const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const sqlite3 = require("sqlite3")
const {open} = require("sqlite")
app.use(express.json())
app.use(cors())


const dbPath = path.join(__dirname,'notes.db')
let database = null;
const port = 3006;
const initializeDBAndServer = async() => {
    try {
        database = await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(port,()=>{
        console.log(`Server Running at:http://localhost:${port}/`)
    })
    } catch (error) {
        console.log("DB Error at:",error)
        process.exit(1);
    }
}

initializeDBAndServer()

app.post("/notes",async(request,response) => {
    const {title,description,category} = request.body;
    const noteDetails = request.body;
    console.log("noteDetails:",noteDetails)
    const checkTaskName = `SELECT * FROM notes WHERE title='${title}';`;
    if(checkTaskName === undefined){
        response.status(400);
        response.send("Title already exist")
    }
    const addNoteQuery= `INSERT INTO notes(title,description,category) VALUES('${title}','${description}','${category}');`;
    const addNoteQueryResponse = await database.run(addNoteQuery);
    const noteId = addNoteQueryResponse.lastID;
    response.send(`Note added Successfully with ID: ${noteId}`);
})

// //GET all tasklist 

app.get("/notes",async(request,response) => {
    const getAllNotes = `SELECT * FROM notes`;
    const allNotesResponse = await database.all(getAllNotes);
    response.send(allNotesResponse)
})

// //UPDATE specific task 

app.put("/notes/:id",async(request,response) => {
    const {id} = request.params;
    console.log("ID:",id)
    const {title,description,category} = request.body;
    console.log(request.body)
    const updateNoteQuery = `
        UPDATE notes 
        SET 
            title='${title}',
            description='${description}',
            category='${category}'
        WHERE id=${id}`;
    await database.run(updateNoteQuery)
    response.send("Note updated Successfully")

})

// //SPECIFIC task

app.get("/notes/:id",async(request,response) => {
    const {id} = request.params;
    const getNote = `SELECT * FROM notes WHERE id=${id}`;
    const allNotesResponse = await database.get(getNote);
    response.send(allNotesResponse)
})

// //delete Specific Task 

app.delete("/notes/:noteId",async(request,response) => {
    const {noteId} = request.params;
    const getNoteWithId = `SELECT * FROM notes WHERE id=${noteId};`;
    const getTaskWithIdResponse = await database.get(getNoteWithId);
    if(getTaskWithIdResponse ===undefined){
        response.status(400)
        response.send("Invalid note Id,try again with valid id")
    }else{
        const deleteNoteQuery = `DELETE FROM notes WHERE id=${noteId}`;
        await database.run(deleteNoteQuery)
        response.send("Note Deleted Successfully");
    }
})

// //User Profile
