const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async() => {
    try{
        await mongoose.connect(db, {
            useNewUrlParser:true,
            useCreateIndex:true,
            useUnifiedTopology: true
        });
        console.log('mongodb connected!!');
    }catch(err){
        console.error('conn error: ' + err.message);
        //exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;