const { Router } = require("express");
const auth = require("../middleware/auth");
const Oneclick = require("../model/oneclick");
const router = Router();


router.get("/",auth, async(req,res) => {
    let oneclick = await Oneclick.find().populate('product').sort({_id:1}).lean()
    oneclick = oneclick.map((oneclick,index) =>{
        oneclick.createdAt = oneclick.createdAt.toLocaleString()
        oneclick.index = index + 1;
        oneclick.status = oneclick.status == 1
        ? '<span class="badge bg-success">Ответчино</span>'
        : '<span class="badge bg-danger">В ожидании</span>'; 
        
        return oneclick
    })
    
        res.render("oneclick/index", {
            isOneclick: true,
            oneclick,
            title: "Список заказов",
        });


});

router.get('/get/:id',auth,async(req,res)=>{
        let _id = req.params.id
        let oneclick = await Oneclick.findOne({_id}).lean()
        res.send(oneclick)

})  

router.get('/menu/:id',auth,async(req,res)=>{
    try {  
        let _id = req.params.id
        let oneclick = await Oneclick.findOne({_id})
        oneclick.menu = oneclick.menu == 1 ? 0:1
        await oneclick.save()
        res.redirect('/oneclick')
    } catch (error) {
        console.log(error);  
    }
})   

router.get("/status/:id", auth, async (req, res) => {
    try {
        let _id = req.params.id;
        let oneclick = await Oneclick.findOne({ _id });
        oneclick.status = oneclick.status == 1 ? 0 : 1;
        await oneclick.save();
        res.redirect("/oneclick");
    } catch (error) {  
        console.log(error);   
    }
});



router.get("/delete/:id",auth, async(req, res) => {
        let _id = req.params.id
        await Oneclick.findByIdAndDelete({_id})
        res.redirect("/oneclick");
});


router.post('/', auth, async(req,res)=>{
        if(req.body){
            let {phone,_id} = req.body
            let newOneclick = await new Oneclick({ phone, product:_id });
            await newOneclick.save()
            res.send('ok')
        }
        res.send('error')
}) 

router.post("/save", auth, async (req, res) => {
    let { _id, name, status, address, phone } = req.body;
    let oneclick = { name, status, address, phone };
    oneclick.status = oneclick.status == 1;
    await  Oneclick.findByIdAndUpdate(_id, oneclick);
    res.redirect("/oneclick");
}); 

module.exports = router;
