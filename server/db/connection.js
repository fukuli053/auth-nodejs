var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose;