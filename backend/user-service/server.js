const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Chat = require('./models/Chat');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080'
}));

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/localetrade', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const chatSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});

const Chat = mongoose.model('Chat', chatSchema);

app.get('/chat/:sender/:receiver', async (req, res) => {
    const { sender, receiver } = req.params;
    try {
        const chats = await Chat.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        }).sort({ timestamp: 1 });
        res.json(chats);
    } catch (error) {
        res.status(500).send('Error fetching chat messages');
    }
});

app.post('/chat', async (req, res) => {
    const { sender, receiver, message } = req.body;
    try {
        const chatMessage = new Chat({ sender, receiver, message });
        await chatMessage.save();
        res.status(201).json(chatMessage);
    } catch (error) {
        res.status(500).send('Error saving chat message');
    }
});

const PORT = process.env.PORT || 3003; // Use a different port for the Chat service
app.listen(PORT, () => console.log(`Chat Service running on port ${PORT}`));
