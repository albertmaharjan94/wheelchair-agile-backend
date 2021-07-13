const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useCreateIndex: true,
    useUnifiedTopology: true,
    server: { socketOptions: { connectTimeoutMS: 100000000 }}
});

