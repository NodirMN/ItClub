const { Router } = require("express");
const auth = require("../middleware/auth");
const Slider = require("../model/slider");
const router = Router();
const upload = require("../middleware/file");
  
router.get("/", auth, async (req, res) => {
let sliders = await Slider.find().sort({ _id: -1 }).lean();
    sliders = sliders.map((slider) => {
        slider.status =
        slider.status == 1
            ? '<span class="badge bg-success">Активный</span>'
            : '<span class="badge bg-danger">Неактивный</span>';
        return slider;
    });
    res.render("slider/index", {
        isSlider: true,
        sliders,
        title: "Слайдер",
    });
});

router.get("/get/:id", auth, async (req, res) => {
    let _id = req.params.id;
    let slider = await Slider.findOne({ _id }).lean();
    res.send(slider);
});


router.get("/status/:id", auth, async (req, res) => {
    try {
        let _id = req.params.id;
        let slider = await Slider.findOne({ _id });
        slider.status = slider.status == 1 ? 0 : 1;
        await slider.save();
        res.redirect("/slider");
    } catch (error) {
        console.log(error);
    }
});

router.post("/save", auth, upload.single("img"), async (req, res) => {
    let { _id, title, status,text,link,  order } = req.body;
    let slider = { title, status, text, link,  order };
    slider.status = slider.status == 1;
    
    if (req.file) {
        slider.img = req.file.path;
    }
    await Slider.findByIdAndUpdate(_id, slider);
    res.redirect("/slider");
});

router.get("/delete/:id", auth, async (req, res) => {
    let _id = req.params.id;
    await Slider.findByIdAndDelete({ _id });
    res.redirect("/slider");
});

router.post("/", auth, upload.single("img"), async (req, res) => {
    let { title, text, link, status,  order } = req.body;
    let img = "/images/default.png";
    if (req.file) {
        img = req.file.path;
    }
    status = status || 0;
    let newSlider = await Slider({ title, text,link, status,  order, img });
    await newSlider.save();
    res.redirect("/slider");
});

module.exports = router;
