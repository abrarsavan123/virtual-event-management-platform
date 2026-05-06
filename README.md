# Virtual Event Management Platform Backend

A Node.js/Express backend system for managing virtual events. This system features secure user authentication, event scheduling (CRUD), and participant registration using in-memory data structures.

## Features

- **User Authentication**: Secure registration and login using `bcryptjs` for password hashing and `jsonwebtoken` (JWT) for session management.
- **Role-Based Access Control**: Distinguishes between **Organizers** (can create/manage events) and **Attendees** (can register for events).
- **Event Management**: Complete CRUD operations for events (exclusive to organizers).
- **Participant Management**: Allows attendees to register for events.
- **Email Notifications**: Mocked asynchronous email service that "sends" a confirmation email upon successful registration.
- **In-Memory Storage**: Uses arrays to store data (volatile).

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Security**: bcryptjs, jsonwebtoken
- **Testing**: Jest, Supertest
- **Utilities**: dotenv, cors

## API Endpoints

### Authentication
- `POST /register`: Register a new user. Body: `{ email, password, role }` (role: 'organizer' or 'attendee').
- `POST /login`: Login and receive a JWT. Body: `{ email, password }`.

### Events
- `GET /events`: List all events (Requires authentication).
- `POST /events`: Create a new event (Requires Organizer role). Body: `{ title, description, date, time }`.
- `PUT /events/:id`: Update an existing event (Requires Organizer role).
- `DELETE /events/:id`: Delete an event (Requires Organizer role).
- `POST /events/:id/register`: Register for an event (Requires Attendee role).

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory (see `.env.example` or use the provided default).
   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret_here
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Running Tests

To run the automated test suite:
```bash
npm test
```

## Project Structure

```
.
├── src/
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth & Role-based logic
│   ├── models/         # In-memory data store
│   ├── routes/         # API route definitions
│   ├── services/       # Async services (Email)
│   ├── app.js          # App configuration
│   └── server.js       # Server entry point
├── tests/              # Jest test suites
└── .env                # Environment variables
```

## License

ISC
