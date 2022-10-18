const { Router } = require("express");
const auth = require("../middleware/auth");
const Feedback = require("../model/feedback");
const router = Router();


router.get("/",auth, async(req,res) => {
    let feedback = await Feedback.find().sort({_id:1}).lean()
    feedback = feedback.map((feedback,index) =>{
        feedback.createdAt = feedback.createdAt.toLocaleString()
        feedback.index = index + 1;
        feedback.status = feedback.status == 1
        ? '<span class="badge bg-success">Ответчино</span>'
        : '<span class="badge bg-danger">В ожидании</span>'; 
        
        return feedback
    })
    
        res.render("feedback/index", {
            isFeedback: true,
            feedback,
            title: "Список категорий",
        });


});

router.get('/get/:id',auth,async(req,res)=>{
        let _id = req.params.id
        let feedback = await Feedback.findOne({_id}).lean()
        res.send(feedback)

})

router.get('/menu/:id',auth,async(req,res)=>{
    try {
        let _id = req.params.id
        let feedback = await Feedback.findOne({_id})
        feedback.menu = feedback.menu == 1 ? 0:1
        await feedback.save()
        res.redirect('/feedback')
    } catch (error) {
        console.log(error);  
    }
})   

router.get("/status/:id", auth, async (req, res) => {
    try {
        let _id = req.params.id;
        let feedback = await Feedback.findOne({ _id });
        feedback.status = feedback.status == 1 ? 0 : 1;
        await feedback.save();
        res.redirect("/feedback");
    } catch (error) {  
        console.log(error);   
    }
});




router.get("/delete/:id",auth, async(req, res) => {
        let _id = req.params.id
        await Feedback.findByIdAndDelete({_id})
        res.redirect("/feedback");
});


router.post('/',auth,  async(req,res)=>{
    let {name,text,phone,} = req.body
    let newFeedback = await new Feedback({ name, text, phone });
    await newFeedback.save()
    res.send('ok')
})


module.exports = router;
