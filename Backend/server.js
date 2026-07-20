require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db-config')
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/AuthRoutes');
const adminRoutes  = require('./routes/AdminRoutes')
const substationRoutes = require('./routes/SubstationRoutes')
const otcalculation = require('./jobs/weeklyHours.job')

const port = process.env.PORT;
const app = express();
app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173',     // For local development
  'http://10.10.71.65:7000',   // Frontend running on port 7000
  'http://10.10.71.65'         // Frontend running on port 80 (if you change it later)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, postman, or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(cookieParser());

//db connection check
(async () => {
    try {
        const connection = await db.getConnection();
        console.log(' Connected to MySQL database ');
        connection.release();
    } catch (err) {
        console.error('MySQL connection failed:', err.message);
        process.exit(1);
    }
})();

//routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/substation', substationRoutes);


app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});


otcalculation();
