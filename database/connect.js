const mongoose = require('mongoose');


const connect = async (uri,) => {

    try {

        await mongoose.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });

          console.log('database connection established');

    } catch (error) {
        throw new Error(error);
    }
};


module.exports = connect;



