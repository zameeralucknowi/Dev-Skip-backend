const express = require('express')
const app = express();

app.use('/hello',(req,res)=>{
    res.send("helo helo")
})


app.use('/test',(req,res)=>{
    res.send("testing nodemon ")
})


app.use('/',(req,res)=>{
    res.send("hello from express")
})




app.listen(3000,()=>{
    console.log("server listening on PORT 3000")
});