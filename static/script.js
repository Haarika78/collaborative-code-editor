let socket;
let room = "";
let username = "";
let editor;
let isUpdating = false;
let typingTimeout;
const cursors = {};
const userColors = {};

window.addEventListener("load", () => {
    if (typeof io === "undefined") {
        console.error("Socket.IO failed to load ❌");
        return;
    }

    socket = io();
    console.log("Socket initialized ✅");

    // Load room from URL
    const roomFromURL = new URLSearchParams(location.search).get("room");
    if (roomFromURL) document.getElementById("room").value = roomFromURL;

    // Monaco
    require.config({
        paths: {
            vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs"
        }
    });

    require(["vs/editor/editor.main"], () => {
        editor = monaco.editor.create(document.getElementById("editor"), {
            value: 'print("Start coding...")',
            language: "python",
            theme: "vs-dark",
            automaticLayout: true
        });

        editor.onDidChangeModelContent(() => {
            if (isUpdating || !room) return;

            clearTimeout(typingTimeout);

            typingTimeout = setTimeout(() => {
    socket.emit("code_change", {
        room,
        code: editor.getValue(),
        sent_at: Date.now()
    });
}, 300);

            socket.emit("typing", { room, user: username });
        });

        editor.onDidChangeCursorPosition(e => {
            if (room) {
                socket.emit("cursor_move", {
                    room,
                    user: username,
                    position: e.position
                });
            }
        });
    });

    // Socket events
    socket.on("connect", () => {
        setConnection(true);
    });

    socket.on("disconnect", () => {
        setConnection(false);
    });

    socket.on("user_list", users => {
        const usersEl = document.getElementById("users");

        usersEl.innerHTML = users
            .map(user => `<li>${escapeHTML(user)}</li>`)
            .join("");

        const count = document.getElementById("userCount");
        if (count) count.textContent = users.length;
    });

    socket.on("activity", msg => {
        document.getElementById("activity").textContent = msg;
    });

    socket.on("update_code", data => {
    if (!editor) return;

    // Calculate synchronization latency
    if (data.sent_at != null) {
        const latency = Date.now() - data.sent_at;
        console.log(`Sync latency: ${latency} ms`);
    }

    isUpdating = true;

    editor.getModel().pushEditOperations(
        [],
        [{
            range: editor.getModel().getFullModelRange(),
            text: data.code
        }],
        () => null
    );

    isUpdating = false;
});

    socket.on("typing", msg => {
        const typing = document.getElementById("typing");
        typing.textContent = msg;

        clearTimeout(typing.clearTimer);

        typing.clearTimer = setTimeout(() => {
            typing.textContent = "";
        }, 1000);
    });

    socket.on("receive_message", msg => {
        const messages = document.getElementById("messages");
        const p = document.createElement("p");

        p.textContent = msg;
        messages.appendChild(p);
        messages.scrollTop = messages.scrollHeight;
    });

    socket.on("code_output", output => {
        document.getElementById("output").textContent = output;
    });

    socket.on("cursor_update", data => {
        if (!editor || data.user === username) return;

        const { user, position } = data;

        if (!userColors[user]) {
            userColors[user] = getRandomColor();
        }

        if (cursors[user]) {
            editor.deltaDecorations(cursors[user], []);
        }

        cursors[user] = editor.deltaDecorations([], [{
            range: new monaco.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column
            ),
            options: {
                className: `cursor-${user}`,
                after: {
                    content: ` ${user}`,
                    inlineClassName: "remote-cursor-label"
                }
            }
        }]);
    });
});

// Join room
window.joinRoom = () => {
    username = document.getElementById("username").value.trim();
    room = document.getElementById("room").value.trim();

    if (!username) {
        alert("Enter username");
        return;
    }

    if (!room) {
        room = Math.random().toString(36).substring(2, 8);
        document.getElementById("room").value = room;
    }

    document.getElementById("headerRoom").textContent = room;
    document.getElementById("roomStatus").textContent = "Active";

    socket.emit("join", { room, user: username });
};

// Leave room
window.leaveRoom = () => {
    if (!room) {
        alert("You are not currently in a room");
        return;
    }

    socket.emit("leave_room", {
        room: room,
        user: username
    });

    // Clear local room information
    room = "";
    username = "";

    document.getElementById("headerRoom").textContent = "Not joined";
    document.getElementById("roomStatus").textContent = "Not joined";

    // Clear collaborators
    document.getElementById("users").innerHTML = "";

    const count = document.getElementById("userCount");
    if (count) {
        count.textContent = "0";
    }

    // Clear activity
    document.getElementById("activity").textContent = "";

    // Clear username and room inputs
    document.getElementById("username").value = "";
    document.getElementById("room").value = "";
};

// Run code
window.runCode = () => {
    if (!editor || !room) return;

    socket.emit("run_code", {
        room,
        code: editor.getValue()
    });
};

// Send chat
window.sendMessage = () => {
    const input = document.getElementById("chatInput");
    const msg = input.value.trim();

    if (!msg || !room) return;

    socket.emit("send_message", {
        room,
        user: username,
        msg
    });

    input.value = "";
};

// Copy output
window.copyOutput = () => {
    navigator.clipboard.writeText(
        document.getElementById("output").textContent
    );
};

// Share room
window.copyRoomLink = () => {
    if (!room) {
        alert("Join a room first");
        return;
    }

    const link = `${location.origin}?room=${encodeURIComponent(room)}`;

    navigator.clipboard.writeText(link)
        .then(() => alert("Room link copied!"))
        .catch(() => alert("Copy failed"));
};

// Connection status
function setConnection(connected) {
    const status = document.getElementById("status");

    status.classList.toggle("connected", connected);

    status.innerHTML = `
        <span class="status-dot"></span>
        ${connected ? "Connected" : "Disconnected"}
    `;

    const footer = document.getElementById("footerStatus");
    if (footer) footer.textContent = connected ? "Online" : "Offline";
}

// Helpers
function getRandomColor() {
    const colors = ["#ff4d4d", "#4da6ff", "#33cc33", "#ff9933", "#cc66ff"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}