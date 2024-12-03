import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authroutes from '../api/routes/auth.routes.js';
import profileroutes from '../api/routes/profile.route.js';
import adminroutes from '../api/routes/admin.routes.js';
import appointmentroutes from '../api/routes/appointments.routes.js';
import patientroutes from '../api/routes/patient.routes.js';
import Filterroutes from '../api/routes/Filter.routes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();
const app = express(); 

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://frontend-domain.com',
  'http://localhost:3000',
  'https://healnexus.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));  

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());  
app.use(cookieParser());

const publicPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '../public')
  : path.join(__dirname, '../public');

app.use('/public', express.static(publicPath));
app.use('/public/Images', express.static(path.join(publicPath, 'Images')));

app.use("/auth", authroutes);
app.use("/profile", profileroutes);
app.use("/admin", adminroutes);
app.use("/appointment", appointmentroutes);
app.use("/patient", patientroutes);
app.use("/", Filterroutes);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app; 
