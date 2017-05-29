import express from 'express';
import validate from 'express-validation';
import paramValidation from '../config/param-validation';
import searchCtrl from '../controllers/search.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .post(validate(paramValidation.search), searchCtrl.search)

export default router;
