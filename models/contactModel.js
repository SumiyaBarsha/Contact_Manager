import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please add contact name!"]
    },
    email:{
        type: String,
        required: [true, "Please add your email!"],
        unique: true,
    },
    mobile:{
        type: String,
        required: [true, "Please add your contact number!"],
        unique: true,
    }
},
{
    timestamps: true,
});

const contactModel = mongoose.model("Contact",contactSchema);

export default contactModel;