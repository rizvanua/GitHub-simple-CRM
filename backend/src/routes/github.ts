import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { Project } from '../models/Project';
import { githubService } from '../services/githubService';
import { IUser } from '../models/User';

const router = express.Router();

// Add GitHub repository
router.post('/', auth, [
  body('repoPath')
    .trim()
    .notEmpty()
    .withMessage('Repository path is required')
    // .matches(/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/)
    .withMessage('Invalid repository path format. Expected format: owner/repository')
], async (req: any, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { repoPath } = req.body;
    const userId = (req.user as IUser)._id;

    // Check if repository already exists for this user
    const existingProject = await Project.findOne({ 
      userId, 
      githubPath: repoPath 
    });

    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'Repository already exists in your projects'
      });
    }

    // Fetch repository data from GitHub API
    const repoData = await githubService.getRepositoryData(repoPath);

    // Create new project with GitHub data
    const project = new Project({
      ...repoData,
      userId
    });

    await project.save();

    return res.status(201).json({
      success: true,
      message: 'GitHub repository added successfully',
      project
    });

  } catch (error) {
    console.error('Error adding GitHub repository:', error);
    
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to add GitHub repository'
    });
  }
});

// Check if GitHub repository exists
router.get('/check/:repoPath', auth, async (req: any, res: Response) => {
  try {
    const { repoPath } = req.params;
    const userId = (req.user as IUser)._id;

    // Check if repository already exists for this user
    const existingProject = await Project.findOne({ 
      userId, 
      githubPath: repoPath 
    });

    if (existingProject) {
      return res.status(200).json({
        success: true,
        exists: true,
        message: 'Repository already exists in your projects'
      });
    }

    // Check if repository exists on GitHub
    const existsOnGitHub = await githubService.checkRepositoryExists(repoPath);

    return res.status(200).json({
      success: true,
      exists: false,
      existsOnGitHub,
      message: existsOnGitHub 
        ? 'Repository found on GitHub and can be added' 
        : 'Repository not found on GitHub'
    });

  } catch (error) {
    console.error('Error checking GitHub repository:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check GitHub repository'
    });
  }
});

export default router;
