db = db.getSiblingDB('olympian');
db.createUser({
  user: 'olympian',
  pwd: 'olympian123',
  roles: [{ role: 'readWrite', db: 'olympian' }]
});

// Create indexes for performance
db.conversations.createIndex({ createdAt: -1 });
db.conversations.createIndex({ updatedAt: -1 });
db.messages.createIndex({ conversationId: 1, createdAt: 1 });
db.messages.createIndex({ role: 1 });
db.artifacts.createIndex({ conversationId: 1 });
db.artifacts.createIndex({ messageId: 1 });
db.config.createIndex({ key: 1 }, { unique: true });
