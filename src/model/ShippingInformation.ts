import mongoose, { Document } from "mongoose";
import { ShippingInformationData } from "../types/StoreData";

export type ShippingInformationDocument = Document & ShippingInformationData;

const ShippingInformationSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  domestic: {
    standard: { type: String, required: true },
    express: { type: String, required: true },
  },
  international: {
    economy: { type: String, required: true },
    express: { type: String, required: true },
  },
});

export default mongoose.model<ShippingInformationDocument>(
  "ShippingInformations",
  ShippingInformationSchema
);
