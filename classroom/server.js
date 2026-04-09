const express = require("express");
const app = express();
const users = require("../routes/user.js");
const posts = require("../routes/post.js");
const session = require("express-session");

app.use(session({secret: "mysupersecretstring", resave: false, saveUninitialized: true }));

app.get("/reqcount", (req, res) => {
    req.session.count = 1;
    res.send(`You sent a request x times`);
});

// app.get("/test", (req, res) => {
//     res.send("test successful!");
// })

app.listen(3000, () => {
    console.log("server is listing to 3000");
})