import app from '../src/app.js';
import connectToDB from '../data/database/connectToDB.js';
import connectCloudinary from '../data/database/cloudinary.js';

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  connectToDB();
  connectCloudinary();
  console.log(`The Server is Running on Port: ${PORT}`);
});