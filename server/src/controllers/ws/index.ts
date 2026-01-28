import { Response, Request } from "express";
import { prisma } from '../../db/db.index'


export const handleChatWs = async(req:Request ,res:Response):Promise<any>=>{
    try {
        const {chatId, senderId, receiverId, content}= req.body
        const saveMessage = await prisma.message.create({
            data:{
                chatId,
                senderId,
                receiverId,
                content
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        profileUrl: true,
                    }
                },
                recipient: {
                    select: {
                        id: true,
                        username: true,
                        profileUrl: true,
                    }
                }
            }
        })
        res.status(200).json({saveMessage:saveMessage})
    }
    catch (error:any) {
        console.error("An error occured in the handleChat", error.message)
    }
}

export const broadCastWs = async(req:Request ,res:Response):Promise<any>=>{
    console.log("I am here")

    try {
        const {chatId} = req.params;
        const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        select: {
            participants: {select:{
                id:true
            }}
        }
        });

        res.status(200).json({participants:chat?.participants})
    }
    catch (error:any) {
        console.error("An error occured in the broadcastws", error.message)
    }
}


export const handleJoinRoom = async (req: Request, res: Response):Promise<any> => {
  try {
    const { userId, interviewId } = req.body;

    if (!userId || !interviewId) {
       res.status(400).json({ error: "Missing userId or interviewId" });
       return;
    }

    const [interview, user] = await Promise.all([
      prisma.interview.findUnique({
        where: { id: interviewId },
        select: { id: true, interviewerId: true, candidateId: true },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true },
      }),
    ]);

    if (!interview || !user) {
       res.status(404).json({ error: "Interview or User not found" });
       return;
    }

    const otherUserId = interview.candidateId === userId 
      ? interview.interviewerId 
      : interview.candidateId;

    res.status(200).json({
      success: true,
      data: {
        userId,
        username: user.username,
        interviewId: interview.id,
        interviewerId: interview.interviewerId,
        candidateId: interview.candidateId,
        otherUserId,
      }
    });
  } catch (error) {
    console.error("REST API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
