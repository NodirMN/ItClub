const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Category =require('../model/category')
const Page = require('../model/page')
const Product = require('../model/product')
const Users = require("../model/users");
const Oneclik = require("../model/oneclick");


router.get('/',auth, async(req,res)=>{
    let category = await Category.find().populate().sort().lean();
    let product = await Product.find().populate('category').sort().lean();
    let users = await Users.find().sort().lean();
    let oneclick = await Oneclik.find().sort().lean();
    product = product.map(product=>{
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
    res.render("pages/dashboard", {

            isHome: true,
            category,
            product,
            users,
            oneclick,
    });
})

router.get("/page", auth, async (req, res) => {
        let page = await Page.find().sort({ _id: -1 }).lean();
        page = page.map((page,index) => {
            page.index = index+1
            page.status =  
                page.status == 1
                ? '<span class="badge bg-success">Активный</span>'
                : '<span class="badge bg-danger">Неактивный</span>';
            page.menu =
                page.menu == 1
                ? '<span class="badge bg-success">Да</span>'
                : '<span class="badge bg-danger">Нет</span>';
            page.feedback =
                page.feedback == 1
                ? '<span class="badge bg-success">Да</span>'
                : '<span class="badge bg-danger">Нет</span>';
        
            return page;
        });
    res.render('page',{
        title:'Список странитц',
        isPage:true,
        page
    }
    )
});
router.get("/get/:id", auth, async (req, res) => {
    let _id = req.params.id;
    let page = await Page.findOne({ _id}).lean();
    res.send(page);
});



router.get("/status/:id", auth, async (req, res) => {
    try {
        let _id = req.params.id;
        let page = await Page.findOne({ _id });
        page.status = page.status == 1 ? 0 : 1;
        await page.save();
        res.redirect("/page");
    } catch (error) {
        console.log(error);
    }
});

router.get("/menu/:id", auth, async (req, res) => {
    try {
        let _id = req.params.id;
        let page = await Page.findOne({ _id });
        page.menu = page.menu == 1 ? 0 : 1;
        await page.save();
        res.redirect("/page");
    } catch (error) {
        console.log(error);
    }
});

router.get("/feedback/:id", auth, async (req, res) => {
        try {
            let _id = req.params.id;
            let page = await Page.findOne({ _id });
            page.feedback = page.feedback == 1 ? 0 : 1;
            await page.save();
            res.redirect("/page");
        } catch (error) {
            console.log(error);
        }
});  


router.get("/delete/:id", auth, async (req, res) => {
    let _id = req.params.id;
    await Page.findByIdAndDelete({ _id });
    res.redirect("/page");
});

router.post("/", auth,  async (req, res) => {
    let { title,text, status, menu, slug, feedback,} = req.body;
    status = status || 0;
    menu = menu || 0;
    feedback = feedback || 0;
    let newPage = await Page({title,text,status,slug,menu,feedback,
    });
    await newPage.save();  
    res.redirect("/page");
});  



router.post("/save", auth, async (req, res) => {
        let { _id, title, status, menu, slug,text,text1, feedback,  } = req.body;
        let page = { title,  status, menu, slug,text, text1, feedback, };
            page.status = page.status == 1;
            page.menu = page.menu == 1;
            page.feedback = page.feedback == 1;
        await Page.findByIdAndUpdate(_id,page);
        res.redirect("/page");
});


router.post("/search", auth, async (req, res) => {
        const { st } = req.body;
        let category = await Category.find().populate().sort().lean();
        const product = await Product.find({title: { $regex: '.*' + st + '.*' } }).populate('category').lean()
        product.map(product=>{
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
                res.render("pages/search", {
                    title: `Результат поиска по слову: ${st}`,
                    product,
                    category,
                });
});     


module.exports = router    