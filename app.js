require('./configurations/setup')

const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : false,
}));

// app.get('/', (req, res)=>{
//     var img = fs.readFileSync('./intro.gif');
//     res.writeHead(200, {'Content-Type': 'image/gif' });
//     res.end(img, 'binary');
// })

app.get('/', (req, res)=>{
    res.send("Hello ");
})

app.use("/public", express.static(__dirname + '/public'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicle', require('./routes/vechile'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/tracker', require('./routes/tracker'));
app.use('/api/admin', require('./routes/adminAuth'));



    
app.listen(process.env.PORT||3000,() => {
    console.log("Server is listening to port 3000")
})


