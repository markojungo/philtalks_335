
const { MongoClient, ServerApiVersion } = require('mongodb')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.5bcrbmd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const MAX_ROOMSIZE = 3
const QUESTIONS = [
    'Why is Gamora?',
    'When\'s dinner?',
]

const PHILOSOPHERS = [
    'Socrates',
    'Plato',
    'Bob'
]

const db = {
    name: process.env.MONGO_DB_NAME,
    rooms: process.env.MONGO_COLLECTION_ROOMS
}

const createRoom = async (name) => {
    let roomData = {
        id: Math.floor(Math.random() * 90000) + 10000, /* random 5-digit id */
        participants: [name],
        chatTexts: [],
        question: QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)],
    }
    await client.db(db.name).collection(db.rooms).insertOne(roomData)

    return roomData
}

const addParticipant = async (id = null) => {
    try {
        await client.connect()
        let rooms = await client.db(db.name).collection(db.rooms)
        let [question, name] = [null, null]
        let participants = []
        let chatTexts = []

        if (id == null) {
            for (let room in rooms) {
                if (room.participants.length < MAX_ROOMSIZE) {
                    id = room.id
                    participants = room.participants
                    question = room.question
                    chatTexts = room.chatTexts
                    break
                }
            }
        } else {
            let room = await rooms.findOne({id: Number(id)})
            participants = room.participants
            question = room.question
            chatTexts = room.chatTexts
        }
    
        if (id) { /* Update participants */
            if (participants.length < MAX_ROOMSIZE) {
                availnames = PHILOSOPHERS.filter(name => !participants.includes(name))
                name = availnames[0]
                participants.push(name)
                await rooms.updateOne({ id: Number(id) }, { 
                    $set: { participants: participants }
                })
            } else {
                name = PHILOSOPHERS[0]
                let roomData = {
                    id: Math.floor(Math.random() * 90000) + 10000, /* random 5-digit id */
                    participants: [name],
                    chatTexts: [],
                    question: QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)],
                }

                id, participants, chatTexts, question = roomData
                await client.db(db.name).collection(db.rooms).insertOne(roomData)
                console.log('New room created')
                participants.push(name)
            }
        } else { /* Create new room if none found */
            name = PHILOSOPHERS[0]
            let roomData = {
                id: Math.floor(Math.random() * 90000) + 10000, /* random 5-digit id */
                participants: [name],
                chatTexts: [],
                question: QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)],
            }

            id, participants, chatTexts, question = roomData
            await client.db(db.name).collection(db.rooms).insertOne(roomData)
            console.log(id)
            console.log('New room created')
            participants.push(name)
        }
    
        return {
            id, participants, question, chatTexts, name
        }
    } catch (e) { console.log(e) }
    finally { await client.close() }
}

const participantLeave = async (name, id) => {
    try {
        await client.connect()
        let rooms = client.db(db.name).collection(db.rooms)
        let participants = await rooms.find({id: Number(id)}).toArray()
        
        if (!participants)
            return
        
        participants = participants[0].participants

        const i = participants.indexOf(name)
        if (i != -1) {
            participants = participants.splice(i, 1)
            await rooms.updateOne(
                {id: Number(id)},
                {$set: {participants: participants}}
            )
        }
    } catch (e) {console.log(e)}
    finally { await client.close() }
}

const updateChat = async (name, id, chat) => {
    try {
        await client.connect()
        let rooms = client.db(db.name).collection(db.rooms)
        let chatTexts = await rooms.findOne({id: Number(id)})
        if (chatTexts) {
            chatTexts = chatTexts.chatTexts
            chatTexts.push({
                name: name,
                chat: chat
            })
            await rooms.updateOne( {id: Number(id)}, {$set: {chatTexts: chatTexts}})
            return chatTexts
        } else {
            console.log(`Room ${id} not found.`)
            return {name: name, chat: 'Error fetching chat'}
        }
    } catch (e) {console.log(e)}
    finally { await client.close() }
}

module.exports = {
    addParticipant, participantLeave, updateChat
}