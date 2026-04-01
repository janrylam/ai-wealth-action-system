import express, { Router, Request, Response } from 'express';
import { RoadmapGenerator } from '../services/RoadmapGenerator';

const router: Router = express.Router();
const roadmapGenerator = new RoadmapGenerator();

/**
 * POST /api/v1/roadmap/generate
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { wealth_stage, selected_path, current_profile } = req.body;

    if (!wealth_stage || !selected_path || !current_profile) {
      return res.status(400).json({
        error: 'Missing required fields: wealth_stage, selected_path, current_profile'
      });
    }

    const request = {
      wealth_stage,
      selected_path,
      current_profile,
    };

    const roadmap = await roadmapGenerator.generate90DayRoadmap(request);

    res.json({
      success: true,
      data: roadmap,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Roadmap generation failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/v1/roadmap/examples
 */
router.get('/examples', (req: Request, res: Response) => {
  const examples = [
    {
      stage: 'Bootstrap',
      path: 'Freelancing to SaaS',
      duration: '90 days',
      expected_outcome: '$2-5K MRR'
    },
    {
      stage: 'Scaling',
      path: 'Content + Community',
      duration: '90 days',
      expected_outcome: '10K followers + $5K MRR'
    },
    {
      stage: 'Optimization',
      path: 'Portfolio Building',
      duration: '90 days',
      expected_outcome: '20% ROI'
    }
  ];

  res.json({ examples });
});

export default router;