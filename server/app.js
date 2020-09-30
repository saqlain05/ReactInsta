const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI} = require('./keys')
const cors = require('cors')

app.use(cors())

// aVfba1eRmVS1vSRt

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
    mongoose.connection.on('connected', ()=>{
        console.log('connected to moongo yeeaahh')
    })
    mongoose.connection.on('error', (err)=>{
        console.log('DataBase Not Connected', err)
    })

    require('./models/user')
    require('./models/post')
    // mongoose.model("User")
    app.use(express.json())
    app.use(require('./routes/auth'))
    app.use(require('./routes/post'))
    
app.listen(PORT,()=>{
    console.log("Server is running on ", PORT)
    // console.log(`server is running on ${PORT}`)
})