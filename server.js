const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html', {
    APP_URL: process.env.APP_URL
  });
});

let messages = [];

io.on('connection', socket => {
  console.log(`socket conectado: ${socket.id}`);

  socket.emit('previusMessages', messages);

  socket.on('sendMessage', data => {
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data);
  });
});

server.listen(process.env.PORT || 3000);