// ** Configurations files Imports
import { db } from "./config/database.js";

// ** Express Router Imports
import router from "./config/app.js";

// ** Controllers Imports
import { register, login, getUser } from "./controllers/User.controller.js";
import { authMiddleware } from "./controllers/Auth.controller.js";
import { createList, getLists } from "./controllers/List.controller.js";
import { createTask, getTasks, markTaskAsComplete, updateTaskListId } from "./controllers/Task.controller.js";

// Database Connection
db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err))

// Home route
router.get('/', async (req, res) => {
    res.status(200).send("Root route");
})

// User routes
router.post('/register', register);
router.post('/login', login);
router.get('/user', authMiddleware, getUser);

// List routes
router.post('/list', authMiddleware, createList);
router.get('/list', authMiddleware, getLists);

// Task routes
router.post('/task', authMiddleware, createTask);
router.get('/task', authMiddleware, getTasks);
router.put('/task', authMiddleware, markTaskAsComplete);
router.put('/task/list', authMiddleware, updateTaskListId);