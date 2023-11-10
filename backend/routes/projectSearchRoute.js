import express from 'express';
export const projectSearchRouter = express.Router();
import { Project } from '../models/Project.js'; // Update the path to your model

// Search Endpoint
projectSearchRouter.get('/search', async (req, res) => {
    try {
        const query = {};

        // Add search criteria to the query object based on the request query parameters
        for (const key in req.query) {
            if (req.query[key]) {
                // For simplicity, using direct assignment. Customize as needed.
                query[key] = req.query[key];
            }
        }

        const results = await Project.find(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});