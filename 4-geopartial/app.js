import express from 'express';
import process from 'process';
import Bodyparser from 'body-parser';

import path from 'path'
import { fromNorthPole, aroundLockm, nearbyCities, client } from './redis.js';
import { addUsCities } from './uscities.js';
import { addIntCities } from './worldcities.js';
const port = process.env.PORT || 3001;

// setup redis data
client.flushall();
addUsCities();
addIntCities();

const app = express();
app.use(express.json());
app.use(Bodyparser.json());

// app.use(express.static('public'))
app.set('views', './src/views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
});

app.get('/location', (req, res) => {
  res.render('location')
})

app.post("/api/location", (req, res) => {
  const { latitude, longitude } = req.body;
  res.send({ latitude, longitude })
});

app.get('/nearby-cities/:distance', (req, res) => {
  const distance = req.params.distance
  res.render('nearbycities', { distance })
})

app.post('/nearby-cities', async (req, res) => {
  // Get the user's location from the request body
  const latitude = parseInt(req.body.latitude);
  const longitude = parseInt(req.body.longitude);
  const distance = parseInt(req.body.distance);
  const cities = await nearbyCities(longitude, latitude, distance)
  res.send(cities)
});

app.get('/from-northpole/:km', async (req, res) => {
  const data = await fromNorthPole(parseInt(req.params.km));
  res.send(data);
});

app.get('/around/:long/:lat/:km', async (req, res) => {
  const data = await aroundLockm(parseInt(req.params.long), parseInt(req.params.lat), parseInt(req.params.km));
  res.send(data);
});


// app.listen(process.argv[2]);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
