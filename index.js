const express=require('express')
const mongoose=require('mongoose')

const app=express()
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.render('index')
})
const port= process.env.port||3300
app.listen(port,()=>{
    console.log('heard from port')
})