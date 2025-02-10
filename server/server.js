import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors'

dotenv.config({ path: "../.env" });

const app = express();
const port = 3000;
const ALLOWED_ORIGIN = "http://localhost:3000";

const server = createServer(app);
const io = new Server(server, {
  cors: ALLOWED_ORIGIN,
  serveClient: false
})

const clients = {};
const width = 7;
const height = 5;
const ar = [];
const users = new Map();
const states = [];
let current_tick = 0;

//console.log(users.size);
function init_ar() {
  for (let y = 0; y < height; y++) {
    ar[y] = [];
    for (let x = 0; x < width; x++) {
      ar[y][x] = 0;
    }
  }
}

function init_test_users() {

  users.set(1, {
    id: 1,
    x: 0,
    y: Math.floor(height / 2),
    dx: 1,
    dy: 0
  });

  users.set(2, {
    id: 2,
    x: Math.floor(width),
    y: Math.floor(height / 2),
    dx: -1,
    dy: 0
  });

}

new_round();

function new_round() {
  init_ar();
  init_test_users();
  console.log(users);
  setInterval(new_tick, 2000);
}

function new_tick() {

  console.log('new_tick');

  update_users();
  console.log(users);

  add_state();
  console.log(states);

}

function update_users() {
  for (let [id, user] of users) {
    update_user(user);
  }
}

function update_user(user) {
  //console.log(id);
  //console.log(user);
  user.x += user.dx;
  user.y += user.dy;
  //console.log(user);

  const tick_users = [];

  const tick = {

  }

}

function add_state() {

  const state = {
    users: []
  };

  for (let [id, user] of users) {
    state.users.push({
      id: user.id,
      x: user.x,
      y: user.y
    })
  }

  //states.push


}
/*
setInterval(() => {
  new_tick();
  // runs every 2 seconds
}, 2000);
*/


/*
app.use(
    cors({
      origin: ALLOWED_ORIGIN
    })
)
*/

app.use(express.json())// Allow express to parse JSON bodies
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {

  console.log('User %s connected: ', socket.id);

  clients[socket.id] = {
    id: socket.id,
    socket: socket,
    x: 0,
    y: height / 2,
    dx: 1,
    dy: 0
  };

  const keys = Object.keys(clients);

  keys.forEach(key => {
    console.log(key);
    //console.log(`${key} : ${obj[key]}`);
  });

  /*
  for (let client_id in clients) {
    //console.log(client_id);

    if (clients.hasOwnProperty(client_id)) {
      console.log(clients[client_id]);
      //console.log(`${key} : ${obj[key]}`)
    }
  }

   */


  //console.log(clients);
  //console.log(socket.id);
  //console.log(socket);
  socket.on('ping', (msg) => {
    console.log('ping: ' + msg);
    socket.emit('pong');
  });

  socket.on('fetch_updates', (msg) => {

    console.log('fetch_updates: ' + JSON.stringify(msg));
    socket.emit('updates_fetched', 'updates');
  });

  socket.on('disconnect', () => {
    delete clients[socket.id];
    console.log('User disconnected: ' + socket.id);
    console.log(clients);
  });
});

app.post("/api/token", async (req, res) => {
  
  // Exchange the code for an access_token
  const response = await fetch(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.VITE_DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: req.body.code,
    }),
  });

  // Retrieve the access_token from the response
  const { access_token } = await response.json();

  // Return the access_token to our client as { access_token: "..."}
  res.send({access_token});
});

app.get("/index", async (req, res) => {

  // Return the access_token to our client as { access_token: "..."}
  res.send('Hello world');
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
