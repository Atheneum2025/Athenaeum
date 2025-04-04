const express = require('express');
const cloudinary = require('cloudinary');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const connectDB = require('./db/connect');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const users = require('./routes/user.routes');
const auth = require('./routes/auth.routes');
const course = require('./routes/course.routes');
const subject = require('./routes/subject.routes');
const unit = require('./routes/unit.routes');
const material = require('./routes/material.routes');
const quiz = require('./routes/quiz.routes.js');
const calendar = require('./routes/calendar.routes.js');
const viewLater = require('./routes/viewLater.routes.js');
const contactUs = require('./routes/contactUs.routes.js');

// const {sendMessageToAdmin} = require("./utils/contactUs.utils.js")
// const upload = require('./routes/upload.routes');
// const download = require('./routes/download.routes');

const { verifyJWT, verifyAdmin, verifyProfessor } = require('./middlewares/verify.js');


//middleware

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    credentials: true, // Allow credentials (cookies, etc.)
  })
);
app.use(cookieParser())

// app.use(
//     cors({
//         origin:["https://localhost:3000","https://localhost:5173"]
//     })
// )

// app.use((req,res,next)=>{
//     res.header("Access-Control-Allow-Origin","*") //watch it
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested_With, Content-Type, Accept");
//     next();
// })
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static("uploads"))


// const upload = multer(); // Configure multer for form-data parsing

// Middleware to parse form-data
// app.use(upload.none());
//routes

//authenticate user
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/course/', course);
app.use('/api/v1/subject/', subject);
app.use('/api/v1/unit/', unit);
app.use('/api/v1/material/', material);
app.use('/api/v1/quiz/', quiz);
app.use('/api/v1/viewLater/', viewLater);
app.use('/api/v1/contactUs/', contactUs);

app.get('/api', (req, res) => {
    res.json({ message: 'hello from rishon server' })
    console.log('hit')
})

// app.post('/upload', upload.single('file'), function (req, res) {

//     const videoPath = req.file.path
//     const outputPath = `./uploads/courses/223`
//     const hlsPath = `${outputPath}/index.m3u8`

//     ;
// })
// app.get('/video', (req, res) => {
//     console.log('hit')
//     const videoPath = path.resolve(__dirname, 'public/videoFile.mp4');
//     const stat = fs.statSync(videoPath);
//     const fileSize = stat.size;
//     const range = req.headers.range;

//     if (range) {
//         const parts = range.replace(/bytes=/, '').split('-');
//         const start = parseInt(parts[0], 10);
//         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

//         if (start >= fileSize) {
//             res.status(416).send('requested range not satisfiable\n');
//             return;
//         }

//         const chunkSize = end - start + 1;
//         const file = fs.createReadStream(videoPath, { start, end });
//         const headers = {
//             'Content-Range': 'bytes ${start}-${end}/${fileSize}',
//             'Accept-Ranges': 'bytes',
//             'Content-Length': chunkSize,
//             'Content-Type': 'video/mp4',
//         };

//         res.writeHead(206, headers);
//         fs.createReadStream(videoPath).pipe(res);
//     }
// })

const start = async () => {
    try {

        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, (err) => {
            if (err) console.log(err);
            console.log(`listening to port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();