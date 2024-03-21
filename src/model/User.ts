import mongoose, { Document } from "mongoose";
import { UserData } from "../types/UserData";
import { Role } from "../types/Role";

export type UserDocument = Document & UserData;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  hashedPassword: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.Customer,
    required: true,
  },
  banned: {
    type: Boolean,
    default: false,
    required: true,
  },
});

export default mongoose.model<UserDocument>("Users", UserSchema);
