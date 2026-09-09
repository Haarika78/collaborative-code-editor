from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, emit
import subprocess
import uuid
import os
import sys

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

room_users = {}
room_code = {}

# Track which room/user belongs to each Socket.IO connection
socket_users = {}


@app.route('/')
def home():
    return render_template('index.html')


# =========================
# JOIN ROOM
# =========================
@socketio.on('join')
def handle_join(data):
    room = data.get('room')
    user = data.get('user')

    if not room or not user:
        return

    # If this socket was already in another room, remove it first
    if request.sid in socket_users:
        old_room = socket_users[request.sid]['room']
        old_user = socket_users[request.sid]['user']

        if old_room != room:
            leave_room(old_room)

            if old_room in room_users and old_user in room_users[old_room]:
                room_users[old_room].remove(old_user)

                emit(
                    'user_list',
                    room_users[old_room],
                    room=old_room
                )

                emit(
                    'activity',
                    f"{old_user} left the room",
                    room=old_room
                )

                if not room_users[old_room]:
                    del room_users[old_room]

    join_room(room)

    if room not in room_users:
        room_users[room] = []

    if user not in room_users[room]:
        room_users[room].append(user)

    # Remember this socket's room and username
    socket_users[request.sid] = {
        'room': room,
        'user': user
    }

    # Send existing code to the new user
    if room in room_code:
        emit(
            'update_code',
            {
                'code': room_code[room],
                'sent_at': None
            }
        )

    # Send updated collaborator list
    emit(
        'user_list',
        room_users[room],
        room=room
    )

    emit(
        'activity',
        f"{user} joined the room",
        room=room
    )


# =========================
# LEAVE ROOM
# =========================
@socketio.on('leave_room')
def handle_leave_room(data):
    room = data.get('room')
    user = data.get('user')

    if not room or not user:
        return

    # Leave the Socket.IO room
    leave_room(room)

    # Remove user from room list
    if room in room_users and user in room_users[room]:
        room_users[room].remove(user)

        # Send updated users to everyone still in the room
        emit(
            'user_list',
            room_users[room],
            room=room
        )

        emit(
            'activity',
            f"{user} left the room",
            room=room
        )

        # Remove empty room from memory
        if not room_users[room]:
            del room_users[room]

    # Remove socket tracking
    if request.sid in socket_users:
        del socket_users[request.sid]


# =========================
# DISCONNECT
# =========================
@socketio.on('disconnect')
def handle_disconnect():
    if request.sid not in socket_users:
        return

    room = socket_users[request.sid]['room']
    user = socket_users[request.sid]['user']

    if room in room_users and user in room_users[room]:
        room_users[room].remove(user)

        emit(
            'user_list',
            room_users[room],
            room=room
        )

        emit(
            'activity',
            f"{user} left the room",
            room=room
        )

        if not room_users[room]:
            del room_users[room]

    del socket_users[request.sid]


# =========================
# CODE SYNC + LATENCY
# =========================
@socketio.on('code_change')
def handle_code(data):
    room = data['room']
    code = data['code']
    sent_at = data.get('sent_at')

    room_code[room] = code

    emit(
        'update_code',
        {
            'code': code,
            'sent_at': sent_at
        },
        room=room,
        include_self=False
    )


# =========================
# TYPING
# =========================
@socketio.on('typing')
def handle_typing(data):
    emit(
        'typing',
        f"{data['user']} is typing...",
        room=data['room'],
        include_self=False
    )


# =========================
# CHAT
# =========================
@socketio.on('send_message')
def handle_message(data):
    emit(
        'receive_message',
        f"{data['user']}: {data['msg']}",
        room=data['room']
    )


# =========================
# CURSOR
# =========================
@socketio.on('cursor_move')
def handle_cursor(data):
    emit(
        'cursor_update',
        data,
        room=data['room'],
        include_self=False
    )


# =========================
# RUN CODE
# =========================
@socketio.on('run_code')
def handle_run_code(data):
    code = data.get('code')
    room = data.get('room')

    if not code:
        return

    filename = f"temp_{uuid.uuid4().hex}.py"

    try:
        with open(filename, "w") as f:
            f.write(code)

        result = subprocess.run(
            [sys.executable, filename],
            capture_output=True,
            text=True,
            timeout=5
        )

        output = result.stdout if result.stdout else result.stderr

    except subprocess.TimeoutExpired:
        output = "⏰ Timeout!"

    except Exception as e:
        output = str(e)

    finally:
        if os.path.exists(filename):
            os.remove(filename)

    emit(
        'code_output',
        output,
        room=room
    )


if __name__ == "__main__":
    socketio.run(
        app,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5003))
    )