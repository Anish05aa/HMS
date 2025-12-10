import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongodb.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

// app config
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();
connectCloudinary();

// middleware
const corsOptions = {
  origin: ['https://hms-bafy.onrender.com/', 'https://hms-frontend-yaju.onrender.com'], // ✅ allow both admin and doctor frontend
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter); 
app.use('/api/user',userRouter);

app.get('/', (req, res) => {
  res.send('API WORKING great');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
