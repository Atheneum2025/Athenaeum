const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const connectDB = require('./db/connect');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const users = require('./routes/user.routes');
const auth = require('./routes/auth.routes');
const course = require('./routes/course.routes');
// const upload = require('./routes/upload.routes');
// const download = require('./routes/download.routes');

const { verify, verifyAdmin, verifyProfessor } = require('./middlewares/verify');

// roles
const ROLES = {
    ADMIN: 'admin',
    PROFESSOR: 'professor',
    STUDENT: 'student'
}
//middleware

app.use(cors());
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
app.use(express.urlencoded({extended: true}))
app.use("/uploads",express.static("uploads"))

// multer middlewares
const storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null, "./uploads")
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname +  "-" + path.extname(file.originalname))
    }
})

// multer configuration
const upload = multer({storage: storage})
//routes

app.use('/api/v1/users', users, verify, verifyAdmin);
//authenticate user
app.use('/auth', auth);

//uploads
// app.use('/upload', upload, verify, verifyProfessor);
// app.use('/download', download, verify);


app.get("/api/v1/users", verify, (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            message: "Welcome to the your Dashboard User!",
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});

app.get("/api/v1/admin", verify, verifyAdmin, (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            message: "Welcome to your Dashboard Admin!",
        });
    }
    catch (error) {
        res.status(500).json({ error: error })
    }
});

app.get("/api/v1/professor", verify, verifyProfessor, (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            message: "Welcome to your Dashboard Professor!"
        });
    }
    catch (error) {
        res.status(500).json({ error: error })
    }
})

// app.use('/search', search);

app.use('/api/v1/courses', course);
app.get('/api', (req, res) => {
    res.json({ message: 'hello from rishon server' })
    console.log('hit')
})


app.post('/upload', upload.single('file'), function(req,res){
    
    const videoPath = req.file.path
    const outputPath = `./uploads/courses/223`
    const hlsPath = `${outputPath}/index.m3u8`
    console.log("hlsPath", hlsPath);


;})
app.get('/video', (req, res) => {
    console.log('hit')
    const videoPath = path.resolve(__dirname, 'public/videoFile.mp4');
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize) {
            res.status(416).send('requested range not satisfiable\n');
            return;
        }

        const chunkSize = end - start + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const headers = {
            'Content-Range': 'bytes ${start}-${end}/${fileSize}',
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, headers);
        fs.createReadStream(videoPath).pipe(res);
    }
})

const start = async () => {
    try {

        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, (err) => {
            if (err) console.log(err);
            console.log(`listening to port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();