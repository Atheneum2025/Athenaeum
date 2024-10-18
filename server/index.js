const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();
const PORT = process.env.PORT || 3000 ;

const users = require('./routes/user.routes');
const auth = require('./routes/auth.routes');
//middleware

app.use(cors());
app.use(express.json());

//routes

app.use('/api/v1/users', users);
app.use('/auth', auth);
//authenticate user
// app.use('/register', signup);
// app.use('/login', login);
// app.use('/search', search);

// app.use('/api/v1/courses', courses);
// app.use('/api/v1/courses/:courseId/subject', subjects);
// app.get('/api', (req,res)=>{
//     res.json({message: 'hello from rishon server'})
//     console.log('hit')
// })

const start = async () =>{
    try {
        
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, (err) => {
            if(err) console.log(err);
            console.log(`listening to port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();