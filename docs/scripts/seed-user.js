/**
 * Usage: node scripts/seed-user.js email password [name]
 * Example: node scripts/seed-user.js demo@example.com secret "Demo User"
 */

import connectDB from "@config/db";
import bcrypt from "bcrypt";

async function main() {
  const [, , email, password, name] = process.argv;
  if (!email || !password) {
    console.error("Usage: node scripts/seed-user.js email password [name]");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  const conn = await connectDB();

  try {
    const [result] = await conn.execute(
      "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), name = VALUES(name)",
      [email, hash, name || null]
    );

    console.log("User seeded:", email);
  } catch (err) {
    console.error("Seed error", err);
  } finally {
    await conn.end();
  }
}

main();
