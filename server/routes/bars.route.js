import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import config from '../config/config';
import paramValidation from '../config/param-validation';
import barsCtrl from '../controllers/bars.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(barsCtrl.bars)

router.route('/:businessId')
  .post(expressJwt({ secret: config.jwtSecret }), validate(paramValidation.going), barsCtrl.going)

export default router;
