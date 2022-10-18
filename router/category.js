const { Router } = require("express");
const auth = require("../middleware/auth");
const Category = require("../model/category");
const router = Router();
const upload = require('../middleware/file')
const category = require("../model/category");
var Handlebars = require("handlebars");
var paginate = require("handlebars-paginate");
Handlebars.registerHelper("paginate", paginate);




router.get("/",auth, async(req,res) => {
 
    let categories = await Category.find().sort({_id:1}).lean();
    categories = categories.map((category,index,) =>{
        category.index = index + 1;
        category.status = category.status == 1
        ? '<span class="badge bg-success">Активный</span>'
        : '<span class="badge bg-danger">Неактивный</span>'; 
        category.menu = category.menu == 1
        ? '<span class="badge bg-success">Да</span>'  
        : '<span class="badge bg-danger">Нет</span>'; 
        
        return category
    })
            res.render("category/index", {
            isCategory: true,
            categories,
            title: "Список категорий",
        });


});





router.get('/get/:id',auth,async(req,res)=>{
        let _id = req.params.id
        let category = await Category.findOne({_id}).lean()
        res.send(category)

})

router.get('/menu/:id',auth,async(req,res)=>{
    try {
        let _id = req.params.id
        let category = await Category.findOne({_id})
        category.menu = category.menu == 1 ? 0:1
        await category.save()
        res.redirect('/category')
    } catch (error) {
        console.log(error);  
    }
})   

router.get("/status/:id", auth, async (req, res) => {
    try {
        let _id = req.params.id;
        let category = await Category.findOne({ _id });
        category.status = category.status == 1 ? 0 : 1;
        await category.save();
        res.redirect("/category");
    } catch (error) {  
        console.log(error);   
    }
});

router.post("/save", auth, upload.single('img'), async (req, res) => {
        let { _id, title, status, menu, order } = req.body;
        let category = {title,order,status,menu}
        category.status = category.status == 1
        category.menu = category.menu == 1;
        if (req.file) {
            category.img = req.file.path
        }
        await  Category.findByIdAndUpdate(_id,category);
        res.redirect("/category");
});


router.get("/delete/:id",auth, async(req, res) => {
        let _id = req.params.id
        await Category.findByIdAndDelete({_id})
        res.redirect("/category");
});


router.post('/',auth, upload.single('img'), async(req,res)=>{
    let {title,status,menu,order} = req.body
    let img = '/images/default.png'
    if (req.file) {
        img = req.file.path
    }
    status = status || 0;
    menu = menu || 0
    let newCategory = await Category({ title, status, menu, order,img });
    await newCategory.save()
    res.redirect('/category')
})


module.exports = router;
