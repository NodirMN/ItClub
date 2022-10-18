const { Router } = require("express");
const auth = require("../middleware/auth");
const Promo = require("../model/promo");
const router = Router();
const upload = require("../middleware/file");

router.get("/", auth, async (req, res) => {
    let promo = await Promo.find().sort({ _id: -1 }).lean();
    promo = promo.map((promo) => {
        promo.status =
        promo.status == 1
            ? '<span class="badge bg-success">Активный</span>'
            : '<span class="badge bg-danger">Неактивный</span>';
        return promo;
    });
    res.render("promo/index", {
        isPromo: true,
        promo,
        title: "Список акции",
    });
});

router.get("/get/:id", auth, async (req, res) => {
    let _id = req.params.id;
    let promo = await Promo.findOne({ _id }).lean();
    res.send(promo);
});

router.get("/status/:id", auth, async (req, res) => {
    try {
        let _id = req.params.id;
        let promo = await Promo.findOne({ _id });
        promo.status = promo.status == 1 ? 0 : 1;
        await promo.save();
        res.redirect("/promo");
    } catch (error) {
        console.log(error);
    }
});

router.get("/delete/:id", auth, async (req, res) => {
    let _id = req.params.id;
    await Promo.findByIdAndDelete({ _id });
    res.redirect("/promo");
});

router.post("/", auth, upload.fields([
    {name:'img',maxCount:1},
    {name:'bigimg',maxCount:1},  
]), async (req, res) => {
    let { title, text, status, menu, order } = req.body;
    let img = bigimg = ''
    if (req.files) {
        if (req.files.img) {
            img= req.files.img[0].path;
        }
        if (req.files.bigimg) {
            bigimg = req.files.bigimg[0].path; 
        }
    }
    status = status || 0;  
    let newPromo = await Promo({title,text,status,menu,order,img,bigimg});
    await newPromo.save();
    res.redirect("/promo");
});

router.post("/save", auth, upload.fields([
    {name:'img',maxCount:1},
    {name:'bigimg',maxCount:1},  
]), async (req, res) => {
    let { _id, title, status, menu, order, text, } = req.body;
    let promo = { title, order, status, menu, text };
    promo.status = promo.status == 1;
        if (req.files) {
                if (req.files.img) {
                    promo.img = req.files.img[0].path;
                }
                if (req.files.bigimg) {
                    promo.bigimg = req.files.bigimg[0].path;
                }
        }
        let photos = promo.photos;
    await Promo.findByIdAndUpdate(_id, promo);
    res.redirect("/promo");
});

module.exports = router;
