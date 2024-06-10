import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const db = new Low<string[]>(new JSONFile("db.json"), []);

await db.read();
await db.write();

export default db;
