
const mongoose = require("mongoose");

const DBConnection = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017/notes',{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("DB Connected Successfully")
    } catch (err) {
        console.log(err)
    }
    
}

module.exports = DBConnection;