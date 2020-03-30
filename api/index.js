const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const expressWs = require('express-ws');
const app = express();
expressWs(app);

app.use(express.json());
app.use(cors());

const port = 8000;

const connections = {};
const messages = [];
app.ws('/draw', function (ws, req) {
    console.log('client connected');
    const id = nanoid();
    connections[id] = ws;

    ws.send(JSON.stringify(
        messages
    ));


    ws.on('message', (draw) => {
        console.log(`Incoming message from ${id}: `, draw);

        const parsed = JSON.parse(draw);
        messages.push(...parsed);
        Object.keys(connections).forEach(drawid => {
            const connection = connections[drawid];
            connection.send(JSON.stringify(

                messages
            ));


        })
    });

    ws.on('close', (msg) => {
        console.log(`client disconnected! ${id}`);

        delete connections[id];
    });
});

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});