# ETL
# User Authentication System with PDF Generation

This project is a user authentication system built with Express.js, Mongoose, and Nodemailer. It allows users to register, log in, and receive notification emails. Additionally, the admin can generate a PDF containing user login credentials.

## Features

- User registration with username, email, password, and user type (User/Admin).
- Email verification upon registration.
- User login with JWT authentication.
- Admin functionality to generate a PDF of all registered users.
- Email notifications for registration and login activities.

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database to store user credentials.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Bcrypt**: Library for hashing passwords.
- **JsonWebToken**: Library for creating and verifying JWTs.
- **Nodemailer**: Module for sending emails.
- **PDFKit**: Library for generating PDF documents.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/repository-name.git
   cd repository-name
