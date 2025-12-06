const path = require('path');
const fs = require('fs');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
   fs.mkdirSync(dataDir, { recursive: true });
   console.log('✓ Created data directory');
}

console.log('✓ Database ready (NeDB - file-based, no configuration needed)');

module.exports = {
   connectDB: () => {}, // No connection needed for NeDB
   getConnectionStatus: () => true // Always ready
};
