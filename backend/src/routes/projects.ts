import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { Project } from '../models/Project';

const router = express.Router();

// Get all projects for the authenticated user
router.get('/', auth, async (req: any, res: Response) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Create a new project
router.post('/', [
  auth,
  body('owner').notEmpty().trim(),
  body('name').notEmpty().trim(),
  body('url').isURL(),
  body('stars').isInt({ min: 0 }),
  body('forks').isInt({ min: 0 }),
  body('openIssues').isInt({ min: 0 }),
  body('createdAt').isInt({ min: 0 })
], async (req: any, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { owner, name, url, stars, forks, openIssues, createdAt } = req.body;

    // Check if project already exists for this user
    const existingProject = await Project.findOne({ 
      userId: req.user.id, 
      name 
    });
    
    if (existingProject) {
      return res.status(400).json({ 
        success: false, 
        error: 'Project with this name already exists' 
      });
    }

    const project = new Project({
      owner,
      name,
      url,
      stars,
      forks,
      openIssues,
      createdAt,
      userId: req.user.id
    });

    await project.save();

    return res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Update a project
router.put('/:id', [
  auth,
  body('owner').optional().notEmpty().trim(),
  body('name').optional().notEmpty().trim(),
  body('url').optional().isURL(),
  body('stars').optional().isInt({ min: 0 }),
  body('forks').optional().isInt({ min: 0 }),
  body('openIssues').optional().isInt({ min: 0 }),
  body('createdAt').optional().isInt({ min: 0 })
], async (req: any, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const project = await Project.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        (project as any)[key] = req.body[key];
      }
    });

    await project.save();

    return res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Delete a project
router.delete('/:id', auth, async (req: any, res: Response) => {
  try {
    const project = await Project.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }

    return res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

export default router;
