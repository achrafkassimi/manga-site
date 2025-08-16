# 📚 Manga Set Web

Manga Set Web is a React-based application that allows users to search for mangas, explore manga details, and view chapters using the [MangaDex API](https://api.mangadex.org/).  
The app is styled with **Tailwind CSS** and deployed on **Vercel/Netlify**.

---

## 🚀 Features

- 🔍 Search for any manga by title  
- 🖼️ Display manga covers, titles, and publication status  
- 📖 View detailed manga info (summary, genres, authors, chapters)  
- 📱 Responsive design (desktop + mobile)  
- 🌐 Deployment-ready on Vercel or Netlify  

---

## 🛠️ Tech Stack

- **Frontend:** React + Tailwind CSS  
- **Routing:** React Router  
- **API:** MangaDex API  
- **Deployment:** Netlify / Vercel  

---

## 📂 Project Structure

# 📚 Manga Set Web - Backend

This is the **backend API** for the Manga Set Web project. It serves manga data fetched from [MangaDex API](https://api.mangadex.org/) to the frontend React application.  

---

## 🚀 Features

- 🔍 Search mangas by title  
- 📖 Fetch detailed manga information  
- 📜 Retrieve chapter lists for each manga  
- 🔒 Optional: caching for faster responses  

---

## 🛠️ Tech Stack

- **Backend:** Node.js + Express OR Django + DRF  
- **API:** MangaDex API  
- **Database:** Optional (for caching/favorites)  
- **Deployment:** Heroku / Render / Railway  

---

## 📂 Project Structure

Example (Node.js/Express):

backend/
controllers/
mangaController.js
routes/
mangaRoutes.js
services/
mangadexService.js
app.js
server.js
package.json

scss
Copier le code

Example (Django/DRF):

backend/
mangaset/
settings.py
urls.py
manga/
views.py
serializers.py
urls.py
models.py
manage.py

yaml
Copier le code

---

## 🔌 API Endpoints

| Method | Endpoint               | Description |
|--------|------------------------|-------------|
| GET    | `/api/manga?title=`    | Search mangas by title |
| GET    | `/api/manga/:id`       | Get detailed manga info |
| GET    | `/api/manga/:id/chapters` | Get chapters for a manga |

---

## ⚡ Installation & Setup

### Node.js / Express

1. Clone the repo:
```bash
git clone https://github.com/your-username/manga-set-web-backend.git
cd manga-set-web-backend
Install dependencies:

bash
Copier le code
npm install
Create .env file (if needed):

env
Copier le code
PORT=5000
MANGAdEX_API_URL=https://api.mangadex.org
Start development server:

bash
Copier le code
npm run dev
Django / DRF
Clone the repo:

bash
Copier le code
git clone https://github.com/your-username/manga-set-web-backend.git
cd manga-set-web-backend
Create virtual environment and install dependencies:

bash
Copier le code
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
Apply migrations and run server:

bash
Copier le code
python manage.py migrate
python manage.py runserver
📝 Extra Notes
The backend handles requests from the frontend, fetches data from MangaDex, and returns JSON responses

Error handling and rate-limiting may be added to prevent API overload

CORS headers are configured to allow frontend access

📌 License
This project is licensed under the MIT License.

👨‍💻 Author
Your Name
Manga Set Web – Capstone Project Backend

yaml
Copier le code

---

If you want, I can also create a **full combined project README** that covers **both frontend and backend** with setup instructions and API examples, so it’s ready for GitHub submission.  

Do you want me to do that?







Demander à ChatGPT
