
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chat_app', { useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
.then(() => {
 console.log('MongoDB connected successfully');
})
.catch(err => {
 console.error('Error connecting to MongoDB:', err);
});

