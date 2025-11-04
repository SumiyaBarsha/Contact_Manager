import express from "express";
import "dotenv/config";
import contactRouter from "./routes/contactRouter.js";
import errorHandler from "./middleware/errorHandler.js";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import cookieParser from "cookie-parser";

//connect database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
//api endpoints
app.use("/api/contacts", contactRouter);
app.use("/api/users", userRouter);

//middleware error handler
app.use(errorHandler);
app.use(cookieParser()); // so refresh token in cookie works

app.get("/", (req,res) => {
    res.json({message: "API working!!!"});
});

app.listen(port, ()=>{
    console.log(`Server running on PORT ${port}`);
});