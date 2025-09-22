import mongoose, { mongo } from "mongoose";

const abilitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "No se conoce nada acerca de esta habilidad" },
},
    { timestamps: true }
);

export default mongoose.model("Ability", abilitySchema);