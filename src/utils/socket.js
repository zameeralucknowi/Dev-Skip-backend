const socket = require('socket.io')
const Message = require('../models/message');
const Conversation = require('../models/conversation')

const initializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            origin:'https://devskip.onrender.com',
            credentials: true
        }
    })

    io.on('connection', (socket) => {

        try {

            socket.on('joinChat', ({ fromUser, senderId, recieverId }) => {
                const roomId = [senderId, recieverId].sort().join('_');
                socket.join(roomId);
            })

            socket.on('sendMessage', async ({ fromUser, senderId, recieverId, message }) => {
                const roomId = [senderId, recieverId].sort().join('_');

                let conversation = await Conversation.findOne({
                    participants: { $all: [senderId, recieverId] }
                })

                if (!conversation) {
                    conversation = await Conversation.create({
                        participants: [senderId, recieverId]
                    })
                }

                const dbMessage = new Message({ senderId, recieverId, content: message })

                conversation.messages.push(dbMessage._id);

                await Promise.all([conversation.save(), dbMessage.save()]);
                socket.to(roomId).emit('messageRecieved', { senderId, message })

            })

            socket.on('discconnet', () => {

            })


        } catch (error) {
            console.log(error)
        }

    })


}

module.exports = initializeSocket;