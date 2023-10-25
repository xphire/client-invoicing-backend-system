const cors = require('cors');

const whitelist = ['https://render.com','https://onrender.com'];

const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } 
      else 
      {
        callback(new Error('Not allowed by CORS'));
        //throw new Error('Not allowed by CORS');
      };
    },
};



module.exports = cors(corsOptions);