import dotenv from "dotenv";
import { connectDb } from "../db.js";
import { defaultContent, mergeContent } from "../defaultContent.js";
import { getSettings } from "../models/Settings.js";

dotenv.config();

await connectDb();
const settings = await getSettings();

const existingEbook = settings.ebook || {};

settings.ebook.title = "রিজেকশন ফাইল";
settings.ebook.subtitle = "বাংলাদেশি স্টুডেন্ট ভিসা রিফিউজ হওয়ার ৪৭টি কারণ — এবং প্রতিটির সমাধান";
settings.ebook.description = "কাগজ নয়, প্রমাণ। প্রতিটি রিফিউজাল কারণের exact সমাধান, ডকুমেন্ট লিস্টসহ।";
settings.ebook.price = 399;
settings.ebook.originalPrice = 999;
settings.ebook.coverUrl = existingEbook.coverUrl || "";
settings.ebook.filePublicId = existingEbook.filePublicId || "";
settings.ebook.fileFormat = existingEbook.fileFormat || "";
settings.ebook.fileResourceType = existingEbook.fileResourceType || "";
settings.ebook.originalFileName = existingEbook.originalFileName || "";

settings.content = mergeContent(defaultContent);

settings.markModified("ebook");
settings.markModified("content");
await settings.save();

console.log("Seeded Rejection File / Visa rejection CMS content into MongoDB settings.");
process.exit(0);
