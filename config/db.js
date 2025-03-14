const mongoose =  require("mongoose")
require("dotenv/config")

const {MONGODB_URL} = process.env

const db = async () => {
    try {
        await mongoose.connect(MONGODB_URL)
        console.log(`Connected to MEDARK Database`);
    } catch (err) {
        console.log(`An error occured: ${err}`);
    }
}
module.exports = db