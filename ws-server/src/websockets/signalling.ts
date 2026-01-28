import { ConnectionType, JoinRoomResponse, RoomType, TypeWebRTCSchema, ExtendedWebSocket } from "../zod/type";
import axios from "axios";

export let connections = new Map<string, ConnectionType>();

export let room = new Map<string, RoomType>();

async function addConnections(message: TypeWebRTCSchema, ws: ExtendedWebSocket) {
  const { userId, interviewId } = message.payload;
  if (!userId || !interviewId) return;

  try {
    const response = await axios.post(`${process.env.REST_API_URL}/api/ws/handleJoinRoom`, {
      userId,
      interviewId,
    });

    const joinRoomData: JoinRoomResponse = response.data;
    if (!joinRoomData || !joinRoomData.success) return;

    const { interviewerId, candidateId, username } = joinRoomData.data;

    ws.userId = userId;
    ws.interviewId = interviewId;
    ws.interviewerId = interviewerId;
    ws.candidateId = candidateId;

    connections.set(userId, { userId, interviewId, ws });

    const otherUserId = userId === candidateId ? interviewerId : candidateId;
    const bothUsersPresent = connections.has(userId) && connections.has(otherUserId);

    const getRole = (uid: string) => uid === interviewerId ? "OFFERER" : "ANSWERER";

    const messageToUser: TypeWebRTCSchema = {
      type: "webrtc_connection",
      payload: { action: "ROOMJOIN_SUCCESS", userId, interviewId },
      role: bothUsersPresent ? getRole(userId) : null,
      isBothParticipantPresent: bothUsersPresent,
      message: `You have joined the interview.`,
    };
    sendSuccessMessage(userId, messageToUser);

    if (bothUsersPresent) {
      const messageToOther: TypeWebRTCSchema = {
        type: "webrtc_connection",
        payload: { action: "ROOMJOIN_SUCCESS", userId: otherUserId, interviewId },
        role: getRole(otherUserId),
        isBothParticipantPresent: true,
        message: `User ${username} has joined the room.`,
      };
      sendSuccessMessage(otherUserId, messageToOther);
    }
  } catch (error) {
    console.error("Error in addConnections:", error);
  }
}


async function handleSendWithoutChange(message: TypeWebRTCSchema, ws:ExtendedWebSocket) {
  const { userId, interviewerId, candidateId } = ws;

  if (!userId || !interviewerId || !candidateId) {
    console.log("Socket not authenticated. Call addConnections first.");
    return;
  }

  // Validate WebRTC payload
  const { action, candidate, sdp } = message.payload;
  if (action === "ICE_CANDIDATE" && !candidate) return;
  if ((action === "OFFER" || action === "ANSWER") && !sdp) return;

  // Determine the recipient using local variables
  const otherUserId = userId === candidateId ? interviewerId : candidateId;
  const role = userId === interviewerId ? "OFFERER" : "ANSWERER";

  // Route the message directly
  if (connections.has(otherUserId)) {
    const updatedMessage = { ...message, role };
    sendSuccessMessage(otherUserId, updatedMessage);
  }
}



export function handleJoinWebRTC(message: TypeWebRTCSchema, ws:ExtendedWebSocket){
    addConnections(message, ws);
}

export function handleOffer(message: TypeWebRTCSchema, ws:ExtendedWebSocket){
    handleSendWithoutChange(message, ws);
}

export function handleAnswer(message: TypeWebRTCSchema, ws:ExtendedWebSocket){
  handleSendWithoutChange(message, ws)
}

export function handleIceCandidate(message: TypeWebRTCSchema, ws:ExtendedWebSocket){
  handleSendWithoutChange(message, ws);
}

export function handleLeave(message: TypeWebRTCSchema, ws:ExtendedWebSocket){
  handleSendWithoutChange(message, ws);
}

export function sendSuccessMessage(userId: string, message: any) {
  const conn = connections.get(userId);
  if (!conn) {
    console.warn("⚠️ No active WebSocket for user:", userId);
    return;
  }
  try {
    console.log("➡️ Sending to:", userId);
    conn.ws.send(JSON.stringify(message));
  } catch (e) {
    console.error("❌ Failed to send message:", e);
  }
}

