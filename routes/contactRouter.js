import express from "express";
import { getContact,createContact,updateContact,getSingleContact,deleteContact } from "../controllers/contactController.js";

const router = express.Router();
//get all contacts
router.route("/").get(getContact);
//create a contact
router.route("/").post(createContact);
//get one contact
router.route("/:id").get(getSingleContact);
//update a contact
router.route("/:id").put(updateContact);
//delete a contact
router.route("/:id").delete(deleteContact);


export default router;