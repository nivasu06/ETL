
# User Authentication System 

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
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your MongoDB database:
   - Make sure you have MongoDB installed and running on your local machine.
   - Create a new database named `assignment-login-credentials`.

4. Replace the email and password in the Nodemailer setup with your own credentials in the code:
   ```javascript
   const transporter = nodemailer.createTransport({
       service: 'Gmail',
       auth: {
           user: 'your-email@gmail.com', // Your email
           pass: 'your-email-password' // Your email password
       }
   });
   ```

5. Start the server:
   ```bash
   npm start
   ```

6. Open your browser and go to `http://localhost:3000` to access the sign-up form.

## API Endpoints

- **GET /**: Serves the sign-up form.
- **POST /api/register**: Registers a new user. Requires `username`, `email`, `password`, and `type`.
- **POST /api/login**: Logs in a user. Requires `email` and `password`.
- **GET /api/generate-pdf**: Generates and downloads a PDF containing the usernames and emails of all registered users (Admin only).

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [R. Nivasu](https://github.com/nivasu06).
```

This includes the installation command as part of the installation steps. Let me know if you need any more modifications!
