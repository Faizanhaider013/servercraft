import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

// REGISTER
router.post('/register', (req, res) => {
    const { username, password } = req.body

    try {
        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 8)

        // Create user
        const insertUser = db.prepare(`
            INSERT INTO user (username, password)
            VALUES (?, ?)
        `)

        const result = insertUser.run(username, hashedPassword)

        // Add default todo
        const defaultTodo = 'Hello :) Add your first todo!'

        const insertTodo = db.prepare(`
            INSERT INTO todos (user_id, task)
            VALUES (?, ?)
        `)

        insertTodo.run(result.lastInsertRowid, defaultTodo)

        // Create JWT token
        const token = jwt.sign(
            { id: result.lastInsertRowid },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        // Send response
        return res.status(201).json({
            message: 'User registered successfully',
            token
        })

    }  catch (err) {
    console.error('REGISTER ERROR:', err)

    return res.status(500).json({
        error: err.message
    })
}
})


// LOGIN
router.post('/login', (req, res) => {

    const { username, password } = req.body

    try {
        const user = db.prepare(`
            SELECT * FROM user
            WHERE username = ?
        `).get(username)

        console.log('USERNAME:', username)
        console.log('USER FROM DB:', user)

        if (!user) {
            return res.status(401).json({
                error: 'Invalid username or password'
            })
        }

        const passwordMatch = bcrypt.compareSync(
            password,
            user.password
        )

        console.log('PASSWORD MATCH:', passwordMatch)

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Invalid username or password'
            })
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        return res.json({
            message: 'Login successful',
            token
        })

    } catch (err) {
        console.error('LOGIN ERROR:', err)

        return res.status(500).json({
            error: 'Login failed'
        })
    }
})

export default router