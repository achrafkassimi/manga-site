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

