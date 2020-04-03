import express from 'express';
import { logger } from '../../logger';
import { getReadyStatus } from './ready/getReadyStatus';
import { getLiveStatus } from './live/getLiveStatus';

const router = express.Router();

router.get('/live', async (req, res) => {
  logger.info('navigating to health/live page');
  const status = await getLiveStatus();
  res.status(status.code).send(status.message);
});

router.get('/ready', async (req, res) => {
  logger.info('navigating to health/ready page');
  const status = await getReadyStatus();
  res.status(status.code).send(status.message);
});

module.exports = router;
