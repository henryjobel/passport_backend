import crypto from "node:crypto";
import mongoose from "mongoose";

const { Schema } = mongoose;

const ITERATIONS = 120000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    name: { type: String, default: "Admin" },
    lastLoginAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const AdminUser = mongoose.model("AdminUser", adminUserSchema);

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .pbkdf2Sync(String(password), salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");
  return { hash, salt };
}

export function verifyPassword(password, storedHash, salt) {
  const { hash } = hashPassword(password, salt);
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(storedHash || "", "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function ensureAdminUser(email, password, name = "Admin") {
  if (!email || !password) return null;
  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await AdminUser.findOne({ email: normalizedEmail });
  if (existing) return existing;

  const { hash, salt } = hashPassword(password);
  return AdminUser.create({
    email: normalizedEmail,
    passwordHash: hash,
    passwordSalt: salt,
    name,
    role: "admin"
  });
}
