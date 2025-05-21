import "dotenv/config";
import  connectDB  from "./db/index.js";
import app from "./app.js"


// dotenv.config({
//   path: "./env",
// });

connectDB()
.then (() => {
    app.listen(process.env.PORT || 8000 , () =>{
        console.log(`Server is listening at port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("Error in DB: ",err);
    
})


