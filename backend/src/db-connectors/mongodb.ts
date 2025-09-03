import mongoose from 'mongoose';

interface MongoDBConfig {
  uri: string;
  options?: {
    useNewUrlParser?: boolean;
    useUnifiedTopology?: boolean;
  };
}

export const connectMongoDB = async (config: MongoDBConfig): Promise<void> => {
  try {
    await mongoose.connect(config.uri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB disconnected successfully');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
};

export const getMongoDBStatus = (): boolean => {
  return mongoose.connection.readyState === 1;
};
