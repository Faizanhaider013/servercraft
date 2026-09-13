import express from 'express'
import path, {dirname} from 'path'
import {fileURLtoPath} from 'url'

const app=express()
const PORT= process.env.PORT || 5003

const __filename= fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

app.get('/', (req,res)=> {
    res.sendFille(path)
})

app.listen(PORT,() => {
    console.log(`Server has started on port: ${PORT} `)
})
