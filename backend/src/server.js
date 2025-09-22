import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { createDefaultAdmin } from './config/seedAdmin.js';

dotenv.config();

const startServer = async () => {
    try {

        await connectDB();
        await createDefaultAdmin();

        app.listen(process.env.PORT, () => {
            console.log(`Server on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Error levantando el servidor", error);
    }
};

startServer();