# 🌐 Translation Admin Panel

A robust multilingual translation management system built with the MERN stack. This tool allows developers and content managers to perform CRUD operations on translation keys, auto-translate text to multiple Indian languages using a translation API, and export localized content in structured JSON files ready for integration.

---

## 🚀 Features

- 🔤 Add, edit, and delete translation keys and values  
- 🌍 Supports multiple Indian languages (English, Tamil, Hindi, Telugu, Kannada, Malayalam)  
- ⚡ One-click translation using Google Cloud Translate API  
- 📁 Export JSON files per language or all at once  
- 📊 Intuitive admin panel built with React & Ant Design  
- 🧠 Backend powered by Node.js, Express, and MongoDB  

---

## 🧑‍💻 Use Cases

- Centralized translation hub for multilingual web or mobile apps  
- Admin interface for managing dynamic app content in multiple languages  
- Export-ready JSON files for integration with i18next or other i18n libraries  

---

## 🏗️ Tech Stack

| Layer       | Technology                      |
|-------------|----------------------------------|
| Frontend    | React, Redux Toolkit, Ant Design |
| Backend     | Node.js, Express                 |
| Database    | MongoDB (Mongoose ODM)           |
| Translation | Google Cloud Translation API     |

---

## 🔧 Getting Started

### Prerequisites

- Node.js ≥ 18  
- MongoDB running locally or on MongoDB Atlas  
- Google Cloud Translation API credentials  

### Setup

#### Backend

```bash
# Clone the repo
git clone https://github.com/your-username/translation-admin-panel.git

# Install backend dependencies
cd backend
npm install

# Create .env file and add environment variables
touch .env
# Add your MONGODB_URI and GOOGLE_API_KEY here

# Start backend server
npm run dev
```

#### Frontend

```bash
# In a new terminal
cd frontend
npm install
npm start
```

### Sample JSON Output

```bash
{
  "title": "Link Mithra",
  "aadhaar": "Download Aadhaar",
  "pan": "Download PAN"
}
```

## 🙌 Acknowledgements

- Google Cloud Translation API

- Ant Design

- i18next