const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const bodyParser = require('body-parser')

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const {
    addParticipant, updateChat
} = require('./api')

const PORT = process.env.SERVER_PORT || 8080
var app = express()
app.use(cors({ origin: '*' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    const fullURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    console.log(`Recieved request (${fullURL}): ${req.data} `)
    next()
})

app.get('/rooms', async (req, res) => {
    try {
        const {
            id, participants, question, chatTexts, name
        } = await addParticipant();

        res.status(200).json({id, participants, question, chatTexts, name})
    } catch (e) {
        console.log(e)
    }
})

app.get('/rooms/:id', async (req, res) => {
    try {
        const {
            id, participants, question, chatTexts, name
        } = await addParticipant();
        res.status(200).json({id, participants, question, chatTexts, name})
    } catch (e) {
        console.log(e)
    }
})

app.post('/rooms/:id', async (req, res) => {
    try {
        let { name, chat } = req.body
        let id = req.params.id
        let chatTexts = await updateChat(name, id, chat)
        res.status(200).json([chatTexts])
    } catch (e) {
        console.log(e)
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})