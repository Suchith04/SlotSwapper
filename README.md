# 🕒 Slot Swapper — MERN Stack Application

## 📘 Overview

**Slot Swapper** is a MERN-based web application that allows users to create, manage, and swap their scheduled slots (events) with others in a seamless way.
It’s designed to simplify time management and coordination by enabling users to mark their slots as “swappable” and exchange them with available ones from other users.

The project demonstrates full-stack integration using **MongoDB**, **Express.js**, **React (Vite)**, and **Node.js**, focusing on user authentication, data management, and responsive UI.

### ✨ Design Choices

* **Schema Separation:** Used three independent schemas — `User`, `Event`, and `SwapRequest` — to maintain clear modularity.
  *(However, not linking schemas via `populate()` led to heavier computation during data retrieval.)*
* **Minimalist UI:** Focused on functionality and responsiveness over aesthetics due to time constraints.
* **Manual API Integration:** Used Fetch manually instead of custom hooks or abstractions for clearer request tracking.
* **Scalable Structure:** The backend is structured to easily evolve into a microservice architecture in the future.

---

## ⚙️ Tech Stack

**Frontend:** React (Vite), TailWind CSS, React Router
**Backend:** Node.js, Express.js, MongoDB (Mongoose)
**Authentication:** JWT (JSON Web Tokens)
**Environment Variables:** Stored in `/server/.env`

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Suchith04/SlotSwapper
cd SlotSwapper
```

### 2. Backend Setup

```bash
cd server
npm install
```

#### Create a `.env` file in the `/server` directory:

```
MONGO_URI=your_mongodb_connection_string
JWT_CODE=your_secret_key
```

#### Run the backend:

```bash
node server.js
```

The backend will start on **port 5000**.

---

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

The frontend runs by default on **Vite’s port (usually 5173)**.
You can access the app at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔗 API Endpoints

| Method   | Endpoint                        | Description                                             |
| -------- | ------------------------------- | ------------------------------------------------------- |
| **POST** | `/api/register`                 | Register a new user                                     |
| **POST** | `/api/login`                    | Login and receive JWT                                   |
| **GET**  | `/api/swappable-slots`          | Get slots available for swapping (excluding user’s own) |
| **GET**  | `/api/my-slots`                 | Get the logged-in user’s events                         |
| **GET**  | `/api/my-swappable`             | Get the user’s own swappable slots                      |
| **POST** | `/api/swap-request`             | Send a swap request                                     |
| **GET**  | `/api/swaps-sent`               | Get swap requests sent by the user                      |
| **GET**  | `/api/swaps-received`           | Get swap requests received by the user                  |
| **POST** | `/api/swap-response/:requestId` | Accept or reject a swap request                         |
| **POST** | `/api/events/:id/update`        | Toggle a slot’s swappability                            |
| **POST** | `/api/add`                      | Add a new event or slot                                 |


---

## 💡 Assumptions

* Each event belongs to a single user and can optionally be marked as “swappable”.
* Users can only send swap requests for available slots (not their own).
* No calendar view or email verification implemented due to time constraints.
* Authentication is handled purely through JWT without refresh tokens.

---

## 🚀 Deployment Links
[👉 View Live App](https://slot-swapper-deploy.vercel.app/)  
[🔗 Backend API](https://slotswapper-bmao.onrender.com)

---


---

## 📸 Demo Screenshots

### 🔐 Authentication Pages
| Signup |
|:--:|:--:|
<img width="1920" height="982" alt="image" src="https://github.com/user-attachments/assets/5944d7c3-27c4-4c40-a389-9a06243e251e" />


### 🗓️ Dashboard
| My Slots | Marketplace |
|:--:|:--:|
| <img width="1920" height="884" alt="image" src="https://github.com/user-attachments/assets/33b9fd2e-1bd5-4dfc-87a0-35bea84d3977" /> | <img width="1363" height="599" alt="image" src="https://github.com/user-attachments/assets/3378b80b-5c4d-44d4-b29c-7c8a0f44f792" /> |

### 🔁 Swap Requests
| Sent Requests & Received Requests |
|:--:|:--:|
| <img width="1898" height="870" alt="image" src="https://github.com/user-attachments/assets/b2f309d7-db9e-4072-a102-5200b2abd9ca" /> |


---

## 🚧 Challenges Faced

### 🧩 Schema Linking

Initially, I didn’t interlink schemas using Mongoose’s `populate()` method, leading to higher computation during data aggregation and filtering.
**Lesson Learned:** Schema referencing is crucial for efficient data retrieval and scalability.

### 🎨 Frontend Development

Frontend development posed a major challenge — balancing state management, responsiveness, and API integration under time pressure was tough.
Despite that, the UI remains clean and functional across devices.

### 🕒 Time Management

With limited time, some planned features like **email verification**, **calendar integration**, and **role-based access control** were postponed.
Developed The Project in About 12 Hours

### 🧠 Debugging Realization

I  wasted a **lot of time debugging the frontend**, only to realize later that the issue was in the **backend API — I had forgotten a `return` statement**.
This experience taught me the importance of verifying backend logic before assuming a frontend issue.

---

## 🚀 Future Improvements

* ✅ Refactor into **microservice-based routes** for scalability.
* ✅ Integrate **Google Calendar API** for a dynamic calendar view.
* ✅ Add **email verification** and password recovery.
* ✅ Optimize schemas for better relational queries using `populate()`.
* ✅ Improve UI/UX and introduce notifications for swap updates(can use **AWS SNS & SQS** for realtime notifications).

---

## 👨‍💻 Author

**Suchith Marupaka**
📧 *marupakasuchith@gmail.com*
💼 *[linkedin.com/in/suchith014](https://www.linkedin.com/in/suchith014/)*

---

