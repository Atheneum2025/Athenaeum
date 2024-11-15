const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();
const PORT = process.env.PORT || 3000 ;

const users = require('./routes/user.routes');
const auth = require('./routes/auth.routes');
const course = require('./routes/course.routes');
const upload = require('./routes/upload.routes');
const download = require('./routes/download.routes');

const {verify, verifyAdmin, verifyProfessor} = require('./middlewares/verify');

// roles
const ROLES = {
    ADMIN : 'admin',
    PROFESSOR : 'professor',
    STUDENT : 'student'
}
//middleware

app.use(cors());
app.use(express.json());

//routes

app.use('/api/v1/users', users, verify, verifyAdmin);
//authenticate user
app.use('/auth', auth);

//uploads
app.use('/upload', upload, verify, verifyProfessor);
app.use('/download', download, verify);


app.get("/api/v1/users", verify, (req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Welcome to the your Dashboard User!",
        });
    }
    catch(error){
        res.status(500).json({error: error});
    }
});

app.get("/api/v1/admin", verify, verifyAdmin, (req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Welcome to your Dashboard Admin!",
        });
    }
    catch(error){
        res.status(500).json({error: error})
    }
});

app.get("/api/v1/professor", verify, verifyProfessor, (req, res) => {
    try{
        res.status(200).json({
            status: "success",
            message: "Welcome to your Dashboard Professor!"
        });
    }
    catch(error){
        res.status(500).json({error: error})
    }
})

// app.use('/search', search);

app.use('/api/v1/courses', course);
app.get('/api', (req,res)=>{
    res.json({message: 'hello from rishon server'})
    console.log('hit')
})

const start = async () =>{
    try {
        
        // await connectDB(process.env.MONGO_URI);
        app.listen(PORT, (err) => {
            if(err) console.log(err);
            console.log(`listening to port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();