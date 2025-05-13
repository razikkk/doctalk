import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import userRouter from './Routes/userRoutes'
import adminRouter  from './Routes/adminRoutes'
import doctorRouter from './Routes/doctorRoutes'
import fs from 'fs'
import morgan from 'morgan'
import path from 'path'

dotenv.config()

const app = express()
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization']
  };
 
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:;"
    );
    next();
  });
app.use(cors(corsOptions)) 

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))


const accessLogStream = fs.createWriteStream(path.join(__dirname, '/config/access.log'),{flags:'a'})
app.use(morgan('combined',{stream:accessLogStream}))


app.use('/api/users',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
const uploadPath = path.join(__dirname,'../uploads')
console.log("servic from",uploadPath)
app.use('/uploads',express.static(uploadPath))

mongoose.connect(process.env.MONGO_URL as string).then(()=>{
    console.log('connected')
})
.catch((err)=>{
    console.log(err.message)
})

const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})