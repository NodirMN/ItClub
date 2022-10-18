const {Router} = require('express')
const router = Router()



router.use("/",require("./router/page"));
router.use("/users", require("./router/users"));
router.use("/category", require("./router/category"));
router.use("/product", require("./router/product"));   
router.use('/slider',require('./router/slider'))
router.use("/attribute", require("./router/attribute"));
router.use("/blog", require("./router/blog"));
router.use("/promo", require("./router/promo"));
router.use("/page", require("./router/page"));
router.use("/feedback", require("./router/feedback"));
router.use("/vacancy", require("./router/vacancy"));
router.use("/oneclick", require("./router/oneclick"));
router.use("/userprofile", require("./router/userprofile"));
router.use("/frontuser", require("./router/frontuser"));









router.use('/api',require('./router/api.js'))
module.exports = router