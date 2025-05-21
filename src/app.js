import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
  })
);

// getting ready to take the essentials in the server using express 

app.use(express.json({limit:"16mb"}));
app.use(express.urlencoded({extended:true,limit:"16mb"}))
app.use(express.static("public"))
app.use(cookieParser());
export default app;