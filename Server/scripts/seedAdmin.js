import "dotenv/config";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const [name, email, password] = process.argv.slice(2);
if (!name || !email || !password) {
  console.error(
    'Usage: npm run seed:admin -- "Name" admin@example.com StrongPassword',
  );
  process.exit(1);
}
const hash = await bcrypt.hash(password, 12);
await db.query(
  "INSERT INTO admins (name,email,password_hash,role,is_active) VALUES (?,?,?,'SUPER_ADMIN',1) ON DUPLICATE KEY UPDATE name=VALUES(name),password_hash=VALUES(password_hash),role='SUPER_ADMIN',is_active=1",
  [name, email.toLowerCase(), hash],
);
console.log(`Super Admin ${email.toLowerCase()} is ready.`);
await db.end();
