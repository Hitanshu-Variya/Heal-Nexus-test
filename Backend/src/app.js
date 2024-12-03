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

const allowedOrigins = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []; 
console.log(allowedOrigins);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,      
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));  

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());  
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/public/Images', express.static(path.join(__dirname, '../public/Images')));

app.use("/auth", authroutes);
app.use("/profile", profileroutes);
app.use("/admin", adminroutes);
app.use("/appointment", appointmentroutes);
app.use("/patient", patientroutes);
app.use("/", Filterroutes);

export default app; 
