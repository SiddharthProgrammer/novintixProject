
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { connectDB } = require('./config/db');
const Message = require('./models/Message');
const formatMessage = require('./utils/messages');
const {
   userJoin,
   getCurrentUser,
   userLeave,
   getpeopleUsers,
} = require('./utils/users');

// Initialize database (creates data directory if needed)
connectDB();

const app = express();
const server = http.createServer(app);


const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";
const io = socketIo(server, {
   cors: {
      origin: FRONTEND_URL,
      methods: ["GET", "POST"]
   }
});


app.use(cors({
   origin: FRONTEND_URL
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const botName = 'ChatApp';


io.on('connection', (socket) => {
   socket.on('joinpeople', async ({ username, people, password }) => {
     
      const ROOM_PASSWORD = '123';
      
      if (password !== ROOM_PASSWORD) {
         socket.emit('passwordError', { message: 'Incorrect password. Please try again.' });
         return;
      }

      const user = userJoin(socket.id, username, people);

      socket.join(user.people);

     
      try {
         const previousMessages = await Message.findWithLimit({ people: user.people }, 100);
        
         socket.emit('previousMessages', previousMessages);
      } catch (error) {
         console.error('Error loading previous messages:', error);
      }

    
      socket.emit('message', formatMessage(botName, 'Welcome to ChatApp'));

    
      socket.broadcast
         .to(user.people)
         .emit(
            'message',
            formatMessage(botName, `${user.username} has joined the chat!`)
         );

      // Send room users
      io.to(user.people).emit('peopleUsers', {
         people: user.people,
         users: getpeopleUsers(user.people),
      });
   });

   socket.on('chatMessage', async (msg) => {
      const user = getCurrentUser(socket.id);

      if (user) {
         const messageData = formatMessage(user.username, msg);
         
         // Save message to database
         try {
            await Message.save({
               username: messageData.username,
               text: messageData.text,
               time: messageData.time,
               people: user.people,
               createdAt: new Date()
            });
         } catch (error) {
            console.error('Error saving message:', error);
         }

         // Emit message to all users in the room
         io.to(user.people).emit('message', messageData);
      }
   });

   // runs when clients disconnects
   socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      if (user) {
         io.to(user.people).emit(
            'message',
            formatMessage(botName, `${user.username} has left the chat!`)
         );

        
         io.to(user.people).emit('peopleUsers', {
            people: user.people,
            users: getpeopleUsers(user.people),
         });
      }
   });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
   console.log(`127.0.0.1: ${PORT}`);
});
