const mongoose=require('mongoose');
const { type } = require('os');
const schema=mongoose.Schema;
const Review=require("./reviews.js");
const { required } = require('joi');

const listingSchema=new schema({
    title:{
     type:String,
     required:true

    },
    description:{
    type:String
    },
    image:{
        url:String,
        filename:String
    },
    price:{
      type:Number
    },
    location:{
     type:String
    },
    country:{
    type:String
    },
    reviews:[
      {
        type:schema.Types.ObjectId,
        ref:"Review",
      },
    ],
    owner:[
      {
        type:schema.Types.ObjectId,
        ref:"User",
      }
    ],
    geometry:{
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    category:{
      type: String,
      enum:["Trending","Rooms","IconicCities","Mountains","Castles","Amazingpools","Camping","Farms","Artic","Domes","Boats"],
      required: true,
      cast:false
    }

});



listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){
  await Review.deleteMany({_id:{$in:listing.reviews}});
}
});




const Listing=mongoose.model("Listing",listingSchema);


module.exports=Listing;