const {Router} = require('express');
const router = Router()
const Users = require('../model/users');
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");



///////////////////////////User api send
router.get("/",auth, async (req, res) => {
    let users = await Users.find().lean()
    res.render("users/index", {
        title:"admin",
        users,
        
    }); 
});




router.get("/users/get/:id", async (req, res) => {   
    let _id = req.params.id;
    let users = await Users.findOne({ _id }).lean();
    res.send(users);
});



// router.post("/users/login",auth,async (req, res) => {
//     try {
//         let { email, password } = req.body;
//         let checkUsers = await Users.findOne({  
//             $or: [{ email }, { phone: email }]});   
//             if (checkUsers) {
//             let comprePass = await bcrypt.compare(password,checkUsers.password)
//             if (comprePass) {
//                     let token = uuidv4();
//                     let date = new Date();
//                     date.setDate(date.getDate() + 1);
//                     let tokenExp = date
//                     checkUsers.token = token
//                     checkUsers.tokenExp = tokenExp
//                     await Users.findByIdAndUpdate({_id:checkUsers._id},{token,tokenExp})
//                     res.send({
//                         _id:checkUsers._id,
//                         token,    
//                     })
//             }else {
//                 res.send('password invalid')
//             }
//         }else{
//             res.send('not exists')
//         }
//         } catch(error){
//             res.send(error)
//         }
// });
////////////////////////////////////////////////////////////////////////////////////


router.get("/login", async (req, res) => {
    res.render("users/login", {
        title: "Please Sign-in to your account.",
        layout: "no-head",
        success: req.flash("success"),
        error: req.flash("error"),
    });
});




router.get('/logout',async(req,res)=>{
    req.session.destroy(()=>{
            res.redirect('/users/login')
        })
    })



router.post("/login", async (req, res) => {
    let { login, password, } = req.body;
    let checkUser = await Users.findOne({ login  }).lean();
    if (checkUser) {
        let comparePass = await bcrypt.compare(password, checkUser.password,);
        if (comparePass) {
        req.session.isAuthed = true;
        req.session.user = checkUser;
        req.flash("success", "Tizizmga kirdingiz"); 
        res.redirect("/");
        } else {  
        req.flash("error", "Hatolik yuzaga keldi"); 
        res.redirect("/users/login");
        }
    } else {
        res.redirect("/users/login");
    }   
});

router.post('/login',(req,res)=>{
    const {login,password} = req.body
    if (login == 'admin' && password == 'root') {
         req.session.isAuthed = true;
         res.redirect("/");
    } else {
        res.redirect("/users/login");
  }     
})



///////////////////////////////////////////
router.get("/check/:login", async (req, res) => {
    let login = req.params.login;
    let checkLogin = await Users.findOne({ login });
    if (checkLogin) {
        res.send(true);
    }else{
        res.send(false)
    }
});

router.get("/reg", async (req, res) => {
    res.render("users/reg", {
        title: "Enter your details to create your account",
        layout: "no-head",
    });
});


router.post("/reg", async (req, res) => {
    let { login, password, name } = req.body;
    const checkUser = await Users.findOne({login}).lean();
    if (checkUser) {
        req.flash("error", "This is user olerady token");
        res.redirect("/users/reg");
    } else {
        let hashpass = await bcrypt.hash(password, 6);
        let user = await new Users({ login, password: hashpass, name });
        await user.save();
        res.redirect("/users/login");
    }
});



module.exports = router;


