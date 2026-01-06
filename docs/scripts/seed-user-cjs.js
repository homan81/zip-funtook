/*
 Usage: node scripts/seed-user-cjs.js email password [name]
 Example: node scripts/seed-user-cjs.js demo@example.com secret "Demo User"
*/
//
//import connectDB from "@config/db";
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function main() {
  const [, , email, password, name] = process.argv;
  if (!email || !password) {
    console.error("Usage: node scripts/seed-user-cjs.js email password [name]");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  // const conn = await connectDB();
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "staging_funtook",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  });

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
