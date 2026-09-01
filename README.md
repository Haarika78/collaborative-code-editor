# 💻 Collaborative Code Editor

A web-based collaborative code editor where multiple users can work on the same code in real time. Users can join a room, edit code together, chat with other users, see their cursors, and run Python code.

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

Users can create or join a room using a Room ID. Users in the same room can work on the same code.

### ⚡ Code Synchronization

When a user changes the code, the change is sent to the server using Socket.IO and then shared with the other users in the room.

An `isUpdating` flag is used on the client side to prevent unnecessary update loops.

### 🖱️ Cursor Tracking

Cursor positions are sent between users so that everyone can see where the other users are working. Each user is displayed with their own label.

### 💬 Chat

Users in the same room can send messages through the built-in chat. The application also shows when another user is typing.

### ▶️ Python Code Execution

Python code written in the editor can be executed from the application. The code is temporarily written to a file and executed using Python's `subprocess` module. The output is then displayed to the user.

### 💾 Auto-Save

The current code is stored in memory for each room. When users join or reconnect to a room, the stored code can be loaded again while the application is running.

## 🌱 Environment Variables

The application can use a secret key through an environment variable.

Create a `.env` file:

```text
SECRET_KEY=your_secret_key
```

In `app.py`:

```python
import os

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_key')
```

## 📌 Current Status

The project is working locally and has been tested with multiple users connecting to the same room.

It is currently not deployed to a cloud hosting platform.

## 🔮 Future Improvements

* ☁️ Deploy the application online
* 💾 Add database support for persistent rooms and code
* 🔐 Add user authentication
* 🔒 Improve security for Python code execution
* 🧩 Add support for more programming languages
* 👥 Improve room and user management
* 🧪 Add automated tests
