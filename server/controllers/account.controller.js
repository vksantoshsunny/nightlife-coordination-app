import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../errors/APIError';
import config from '../config/config';
import User from '../models/user.model';
import Bar from '../models/bar.model';

/**
 * Returns user's data
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function fetch(req, res, next) {
  (async function() {
    try {
      const user = await User.get(req.user.id);
      return res.json({ data: user });
    } catch(error) {
      return next(new APIError('Login to perform this action', httpStatus.UNAUTHORIZED, true));
    }
  })();
}

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function update(req, res, next) {
  (async function() {
    try {
      const user = await User.get(req.user.id);

      user.email = req.body.email;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;

      if(req.body.password) user.password = req.body.password;

      const updatedUser = await user.save();
      const token = jwt.sign(updatedUser.toObject(), config.jwtSecret);

      // retrun updated token too
      return res.json({
        data: {
          token: token,
          user: updatedUser
        }
      });
    } catch(error) {
      return next(error);
    }
  })();
}

/**
 * Returns the bars that a user is going to
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function bars(req, res, next) {
  (async function() {
    try {
      const user = await User.get(req.user.id);
      const bars = await Bar.getBars();

      return res.json({ data: {
        going: user.bars,
        bars: bars.reduce((acc, b) => {acc[b.businessId] = b.going; return acc;}, {})
        // bars: bars.map(b => ({[b.businessId]: b.going}))
      } });
    } catch(error) {
      return next(error);
    }
  })();
}

export default { fetch, update, bars };
