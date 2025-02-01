const mongoose = require('mongoose');
const listing = require("../model/listing.js");
const initData = require('./data.js');

main()
    .then(() => {
        console.log("Database connected");
    })
    .catch(err => {
        console.log(err);
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    // Ensure each sample listing has the required geometry.type field
    initData.sampleListings = initData.sampleListings.map((obj) => {
        if (!obj.geometry || !obj.geometry.type) {
            obj.geometry = obj.geometry || {};
            obj.geometry.type = "Point"; // Set a default value
        }
        return { ...obj, owner: "66af1ccaefc29dfdc9078785" };
    });

    await listing.deleteMany({});
    await listing.insertMany(initData.sampleListings);

    console.log("Data is initialized");
}

initDB();
