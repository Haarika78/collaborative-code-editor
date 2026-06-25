# 💻 Collaborative Code Editor

A real-time collaborative code editor that allows multiple users to join a shared room, write code together, communicate via chat, and execute Python code—all in sync.

---

## 🚀 Features at a Glance

* 🧑‍🤝‍🧑 Real-time multi-user collaboration
* ⚡ Instant code synchronization
* 🖱️ Live cursor tracking with user labels
* 💬 Built-in chat system
* ⌨️ Typing indicators
* ▶️ Run Python code with output display
* 💾 Auto-save code per room (in-memory)
* 🔗 Shareable room links
* 🎨 Monaco Editor (VS Code-like UI)

---

## 🛠️ Tech Stack

**Frontend**

* HTML, CSS, JavaScript
* Monaco Editor

**Backend**

* Flask
* Flask-SocketIO

**Communication**

* WebSockets (Socket.IO)

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/collaborative-code-editor.git
cd collaborative-code-editor
```

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Run the Application

```bash
python app.py
```

### 4️⃣ Open in Browser

```
http://127.0.0.1:5003
```

---

## 📁 Project Structure

```
collaborative-editor/
│
├── app.py                  # Flask backend with Socket.IO
├── requirements.txt        # Python dependencies
│
├── templates/
│   └── index.html          # Main frontend UI
│
├── static/
│   ├── script.js           # Client-side logic
│   └── style.css           # Styling
│
└── README.md               # Documentation
```

---

## 🔄 How It Works

### 1. Room-Based Collaboration

Users join a room using a Room ID. Each room acts as a shared workspace.

### 2. Real-Time Communication

Flask-SocketIO enables event-driven communication:

* `join` → user joins room
* `code_change` → sync code
* `cursor_move` → track cursor
* `send_message` → chat

### 3. Code Synchronization

* Editor changes are emitted to the server
* Server broadcasts updates to all users
* `isUpdating` flag prevents infinite loops

### 4. Cursor Tracking

Each user's cursor position is shared and rendered with unique styling.

### 5. Code Execution

* Code is written to a temporary file
* Executed using subprocess
* Output returned to clients

### 6. Auto-Save System

Code is stored in memory per room and reloaded when users join.

### 7. Shareable Rooms

Room links can be generated and shared for instant collaboration.

---

## 🧪 Diagnosed Mistake Types

During development, the following issues were identified and resolved:

* ❌ Socket.IO version mismatch → Fixed by aligning client & server versions
* ❌ `io is undefined` → Caused by script loading order (Monaco conflict)
* ❌ Duplicate socket initialization → Resolved by single initialization
* ❌ 400 Bad Request (WebSocket) → Fixed via correct dependency versions
* ❌ Infinite update loop → Solved using `isUpdating` flag
* ❌ Cursor flickering → Fixed using proper decoration handling

---

## 🌱 Environment Variables

Create a `.env` file (optional):

```
SECRET_KEY=your_secret_key
```

In `app.py`:

```python
import os
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_key')
```

---

## 🚀 Deployment

### Option 1: Local Deployment

```bash
python app.py
```

---

### Option 2: Render / Railway (Recommended)

1. Push code to GitHub
2. Connect repository to hosting platform
3. Add build/start commands:

**Build Command**

```bash
pip install -r requirements.txt
```

**Start Command**

```bash
python app.py
```

---

### Option 3: Production Setup (Advanced)

Use:

* Gunicorn
* Eventlet

```bash
pip install gunicorn
gunicorn -k eventlet -w 1 app:app
```

---

## 🤝 Contributing

Contributions are welcome!

### Steps:

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added feature"
```

4. Push to branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---


