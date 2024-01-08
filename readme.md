# Course Review API

### Objective: Develop a Node.js Express application with TypeScript as the programming language, integrating MongoDB with Mongoose for course review management. Here data integrity is ensured through validation using Zod. This application is developed using Node.js, Express, MongoDB, and TypeScript.

## Features

- Course Management: Create, read, dynamic or partial update, and delete courses.
- Review System: Add reviews to courses.
- Pagination and Filtering: Get paginated and filtered lists of courses.
- Best Course Endpoint: Retrieve the best course based on average review rating and count.
- Validation: Input validation using Zod.
- Error Handling: Centralized error handling.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed
- MongoDB Atlas account (or your local MongoDB server)
- MongoDB connection string
- Your environment variables in a `.env` file (similar to the provided `.env` example)

## Getting Started

1.  Clone the repository:

    ```bash
        git clone https://github.com/Porgramming-Hero-web-course/l2b2a4-course-review-with-auth-riasat97.git
    ```

2.  Navigate to the project directory:
    ```bash
        cd l2b2a4-course-review-with-auth-riasat97
    ```
3.  Install dependencies:
    ```bash
        npm install
    ```
4.  Create a .env file in the root directory and add your environment variables:

    ```bash
        NODE_ENV=development
        PORT=5000
        DATABASE_URL=mongodb+srv://your-username:your-password@cluster0.mongodb.net/your-database?retryWrites=true&w=majority
        BCRYPT_SALT_ROUNDS=12
    ```

    Replace your-username, your-password, and your-database with your MongoDB Atlas credentials.

5.  Start the application:

    ```bash
        npm run start:dev
    ```

    The application will be available at http://localhost:5000.

    API Documentation link: https://documenter.getpostman.com/view/158106/2s9YsDkF4U
