import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

// Initialize express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

const JWT_SECRET = 'L9uOmRerxo'; // Replace with a secure secret in production

// MongoDB connection function
const connectUsingMongoose = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/assignment-login-credentials', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected using Mongoose');
    } catch (err) {
        console.error('Error while connecting to DB:', err.message);
    }
};

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        maxLength: [25, "Name can't be greater than 25 characters"],
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+\@.+\..+/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['User', 'Admin'], // Only 'User' and 'Admin' types
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

// User model
const User = mongoose.model('User', userSchema);

// Connect to the database
connectUsingMongoose();

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'nivasuravikumar6@gmail.com', // Your email
        pass: 'hfcf lmks jmqp dsdq' // Your email password
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Serve the sign-up form
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign Up</title>
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body {
                background-image: url("https://www.shutterstock.com/image-vector/food-kitchen-seamless-pattern-pale-600nw-276735071.jpg");
            }
            .container {
                max-width: 600px;
                margin-top: 50px;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .form-control {
                border-radius: 4px;
            }
            .btn-primary {
                background-color: #007bff;
                border: none;
                border-radius: 4px;
                padding: 10px 20px;
            }
            .btn-primary:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2 class="text-center mb-4">Sign Up</h2>
            <form action="/api/register" method="POST">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="username" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="type">Type:</label>
                    <select id="type" name="type" class="form-control" required>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Sign Up</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

// User registration route
// User registration route
app.post('/api/register', async (req, res) => {
    const { username, email, password, type } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already registered. Please use a different email.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword, type });
    await user.save();

    // Send welcome email
    const mailOptions = {
        from: 'nivasuravikumar6@gmail.com',
        to: user.email,
        subject: 'Welcome to Nivasu\'s Website!',
        text: `Hello ${username},\n\nWelcome to Nivasu's website! We are excited to have you onboard.\n\nBest regards,\nNivasu's Website Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending welcome email:', error);
        } else {
            console.log('Welcome email sent:', info.response);
        }
    });

    res.json({ message: 'User registered successfully!' });
});

// User login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'User not found!' });
    }

    // Compare the password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials!' });
    }

    // Create JWT Token
    const token = jwt.sign({ id: user._id, username: user.username, type: user.type }, JWT_SECRET, { expiresIn: '1h' });

    // Send login email
    const mailOptions = {
        from: 'nivasuravikumar6@gmail.com',
        to: user.email,
        subject: 'Login Notification',
        text: `Hello ${user.username},\n\nYou have successfully logged in.\n\nBest regards,\nNivasu's Website Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending login email:', error);
        } else {
            console.log('Login email sent:', info.response);
        }
    });

    // Check user type and respond accordingly
    if (user.type === 'Admin') {
        return res.json({ message: 'Login successful! You are an Admin.', token, showPDF: true });
    } else {
        return res.json({ message: 'Login successful! Hi, hello, bye!', token });
    }
});

// Endpoint to generate PDF of all users
app.get('/api/generate-pdf', async (req, res) => {
    const users = await User.find({}, 'username email'); // Fetch all users' usernames and emails

    // Generate PDF
    const doc = new PDFDocument();
    const filename = `user_credentials.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);
    doc.fontSize(20).text('User Login Credentials', { align: 'center' });
    doc.moveDown();

    users.forEach((user) => {
        doc.fontSize(14).text(`Username: ${user.username} | Email: ${user.email}`);
    });

    doc.end(); // Finish the PDF creation
});

// Start Server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
