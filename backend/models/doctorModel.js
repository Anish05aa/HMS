import mongoose from "mongoose";

const doctorSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    speciality: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    experience: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    about:{
        type: String,
        required: true
    },
    fees:{
        type: Number,
        required: true  
    },
    address: {
        line1: {
          type: String,
          required: true
        },
        line2: {
          type: String,
          required: false
        }
      },
    date: {
        type: Number,
        required: true
    },
    slots_booked: {
        type: Object,
        default: {}
    },


}, {minimize:false});


const doctorModel = mongoose.models.doctor || mongoose.model("doctors", doctorSchema);

export default doctorModel;

