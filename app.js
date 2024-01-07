import express from 'express'
import createError from 'http-errors'
import morgan from 'morgan'
import { router } from './routes/api.route.js'
import { Server } from 'socket.io'
import http from 'http'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/start', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/api', router);

io.on('connection', (socket) => {
  console.log(`${socket.id} user connected`);

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
