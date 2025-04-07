# Digital-Game-Store
 A digital marketplace for video games, built with MongoDB, Express.js, React, and Node.js. Features include user authentication, game browsing, cart & checkout, and secure payments for a seamless shopping experience.
Sure! Below is a **README.md** file for your **MERN-based E-commerce Platform for Digital Game Stores**, structured with installation instructions, features, and usage details.

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

## ✨ Features

- **User Authentication**  
  - Secure Login & Signup with JWT authentication

- **Product Management**  
  - Browse and search for video games  
  - Detailed product view with images and descriptions

- **Shopping Cart**  
  - Add, remove, and update cart items  
  - Proceed to checkout seamlessly

- **User Library & Wishlist**  
  - Manage your owned games in the Library  
  - Save favorite games in your Wishlist

- **Additional Pages**  
  - **Discover:** Explore trending games  
  - **News:** Stay updated with the latest gaming news  

- **Filtering & Search**  
  - Dedicated search and filtering components on Cart, Library, and Wishlist pages

- **Modern UI/UX**  
  - Responsive design with a blue/white theme  
  - Bootstrap Icons for enhanced visual cues

---

## 🛠 Technology Stack

- **Frontend:**  
  - React.js  
  - React Router DOM  
  - Bootstrap & Bootstrap Icons  
  - Custom CSS

- **Backend:**  
  - Node.js  
  - Express.js  
  - MongoDB (Mongoose)

- **Authentication:**  
  - JWT (JSON Web Tokens)

- **Tooling:**  
  - concurrently (to run frontend and backend simultaneously)  
  - nodemon (for auto-restarting the server)

---

## 📁 Project Structure

```plaintext
GameStore-Ecommerce/
├── backend/
│   ├── config/
│   │     └── db.js                # Database connection setup
│   ├── middleware/
│   │     └── authMiddleware.js    # Authentication middleware
│   ├── models/
│   │     ├── User.js              # User schema/model
│   │     ├── Product.js           # Product schema/model
│   │     └── Order.js             # Order schema/model
│   ├── routes/
│   │     ├── auth.js              # Authentication routes (login, signup)
│   │     ├── product.js           # Product-related routes
│   │     └── order.js             # Order-related routes
│   ├── seeder.js                  # Script to seed sample data into MongoDB
│   ├── .env                     # Environment variables
│   └── server.js                  # Main Express server file
│
├── frontend/
│   ├── public/
│   │     └── images/              # Static images (avatar.png, placeholder.png, product images, etc.)
│   ├── src/
│   │     ├── components/
│   │     │     ├── Header.js
│   │     │     ├── Header.css
│   │     │     ├── Footer.js
│   │     │     ├── Footer.css
│   │     │     ├── Home.js
│   │     │     ├── Home.css
│   │     │     ├── Discover.js
│   │     │     ├── Discover.css
│   │     │     ├── News.js
│   │     │     ├── News.css
│   │     │     ├── Library.js
│   │     │     ├── Library.css
│   │     │     ├── Wishlist.js
│   │     │     ├── Wishlist.css
│   │     │     ├── Cart.js
│   │     │     ├── Cart.css
│   │     │     ├── Login.js
│   │     │     ├── Signup.js
│   │     │     ├── Auth.css             # Shared auth styles for Login/Signup
│   │     │     ├── PageSearchBar.js
│   │     │     ├── PageSearchBar.css
│   │     │     └── CategoryFilter.js    
│   │     ├── App.js
│   │     └── App.css
│   └── package.json
│
├── package.json                   # Root-level package.json (with concurrently, etc.)
└── README.md
```

---

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/GameStore-Ecommerce.git
cd GameStore-Ecommerce-Website
```

### 2. Backend Setup
- Navigate to the **backend** folder:
  ```bash
  cd backend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Create a `.env` file with your environment variables:
  ```env
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```
- Start the backend server (using nodemon):
  ```bash
  nodemon server.js
  ```

### 3. Frontend Setup
- Open a new terminal and navigate to the **frontend** folder:
  ```bash
  cd frontend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Install Bootstrap and Bootstrap Icons:
  ```bash
  npm install bootstrap bootstrap-icons
  ```
- Import Bootstrap CSS and Bootstrap Icons in `src/index.js`:
  ```jsx
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap-icons/font/bootstrap-icons.css';
  ```
- Start the frontend development server:
  ```bash
  npm start
  ```

### 4. Run Concurrently
At the project root, use the `concurrently` package to run both servers:
```json
// package.json (root-level)
"scripts": {
  "start": "concurrently \"npm run server\" \"npm run client\"",
  "server": "nodemon backend/server.js",
  "client": "npm start --prefix frontend"
}
```

---

## 🚀 Usage

- **Homepage:**  
  - Use the header search bar to find games.
  - Browse the product cards and view detailed pages.

- **Authentication:**  
  - Sign up and log in to access personalized features.

- **User Pages:**  
  - Manage your cart, library, and wishlist.
  - Use dedicated search and filtering for a refined experience.

- **Additional Pages:**  
  - **Discover:** Explore trending games.
  - **News:** Stay updated on the latest gaming news.

---

## 🔮 Future Enhancements

- Integrate a payment gateway.
- Add advanced filtering and sorting options.
- Include user reviews and ratings.
- Enhance real-time notifications.
- Improve responsiveness and accessibility.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

Enjoy building your GameStore Ecommerce Website! If you have any questions or need further assistance, feel free to reach out.
