# 💻 Collaborative Code Editor

A web-based collaborative code editor where multiple users can work on the same code in real time. Users can join a room, edit code together, chat with other users, see each other's cursors, and run Python code.

## 🚀 Live Demo

🔗 **Try the live application:**
https://collaborative-code-editor-uabx.onrender.com/

## 🚀 Features

* 🧑‍🤝‍🧑 Real-time code editing
* 👥 Multiple users in the same room
* ⚡ Real-time code synchronization
* 🖱️ Live cursor tracking with user labels
* 💬 Team chat inside the room
* ⌨️ Typing indicators
* ▶️ Python code execution
* 📤 Displays code execution output
* 🔗 Shareable room links
* 💾 Auto-save while the room is active
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

 bash
git clone https://github.com/Haarika78/collaborative-code-editor.git
cd collaborative-code-editor


### 2️⃣ Install the dependencies

  bash
pip install -r requirements.txt


### 3️⃣ Start the application

  bash
python app.py


### 4️⃣ Open the application

Open the following URL in your browser:

 text
http://127.0.0.1:5003


## 📁 Project Structure

  text
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


## 🔄 How It Works

### 🏠 Rooms

Users can create or join a room using a Room ID. Users who join the same room can work on the same code and communicate with each other.

### ⚡ Code Synchronization

When a user changes the code, the updated content is sent to the server using Socket.IO. The server then sends the changes to the other users in the same room.

An `isUpdating` flag is used on the client side to avoid unnecessary update loops.

### 🖱️ Cursor Tracking

The application sends cursor positions between users so everyone can see where other users are working. Each user's cursor is displayed with their username.

### 💬 Chat

Users in the same room can send messages through the built-in team chat. The application also shows when another user is typing.

### ▶️ Python Code Execution

Python code written in the editor can be executed directly from the application.

The code is temporarily written to a Python file and executed using Python's `subprocess` module. The output or error message is then displayed in the output panel.

A timeout is also used to prevent programs from running indefinitely.

### 💾 Auto-Save

The current code is stored in memory for each room while the application is running. When another user joins the same room, the existing code can be loaded automatically.

## 🌱 Environment Variables

The application uses the `SECRET_KEY` environment variable.

For local development, set `SECRET_KEY` in your environment before starting the application:

```text
SECRET_KEY=your_secret_key

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
* ✅ Deployed on Render

## 🔮 Future Improvements

* 💾 Add database support for persistent rooms and code
* 🔐 Add user authentication
* 🔒 Improve security for Python code execution
* 🧩 Add support for more programming languages
* 👥 Improve room and user management
* 🧪 Add automated tests

## ⚠️ Security Note

The current Python execution feature runs submitted code on the server using a subprocess. This implementation is intended for portfolio and demo use. For production use with untrusted users, code execution should be isolated using a secure sandbox or container-based environment.



⭐ Thanks for checking out the project!
