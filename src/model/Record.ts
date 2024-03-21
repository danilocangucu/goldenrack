import mongoose, { Document } from "mongoose";

import { Genre } from "../types/Genre";
import { Condition } from "../types/Condition";
import { RecordData } from "../types/RecordData";

export type RecordDocument = Document & RecordData;

const RecordSchema = new mongoose.Schema({
  genre: {
    type: String,
    enum: Object.values(Genre),
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  recordAvailability: [
    {
      storeId: {
        type: String,
        required: true,
      },
      condition: {
        type: String,
        enum: Object.values(Condition),
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

export default mongoose.model<RecordDocument>("Record", RecordSchema);
