const { ShardingManager } = require('discord.js');
const shard = new ShardingManager('./yo.js');
shard.spawn(2);

const express = require('express');
const app = express();
app.use(express.static('public'));
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
});
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];
app.get("/dreams", (request, response) => {
  response.send(dreams)
});
app.post("/dreams", (request, response) => {
  dreams.push(request.query.dream)
  response.sendStatus(200)
});
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your bot is listening on port ${listener.address().port}`)});
