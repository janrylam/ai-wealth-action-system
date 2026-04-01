import express, { Router, Request, Response } from 'express';
import { WealthAdvisor } from '../services/WealthAdvisor';

const router: Router = express.Router();
const wealthAdvisor = new WealthAdvisor();

/**
 * POST /api/v1/diagnosis/analyze
 * Main diagnosis endpoint
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { income, skills, time_available, capital, risk_tolerance } = req.body;

    if (!income || !skills || time_available === undefined || capital === undefined || !risk_tolerance) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['income', 'skills', 'time_available', 'capital', 'risk_tolerance']
      });
    }

    const profile = {
      income: parseFloat(income),
      skills: Array.isArray(skills) ? skills : [skills],
      time_available: parseFloat(time_available),
      capital: parseFloat(capital),
      risk_tolerance
    };

    const diagnosis = await wealthAdvisor.diagnose(profile);

    res.json({
      success: true,
      data: diagnosis,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Diagnosis failed',
      message: error.message
    });
  }
});

/**
 * GET /api/v1/diagnosis/stages
 */
router.get('/stages', (req: Request, res: Response) => {
  const stages = [
    {
      stage: 'Bootstrap',
      description: 'Just starting, limited resources',
      monthly_income: '0-2000'
    },
    {
      stage: 'Scaling',
      description: 'Growing revenue, need systems',
      monthly_income: '2000-10000'
    },
    {
      stage: 'Optimization',
      description: 'Established income, focus on efficiency',
      monthly_income: '10000+'
    }
  ];

  res.json({ stages });
});

export default router;