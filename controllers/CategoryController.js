import models from '../models/';

const Category = models.category;

const getCategories = async (req, res) => {
  let categoriesRows = await Category.findAll({raw: true});

  let mapGen = categoriesRows.map(category => {
    return [category.id, category];
  });
  let availableCategories = new Map(mapGen);


  let categories = [];

  // Set up top level objects
  categoriesRows.map(category => {
    if(!category.belongsTo) {
      categories.push({
        id: category.id,
        name: category.name,
        subCategories: []
      });
      availableCategories.delete(category.id);
    }
  });

  categories.map(category => {
    category.subCategories = generateSubCategories(availableCategories, category.id);
  });

  res.send(categories);
};

// Depth first search
function generateSubCategories(availableCategories, currentId) {
  let subCategories = [];

  availableCategories.forEach((category, id) => {
    if (category.belongsTo === currentId) {
      subCategories.push(category);
      availableCategories.delete(id);
      category.subCategories = generateSubCategories(availableCategories, id);
    }
  });

  return subCategories;
}

export default {
  getCategories
}