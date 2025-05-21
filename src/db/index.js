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

// const app = express();


// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error) =>{ // this is an express inbuild event listener which sees if the app is listening or not
//             console.log("Error:",error);
//         })
//         // if every thing goes well then server will be active
//         app.listen(process.env.PORT , () =>{
//             console.log(`Server is listening at port ${process.env.PORT}`);

//         })
//     } catch (error) {
//         console.log("Error connecting to MongoDB:", error);

//     }
// })() // effies functions that are executed immediately