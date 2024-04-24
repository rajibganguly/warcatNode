const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./backend/routes/userRoutes');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()) // for CORS enable or disable

// Routes
app.use('/api', userRoutes);
// Other routes
//mongodb+srv://rajibgangulyaiml:Password@123@cluster0.ld6zicc.mongodb.net/warcatDb
//mongodb://127.0.0.1:27017/?directConnection=true

// Database connection
mongoose.connect('mongodb://localhost:27017/warcatDb');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
