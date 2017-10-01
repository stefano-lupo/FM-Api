import jwt from 'jsonwebtoken';
import moment from 'moment';

import { TOKEN_EXPIRE_MINUTES } from '../constants/app';
import config from '../config';

export const generateToken = (id) => {
  const auth = {
    token: jwt.sign({data: id}, config.jwtSecret, {expiresIn: TOKEN_EXPIRE_MINUTES * 60}),
    expiresAt: moment().add(TOKEN_EXPIRE_MINUTES, 'm')
  };

  return auth;
};

