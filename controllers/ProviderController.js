import models from '../models/';

const Provider = models.provider;
const Account = models.account;

import { generateToken } from '../util/generic';

const createTestProvider = async (req, res) => {
  const account = await Account.find({facebookId: '10212210797601804'});
  const id = account.dataValues.id;
  console.log(account);
  const provider = await Provider.create({
    name: "Lupo Web Design",
    category: "Who knows",
    description: "Great Websites",
    images: ['https://openclipart.org/download/17810/lemmling-Cartoon-elephant.svg'],
    accountId: id
  });
  res.send(`${provider.name} created`);
};

const getTestProvider = async (req, res) => {
  const account = await Account.findOne({
      include: [{model: Provider}]
  });
  console.log(account);
  res.send(account);
};

const loginMyProvider = async (req, res) => {
  console.log("here");
  const { id } = req.params;
  console.log(id);

  const provider = await Provider.findById(id);

  res.send(provider.dataValues);
};


const registerMyProvider = async (req, res) => {
  const { name, description, category, accountId } = req.body;

  const result = await Provider.findCreateFind({
    where: {name},
    defaults: {name, description, category, accountId}
  });

  // TODO Implement some naming && category restriction
  const myProvider = result[0];
  const created = result[1];

  myProvider.dataValues.auth = generateToken(myProvider.id);
  res.send(myProvider);
};

export default {
  createTestProvider,
  getTestProvider,

  loginMyProvider,
  registerMyProvider,

}