# Calorie Tracking AI Application

## 📌 Project Overview
A professional-grade backend for a Calorie Tracking Application designed for serious academic evaluation. This system leverages Node.js, Express, and MongoDB to provide clean, scalable architecture for tracking nutrition. It features **AI-powered Food Recognition** (simulated for demonstration, ready for OpenAI Vision) to simplify user data entry.

## 🚀 Key Features

### 1. Secure User Management
- **Security**: Passwords hashed with `bcrypt`. Authentication via `JWT` (JSON Web Tokens).
- **Profile**: Stores user biometrics (height, weight, age) and automatically calculates nutritional goals.

### 2. Comprehensive Food Database
- **Search**: Fuzzy search capabilities for finding foods.
- **Custom Foods**: Users can contribute their own food items.
- **Detailed Macros**: Tracks Protein, Carbs, and Fat alongside Calories.

### 3. AI Food Recognition
- **Dual-Mode System**:
    - **Simulation**: Instantly runnable demo mode returning realistic mock data.
    - **Production**: Configurable integration with OpenAI GPT-4 Vision API.
- **Flow**: User uploads image -> System analyzes -> Returns Estimated Name & Calories -> User Confirms.

### 4. Daily Tracking & Analytics
- **Daily Logs**: Aggregates meals by day.
- **Real-time Totals**: Automatically calculates daily intake against goals.
- **Analytics**: Weekly and Monthly statistical rollups.

## 🛠️ Architecture

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Validation**: Joi / Manual Checks
- **File Handling**: Multer (Disk Storage)

### Modular Folder Structure
```
src/
├── config/         # Database and Env configuration
├── controllers/    # Request handling logic
├── middlewares/    # Auth and Error handling
├── models/         # Mongoose Schemas (User, Food, Log, ImageRecognition)
├── routes/         # API Endpoint definitions
├── services/       # Business logic (AI Service)
└── utils/          # Helpers (Multer config)
```

## 🧠 Database Schema (ER Concept)
- **User**: 1-to-Many -> **DailyLog**
- **User**: 1-to-Many -> **ImageRecognition**
- **DailyLog**: Embeds -> **Entries** (referencing **Food**)

## 🤖 AI Implementation Details
The `aiService.js` implements a Strategy Pattern. It checks for the presence of `AI_API_KEY`.
- **If Present**: It sends the image (Base64) to OpenAI API, prompting a strict JSON response with nutritional estimates.
- **If Absent**: It falls back to a deterministic simulation, returning a random selection from a predefined nutritious menu (e.g., "Grilled Chicken Salad", "Avocado Toast") with confidence scores.
**Limitations**: Current AI models estimate portion sizes based on visual volume, which can vary by density. This is noted in the `confidence` score.

## 🔧 Setup & Installation

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Create `.env` file (see `.env.example` logic or use provided default):
    ```
    MONGO_URI=mongodb://localhost:27017/calorie-app
    JWT_SECRET=your_jwt_secret
    # AI_API_KEY=sk-... (Optional)
    ```
3.  **Run Server**:
    ```bash
    npm run dev
    ```
    Server runs on `http://localhost:5000`.

## 📡 API Endpoints 

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get Token

### Food & Logs
- `GET /api/foods/search?query=...` - Find food
- `POST /api/logs` - Add entry
- `GET /api/logs/:date` - View specific day

### AI
- `POST /api/ai/analyze` - Upload image (form-data: `image`), returns detection.

---
**Created for Academic Olympiad Evaluation**
