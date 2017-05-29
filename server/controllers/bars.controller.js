import httpStatus from 'http-status';
import APIError from '../errors/APIError';
import config from '../config/config';
import Bar from '../models/bar.model';
import User from '../models/user.model';

/**
 * Returns bar info — how many people are going
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function bars(req, res, next) {
  (async function() {
    try {
      const bars = await Bar.getBars();
      return res.json({
        // data: bars.map(b => ({[b.businessId]: b.going}))
        data: bars.reduce((acc, b) => {acc[b.businessId] = b.going; return acc;}, {})
      })
    } catch(error) {
      return next(error);
    }
  })();
}

/**
 * Set user to going or not going to a bar
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function going(req, res, next) {
  const { businessId } = req.params;
  const { status } = req.body; // going or not going

  (async function() {
    try {
      const user = await User.get(req.user.id);
      const bar = await Bar.getByBusinessId(businessId);

      if (user.bars.indexOf(businessId) !== -1 && status)
        throw new APIError(`You are already going to this bar`, httpStatus.CONFLICT, true);

      if (user.bars.indexOf(businessId) === -1 && !status)
        throw new APIError(`You are already not going to this bar`, httpStatus.CONFLICT, true);

      if (status) { // going
        user.bars.push(businessId);
        bar.going++;
      } else { // not going
        user.bars = user.bars.filter(bi => bi !== businessId);
        bar.going--;
      }
      const savedUser = await user.save();
      const savedBar = await bar.save();
      const bars = await Bar.getBars();

      return res.json({ data: {
        going: savedUser.bars,
        bars: bars.reduce((acc, b) => {acc[b.businessId] = b.going; return acc;}, {})
        // bars: bars.map(b => ({[b.businessId]: b.going}))
      } })
    } catch(error) {
      return next(error);
    }
  })();
}

export default { bars, going };
