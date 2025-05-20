import "dotenv/config";
import  connectDB  from "./db/index.js";

// dotenv.config({
//   path: "./env",
// });

connectDB();

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
