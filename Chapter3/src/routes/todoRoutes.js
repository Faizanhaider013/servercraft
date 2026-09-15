import express from 'express'
import db from '../db.js'

const router = express.Router()

// =====================================================
// GET ALL TODOS FOR LOGGED-IN USER
// GET /todos
// =====================================================

router.get('/', (req, res) => {
    try {
        const getTodos = db.prepare(
            'SELECT * FROM todos WHERE user_id = ?'
        )

        const todos = getTodos.all(req.userId)

        res.json(todos)

    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to fetch todos'
        })
    }
})


// =====================================================
// CREATE A NEW TODO
// POST /todos
// =====================================================

router.post('/', (req, res) => {
    try {
        const { task } = req.body

        if (!task || task.trim() === '') {
            return res.status(400).json({
                message: 'Task is required'
            })
        }

        const insertTodo = db.prepare(`
            INSERT INTO todos (task, completed, user_id)
            VALUES (?, ?, ?)
        `)

        const result = insertTodo.run(
            task,
            0,
            req.userId
        )

        const newTodo = db.prepare(
            'SELECT * FROM todos WHERE id = ?'
        ).get(result.lastInsertRowid)

        res.status(201).json(newTodo)

    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to create todo'
        })
    }
})

// =====================================================
// UPDATE A TODO
// PUT /todos/:id
// =====================================================

router.put('/:id', (req, res) => {
    try {
        const todoId = req.params.id

        const { task, completed } = req.body

        // Check if todo belongs to logged-in user
        const existingTodo = db.prepare(`
            SELECT * FROM todos
            WHERE id = ? AND user_id = ?
        `).get(todoId, req.userId)

        if (!existingTodo) {
            return res.status(404).json({
                message: 'Todo not found'
            })
        }

        const updateTodo = db.prepare(`
            UPDATE todos
            SET task = ?, completed = ?
            WHERE id = ? AND user_id = ?
        `)

        updateTodo.run(
            task ?? existingTodo.task,
            completed ?? existingTodo.completed,
            todoId,
            req.userId
        )

        const updatedTodo = db.prepare(`
            SELECT * FROM todos
            WHERE id = ? AND user_id = ?
        `).get(todoId, req.userId)

        res.json(updatedTodo)

    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to update todo'
        })
    }
})


// =====================================================
// DELETE A TODO
// DELETE /todos/:id
// =====================================================

router.delete('/:id', (req, res) => {
    try {
        const todoId = req.params.id

        // Check if todo belongs to logged-in user
        const existingTodo = db.prepare(`
            SELECT * FROM todos
            WHERE id = ? AND user_id = ?
        `).get(todoId, req.userId)

        if (!existingTodo) {
            return res.status(404).json({
                message: 'Todo not found'
            })
        }

        const deleteTodo = db.prepare(`
            DELETE FROM todos
            WHERE id = ? AND user_id = ?
        `)

        deleteTodo.run(
            todoId,
            req.userId
        )

        res.sendStatus(204)

    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to delete todo'
        })
    }
})


export default router