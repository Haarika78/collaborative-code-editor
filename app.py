from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, emit
import subprocess
import uuid
import os
import sys

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

room_users = {}
room_code = {}  # ✅ store code per room


@app.route('/')
def home():
    return render_template('index.html')


# ✅ JOIN ROOM
@socketio.on('join')
def handle_join(data):
    room = data.get('room')
    user = data.get('user')

    if not room or not user:
        return

    join_room(room)

    if room not in room_users:
        room_users[room] = []

    if user not in room_users[room]:
        room_users[room].append(user)

    # ✅ send existing code
    if room in room_code:
        emit('update_code', room_code[room])

    emit('user_list', room_users[room], room=room)
    emit('activity', f"{user} joined the room", room=room)


# ✅ CODE SYNC + SAVE
@socketio.on('code_change')
def handle_code(data):
    room = data['room']
    code = data['code']

    room_code[room] = code  # save

    emit('update_code', code, room=room, include_self=False)


# ✅ TYPING
@socketio.on('typing')
def handle_typing(data):
    emit('typing', f"{data['user']} is typing...", room=data['room'], include_self=False)


# ✅ CHAT
@socketio.on('send_message')
def handle_message(data):
    emit('receive_message', f"{data['user']}: {data['msg']}", room=data['room'])


# ✅ CURSOR
@socketio.on('cursor_move')
def handle_cursor(data):
    emit('cursor_update', data, room=data['room'], include_self=False)


# ✅ RUN CODE
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

    emit('code_output', output, room=room)


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 5003)))