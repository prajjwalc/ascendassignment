import Sequelize from 'sequelize';
import { db } from "../config/database.js";

export const Task = db.define('task', {
    name: {
        type: Sequelize.STRING
    },
    isComplete: {
        type: Sequelize.BOOLEAN
    },
    listId: {
        type: Sequelize.INTEGER
    },
    userId: {
        type: Sequelize.INTEGER
    }
});

Task.sync().then(() => {
    console.log('Task created');
});
