// src/scripts/migrateUsersToUID.js
import admin from "firebase-admin";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account JSON
const serviceAccountPath = path.join(__dirname, "../../serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrateUsersToUID() {
  console.log("Starting migration...");

  try {
    const snapshot = await db.collection("users").get();
    console.log(`Found ${snapshot.docs.length} documents.`);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const email = docSnap.id;

      try {
        const userRecord = await admin.auth().getUserByEmail(email);
        const uid = userRecord.uid;

        // Skip if UID doc already exists
        const uidDoc = await db.collection("users").doc(uid).get();
        if (uidDoc.exists) {
          console.log(`⚠️ UID document already exists for ${email}, skipping.`);
          continue;
        }

        await db
          .collection("users")
          .doc(uid)
          .set({
            ...data,
            email: email, // keep email field
          });

        console.log(`✅ Migrated ${email} → UID: ${uid}`);
      } catch (err) {
        console.error(`❌ Failed for ${email}: ${err.message}`);
      }
    }

    console.log("Migration complete!");
  } catch (err) {
    console.error("Error fetching users collection:", err.message);
  }
}

migrateUsersToUID();
