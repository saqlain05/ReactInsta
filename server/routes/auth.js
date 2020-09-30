const express = require('express')
const router = express.Router()
const monoogse = require('mongoose')
const User = monoogse.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middlewire/requireLogin')

const name = "saqlain"

router.get('/' , (req,res)=>{
    res.send(`hello ${name} this is home page`)
})

router.post('/signup',(req , res) =>{
    const { name, email, password} = req.body
    if(!email || !password || !name ){
       return res.status(422).json({error: "Plese add all the feild"})
    }else{
        User.findOne({email: email})
        .then((savedUser)=>{
            if(savedUser){
                return res.status(422).json({error: "User Already Exists with that email"})
            }
            bcrypt.hash(password,12)
            .then(hashedpassword=>{
                const user = new User({
                    email,
                    password : hashedpassword,
                    name
                })
                user.save()
                .then(user=>{
                    res.json({message : "Save Successfully"})
                })
                .catch(err=>{
                    console.log(err)
                })

            })
           
        }).catch(err=>{
            console.log(err)
        })
    }
})

router.post('/signin', (req, res)=>{
    const {email, password}= req.body
    if(!email || !password){
       return res.status(422),json({error : "Please Register Email or Passwoed"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error : "email or password is invalid"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message : "successfully signed in"})
                const token = jwt.sign({_id : savedUser._id},JWT_SECRET)
                const {_id, name, email}= savedUser
                res.json({token, user:{_id, name, email}})
            }else{
                return res.status(422).json({error : "email or password is invalid"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

module.exports = router