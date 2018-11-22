const koa = require("koa")
const router = require("./router/router")
const static = require("koa-static")
const path = require("path")
const views = require("koa-views")
const koaBody = require("koa-body")

const app = new koa()

app.use(async (ctx, next) => {
    console.log(`${ctx.method} ${ctx.url} ..........`)
    await next()
})

app.use(koaBody({multipart:true}))
app.use(static(path.join(__dirname, "static")))
app.use(views(path.join(__dirname, "views"), {extension:"ejs", map:{html:"ejs"}}))
app.use(router.routes())
console.log("正在监听3000端⼝口")
app.listen(3000)