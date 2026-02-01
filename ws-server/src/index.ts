import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { setUpWebsocketServer } from "./websockets/websocket";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: `${process.env.FRONTEND_URL}`
}));

app.get("/", (req, res) => {
res.send("Hi from backend");
});

const server = http.createServer(app);

setUpWebsocketServer(server);

const port = process.env.PORT || 5000;

server.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});

