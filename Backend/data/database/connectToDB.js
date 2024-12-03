import mongoose from 'mongoose';

const connectToDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Successfully Connected to Database!");
  } catch (error) {
    console.log("Error Connecting to Database : ", error);
  }
};

export default connectToDB;