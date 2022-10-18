const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()
const Vacancy = require('../model/vacancy')
const Attribute = require("../model/attribute");



router.get("/", auth, async (req, res) => {
    let vacancy = await Vacancy.find().sort({_id:-1}).lean();
    vacancy = vacancy.map((vacancy) => {
        vacancy.status =
        vacancy.status == 1
            ? '<span class="badge bg-success">Активный</span>'
            : '<span class="badge bg-danger">Неактивный</span>';
        return vacancy;
    });
    res.render("vacancy/index", {
        isVacancy: true,
        vacancy,
        title: "Список новастей",
    });
});


router.get('/get/:id',async(req,res)=>{
    let _id =  req.params.id
    let vacancy = await Vacancy.findOne({_id}).lean()
    res.send(vacancy)
})  

router.get("/status/:id", auth, async (req, res) => {
    try {
        let _id = req.params.id;
        let vacancy = await Vacancy.findOne({ _id });
        vacancy.status = vacancy.status == 1 ? 0 : 1;
        await vacancy.save();
        res.redirect("/vacancy");
    } catch (error) {
        console.log(error);
    }
});


// router.get('/view/:id',async (req,res)=>{
//     let _id = req.params.id
//     let vacancy = await Vacancy.findOne({_id}).lean()
//     res.render('vacancy/view',{
//         title: `${vacancy.title}`,  
//         vacancy
//     })
// })


router.get("/delete/:id", auth, async (req, res) => {
    let _id = req.params.id;
    await Vacancy.findByIdAndDelete({ _id });
    res.redirect("/vacancy");
});


router.post('/',
    auth, async(req,res)=>{
        let{name,status,text,views,order,} = req.body
        status = status || 0;
        let newVacancy = await new Vacancy({ name, status, text, views, order });
        await newVacancy.save()
        req.flash("success", " Продукт Добавлен ");
        res.redirect('/vacancy')
    }
    )

router.post("/condi", auth, async (req, res) => {
    let { name, sname, fname, phone, textarea } = req.body;
    let  vacancy = await Vacancy.findOne({_id}).lean()
    vacancy.condi.push({ name, sname, fname, phone, textarea });  
    res.send('ok')
});

    router.post("/save", auth, async (req, res) => {
            let { _id, name, status, text, views, order  } = req.body;
            let vacancy = { name, status, text, views, order };
            vacancy.status = vacancy.status == 1;
            await Vacancy.findByIdAndUpdate(_id,vacancy);
            res.redirect("/vacancy");
    });
    
    module.exports = router     