const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()
const Product = require('../model/product')
const Category = require('../model/category')
const Attribute = require("../model/attribute");
var Handlebars = require("handlebars");
var paginate = require("handlebars-paginate");
Handlebars.registerHelper("paginate", paginate);
const upload = require('../middleware/file')

router.get('/',auth,async(req,res)=>{
    let perPage = 10;
    let page = req.query.p;
    let category = await Category.find().lean()
    let products = await Product.find().populate('category').populate('attribute.attribute').sort({_id:-1}).limit(perPage).skip((perPage * page) - perPage).lean()  
    products = products.map(product=>{
        product.img = product.photos[0]
            product.status = product.status == 1 ? '<span class="badge bg-success">Продукт доступен</span>'
            : product.status == 2 ? ' <span class="badge bg-warning">Товар на заказ </span>'
            : product.status == 3 ? '<span class="badge bg-danger">Продукт недоступен </span>' : ' <span class="badge bg-danger">Продукт неактивен</span>';

            product.newpro = product.newpro == 1
                    ? '<span class="badge bg-success">Да</span>'
                    : '<span class="badge bg-danger">Нет</span>';
            product.hot = product.hot == 1
                ? '<span class="badge bg-success">Да</span>'
                : '<span class="badge bg-danger">Нет</span>'; 

        return product
    })
    res.render("product/index", {
        isProduct: true,
        products,
        category,
        title: "Список продуктов",
        pagination: {
            page: req.query.p || 1,
            pageCount: perPage,
        },
    });
})

router.get("/newpro/:id", auth, async (req, res) => {
    try {
        let _id = req.params.id;
        let product = await Product.findOne({ _id });
        product.newpro = product.newpro == 1 ? 0 : 1;
        await product.save();
        res.redirect("/product");
    } catch (error) {
        console.log(error);
    }
});

router.get("/hot/:id", auth, async (req, res) => {
    try {
        let _id = req.params.id;
        let product = await Product.findOne({ _id });
        product.hot = product.hot == 1 ? 0 : 1;
        await product.save();
        res.redirect("/product");
    } catch (error) {
        console.log(error);
    }
});


router.get('/get/:id',async(req,res)=>{
    let _id =  req.params.id
    let product = await Product.findOne({_id})
    res.send(product)
})  

router.get('/view/:id',async (req,res)=>{
    let _id = req.params.id
    let product = await Product.findOne({_id}).populate('category').populate('attribute.attribute').lean()
    product.status =
    product.status == 1
        ? '  <span class="badge bg-success">Продукт доступен</span>'
        : product.status == 2
        ? ' <span class="badge bg-warning">Товар на заказ </span>'
        : product.status == 3
        ? '<span class="badge bg-danger">Продукт недоступен </span>'
        : ' <span class="badge bg-danger">Продукт неактивен</span>';

    product.newpro =
    product.newpro == 1
        ? '<span class="badge bg-success">Да</span>'
        : '<span class="badge bg-danger">Нет</span>';
    product.hot =
    product.hot == 1
        ? '<span class="badge bg-success">Да</span>'
        : '<span class="badge bg-danger">Нет</span>';

    
    res.render('product/view',{
        title: `${product.title}`,
        product
    })
})


router.post('/save',upload.fields([
    {name:'photo1',maxCount:1},
    {name:'photo2',maxCount:1},  
    {name:'photo3',maxCount:1},
    {name:'photo4',maxCount:1},
    {name:'photo5',maxCount:1},
    {name:'photo6',maxCount:1}  
]),
    auth, async(req,res)=>{
        let{_id,title,category,hot,price,text,status,order,rate,sale,views,newpro,attributes} = req.body
        let product = await Product.findOne({_id})
            
        if (req.files) {
            if(req.files.photo1){
                product.photos[0]= req.files.photo1[0].path
            }
            if (req.files.photo2) {
                product.photos[1] = req.files.photo1[0].path;
            }
            if (req.files.photo3) {
                product.photos[2] = req.files.photo1[0].path;
            }
            if (req.files.photo4) {
                product.photos[3] = req.files.photo1[0].path;
            }
            if (req.files.photo5) {
                product.photos[4] = req.files.photo1[0].path;
            }
            if (req.files.photo6) {
                product.photos[5] = req.files.photo1[0].path;
            }
        }
        let photos = product.photos
        await Product.findByIdAndUpdate(_id,{title,category,hot,price,text,status,attributes,order,photos,rate,sale,views,newpro})
        req.flash('success','Mahsulot qo`shildi')
        res.redirect('/product')
    }
)

router.get("/delete/:id", auth, async (req, res) => {
    let _id = req.params.id;
    await Product.findByIdAndDelete({ _id });
    res.redirect("/product");
});



router.post('/',upload.fields([
    {name:'photo1',maxCount:1},
    {name:'photo2',maxCount:1},
    {name:'photo3',maxCount:1},
    {name:'photo4',maxCount:1},
    {name:'photo5',maxCount:1},
    {name:'photo6',maxCount:1}]),
    auth, async(req,res)=>{
        let{title,category,attributes,hot,price,text,status,sale,views,order,newpro} = req.body
        let photos = []   
        if (req.files) {
            if(req.files.photo1){
                photos.push(req.files.photo1[0].path)
            }
            if (req.files.photo2) {
                photos.push(req.files.photo2[0].path);
            }
            if (req.files.photo3) {
                photos.push(req.files.photo3[0].path);
            }
            if (req.files.photo4) {   
                photos.push(req.files.photo4[0].path);
            }
            if (req.files.photo5) { 
                photos.push(req.files.photo5[0].path);
            }
            if (req.files.photo6) {
                photos.push(req.files.photo6[0].path);
            }
        }
        // console.log({title,category,hot,price,text,status,sale,views,order,newpro,attributes});
        let newProduct = await new Product({title,category,hot,newpro,price,text,attributes,sale,views,status,photos,order})
        await newProduct.save()
        req.flash("success", " Продукт Добавлен ");
        res.redirect('/product')
    }
)

module.exports = router     