import express from 'express'
import crypto from 'crypto'
import { authorize } from './auth.js'
import { users, tasks, sessions, lastIds } from './database.js'
import bcrypt from "bcrypt";
import cors from 'cors'
const app = express()
const port = 3000

app.use(cors())

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/api/tasks', authorize, (req, res) => {
    res.send(tasks.filter(task => task.ownerId === req.currentUserId))
})

app.post('/api/tasks', authorize, (req, res) => {
    let task = {
        id: lastIds.lastTaskId,
        title: req.body.title,
        marked_as_done: req.body.marked_as_done,
        ownerId: req.currentUserId
    }
    lastIds.lastTaskId++

    tasks.push(task)
    res.send(task)
})

app.put('/api/tasks/:id', authorize, (req, res) => {
    let task = tasks.find(task => task.id === parseInt(req.params.id))

    if (!task) {
        res.status(404).send("Task not found")
        return
    }

    if (task.ownerId !== req.currentUserId) {
        res.status(403).send("Forbidden")
        return
    }

    if (req.body.title !== undefined)
        task.title = req.body.title
    if (req.body.marked_as_done !== undefined)
        task.marked_as_done = req.body.marked_as_done
    res.send(task)
})

app.delete('/api/tasks/:id', authorize, (req, res) => {
    let task = tasks.find(task => task.id === parseInt(req.params.id))

    if (!task) {
        res.status(404).send("Task not found")
        return
    }

    if (task.ownerId !== req.currentUserId) {
        res.status(403).send("Forbidden")
        return
    }

    tasks.splice(tasks.indexOf(task), 1)
    res.send(task)
})

app.post('/api/login', (req, res) => {
    let user = users.find(dbUser => dbUser.username === req.body.username)
    if (!user) {
        res.status(401).send("Invalid username or password")
        return
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.status(401).send("Invalid username or password")
        return
    }

    crypto.randomBytes(64, function(err, buffer) {
        let token = buffer.toString('hex');
        sessions[token] = user.id
        res.send({ id: user.id, username: user.username, access_token: token })
    });
})

app.post('/api/register', (req, res) => {
    let user = users.find(dbUser => dbUser.username === req.body.username)
    if (user) {
        res.status(409).send("Username already exists")
        return
    }

    user = {
        id: lastIds.lastUserId,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10)
    }
    lastIds.lastUserId++

    users.push(user)

    crypto.randomBytes(64, function(err, buffer) {
        let token = buffer.toString('hex');
        sessions[token] = user.id
        res.send({ id: user.id, username: user.username, access_token: token })
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})