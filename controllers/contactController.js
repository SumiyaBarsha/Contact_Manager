import asyncHandler from "express-async-handler";
import contactModel from "../models/contactModel.js";
//get all contacts
const getContact = asyncHandler(async (req,res)=>{
    try{
        const contacts = await contactModel.find({user_id: req.user.id});
        res.json({sucess: true, message: "Fetched All Contacts!",data: contacts});
    }catch(err){
        console.log(err);
        res.status(500).json({sucess: false, message:"Error fetching contacts!"});
    }
});
//create a contact
const createContact = asyncHandler (async (req,res)=>{
    if (!req.body) {
        res.status(400);
        throw new Error("Request body is missing!");
    }
    const newContact = new contactModel({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        user_id: req.user.id
    });
    try{
        const savedContact = await newContact.save();
        res.json({success:true , message: "Created a Contact", data: savedContact});
    }catch(err){
        console.error(err);
        res.json({success:false, message:"Error saving contact"});
    }
});
//get one contact
const getSingleContact = asyncHandler (async (req,res)=>{
    let contact = await contactModel.findById(req.params.id);
    if(!contact){
        res.status(404).json({message:"Contact Not Found!"});
    }
    res.status(200).json({success: true,message: `Contact Found with id ${req.params.id}`,data: contact});
});
//update a contact
const updateContact = asyncHandler (async (req,res)=>{
    try{
        const updatedContact = await contactModel.findByIdAndUpdate(req.params.id,{
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile
        });
        if(!updatedContact){
            res.json({success:false, message:"Contact not found"});
        }
        res.status(200).json({success: true,message: `Updated Contact with id ${req.params.id}`,data: updatedContact});;
    }catch(err){
        console.error(err);
        res.status(500).json({success:false, message:"Error updating contact"});
    }
});
//delete a contact
const deleteContact = asyncHandler (async (req,res)=>{
    try{
        const deletedContact = await contactModel.findByIdAndDelete(req.params.id);
        if(!deletedContact){
            res.json({success:false, message:"Contact not found"});
        }
        res.status(200).json({success: true,message: `Deleted Contact with id ${req.params.id}`,data: deletedContact});;
    }catch(err){
        console.error(err);
        res.status(500).json({success:false, message:"Error deleting contact"});
    }
});


export {getContact,createContact,getSingleContact,updateContact,deleteContact}; 