import { Request, Response } from "express";
import mongoose from "mongoose";

/**
 * Reset the database by dropping all collections.
 */
export const resetDatabase = async (req: Request, res: Response): Promise<void> => {
    try {
        const collections = Object.keys(mongoose.connection.collections);

        for (const collectionName of collections) {
            const collection = mongoose.connection.collections[collectionName];
            await collection.deleteMany({}); // Deletes all documents in the collection
        }

        res.status(200).json({ message: "Database reset successfully" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Failed to reset database", error: error.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred while resetting database" });
        }
    }
};
