# Webhook Subscription & Event Handling System

This project allows users to subscribe to webhook services, and handles incoming webhook events with retry logic, authentication, and real-time event streaming.

🚀 ## Tech Stack
Layer	Technology
Frontend	React.js (Vite)
Backend	Node.js with Express + MongoDB
Auth	JWT-based
Realtime	Socket.io
Queue System	BullMQ + Redis

📦 Features
✅ Backend (Express.js + MongoDB)
User Signup/Login with JWT Auth

Subscribe to webhook services (source + callback URL)

Incoming webhook event handler (process & forward)

Retry failed deliveries using BullMQ & Redis

Cancel subscriptions

Real-time event delivery via Socket.io

✅ Frontend (React.js)
Signup/Login interface

Dashboard to subscribe/unsubscribe to services

View live event logs via Socket.io

Auth-protected routes

🧱 Architecture & Design Choices
1. Modular Service Layers
Organized code into /routes, /controllers, /models, and /jobs

Separates concerns: API logic, DB schema, background jobs

2. Webhook Flow
plaintext
Copy
Edit
1. User subscribes to a service (e.g., GitHub) with a callback URL
2. External service POSTs to our `/webhooks/events` endpoint
3. We forward that event to the user’s registered callback URL
4. If delivery fails, retry via BullMQ (up to 3 times)
5. Event is also broadcast to frontend using Socket.io
3. Why BullMQ + Redis?
Persistent queues for reliability (retry failed events)

Scalable (can be distributed across workers)

Built-in retry, delay, and backoff

4. Socket.io for Real-time Events
Socket.io broadcasts incoming events to frontend dashboard instantly

Improves UX (no need to refresh)

5. MongoDB
Simple, schema-flexible document store for subscriptions and events

Easy to relate events to users and sources

⚙️ Project Structure
bash
Copy
Edit
.
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── jobs
│   └── index.js
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   └── App.jsx
├── simulate-webhook.js
├── README.md
🧪 Simulating Webhooks
Use the provided script to simulate an external service sending a webhook:

bash
Copy
Edit
node simulate-webhook.js
🧼 Future Improvements
UI: Add filters/sorting to event log

DB: Add TTL/index cleanup for old events

Security: Validate callback URLs before accepting

Retry: Add email alerts on repeated failures

🛠 Setup Instructions
Clone the repo

Start MongoDB and Redis locally

cd backend && npm install && npm run dev

cd frontend && npm install && npm run dev

Use the React UI to sign up, login, and subscribe

👨‍💻 Author
Rohit Satpute
📫 LinkedIn
🌐 Portfolio

