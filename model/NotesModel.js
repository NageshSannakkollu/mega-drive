const { default: mongoose } = require("mongoose");

const NotesSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:['Work','Personal','Others'],
        default:'Others'
    }
},{timestamps:true})

const NotesModel = mongoose.models.notes || mongoose.model("notes",NotesSchema)
module.exports = NotesModel;