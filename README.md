# 💻 Collaborative Code Editor

A web-based collaborative code editor where multiple users can work on the same code in real time. Users can join a room, edit code together, chat with other users, see each other's cursors, and run Python code.

## 🚀 Features

* 🧑‍🤝‍🧑 Real-time code editing
* 👥 Multiple users in the same room
* ⚡ Code synchronization between users
* 🖱️ Live cursor tracking with user labels
* 💬 Chat between users in a room
* ⌨️ Typing indicators
* ▶️ Python code execution
* 📤 Displays the output of executed code
* 🔗 Shareable room links
* 💾 Auto-save of code while the room is active
* 🎨 Monaco Editor for the coding interface
* 📱 Responsive interface

## 🛠️ Tech Stack

### Frontend

* 🌐 HTML
* 🎨 CSS
* ⚙️ JavaScript
* 📝 Monaco Editor

### Backend

* 🐍 Python
* 🌶️ Flask
* 🔌 Flask-SocketIO

### Communication

* 🔄 WebSockets
* 📡 Socket.IO

### Deployment

* ☁️ Render
* 🚀 Gunicorn

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Haarika78/collaborative-code-editor.git
cd collaborative-code-editor
```

### 2️⃣ Install the dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Start the application

```bash
python app.py
```

### 4️⃣ Open the application

Open the following URL in your browser:

```text
http://127.0.0.1:5003
```

## 📁 Project Structure

```text
collaborative-code-editor/

│
├── app.py
├── requirements.txt
├── .gitignore
│
├── templates/
│   └── index.html
│
├── static/
│   ├── script.js
│   └── style.css
│
└── README.md
```

## 🔄 How It Works

### 🏠 Rooms

Users can create or join a room using a Room ID. Users in the same room can work on the same code and communicate with each other.

### ⚡ Code Synchronization

When a user changes the code, the updated code is sent to the server using Socket.IO and then shared with the other users in the same room.

An `isUpdating` flag is used on the client side to prevent unnecessary update loops.

### 🖱️ Cursor Tracking

Cursor positions are sent between users so that everyone can see where the other users are working. Each user's cursor is displayed with a user label.

### 💬 Chat

Users in the same room can send messages through the built-in chat. The application also shows when another user is typing.

### ▶️ Python Code Execution

Python code written in the editor can be executed from the application. The code is temporarily written to a file and executed using Python's `subprocess` module. The output is then displayed in the output panel.

The execution also has a timeout to prevent programs from running indefinitely.

### 💾 Auto-Save

The current code is stored in memory for each room. When users join or reconnect to a room, the stored code can be loaded again while the application is running.

## 🌱 Environment Variables

The application can use a secret key through an environment variable.

Create a `.env` file:

```text
SECRET_KEY=your_secret_key
```

Make sure `.env` is included in `.gitignore` so the secret key is not uploaded to GitHub.

## 🌐 Deployment

The application can be deployed as a Python Web Service using Render.

The live demo link will be added here after deployment.

## 📌 Current Status

* ✅ Project working locally
* ✅ Real-time code editing
* ✅ Multi-user rooms
* ✅ Code synchronization
* ✅ Live cursor tracking
* ✅ Team chat
* ✅ Typing indicators
* ✅ Python code execution
* ✅ Modern IDE-style interface
* ⏳ Cloud deployment

## 🔮 Future Improvements

* ☁️ Deploy the application online
* 💾 Add database support for persistent rooms and code
* 🔐 Add user authentication
* 🔒 Improve security for Python code execution
* 🧩 Add support for more programming languages
* 👥 Improve room and user management
* 🧪 Add automated tests

## ⚠️ Security Note

The current Python execution feature runs submitted code on the server using a subprocess. For production use with untrusted users, code execution should be isolated using a secure sandbox or container-based environment.

---

⭐ Thanks for checking out the project!
