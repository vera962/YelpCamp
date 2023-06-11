const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} =require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
//Basic logic to check if there's an error
// and if it's successfully opened we can print out
//database connected!
const db =mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", ()=> {
    console.log("Database connected")
});


const sample = array => array[Math.floor(Math.random() * array.length)];

//We're going to start by just removing 
//everything from in the database so we'll make
//a async function called seed DB equals async request
const seedDB = async () => {
 await Campground.deleteMany({});
for(let i=0; i< 50; i++) {

    const random1000=Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random()*20)+10;
    const camp = new Campground( {
        author: '643e41fc57bd44c283905650',
        location: `${cities[random1000].city},${cities[random1000].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis deleniti totam molestias voluptatum quam harum dicta minus. Cumque illum doloremque nesciunt doloribus necessitatibus quis, dignissimos, ipsam porro ab rem mollitia!',
        price,
        images: [
            {
            url: 'https://res.cloudinary.com/dkc5zbaua/image/upload/v1683445192/YelpCamp/bryq64tkqwv47ad9tzks.jpg',
            filename: 'YelpCamp/bryq64tkqwv47ad9tzks',
            },
             {
            url: 'https://res.cloudinary.com/dkc5zbaua/image/upload/v1683445194/YelpCamp/w19t2b6siul0gocyx4ib.jpg',
            filename: 'YelpCamp/w19t2b6siul0gocyx4ib',
             }
        ]
    })
    await camp.save();
    }

}

seedDB().then(()=> {
    mongoose.connection.close();
})

