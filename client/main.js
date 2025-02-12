import './style.css'
import rocketLogo from '/rocket.png'
import { io } from "socket.io-client";

//const socket = io('http://localhost:3000');
const socket = io(':3000');

console.log(socket);
socket.on('pong', (msg) => {
    console.log('pong')
})

socket.on('updates_fetched', (msg) => {
    console.log('updates fetched', msg);
})

socket.emit('ping');
socket.emit('fetch_updates', {last_tick: 12});
//alert(1);

document.querySelector('#app').innerHTML = `
  <div>
    <img src="${rocketLogo}" class="logo" alt="Discord" />
    <h1>Hello, World123!</h1>
    <canvas id="canvas">
    </canvas>
  </div>
`;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "red";
ctx.fillRect(0, 0, 1, 1);

const arr = [];

for (let i = 0; i < 10; i++) {
    arr.push([]);
    for (let j = 0; j < 10; j++) {
       arr[i].push(0);
    }
}

console.log(arr);
alert(arr.length);