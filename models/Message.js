const Datastore = require('nedb');
const path = require('path');

// Create database file in project root
const dbPath = path.join(__dirname, '..', 'data', 'messages.db');

// Create NeDB instance
const db = new Datastore({ filename: dbPath, autoload: true });

// Add index for faster queries
db.ensureIndex({ fieldName: 'people' });
db.ensureIndex({ fieldName: 'createdAt' });

// Message model with MongoDB-like methods
const Message = {
   // Save a new message
   async save(messageData) {
      return new Promise((resolve, reject) => {
         db.insert(messageData, (err, doc) => {
            if (err) reject(err);
            else resolve(doc);
         });
      });
   },

   // Find messages by room
   async find(query = {}) {
      return new Promise((resolve, reject) => {
         db.find(query)
            .sort({ createdAt: 1 })
            .exec((err, docs) => {
               if (err) reject(err);
               else resolve(docs);
            });
      });
   },

   // Find and limit
   async findWithLimit(query, limit) {
      return new Promise((resolve, reject) => {
         db.find(query)
            .sort({ createdAt: 1 })
            .limit(limit)
            .exec((err, docs) => {
               if (err) reject(err);
               else resolve(docs);
            });
      });
   }
};

module.exports = Message;
