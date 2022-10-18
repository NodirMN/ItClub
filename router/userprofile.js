const { Router } = require("express");
const router = Router();
const Users = require("../model/users");
const Userrole = require("../model/userrole");

const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const upload = require("../middleware/file");



///////////////////////////Users api send  
router.get("/", auth,    async (req, res) => {
    let users = await Users.find().populate().lean();
    let user =  req.session.user
    res.render("pages/profile", {
      title: `Изменить данные админа`,
      name: `${user.name}`,
      img:`${user.img}`,
      users,
      error: req.flash("error"),
      success: req.flash("success"),
    });   
});

router.post("/save",   upload.single("img"),async (req, res) => {
  let { login, password, name, roles } = req.body;
 
  const checkUser = await Users.findOne({ login }).populate('userrole').lean();
  let img = "/images/default.png";
    if (req.file) {
      img = req.file.path;
    }
  if (checkUser) {
    req.flash("error", "This is user olerady token");
    res.redirect("/userprofile");
  } else {
    let hashpass = await bcrypt.hash(password, 6);
    
    let user = await new Users({ login, password: hashpass, name ,img, roles });
    await user.save();
    res.redirect("/userprofile");
  }   
});
  

router.post("/update", upload.single("img"), auth, async (req, res) => {
  let { _id, name, login } = req.body;
  let users = { name, login };
  if (req.file) {
    img = req.file.path;
    users.img = img
  }
  await Users.findByIdAndUpdate(_id, users,);
  req.session.user = users
  res.redirect("/userprofile");
});

router.get("/get/:id", auth, async (req, res) => {
  let _id = req.params.id;
  let userprofile = await Users.findOne({ _id }).lean();
  res.send(userprofile);
});

router.get("/delete/:id", auth, async (req, res) => {
  let _id = req.params.id;
  await Users.findByIdAndDelete({ _id });
  res.redirect("/userprofile");
});



module.exports = router;