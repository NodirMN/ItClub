const {Router} = require('express');
const Attribute = require("../model/attribute");
const router = Router()
const Category = require('../model/category')
const Slider = require('../model/slider')
const Product = require('../model/product')
const Blog = require('../model/blog');
const User = require('../model/users')
const bcrypt = require("bcrypt");
///CATEGORIYA
router.get('/category/get/:id',async(req,res)=>{
    let _id = req.params.id
    let category = await Category.findOne({_id}).lean()
    res.send(category)
})


router.get("/category/getall", async (req, res) => {
    let category = await Category.find({ status: 1 }).sort({ order: -1 }).lean();
    res.send(category);
});
///////////////////////////////
router.get("/attribute/get/:id", async (req, res) => {
    let _id = req.params.id;
    let attribute = await Attribute.findOne({ _id }).lean();
    res.send(attribute);
});
router.get("/attribute/cat/:id", async (req, res) => {
    let attribute = await Attribute.find({ category: req.params.id }).lean();
    res.send(attribute);
});  

router.get("/attribute/getall", async (req, res) => {
    let attribute = await Attribute.find({ status: 1 }).sort({ order: -1 }).lean();
    res.send(attribute);
});
////////Slider APi
router.get("/slider/getall", async (req, res) => {
    let slider = await Slider.find({ status:1 }).limit(4).sort({order:-1}).lean();
    res.send(slider);
});


//////////////
router.get('/newproduct', async(req,res)=>{
    let products = await  Product.find({newpro:1}).sort({_id:-1}).populate('category').select(['title','price','sale','photos','review','top','newpro','_id']).limit(4).lean()
    res.send(products)
})

//////////////////////blog
router.get('/blog/get/:id', async(req,res)=>{
    let blog = await  Blog.find({_id:req.params.id}).lean()
    res.send(blog)


})
/////////////////////////////////////email
// router.get('/user/checkemail/:email', async(req,res)=>{
//     let {email} = req.params
//     let checkUser = await User.findOne({email})
//     if (checkUser) {
//         res.send('bad')
//     }else{
//         res.send('good')
//     }
// })

/////////////////////////////////////phone
router.get('/user/checkphone/:phone', async(req,res)=>{
    let {phone} = req.params
    let checkUser = await User.findOne({phone})
    if (checkUser) {
        res.send('bad')
    }else{
        res.send('good')
    }
})

/////////////////////////////////////////
// router.post("/user/reg", async (req, res) => {
//     try {
//         let {name,phone,email,password} = req.body
//         let hashpass = await bcrypt.hash(password,10)
//         let newUser = await new User({ name, phone, email, password:hashpass });
//         await newUser.save()
//         res.send('ok')
//     } catch (error) {
//         res.send(error);
//     }

// });

////////////////////////////////

module.exports = router  