import mongoose from "mongoose";

import { APP_ROLES } from "../modules/auth/auth.constants.js";

// Tizim foydalanuvchisi — login (username/parol) + rol. passwordHash hech qachon chiqmaydi.
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, required: true, enum: APP_ROLES, index: true },
    fullName: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

userSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
