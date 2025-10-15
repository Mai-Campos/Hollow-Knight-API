import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.log("No se ha definido la variable MONGODB_URI");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // corta intentos lentos
      socketTimeoutMS: 45000, // cierra conexiones colgadas
    });
    console.log(
      "Conexión establecida con la base de datos MongoDB Hollow Knight API "
    );
  } catch (error) {
    console.log("Error de conexión a la base de datos:", error);
    process.exit(1);
  }
};
