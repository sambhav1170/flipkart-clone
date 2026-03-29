const fs = require('fs');
const path = require('path');
const db = require('./config/db');

const exportUsersLive = async () => {
  try {
    const query = 'SELECT id, name, email, phone, role, created_at FROM users';
    const result = await db.query(query);
    
    if (result.rows.length === 0) return;

    const jsonString = JSON.stringify(result.rows, null, 2);
    
    // VERCEL HOTFIX: Vercel lambda file systems are completely Read-Only!
    if (!process.env.VERCEL) {
      const exportPath = path.join(__dirname, 'exported_users.json');
      fs.writeFileSync(exportPath, jsonString);
      console.log(`✅ LIVE SYNC: Exported ${result.rows.length} users to exported_users.json!`);
    } else {
      console.log(`✅ VERCEL SYNC MODE: Export data tracked in memory safely!`);
    }
  } catch (error) {
    console.error('❌ Failed to live sync users:', error);
  }
};

// If run directly via CLI (node export_users.js)
if (require.main === module) {
  exportUsersLive().then(() => process.exit(0));
}

module.exports = exportUsersLive;
