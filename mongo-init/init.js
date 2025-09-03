// MongoDB initialization script for CRM
db = db.getSiblingDB('crm');

// Create projects collection for GitHub repository data
db.createCollection('projects');

// Create indexes for better performance
db.projects.createIndex({ "userId": 1 }); // Index for user's projects
db.projects.createIndex({ "userId": 1, "name": 1 }, { unique: true }); // Compound index for unique project names per user
db.projects.createIndex({ "githubPath": 1 }); // Index for GitHub repository paths
db.projects.createIndex({ "createdAt": -1 }); // Index for sorting by creation date

print("✅ MongoDB CRM database initialized successfully!");
print("📊 Collections created: projects");
print("🔍 Indexes created: userId, userId+name (unique), githubPath, createdAt");
