import { DataTypes } from 'sequelize';
import { sequelize } from '../database/dbConnect.js';

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  bookid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Books',
      key: 'bookid'
    },
    onDelete: 'CASCADE'
  }
}, {
  timestamps: true
});

export default Cart;
