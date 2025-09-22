import  User  from '../models/User.js';

export const createDefaultAdmin = async () => {
    try {

        const adminExist = await User.findOne({ role: "admin" });
        if (adminExist) return;

    
        const admin = new User({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: ["admin", "user"]
        });
 
        await admin.save();

        console.log("Admin creado correctamente");
        console.log(`Name: ${admin.name}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Password: ${admin.password}`);

    } catch (error) {
        console.error("Error creando admin por defecto", error)
    }
}   