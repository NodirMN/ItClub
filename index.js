const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const varMiddle = require('./middleware/var')
const auth = require("./middleware/auth");      
const routerList = require('./router');
///////////////////////////////////Sessiya
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require('connect-flash');



//////////////////////////////key papka
const key = require('./key/key')

///////////////////////////////EXPRESS

const  app = express();

////////////////////////////////HENDLEBARS  
const hbs = exphbs.create({
  // defaultLayout: "main",
    extname: ".hbs",
});



//////////////////////////////PABLIC PAPKA
app.use(express.static('public'));
app.use('/uploads',express.static('uploads'))
app.use(express.json())


//////////////////////////////INPUTS Jonatish uchun
app.use(express.urlencoded({extended: true}))

////////////////////////////////////////////////
const MONGODB_URI  = ''
let store = new MongoDBStore({
    uri: key.MONGODB_URI,
    collection: "mySessions",
});

////////////////////////////////Sessiya saqlash
app.use(
    session({
        secret: key.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        // cookie: { secure: true },
        store
        
    })
);   

/////////////////////////////////

app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(flash());

/////////////////////////////
app.use(varMiddle)



app.engine('hbs',hbs.engine)
app.set('view engine', 'hbs')
app.set('views','views') 



////////////////////////////////ROUTER

app.use(routerList)

/////////////////////////////////Router use




//////////////////////SERVER RUNNING
// app.listen(3000,()=>{
//     console.log("server is running ==> http://localhost:3000/");
// })


//////////////////////////MONGOSE RUNNING

async function dev(){   
    try {      
        await mongoose.connect(key.MONGODB_URI, { useNewUrlParser: true });
        app.listen(3000,()=>{
            console.log("Server is running ==> http://localhost:3000/");
        })
    } catch (error) {
        console.log(error);
    }
}


dev();    