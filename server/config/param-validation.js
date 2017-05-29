import Joi from 'joi';

const Validators = {
  name: Joi.string().regex(/^([a-zA-Z\s\.\']{2,30}\s*)+$/).allow(''),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20),
  searchQuery: Joi.string().min(2).max(50)
}

export default {
  /* Authentication */
  // POST /api/auth/login
  login: {
    body: {
      email: Validators.email,
      password: Validators.password.required()
    }
  },

  // POST /api/auth/register
  register: {
    body: {
      email: Validators.email,
      password: Validators.password.required(),
      confirmPassword: Joi.any().valid(Joi.ref('password')).required()
        .options({
          language: {
            any: {
              allowOnly: 'does not match password'
            }
          }
        }),
      firstName: Validators.name,
      lastName: Validators.name
    }
  },

  /* Account */
  // POST /api/account
  updateAccount: {
    body: Joi.object().keys({
      email: Validators.email,
      firstName: Validators.name,
      lastName: Validators.name,
      password: Validators.password,
      confirmPassword: Joi.any().valid(Joi.ref('password'))
        .options({
          language: {
            any: {
              allowOnly: 'does not match password'
            }
          }
        }).label('Confirmation Password'),
    }).with('password', 'confirmPassword')
  },

  /* Search */
  // POST /api/search/
  search: {
    body: {
      query: Validators.searchQuery
    }
  },

  /* Search */
  // POST /api/bar/:businessId
  going: {
    body: {
      status: Joi.boolean().required()
    },
    params: {
      businessId: Joi.string().required()
    }
  },
};
