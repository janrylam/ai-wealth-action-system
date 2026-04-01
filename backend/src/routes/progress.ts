import express, { Router, Request, Response } from 'express';
import { ProgressTracker } from '../services/ProgressTracker';

const router: Router = express.Router();
const progressTracker = new ProgressTracker();

/**
 * POST /api/v1/progress/weekly-review
 */
router.post('/weekly-review', async (req: Request, res: Response) => {
  try {
    const { roadmap_id, week, completed_actions, total_actions, results, challenges, learnings } = req.body;

    if (!roadmap_id || !week || completed_actions === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['roadmap_id', 'week', 'completed_actions', 'total_actions', 'results']
      });
    }

    const review = {
      roadmap_id,
      week: parseInt(week),
      completed_actions: parseInt(completed_actions),
      total_actions: parseInt(total_actions),
      results: results || '',
      challenges: challenges || '',
      learnings: learnings || ''
    };

    const optimization = await progressTracker.weeklyReview(review);

    res.json({
      success: true,
      data: optimization,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Weekly review failed',
      message: error.message
    });
  }
});

/**
 * GET /api/v1/progress/trajectory
 */
router.get('/trajectory/:roadmap_id', (req: Request, res: Response) => {
  const { roadmap_id } = req.params;

  res.json({
    roadmap_id,
    trajectory: [
      { week: 1, estimated_additional_income: 200 },
      { week: 2, estimated_additional_income: 400 },
      { week: 3, estimated_additional_income: 600 }
    ]
  });
});

export default router;