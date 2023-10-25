require('dotenv').config();

const express = require('express');

const helmet = require('helmet');

const rateLimiterMiddleware = require('./middlewares/ratelimiter');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

const connect = require('./database/connect');

const router = require('./router/router');

const PORT = process.env.PORT || 9874;


const cors = require('./middlewares/cors');

//middlewares
app.use(helmet());

app.use(helmet.hidePoweredBy());


if (process.env.NODE_ENV === "production")
{
    app.use(cors);
};


app.use(rateLimiterMiddleware);

app.use(express.urlencoded({extended : true}));

app.use(express.json({limit: '500kb'}));




app.get('/', (req,res) => {
    res.send({
        "status" : "success",
        "live" : true
    });
});


/*
app.post(
    '/validate',
    body('email').notEmpty().isEmail(),
    (req, res , next) => {
      const result = validationResult(req);
      if (result.isEmpty())
      {
        res.status(200).send('arrived');
      }
      else
      {
        res.status(400).send(result.array());
      }
    },
  );
  */

app.use(router);


app.use(errorHandler);


app.listen(PORT, async () => {
     
    try {
        await connect(process.env.MONGO_URI);
        console.log(`listening on ${PORT}`);
    } catch (error) {
        console.error(error);
    }
   
});







