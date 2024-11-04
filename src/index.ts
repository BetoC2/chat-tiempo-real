import express from 'express';
import path from 'node:path';
import { Server } from 'socket.io';
import { config } from 'dotenv';
config();

const port = process.env.PORT ?? 3000;
const app = express();

app.use('/assets', express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'home.html'));
});

app.get('/chat/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'chat.html'));
});

const server = app.listen(port, () => {
  console.log(`Server on http://localhost:${port}`);
});

const io = new Server(server);

io.on('connection', (socket) => {
  socket.on('joinRoom', (data) => {
    const room = 'room-' + data.room;
    socket.join(room);
    io.to(room).emit('userNotification', {
      message: `${data.username} se ha unido a la conversación`,
      timestamp: new Date().toLocaleString(),
    });
  });

  socket.on('sendMessage', (data) => {
    const messageData = {
      username: data.username,
      content: data.content,
      timestamp: new Date().toLocaleString(),
    };
    socket.broadcast.to('room-' + data.room).emit('getMessage', messageData);
  });

  socket.on('userLeft', (data) => {
    const room = 'room-' + data.room;
    socket.leave(room);
    io.to(room).emit('userNotification', {
      message: `${data.username} ha dejado la conversación`,
      timestamp: new Date().toLocaleString(),
    });
  });
});
