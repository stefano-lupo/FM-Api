import jwt from 'jsonwebtoken';
import moment from 'moment';

import { get } from '../util/fetch';
import { TOKEN_EXPIRE_MINUTES } from '../constants/app';

import models from '../models/';
const Account = models.account;

/**
 * POST /auth/register
 * Register a new user if one doesn't already exist
 */
const register = async (req, res) => {
  const {email, firstName, lastName, password} = req.body;
  console.log(email);
  try {
    let account = await Account.find({where: {email: email}});
    if(account) {
      res.json(account);
    } else {
      console.log("Creating account");
      account = await Account.create({email, firstName, lastName, password});
      res.json(account);
    }
  } catch (e) {
    console.log(e);
  }
};

/**
 * POST /auth/facebook
 * Validate user with their facebook token
 */
const authWithFacebook = async (req, res, next) => {
  const { fbAccessToken } = req.body;
  const fbAppId = req.app.get('fbAppId');
  const fbSecret = req.app.get('fbSecret');
  const jwtSecret = req.app.get('jwtSecret');
  const url = `https://graph.facebook.com/v2.10/debug_token?input_token=${fbAccessToken}&access_token=${fbAppId}|${fbSecret}`;

  let response = {};
  try {
    response = await get(url);
    response = response.data;
  } catch (err) {
    console.log(err.status);
    next(err);
  }

  if (!response.is_valid || response.app_id !== fbAppId) {
    return next({status: 401, message: "Invalid Facebook Token Supplied"});
  }

  const facebookId = response.user_id;
  let account = await Account.find({where: {facebookId}, attributes: ['id', 'firstName', 'lastName', 'email', 'facebookId']});
  if(!account) {
    let response = await fetch(`https://graph.facebook.com/v2.10/me?fields=first_name%2Clast_name%2Cemail&access_token=${fbAccessToken}`);
    response = await response.json();
    const firstName = response.first_name;
    const lastName = response.last_name;
    const { email } = response;
    account = await Account.create({firstName, lastName, email, facebookId});
  }

  const auth = {
    token: jwt.sign({data: account.id}, jwtSecret, {expiresIn: TOKEN_EXPIRE_MINUTES * 60}),
    expiresAt: moment().add(TOKEN_EXPIRE_MINUTES, 'm')
  };
  account = account.get({plain: true});     // get standard JSON of rows
  res.json({...account, auth});
};

module.exports = {
  authWithFacebook,
  register
};
