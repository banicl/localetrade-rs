const Chat = require('./chatModel');
const axios = require('axios');

exports.getChat = async (req, res) => {
  const { sender, receiver } = req.params;
  try {
    const chats = await Chat.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ timestamp: 1 });

    res.json(chats);
  } catch (error) {
    res.status(500).send('Error fetching chat messages');
  }
};

exports.sendMessage = async (req, res) => {
  const { sender, receiver, message } = req.body;
  try {
    const chatMessage = new Chat({ sender, receiver, message });
    await chatMessage.save();
    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(500).send('Error sending message');
  }
};

exports.getLastConversations = async (req, res) => {
    const { username } = req.params;
    try {
      console.log(`Fetching last conversations for user: ${username}`);
      
      const lastConversations = await Chat.aggregate([
        {
          $match: {
            $or: [{ sender: username }, { receiver: username }]
          }
        },
        {
          $sort: { timestamp: -1 }
        },
        {
          $group: {
            _id: {
              $cond: { if: { $eq: ['$sender', username] }, then: '$receiver', else: '$sender' }
            },
            lastMessage: { $first: '$message' },
            lastDate: { $first: '$timestamp' },
            unread: { 
              $first: { 
                $cond: [{ $and: [{ $eq: ['$receiver', username] }, { $eq: ['$isRead', false] }] }, true, false] 
              } 
            },
            isCurrentUserSender: { $first: { $eq: ['$sender', username] } } // Add this to track if the current user sent the last message
          }
        },
        { $limit: 3 } // Limit to last 3 conversations
      ]);
  
      console.log('Last Conversations:', lastConversations);
  
      // Populate user information from user-service
      const enrichedConversations = await Promise.all(
        lastConversations.map(async (conversation) => {
          try {
            const userInfoUrl = `http://user-service:3003/user/${conversation._id}`;
            console.log(`Fetching user info from: ${userInfoUrl}`);
            const userResponse = await axios.get(userInfoUrl);
            const userInfo = userResponse.data;
  
            return {
              otherUser: userInfo.username, // Use the username from user-service
              profilePicture: userInfo.profilePicture,
              lastMessage: conversation.lastMessage,
              lastDate: conversation.lastDate,
              unread: conversation.unread,
              isCurrentUserSender: conversation.isCurrentUserSender, // Pass the flag to the frontend
            };
          } catch (error) {
            console.error(`Error fetching user info for ${conversation._id}:`, error.message);
            // Return basic info if user-service call fails
            return {
              otherUser: conversation._id,
              profilePicture: null, // Default in case of failure
              lastMessage: conversation.lastMessage,
              lastDate: conversation.lastDate,
              unread: conversation.unread,
              isCurrentUserSender: conversation.isCurrentUserSender,
            };
          }
        })
      );
  
      console.log('Enriched Conversations:', enrichedConversations);
  
      res.json(enrichedConversations);
    } catch (error) {
      console.error('Error fetching last conversations:', error.message);
      res.status(500).send('Error fetching last conversations');
    }
  };
  