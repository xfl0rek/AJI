const bookshelf = require('../config/bookshelf');

const Category = bookshelf.Model.extend({
    tableName: 'categories',
});

module.exports = {
    getAll: () => Category.fetchAll(),
};
