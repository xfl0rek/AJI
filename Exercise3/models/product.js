const bookshelf= require('../config/bookshelf');

const Product = bookshelf.Model.extend({
    tableName: 'products'
})

module.exports.getAll = () => {
    return Product.fetchAll();
}

module.exports.getById = (id) => {
    return new Product({'id':id}).fetch();
}

module.exports.create = (product) => {
    return new Product({
        name: product.name,
        description: product.description,
        price: product.price,
        amount: product.amount
    }).save();
};

module.exports.update = (product) => {
    return new Product({
        id: product.id
    }).save( {
        name: product.name,
        description: product.description,
        price: product.price,
        amount: product.amount
        }, 
        {patch: true}
    );
}