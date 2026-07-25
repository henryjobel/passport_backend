import dotenv from "dotenv";
import { connectDb } from "../db.js";
import { ensureAdminUser } from "../models/AdminUser.js";

dotenv.config();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  await connectDb();
  const admin = await ensureAdminUser(email, password);
  console.log(`Admin user ready: ${admin.email}`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Admin seed failed:", error);
  process.exit(1);
});
