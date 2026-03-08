# CalorieApp

Уеб приложение за проследяване на хранителен прием с изкуствен интелект. Снимаш ястието, AI разпознава какво е и автоматично записва хранителните стойности.

## Технологии

- **Frontend:** React.js, Vite, TailwindCSS
- **Backend:** Node.js, Express.js
- **База данни:** MongoDB (Atlas)
- **AI:** Groq API (Llama 4 Vision), Google Gemini API

---

## Изисквания

Преди да стартираш проекта, трябва да имаш инсталирано:

- [Node.js](https://nodejs.org/) (версия 18 или по-нова)
- npm (идва заедно с Node.js)
- Акаунт в [MongoDB Atlas](https://www.mongodb.com/atlas) (безплатен)
- API ключ от [Groq](https://console.groq.com/) (безплатен)

---

## Инсталация и стартиране

### 1. Клонирай или свали проекта

```bash
git clone https://github.com/Vladimir2010/CalorieApp.git
cd CalorieApp
```

### 2. Инсталирай зависимостите на Backend-а

```bash
npm install
```

### 3. Инсталирай зависимостите на Frontend-а

```bash
cd frontend
npm install
cd ..
```

### 4. Създай `.env` файл в главната папка

Създай файл `.env` (в `CalorieApp/`, не в `frontend/`) със следното съдържание:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/calorieapp
JWT_SECRET=some_random_secret_string_here
GROQ_API_KEY=gsk_...твоя_ключ...
GEMINI_API_KEY=AIza...твоя_ключ...
```

### 5. Стартирай приложението

Терминал 1 – Backend:
```bash
npm run dev
```

Терминал 2 – Frontend:
```bash
cd frontend
npm run dev
```

### 6. Отвори в браузъра

```
http://localhost:5173
```

---

## Структура на проекта

```
CalorieApp/
├── src/                        # Backend (Node.js/Express)
│   ├── controllers/            # Логика за всяка операция
│   ├── models/                 # Mongoose схеми (User, DailyLog, Food)
│   ├── routes/                 # API маршрути
│   ├── middleware/             # JWT автентикация
│   ├── services/               # AI Service (Groq/Gemini)
│   └── server.js               # Входна точка на сървъра
│
├── frontend/                   # Frontend (React/Vite)
│   └── src/
│       ├── pages/              # Основни екрани (Home, Camera, Profile...)
│       ├── components/         # Navbar
│       ├── i18n.js             # Преводи (BG/EN)
│       ├── api.js              # Axios конфигурация
│       └── App.jsx             # Маршрутизация
│
├── .env                        # Тайни ключове (НЕ се качва в GitHub!)
└── README.md                   # Този файл
```

---

## API Endpoints

| Метод | URL | Описание |
|---|---|---|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Влизане |
| GET | `/api/auth/me` | Данни за текущия потребител |
| PUT | `/api/auth/me` | Обновяване на профил |
| GET | `/api/logs/:date` | Дневен дневник за дата |
| POST | `/api/logs` | Добавяне на храна |
| DELETE | `/api/logs/:date/:entryId` | Изтриване на запис |
| POST | `/api/foods` | Добавяне на храна |
| POST | `/api/ai/analyze` | AI анализ на снимка |

---

## Автори

Разработено от **Владимир Иванов** и **Димитър Христов** за Национална олимпиада по информационни технологии 2026.
