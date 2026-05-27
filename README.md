
<img width="715" alt="image" src="https://github.com/user-attachments/assets/107030df-2ed7-4c73-809c-11a5b0850814" />



A full-stack emotional diary web application that lets users write journal entries and receive emotion analysis using OpenAI's GPT API.  
The emotions are visualized as colored orbs, and users can track their emotional patterns through a "mood shelf" UI.

---
<img width="482" height="639" alt="image" src="https://github.com/user-attachments/assets/2fdb07b5-afa3-4442-9c3e-07c1275958b0" />


## ✨ Features

- 📝 Write diary entries and analyze them using the GPT API
- 🎨 Visualize emotional entries as colored orbs
- 📅 View up to 25 recent entries with detailed popup cards
- 🔐 User authentication system (sign up / login with sessions)
- 📋 Simple and clear UI using vanilla HTML/CSS/JS
- 🧪 Full test coverage with **Jest** and **Supertest**
- 🎧 Includes background music

---

## 🛠 Tech Stack

| Layer        | Technology                        |
|--------------|------------------------------------|
| Frontend     | HTML, CSS, JavaScript (Vanilla)    |
| Backend      | Node.js, Express                   |
| Database     | SQLite3                            |
| Authentication | Passport.js (LocalStrategy), session    |
| Emotion Analysis | OpenAI GPT API                 |
| Testing      | Jest, Supertest                    |


---

## 📁 Project Structure

```
emotional-diary/
├── app.js                 # Express app setup
├── server.js              # Server launcher (app.listen)
├── initDB.js              # SQLite DB initialization script
├── .env                   # Environment variables (OpenAI key)
│
├── routes/                # API route handlers
│   ├── auth.js            # Register & login routes
│   └── diary.js           # Diary API endpoints
│
├── services/              # GPT API integration
│   └── openai.js          # Emotion + keyword analysis logic
│
├── models/                # Database connection logic
│   └── db.js              # SQLite3 DB connector
│
├── db/                    # SQLite3 database files
│   ├── emotional_diary.db # Main database file
│   └── schema.sql         # SQL schema definition
│
├── public/                # Frontend static files
│   ├── audio/
│   │   └── emotional-piano-music.mp3
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── write.js       # Logic for write.html
│   │   └── main.js        # Logic for main.html
│   ├── index.html         # Entry landing page
│   ├── login.html         # Login screen
│   ├── signup.html        # Registration screen
│   ├── write.html         # Diary entry screen
│   ├── main.html          # Mood shelf / orb UI
│   └── admin.html         # Optional admin view
│
├── tests/                 # Jest test files
│   ├── auth.test.js       # Unit test: authentication
│   └── diary.test.js      # Unit test: diary APIs
│
├── coverage/              # Jest coverage output
├── package.json           # Project metadata & scripts
├── package-lock.json      # Dependency lock file
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

1. **Install dependencies**

```bash
npm install
```
2. Add your OpenAI API key to `.env`

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
3. start the server
```
node server.js
```
4. visit the app in your local
```
http://localhost:8080
```
5. visit the live app in browser

- Visit Emotional Diary: [https://emotionl-diary.onrender.com](https://emotionl-diary.onrender.com)


🌐 You can access our app in internet now.


## 🔐 Environment Variables

To run this project locally, your`.env` file in the root directory is essential in running GPT API.  
You can start by copying the `.env.example` file:
```bash
OPENAI_API_KEY=your-api-key-here
```
If you don't have an API key and want to test the project, feel free to contact me — hyunmin43240@gmail.com <br>
I can provide you with a temporary key for testing purposes.
