import express from 'express';
import accountRoutes from './account.route';
import authRoutes from './auth.route';
import searchRoutes from './search.route';
import barsRoutes from './bars.route';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/health-check', (req, res) => res.send('OK'));

router.use('/account', accountRoutes);
router.use('/auth', authRoutes);
router.use('/search', searchRoutes);
router.use('/bars', barsRoutes);

export default router;
