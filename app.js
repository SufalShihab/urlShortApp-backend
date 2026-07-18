const path =require('path')
const express =require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const user = require ('./models/userSchema');
const Url = require('./models/urlSchema');
const userRoutes = require('./routes/userRoutes');
const urlRoutes = require('./routes/urlRoute');

const app = express();
const PORT = process.env.PORT || 5000;


// mongoose.connect('mongodb://127.0.0.1:27017/mernUrlShortApp')
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected Successfully!"))
.catch((err) => console.error("MongoDB Connection Error:", err));


app.use(cors({
    origin:true,
    credentials: true
}));

// app.use(cors({
//     origin:[
//         'http://localhost:5173',
//         'https://url-short-app-frontend.vercel.app'
//     ],
//     credentials: true
// }));

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api', urlRoutes);

app.get('/', (req,res) =>{
    res.send('hi hi hi  ')
} );
 
app.get('/api/go/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;
        const urlData = await Url.findOne({ shortId });

        if (urlData) {
            return res.redirect(urlData.longUrl); 
        } else {
            return res.status(404).send("Link not found!");
        }
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

app.listen(PORT,()=>{
    console.log(`Server is started on port ${PORT}`)
})
