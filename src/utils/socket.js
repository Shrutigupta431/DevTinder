const socket = require("socket.io");

const crypto = require("crypto");

const { Chat } =
    require("../models/chat");

// ✅ ADDED USER MODEL
const User =
    require("../models/user");

// ✅ STORE ONLINE USERS
const onlineUsers =
    new Map();

const getSecretRoomIdHash =
    (userId, targetUserId) => {

        return crypto
            .createHash("sha256")
            .update(
                [userId, targetUserId]
                    .sort()
                    .join("_")
            )
            .digest("hex");
    };

const initializeSocket =
    (server) => {

        const io = socket(server, {

            cors: {
                origin:
                    "http://localhost:5173",
            }
        });

        io.on(
            "connection",
            (socket) => {

                console.log(
                    "New socket connected"
                );

                // ✅ REGISTER USER ONLINE
                socket.on(
                    "registerUser",
                    ({ userId }) => {

                        onlineUsers.set(
                            userId,
                            socket.id
                        );

                        console.log(
                            "USER REGISTERED:",
                            userId
                        );

                        // ✅ BROADCAST ONLINE STATUS
                        io.emit(
                            "userOnline",
                            {
                                userId,
                            }
                        );
                    }
                );

                // JOIN CHAT ROOM
                socket.on(
                    "joinChat",
                    ({
                        firstName,
                        userId,
                        targetUserId
                    }) => {

                        const roomId =
                            getSecretRoomIdHash(
                                userId,
                                targetUserId
                            );

                        console.log(
                            firstName +
                            " joined roomId = ",
                            roomId
                        );

                        socket.join(roomId);
                    }
                );

                // SEND MESSAGE
                socket.on(
                    "sendMessage",
                    async ({
                        firstName,
                        userId,
                        targetUserId,
                        text
                    }) => {

                        try {

                            const roomId =
                                getSecretRoomIdHash(
                                    userId,
                                    targetUserId
                                );

                            console.log(
                                firstName +
                                " sent message:",
                                text
                            );

                            let chat =
                                await Chat.findOne({
                                    participants: {
                                        $all: [
                                            userId,
                                            targetUserId
                                        ],
                                    },
                                });

                            if (!chat) {

                                chat =
                                    new Chat({

                                        participants: [
                                            userId,
                                            targetUserId
                                        ],

                                        messages: [],
                                    });
                            }

                            // SAVE MESSAGE
                            const message = {
                                senderId: userId,
                                text,
                                deliveredAt: null,
                                seenAt: null,
                            };

                            chat.messages.push(message);

                            await chat.save();

                            // Get last pushed message id for delivery/seen updates
                            const savedMessage =
                                chat.messages[chat.messages.length - 1];

                            // SEND TO ROOM
                            io.to(roomId)
                                .emit(
                                    "receiveMessage",
                                    {
                                        firstName,
                                        userId,
                                        text,
                                        messageId:
                                            savedMessage._id,
                                        deliveredAt:
                                            savedMessage.deliveredAt,
                                        seenAt:
                                            savedMessage.seenAt,
                                    }
                                );


                        } catch (err) {

                            console.log(err);
                        }
                    }
                );

                // ✅ TYPING EVENT
                socket.on(
                    "typing",
                    ({
                        firstName,
                        userId,
                        targetUserId,
                    }) => {

                        const roomId =
                            getSecretRoomIdHash(
                                userId,
                                targetUserId
                            );

                        socket
                            .to(roomId)
                            .emit(
                                "typing",
                                {
                                    firstName,
                                }
                            );
                    }
                );

                // ✅ MESSAGE DELIVERED EVENT
                socket.on(
                    "messageDelivered",
                    async ({ userId, targetUserId, messageId }) => {
                        try {
                            const roomId =
                                getSecretRoomIdHash(
                                    userId,
                                    targetUserId
                                );

                            const chat = await Chat.findOne({
                                participants: { $all: [userId, targetUserId] },
                                "messages._id": messageId,
                            });

                            if (!chat) return;

                            const msg = chat.messages.id(messageId);
                            if (!msg) return;

                            // Mark delivered only once
                            if (!msg.deliveredAt) {
                                msg.deliveredAt = new Date();
                                await chat.save();
                            }

                            io.to(roomId).emit(
                                "messageDelivered",
                                {
                                    messageId,
                                    deliveredAt: msg.deliveredAt,
                                }
                            );
                        } catch (err) {
                            console.log(err);
                        }
                    }
                );

                // ✅ MESSAGE SEEN EVENT
                socket.on(
                    "messageSeen",
                    async ({ userId, targetUserId, messageId }) => {
                        try {
                            const roomId =
                                getSecretRoomIdHash(
                                    userId,
                                    targetUserId
                                );

                            const chat = await Chat.findOne({
                                participants: { $all: [userId, targetUserId] },
                                "messages._id": messageId,
                            });

                            if (!chat) return;

                            const msg = chat.messages.id(messageId);
                            if (!msg) return;

                            if (!msg.seenAt) {
                                msg.seenAt = new Date();
                                await chat.save();
                            }

                            io.to(roomId).emit(
                                "messageSeen",
                                {
                                    messageId,
                                    seenAt: msg.seenAt,
                                }
                            );
                        } catch (err) {
                            console.log(err);
                        }
                    }
                );

                // ✅ DISCONNECT EVENT
                socket.on(
                    "disconnect",
                    async () => {


                        console.log(
                            "User disconnected"
                        );

                        for (
                            let [
                                userId,
                                socketId
                            ]
                            of onlineUsers.entries()
                        ) {

                            if (
                                socketId ===
                                socket.id
                            ) {

                                // REMOVE USER
                                onlineUsers.delete(
                                    userId
                                );

                                // ✅ SAVE LAST SEEN
                                await User
                                    .findByIdAndUpdate(
                                        userId,
                                        {
                                            lastSeen:
                                                new Date(),
                                        }
                                    );

                                // ✅ BROADCAST OFFLINE
                                io.emit(
                                    "userOffline",
                                    {
                                        userId,
                                    }
                                );

                                console.log(
                                    "Removed user:",
                                    userId
                                );

                                break;
                            }
                        }
                    }
                );
            }
        );
    };

module.exports = {
  initializeSocket,
  onlineUsers,
};