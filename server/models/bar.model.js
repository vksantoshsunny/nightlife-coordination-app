import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../errors/APIError';

const omit = (o, ...props) => Object.assign( {}, ...(Object.keys(o).filter(prop => !props.includes(prop))).map(prop => ({[prop]: o[prop]})) );
/**
 * Bar Schema
 */
const BarSchema = new mongoose.Schema({
  businessId: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  going: {
    type: Number,
    default: 0
  }
}, {
  toObject: {
    virtuals: true,
    transform: (doc, ret, opts) => omit(ret, "_id", "__v")
  },
  toJSON: {
    virtuals: true,
    transform: (doc, ret, opts) => omit(ret, "_id", "__v")
  }
});


/**
 * Methods
 */


/**
 * Statics
 */
BarSchema.statics = {
  /**
   * Get bar
   * @param {string} id - Yelp's business id of the bar.
   * @returns {Promise<Bar, APIError>}
   */
  getByBusinessId(id) {
    const self = this;
    return this.findOne({businessId: id})
      .exec()
      .then((bar) => {
        if (bar) return bar;
        return self.create({businessId: id})
        // const err = new APIError(`Bar <${id}> not found!`, httpStatus.NOT_FOUND, true);
        // return Promise.reject(err);
      });
  },

  /**
   * Get bars' info from DB.
   * @returns {Promise<Bar[]>}
   */
  getBars() {
    return this.find()
      .exec();
  }

};

/**
 * @typedef Bar
 */
export default mongoose.model('Bar', BarSchema, 'barsnightlife');
