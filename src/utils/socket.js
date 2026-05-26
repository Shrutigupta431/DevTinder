const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomIdHash = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex");
}
const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        }
    })

    //receive  connection request from client

    io.on("connection", (socket) => {
        //handle events
        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomIdHash(userId, targetUserId);
            console.log(firstName + " " + "has joined roomId = ", roomId)
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({ firstName, userId, targetUserId, text }) => {


            // save message to the database
            try {
                const roomId = getSecretRoomIdHash(userId, targetUserId);
                console.log(firstName + " " + "has sent message in roomId = ", text)
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] },

                });
                if (!chat) {
                    chat =  new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    })
                }

                chat.messages.push({
                    senderId: userId,
                    text
                })

               await chat.save();
                io.to(roomId).emit("receiveMessage", {
                    firstName,
                    userId,
                    text
                });

            } catch (err) {
               console.log(err);
            }



        });

        socket.on("disconnect", () => {

        });
    })

}

module.exports = initializeSocket;