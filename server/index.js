const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const bodyParser = require('body-parser')

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const {
    addParticipant, updateChat, participantLeave
} = require('./api')

const PORT = process.env.VITE_SERVER_PORT
var app = express()
app.use(cors({ origin: '*' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    const fullURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    console.log(`Recieved request (${fullURL}): ${req.data} `)
    next()
})

var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(4000);

// socket io
io.set('transports', ['websocket']);
io.on('connection', socket => {
    console.log('User connected');
    socket.on('disconnect', () => console.log('User disconnected'))
    socket.on('save-message', data => {
        console.log('saving message: ' + data)
        io.emit('new-message', data)
    })
})

app.get('/', (req, res) => {
    res.sendFile('../client/dist/index.html', {root: __dirname})
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
        
        if (chat == '/leave') {
            await participantLeave(name, id)
            res.status(200).end()
        } else {
            let chatTexts = await updateChat(name, id, chat)
            res.status(200).json([chatTexts])
        }
    } catch (e) {
        console.log(e)
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})