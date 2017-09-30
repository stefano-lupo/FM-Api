import models from '../models/';

const Provider = models.provider;
const Account = models.account;

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

export default {
  createTestProvider,
  getTestProvider
}