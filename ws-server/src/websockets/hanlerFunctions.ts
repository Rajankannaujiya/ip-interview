import { RawData, WebSocket} from "ws"
import { messageSchema } from "../zod/schema";
import { ExtendedWebSocket, NewMessageEvent, Participants, TypeExitChatSchema, TypeInitMessageSchema, TypeNewMessageSchema, TypeWebRTCSchema } from "../zod/type";
import { handleAnswer, handleIceCandidate, handleJoinWebRTC, handleLeave, handleOffer } from "./signalling";
import axios from "axios";

export const clients: Map<string, WebSocket> = new Map(); // userId -> WebSocket




export async function handleMessage(data:RawData, ws:ExtendedWebSocket){
    let parsed;
    try {
        parsed = JSON.parse(data.toString());
    } catch (e) {
        console.error("Invalid JSON received",e);
        return;
    }
    const result = messageSchema.safeParse(parsed);
    if (!result.success) {
        console.error("Invalid message schema", result.error);
        return;
    }else{
        const message = result.data;
        switch(message.type){
            case "initWs":
                console.log("inside init", message)
                await initChat(message, ws);
                break;

            case "chat_message":
                handleChat(message);
                break;

            case "exit_chat":
                handleExitChat(message, ws);
                break;

            case "webrtc_connection":
                handleWebRtcConnection(message, ws);
                break;

            default:
                console.log("the type of the message is not matched", message)
        }
    }
}


async function initChat(message:TypeInitMessageSchema, ws:ExtendedWebSocket) {
    const {userId} = message.payload
    if(userId && !clients.get(userId)){
        ws.userId = userId;
        clients.set(userId, ws);
        console.log(`User ${userId} connected`);
        return;
    }
}

async function handleChat(data:any){
    console.log("data from handleChat", data.payload)
    const {chatId, senderId, receiverId, content}= data.payload
    try {
        const response = await axios.post(`${process.env.REST_API_URL}/api/ws/handleChat`,{chatId, senderId, receiverId, content});
        const {saveMessage}= await response.data;
        const messagePayload = {
            type: 'new_message' as const,
            payload: saveMessage
        };

        console.log("messagePayload in handle chat", messagePayload);
        broadCast(chatId, messagePayload);
    } catch (error:any) {
        console.error("An error occured in the handleChat", error.message)
    }
    
}

async function broadCast(chatId:string, message:TypeNewMessageSchema | NewMessageEvent){
    console.log("in the broadcast", message)
    try {
        const response = await axios.get(`${process.env.REST_API_URL}/api/ws/broadCast/${chatId}`, )

        const data = await response.data;
        console.log(data);
        const participants:Participants[] = data.participants
        
        participants.forEach(({ id }) => {
            console.log( "int the braodcast",id)
            const ws = clients.get(id);
            console.log( "int the braodcast",id)    
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message));
            }
        });
    } catch (error) {
        console.log("Unable to broadcast message", error)   
    }
}

export function handleExitChat(message:TypeExitChatSchema, ws:ExtendedWebSocket) {
    console.log("this is the data from chatExit", message)
    try {
        const {userId} = message?.payload;
        console.log(userId)

        const foundWs = clients.get(userId);
        if(foundWs && foundWs===ws){
            clients.delete(userId);
            console.log(`${userId} disconnected`);
            ws.close();
        }
    } catch (error) {
        console.log("An error occured in handleExitChat", error);   
    }
}

export function handleWebRtcConnection(message: TypeWebRTCSchema, ws:ExtendedWebSocket){
    
    if(message.payload.action === "JOIN"){
        handleJoinWebRTC(message, ws);
    }
    else if(message.payload.action === "OFFER"){
        // received offer send the answer now
        handleOffer(message, ws);
    }
    else if(message.payload.action === "ANSWER"){
        // received answer send to the other peer
        handleAnswer(message, ws);
    }
    else if(message.payload.action === "ICE_CANDIDATE"){
        // received the ice candidate
        console.log("received ice candidate",message)
        handleIceCandidate(message,ws);
    }
    else if(message.payload.action === "LEAVE" ){
        handleLeave(message, ws);
    }
}

