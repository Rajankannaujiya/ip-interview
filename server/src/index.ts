import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import interviewRouter from "./route/inteviewRouter";
import authRouter from "./route/authRouter"
import feedbackRouter from "./route/feedbackRouter"
import commentRouter from "./route/commentRouter";
import notificationRouter from "./route/notificationRouter"
import userRouter from "./route/userRouter"
import chatRouter from "./route/chatRouter"
import wsChatMessage from "./route/wsChatMessage"

import { userMiddleWare } from "./middleware/userMiddleWare";

dotenv.config();

const app = express();
app.use(express.json());
const frontendUrl = process.env.FRONTEND_URL
console.log(frontendUrl)
app.use(cors(
    {
        origin: process.env.FRONTEND_URL
    }
));

app.get("/", (req, res) => {
    res.send("Hi from backend");
});

app.use("/api/auth", authRouter)
app.use("/api/interview",  interviewRouter);
app.use("/api/feedback", feedbackRouter)
app.use("/api/comment", commentRouter)
app.use("/api/notification", notificationRouter);
app.use("/api/messages", chatRouter)
app.use("/api/users",userMiddleWare, userRouter);
app.use("/api/ws",wsChatMessage)

const port  = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`server is listening on port ${port}`);
})
