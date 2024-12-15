Got it! Here's the content formatted correctly so that when you copy and paste, everything remains aligned:

```markdown
# User Authentication and Authorization API

This API is designed to handle user authentication and authorization, enabling secure access to protected routes based on user roles. 

Built with **Express.js**, **TypeORM**, and **PostgreSQL**, this project provides a robust framework for managing user sessions and permissions.

---

## Features
- **User Registration and Login**: Securely create and manage user accounts.
- **Role-Based Access Control**: Grant or restrict access to resources based on user roles.
- **Session Management**: Maintain user sessions securely with tokens.
- **Database Integration**: Powered by PostgreSQL, with ORM support via TypeORM.

---

## Technologies Used
- [Express.js](https://expressjs.com/) - A fast, unopinionated, minimalist web framework for Node.js.
- [TypeORM](https://typeorm.io/) - An ORM for TypeScript and JavaScript.
- [PostgreSQL](https://www.postgresql.org/) - A powerful, open-source relational database.

---

## Getting Started
### Prerequisites
- **Node.js**: Ensure you have Node.js installed. [Download here](https://nodejs.org/)
- **PostgreSQL**: Install PostgreSQL and create a database.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Nalon03/AUTH-API.git
   ```
2. Navigate into the project directory:
   ```bash
   cd AUTH-API
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables (replace with your values):
     ```
     DATABASE_URL=your_postgresql_connection_string
     JWT_SECRET=your_jwt_secret
     ```

### Running the Application
1. Start the development server:
   ```bash
   npm run dev
   ```
2. The API will be accessible at `http://localhost:5000` (or your specified port).

---

## API Endpoints
| Method | Endpoint           | Description                       |
|--------|--------------------|-----------------------------------|
| POST   | `/register`        | Register a new user              |
| POST   | `/login`           | Authenticate a user              |
| GET    | `/user`,`/admin`    | Access a protected resource      |

---

## Future Improvements
- Implementing OAuth2 for third-party authentication.
- Adding unit and integration tests.
- Enhancing API documentation with Swagger or Postman.
