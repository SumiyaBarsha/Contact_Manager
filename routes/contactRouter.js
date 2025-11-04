import express from "express";
import { getContact,createContact,updateContact,getSingleContact,deleteContact } from "../controllers/contactController.js";
import { validate } from "../middleware/auth.js";

const router = express.Router();

router.use(validate);
//get all contacts
router.route("/").get(getContact);
//create a contact
router.route("/create").post(createContact);
//get one contact
router.route("/:id").get(getSingleContact);
//update a contact
router.route("/:id").put(updateContact);
//delete a contact
router.route("/:id").delete(deleteContact);


export default router;