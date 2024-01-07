import express from 'express'
import createError from 'http-errors'
import morgan from 'morgan'
import { router } from './routes/api.route.js'
import { Server } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'
dotenv.config()

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
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
