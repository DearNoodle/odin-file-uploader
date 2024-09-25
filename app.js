const path = require('path');
require('dotenv').config();
const express = require('express');
const router = require('./routes/router');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const { sessionConnection } = require('./configs/sessionConfig');
app.use(sessionConnection);

const { configCloudinary } = require('./configs/cloudinaryConfig');
configCloudinary();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const passport = require('./passport/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use('/', router);

const PORT = process.env.PORT || 3000;
// '0.0.0.0' host required for railway deploy
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}!`);
});
