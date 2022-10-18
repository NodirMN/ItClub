const { Router } = require("express");
const auth = require("../middleware/auth");
const Frontuser = require("../model/frontuser");
const router = Router();
const upload = require("../middleware/file");

router.get("/", auth, async (req, res) => {
    let frontuser = await Frontuser.find().sort({ _id: -1 }).lean();
    frontuser = frontuser.map((frontuser) => {
        frontuser.status =
        frontuser.status == 1
            ? '<span class="badge bg-success">Активный</span>'
            : '<span class="badge bg-danger">Неактивный</span>';
        return frontuser;
    });

    res.render("frontuser/index", {
        isFrontuser: true,
        frontuser,
        title: "Список Пользователей",
    });
});

router.get("/get/:id", auth, async (req, res) => {
    let _id = req.params.id;
    let frontuser = await Frontuser.findOne({ _id }).lean();
    res.send(frontuser);
});

router.get("/status/:id", auth, async (req, res) => {
    try {
        let _id = req.params.id;
        let frontuser = await Frontuser.findOne({ _id });
        frontuser.status = frontuser.status == 1 ? 0 : 1;
        await frontuser.save();
        res.redirect("/frontuser");
    } catch (error) {
        console.log(error);
    }
});

// router.get("/delete/:id", auth, async (req, res) => {
//     let _id = req.params.id;
//     await Frontuser.findByIdAndDelete({ _id });
//     res.redirect("/frontuser");
// });

router.post("/", auth, upload.single("img"), async (req, res) => {
    let { name, login, email, menu, order, description } = req.body;
    let img = "/images/default.png";
    if (req.file) {
        img = req.file.path;
    }
    let newFrontuser = await Frontuser({ name, login, email,title,text,menu,order,img,description,});
    await newFrontuser.save();
    res.redirect("/frontuser");
});

router.post("/save", auth, upload.single("img"), async (req, res) => {
    let { _id, title, menu, order, text, description } = req.body;
    let frontuser = { title, order,  menu, text, description };
    if (req.file) {
        frontuser.img = req.file.path;
    }
    await Frontuser.findByIdAndUpdate(_id, frontuser);
    res.redirect("/frontuser");
});

module.exports = router;
