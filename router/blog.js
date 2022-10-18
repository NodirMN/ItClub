const { Router } = require("express");
const auth = require("../middleware/auth");
const Blog = require("../model/blog");
const router = Router();
const upload = require("../middleware/file");

router.get("/", auth, async (req, res) => {
    let blog = await Blog.find().sort({_id:-1}).lean();
    blog = blog.map((blog) => {
        blog.status =
        blog.status == 1
            ? '<span class="badge bg-success">Активный</span>'
            : '<span class="badge bg-danger">Неактивный</span>';
        return blog;
    });
    res.render("blog/index", {
        isBlog: true,
        blog,
        title: "Список новастей",
    });
});

router.get("/get/:id", auth, async (req, res) => {
    let _id = req.params.id;
    let blog = await Blog.findOne({ _id}).lean();
    res.send(blog);
});



router.get("/status/:id", auth, async (req, res) => {
    try {
        let _id = req.params.id;
        let blog = await Blog.findOne({ _id });
        blog.status = blog.status == 1 ? 0 : 1;
        await blog.save();
        res.redirect("/blog");
    } catch (error) {
        console.log(error);
    }
});




router.get("/delete/:id", auth, async (req, res) => {
    let _id = req.params.id;
    await Blog.findByIdAndDelete({ _id });
    res.redirect("/blog");
});

router.post("/", auth, upload.single("img"), async (req, res) => {
    let { title,text, status, menu, order, description} = req.body;
    let img = "/images/default.png";
    if (req.file) {
        img = req.file.path;
    }
    status = status || 0;
    let newBlog = await Blog({title,text,status,menu,order,img,description,
    });
    await newBlog.save();
    res.redirect("/blog");
});  



router.post("/save", auth, upload.single("img"), async (req, res) => {
        let { _id, title, status, menu, order, text, description } = req.body;
        let blog = { title, order, status, menu, text, description };
        blog.status = blog.status == 1;
        if (req.file) {
            blog.img = req.file.path;
        }
        await Blog.findByIdAndUpdate(_id,blog);
        res.redirect("/blog");
});



module.exports = router;
