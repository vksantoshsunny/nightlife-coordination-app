import Joi from 'joi';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? 'test.env' : '.env';
dotenv.config({ path: envFile });

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(['development', 'production', 'test', 'provision']).default('development'),
  PORT: Joi.number().default(4040),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  JWT_SECRET: Joi.string().required().description('JWT Secret required to sign'),
  YELP_ACCESS_TOKEN: Joi.string().required().description('Yelp API Access Token'),
  MONGO_URI: Joi.string().required().description('Mongo DB url')
}).unknown().required();

const {error, value: envVars} = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  yelpAccessToken: envVars.YELP_ACCESS_TOKEN,
  mongoUri: envVars.MONGO_URI
};

export default config;
