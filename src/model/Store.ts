import mongoose, { Document } from "mongoose";
import { StoreData } from "../types/StoreData";

export type StoreDocument = Document & StoreData;

const StoreSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  website: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
  contactEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  openingHours: { type: String, required: true },
  returnPolicy: { type: String, required: true },
  featuredItems: { type: [String], required: true },
  shippingInformation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShippingInformation",
  },
});

export default mongoose.model<StoreDocument>("Stores", StoreSchema);
