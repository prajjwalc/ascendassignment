import Sequelize from 'sequelize';
import { db } from "../config/database.js";

export const List = db.define('list', {
    name: {
        type: Sequelize.STRING
    },
    userId: {
        type: Sequelize.INTEGER
    },
});

List.sync().then(() => {
    console.log('List created');
});
