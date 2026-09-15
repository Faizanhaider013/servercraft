import express from 'express'
import path, {dirname} from 'path'
import {fileURLToPath} from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app=express()
const PORT= process.env.PORT || 5003

const __filename= fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

//middleware
app.use(express.json())

// serves the html file from /public director
// and also tells the server all files from public files from the public folder as static assests/file
app.use(express.static(path.join(__dirname, '../public')))




app.get('/', (req,res)=> {
    res.sendFile(path.join(__dirname,'../public','index.html'))
})

//routes
app.use('/auth',authRoutes)
app.use('/todos',authMiddleware,todoRoutes)

app.listen(PORT,() => {
    console.log(`Server has started on port: ${PORT} `)
})

