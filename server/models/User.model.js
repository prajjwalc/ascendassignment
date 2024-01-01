import Sequelize from 'sequelize';
import { db } from "../config/database.js";

export const User = db.define('user', {
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
});

User.sync().then(() => {
    console.log('User created');
});
