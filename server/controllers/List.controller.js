import { List } from "../models/List.model.js";

// Create a new list
export const createList = async (req, res) => {
    const { userId } = req;
    const { listName } = req.body;
    console.log(userId, listName);
    try {
        const newList = await List.create({
            name: listName,
            userId,
        });

        res.status(201).json({ message: "List Created", list: newList });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

// Get all lists
export const getLists = async (req, res) => {
    const { userId } = req;
    try {
        const lists = await List.findAll({
            where: { userId },
        });

        res.status(200).json({ lists });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
    }
}