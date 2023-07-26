const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Database Connected Successfully");

    })
    .catch((err) => {
        console.log("Failed to connect to MongoDB:", err);
    });

module.exports = mongoose;
