import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: number; // UTC Unix timestamp
  aiComment?: string; // AI-generated comment about the project
  githubPath?: string; // GitHub repository path (e.g., "facebook/react")
  userId: number; // PostgreSQL user ID
  createdAtAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  owner: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true,
    match: [/^https?:\/\/.*/, 'Please enter a valid URL']
  },
  stars: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  forks: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  openIssues: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  createdAt: {
    type: Number,
    required: true
  },
  githubPath: {
    type: String,
    trim: true,
    sparse: true
  },
  aiComment: {
    type: String,
    trim: true,
    maxlength: 500 // Limit AI comment length
  },
  userId: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Create compound index for user and project name to ensure uniqueness per user
projectSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Project = mongoose.model<IProject>('Project', projectSchema);
