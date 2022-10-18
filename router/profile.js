const { Router } = require("express");
const router = Router();
const User = require("../modeles/user");

router.get("/", (req, res) => {
    const user = req.session.user;
    res.render("profile/index", {
        title: `${user.name} ${user.lname} foydalanuvchi sahifasi`,
        user,
        error: req.flash("error"),
        success: req.flash("success"),
    });
});

// router.post("/save", async (req, res) => {
//         const { _id, name, lname } = req.body;
//         const chekUser = await User.findOne({
//             email,
//             _id: { $ne: _id },
//         });
//         if (chekUser) {
//             req.flash("error", "Bunday emaildagi foydalanuvchi mavjud");
//             res.redirect("/profile/");
//         } else {
//             const user = await User.findOne({
//             _id,
//             });
//             if (req.file) {
//             const img = req.file.path;
//             user.img = img;
//             }
//             user.name = name;
//             user.lname = lname;
//             await user.save();
//             req.session.user = user;
//             req.flash("success", "Ma`lumot yengilandi!");
//             res.redirect("/profile");
//         }
// });
module.exports = router;
