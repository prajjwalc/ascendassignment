import express from "express";
import cors from 'cors'

const router = express.Router();
const app = express()

const PORT = process.env.PORT || 8080;

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())


// Mount the router on the /api/v1 prefix
app.use('/api/', router);

// ** Home route
app.get('/', async (req, res) => {
    res.status(200).send("Root route");
})

app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});

export default router;
