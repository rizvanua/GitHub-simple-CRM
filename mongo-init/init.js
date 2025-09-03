// MongoDB initialization script for CRM
db = db.getSiblingDB('crm');

// Create collections
db.createCollection('customers');
db.createCollection('orders');
db.createCollection('products');

// Create indexes for better performance
db.customers.createIndex({ "email": 1 }, { unique: true });
db.customers.createIndex({ "phone": 1 });
db.orders.createIndex({ "customerId": 1 });
db.orders.createIndex({ "createdAt": -1 });
db.products.createIndex({ "sku": 1 }, { unique: true });

// Insert sample data
db.customers.insertMany([
  {
    _id: ObjectId(),
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    company: "Tech Corp",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1-555-0456",
    company: "Design Studio",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.products.insertMany([
  {
    _id: ObjectId(),
    sku: "PROD-001",
    name: "Premium Widget",
    description: "High-quality widget for professional use",
    price: 99.99,
    category: "electronics",
    stock: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    sku: "PROD-002",
    name: "Standard Widget",
    description: "Standard widget for everyday use",
    price: 49.99,
    category: "electronics",
    stock: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("✅ MongoDB CRM database initialized successfully!");
