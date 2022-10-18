const { Router } = require("express");
const auth = require("../middleware/auth");
const Attribute = require("../model/attribute");
const Category = require("../model/category");
const router = Router();  

router.get("/", auth, async (req, res) => {
    let attribute = await Attribute.find().populate('category').sort({_id:1}).lean();
    let category = await Category.find({status:1}).lean()
    attribute = attribute.map((attribute,index) => {
        attribute.index = index + 1;
        attribute.status = attribute.status == 1
            ? '<span class="badge bg-success">Активный</span>'
            : '<span class="badge bg-danger">Неактивный</span>';
        return attribute;
    });
    res.render("attribute/index", {
        isAttribute: true,
        category,
        attribute,
        title: "Список атрибутов",
    });
});

router.get("/get/:id", auth, async (req, res) => {
    let _id = req.params.id;
    let attribute = await Attribute.findOne({_id}).lean();
    res.send(attribute);
});



router.get("/status/:id", auth, async (req, res) => {
    try {
        let _id = req.params.id;
        let attribute = await Attribute.findOne({ _id });
        attribute.status = attribute.status == 1 ? 0 : 1;
        await attribute.save();
        res.redirect("/attribute");
    } catch (error) {
        console.log(error);
    }
});

router.post("/save", auth, async (req, res) => {
    let {_id, title, status, order, category } = req.body;
    let attribute = { title, status,  order, category };
    attribute.status = attribute.status == 1;
    await Attribute.findByIdAndUpdate(_id, attribute);
    res.redirect("/attribute");  
});  
  
router.get("/delete/:id", auth, async (req, res) => {
    let _id = req.params.id;
    await Attribute.findByIdAndDelete({_id});
    res.redirect("/attribute");
});


router.post("/", auth,  async (req, res) => {
    let { title, status, order, category } = req.body;
    status = status || 0;
    let newAttribute = await Attribute({ title, status,  order, category });
    await newAttribute.save();
    res.redirect("/attribute");  
});
/////////////////////////api

router.get('api/attribute/cat/:id',async(req,res)=>{
        let attribute = await Attribute.find({category:req.params.id}).lean()
        res.send(attribute);
})  

module.exports = router;
