import jwt from "jsonwebtoken";

// Verify the token and attach the user ID to the request object
export const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;

    // If the user is not logged in, send an error message to the user
    if (!authorization) {
        return res.status(401).send({ message: 'Please Login' });
    }

    // If the user is logged in, extract the token from the authorization header
    const accessToken = authorization.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.userId = decoded.id; // Attach the user ID to the request object
        next(); // Proceed to the next middleware or the main function

    } catch (error) {
        // If the token is invalid or expired, send an error message to the user
        return res.status(401).json({ message: 'Please Login' });
    }
}