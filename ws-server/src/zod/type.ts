import { z } from "zod";
import {  aiChatSchema, exitRoomSchema, initMessageSchema, messageSchema, newMessageSchema, notificationPayloadSchema, OtpSchema, statusSchema, webRTCSchema } from "./schema";
import { WebSocket } from "ws";

export type TypeOtpSchema = z.infer<typeof OtpSchema>
export type TypeNotificationPayloadSchema = z.infer<typeof notificationPayloadSchema>
export type TypeStatusSchema = z.infer<typeof statusSchema>

export type TypeMessage = z.infer<typeof messageSchema>;
export type TypeInitMessageSchema = z.infer<typeof initMessageSchema>
export type TypeExitChatSchema = z.infer<typeof exitRoomSchema>
export type TypeAiChatSchema = z.infer<typeof aiChatSchema>

export type TypeNewMessageSchema = z.infer< typeof newMessageSchema>
export type TypeWebRTCSchema = z.infer<typeof webRTCSchema>

export type ConnectionType = {
    userId: string;
    interviewId: string;
    ws: WebSocket;
}

export type RoomType = {
    interviewId: string;
    peer1Id: string | null;
    Peer2Id: string | null
}

export interface UserProfile {
  id: string;
  username: string;
  profileUrl: string | null;
}

export interface MessagePayload {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewMessageEvent {
  type: "new_message";
  payload: MessagePayload & {
    sender?: UserProfile;   
    recipient?: UserProfile; 
  };
}

export interface Participants{
        id: string;
    };

    export interface UserData {
  userId: string;
  username: string;
  interviewId: string;
  interviewerId: string;
  candidateId: string;
  otherUserId: string | null;
}

export interface JoinRoomResponse {
  success: boolean;
  data: UserData;
}

export interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  interviewId?: string;
  interviewerId?: string;
  candidateId?: string;
}