const mongoose = require("mongoose")
const colors = require("colors")


const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(
            `Connected to database ${mongoose.connection.host}`.bgCyan.white
        );

    }catch(error){
        console.log(`error in connecting db ${error}`.bgRed.white);
    }
};

module.exports = connectDB;