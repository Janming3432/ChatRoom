Real-Time Chat Application
Overview
This is a real-time chat application built using the MERN (MongoDB, Express, React, Node.js) stack. It allows users to create accounts, join or create chat rooms, and send messages in real-time. The platform supports only group chats, secured by authentication

Features

Real-Time Messaging: Messages are delivered instantly using Socket.IO with minimal latency.

Authentication: Users are authenticated with JWT-based authentication, ensuring secure access.

Chat Room Management: Users can create, join, and manage chat rooms for group or private chats.

RESTful APIs: Provides a backend with RESTful APIs for smooth interaction between the frontend and backend.


Tech Stack
Frontend: React, Socket.IO-client, Axios, Material-UI
Backend: Node.js, Express, Socket.IO, JWT
Database: MongoDB, Mongoose


API Endpoints

POST /auth/login : User login

POST /auth/signup : User registration

GET / : Fetch all chat rooms the user participates in

GET /search : Search the database for a chatRoom

GET /:chatRoomId : Fetch chatRoom information

GET /:chatRoomId/messages : Fetch messages from chatRoom

POST / : Create a new ChatRoom

PUT /:chatRoomId/addParticipant : Add a user to a chatRoom

PUT /:chatRoomId/removeParticipant : remove a user from a chatRoom

Future Enhancements

Message Reactions: Add support for reacting to messages (like, love, etc.).

Message Delivery Status: Indicate if messages have been delivered and read.

File Sharing: Allow users to share files (images, documents) in chat rooms.

User Status: Show online/offline status for users in chat rooms.
