import mongoose from "mongoose";
import {DB_NAME} from "../constants.js" // error prone area

const connectDB = async () => {
   try {
    const connectionInstances = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`)
      console.log(`mongo db connected at the host : ${connectionInstances.connection.host}`);
      
   } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1);
    
   }
}

export default connectDB; // this is a default export so use directly the name in import statement no need to use the curly braces