import httpStatus from 'http-status';
import APIError from '../errors/APIError';
import config from '../config/config';
import fetch from 'node-fetch';

/**
 * Returns search results for bars on Yelp
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function search(req, res, next) {
  const { query } = req.body;
  (async function() {
    try {
      const yelpApiUrl = [
        `https://api.yelp.com/v3/businesses/search?location=${query}`,
        `categories=bars`
      ];
      const response = await fetch(yelpApiUrl, {
        headers: { 'Authorization': `Bearer ${config.yelpAccessToken}` },
      })
        .then(res => res.ok ? res.json() : Promise.reject(''))
        .catch(error => Promise.reject(new APIError(`Error fetching bars in ${query}`, httpStatus.NOT_FOUND, true)));

      res.json({
        data: response
      })

    } catch(error) {
      return next(error);
    }
  })();
}

export default { search };
