let socket;

window.addEventListener("load", () => {

    if (typeof io === "undefined") {
        console.error("Socket.IO failed to load ❌");
        return;
    }

    socket = io();
    console.log("Socket initialized ✅");

    let room = "";
    let username = "";
    let isUpdating = false;
    let typingTimeout;
    let editor;

    let cursors = {};
    let userColors = {};

    function getRandomColor() {
        const colors = ["#ff4d4d","#4da6ff","#33cc33","#ff9933","#cc66ff"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // 🔗 AUTO LOAD ROOM FROM URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromURL = urlParams.get("room");

    if (roomFromURL) {
        document.getElementById("room").value = roomFromURL;
    }

    // MONACO
    require.config({
        paths: {
            vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs"
        }
    });

    require(["vs/editor/editor.main"], function () {

        editor = monaco.editor.create(document.getElementById("editor"), {
            value: 'print("Start coding...")',
            language: "python",
            theme: "vs-dark",
            automaticLayout: true
        });

        editor.onDidChangeModelContent(() => {
            if (!isUpdating && room !== "") {

                clearTimeout(typingTimeout);

                typingTimeout = setTimeout(() => {
                    socket.emit("code_change", {
                        room,
                        code: editor.getValue()
                    });
                }, 300);

                socket.emit("typing", { room, user: username });
            }
        });

        editor.onDidChangeCursorPosition((e) => {
            if (room !== "") {
                socket.emit("cursor_move", {
                    room,
                    user: username,
                    position: e.position
                });
            }
        });
    });

    // ✅ JOIN ROOM
    window.joinRoom = function () {
        room = document.getElementById("room").value;
        username = document.getElementById("username").value;

        // 🔥 AUTO GENERATE ROOM IF EMPTY
        if (!room) {
            room = Math.random().toString(36).substring(2, 8);
            document.getElementById("room").value = room;
        }

        if (!username) {
            alert("Enter username");
            return;
        }

        socket.emit("join", { room, user: username });
    };

    // ▶️ RUN CODE
    window.runCode = function () {
        if (!editor) return;

        socket.emit("run_code", {
            room,
            code: editor.getValue()
        });
    };

    // 💬 SEND MESSAGE
    window.sendMessage = function () {
        const msg = document.getElementById("chatInput").value;

        if (!msg.trim()) return;

        socket.emit("send_message", {
            room,
            user: username,
            msg
        });

        document.getElementById("chatInput").value = "";
    };

    // 📋 COPY OUTPUT
    window.copyOutput = function () {
        const output = document.getElementById("output").innerText;

        navigator.clipboard.writeText(output)
            .then(() => alert("Copied!"))
            .catch(() => alert("Copy failed"));
    };

    // 🔗 SHARE ROOM LINK
    window.copyRoomLink = function () {
        const room = document.getElementById("room").value;

        if (!room) {
            alert("Enter or join a room first");
            return;
        }

        const link = `${window.location.origin}?room=${room}`;

        navigator.clipboard.writeText(link)
            .then(() => alert("Room link copied!"))
            .catch(() => alert("Copy failed"));
    };

    // SOCKET EVENTS

    socket.on("connect", () => {
        document.getElementById("status").innerText = "🟢 Connected";
    });

    socket.on("disconnect", () => {
        document.getElementById("status").innerText = "🔴 Disconnected";
    });

    socket.on("user_list", (users) => {
        const usersEl = document.getElementById("users");
        usersEl.innerHTML = users.map(u => `<li>${u}</li>`).join("");
    });

    socket.on("activity", (msg) => {
        document.getElementById("activity").innerText = msg;
    });

    socket.on("update_code", (code) => {
        if (!editor) return;

        const model = editor.getModel();

        isUpdating = true;

        model.pushEditOperations(
            [],
            [{
                range: model.getFullModelRange(),
                text: code
            }],
            () => null
        );

        isUpdating = false;
    });

    socket.on("typing", (msg) => {
        const typingEl = document.getElementById("typing");
        typingEl.innerText = msg;

        setTimeout(() => {
            typingEl.innerText = "";
        }, 1000);
    });

    socket.on("cursor_update", (data) => {
        const { user, position } = data;

        if (!editor || user === username) return;

        if (!userColors[user]) {
            userColors[user] = getRandomColor();
        }

        const color = userColors[user];
        const className = `cursor-${user}`;

        if (!document.getElementById(className)) {
            const style = document.createElement("style");
            style.id = className;
            style.innerHTML = `
                .${className} { border-left: 3px solid ${color}; }
                .${className}-label { color:${color}; font-size:12px; }
            `;
            document.head.appendChild(style);
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
                className: className,
                after: {
                    content: ` ${user}`,
                    inlineClassName: `${className}-label`
                }
            }
        }]);
    });

    socket.on("receive_message", (msg) => {
        const messages = document.getElementById("messages");
        const p = document.createElement("p");

        p.innerText = msg;
        messages.appendChild(p);
        messages.scrollTop = messages.scrollHeight;
    });

    socket.on("code_output", (output) => {
        document.getElementById("output").innerText = output;
    });

});