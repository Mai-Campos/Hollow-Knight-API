import mongoose from "mongoose";

export const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conexión establecida con la base de datos MongoDB Hollow Knight API ");

    } catch (error) {
        console.log("Error de conexión a la base de datos:", error);
        process.exit(1);
    }
}