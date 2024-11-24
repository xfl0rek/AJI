const bookshelf = require('../config/bookshelf');

const Order = bookshelf.Model.extend({
    tableName: 'orders',
    products() {
        return this.hasMany('OrderProduct');
    },
});

const OrderProduct = bookshelf.Model.extend({
    tableName: 'order_products',
    product() {
        return this.belongsTo('Product');
    },
});

module.exports = {
    getAll: () => Order.fetchAll({ withRelated: ['products'] }),
    getById: (id) => Order.where({ id }).fetch({ withRelated: ['products'] }),
    create: (order) => new Order(order).save(),
    updateStatus: (id, status) => new Order({ id }).save({ status }, { patch: true }),
    getByStatus: (status) => Order.where({ status }).fetchAll(),
};
