const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
// const cookieSession = require("cookie-session");
// const { shouldSendSameSiteNone } = require('should-send-same-site-none');
// const session = require("express-session");
// const FileStore = require("session-file-store")(session);

require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// server.express.use(
//   session({
//     secret: "top secret key",
//     sameSite: true,
//     httpOnly: true,
//     store: new FileStore(),
//     saveUninitialized: true,
//     resave: true
//   })
// );

// server.express.use(shouldSendSameSiteNone);

// if(process.env.NODE_ENV !== 'development'){
  // server.express.set('trust proxy', 1)
  // server.express.use(
  //     cookieSession({
  //       name: "__session",
  //       keys: ["key1"],
  //       maxAge: 24 * 60 * 60 * 100,
  //       secure: true,
  //       httpOnly: true,
  //       sameSite: 'none'
  //     })
  // );
// }

server.express.use(cookieParser());

// decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the req for future requests to access
    req.userId = userId;
  }
  next();
});

// 2. Create a middleware that populates the user on each request

server.express.use(async (req, res, next) => {
  // if they aren't logged in, skip this
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, permissions, email, name }'
  );
  // console.log(user)
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      // origin: 'http://sick-yoga-front.herokuapp.com',
      // origin: '*',
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
