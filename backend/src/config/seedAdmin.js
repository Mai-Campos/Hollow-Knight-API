import User from "../models/User.js";

export const createDefaultAdmin = async () => {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.log(
        "ADMIN_EMAIL o ADMIN_PASSWORD no está definido. Omitimos creación de ADMIN"
      );
      return;
    }

    const adminExist = await User.findOne({ role: "admin" });
    if (adminExist) return;

    const admin = new User({
      name,
      email,
      password,
      role: ["admin", "user"],
    });

    await admin.save();

    console.log("Admin creado correctamente");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
  } catch (error) {
    console.error("Error creando admin por defecto", error);
  }
};
