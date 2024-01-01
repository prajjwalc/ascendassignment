// ** React Imports
import React, { createContext, useEffect, useState } from 'react';

// ** axios
import axios from 'axios';

// ** Default Provider Value
const defaultProviderValue = {
    lists: [],
    tasks: [],
    listTasks: {},
    setTasks: () => { },
    updateTaskListId: () => Promise.resolve(),
    createList: () => Promise.resolve(),
    createTask: () => Promise.resolve(),
    markTaskAsCompleted: () => Promise.resolve(),
}

// ** Creating Auth Context
export const UserContext = createContext(defaultProviderValue);

const UserContextProvider = ({ children }) => {
    const base_uri = "http://localhost:8080/api";

    // ** State
    const [lists, setLists] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [listLoading, setListLoading] = useState(false);

    // Function to create a new list
    const createList = async (listName) => {
        const accessToken = localStorage.getItem("accessToken");

        try {
            const { data } = await axios.post(`${base_uri}/list`, { listName }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setLists(prevState => [...prevState, data.list]);
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.response.data.message };
        }
    }

    // Function to create a new task
    const createTask = async (formValues) => {
        const accessToken = localStorage.getItem("accessToken");

        try {
            const { data } = await axios.post(`${base_uri}/task`, { formValues }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setTasks(prevState => [...prevState, data.task]);
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.response.data.message };
        }
    }

    // Function to get all tasks
    const getTasks = async () => {
        const accessToken = localStorage.getItem("accessToken");

        setListLoading(true);
        try {
            const { data } = await axios.get(`${base_uri}/task`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setTasks(data.tasks);
            setListLoading(false);
        } catch (error) {
            console.log(error.response.data.message);
            setListLoading(false);
        }
    }

    // Function to get all lists
    const getLists = async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) return;

        setListLoading(true);
        try {
            const { data } = await axios.get(`${base_uri}/list`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setLists(data.lists);
            setListLoading(false);
        } catch (error) {
            console.log(error.response.data.message);
            setListLoading(false);
        }
    }

    // Function to mark a task as completed
    const markTaskAsCompleted = async (taskId) => {
        const accessToken = localStorage.getItem("accessToken");

        try {
            const { data } = await axios.put(`${base_uri}/task`, { taskId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setTasks(prevState => prevState.filter(task => task.id !== taskId));
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.response.data.message };
        }
    }

    // Function to update the listId of a task
    const updateTaskListId = async (taskId, listId) => {
        const accessToken = localStorage.getItem("accessToken");

        try {
            const { data } = await axios.put(`${base_uri}/task/list`, { taskId, listId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.response.data.message };
        }
    }

    useEffect(() => {
        getLists();
        getTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Provider Values
    const values = {
        lists,
        tasks,
        setTasks,
        updateTaskListId,
        listLoading,
        createList,
        createTask,
        markTaskAsCompleted
    }

    return (
        <UserContext.Provider value={values}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
