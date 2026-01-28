import { Router } from "express";
import { broadCastWs, handleChatWs, handleJoinRoom } from "../controllers/ws";


const router = Router();

router.post("/handleChat", handleChatWs);
router.get("/broadCast/:chatId", broadCastWs)
router.post('/handleJoinRoom', handleJoinRoom);



export default router;