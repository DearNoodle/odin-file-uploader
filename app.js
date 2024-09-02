const express = require('express');
const { sessionConnection } = require('./models/db');
const path = require('path');
const passport = require('./passport/passport');
const router = require('./routes/router');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(sessionConnection);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
