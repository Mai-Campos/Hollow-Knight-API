import mongoose from "mongoose";

const abilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: {
      type: String,
      default: "No se conoce nada acerca de esta habilidad",
    },
    effects: {
      type: [String],
      default: ["No se conocen efectos de esta habilidad"],
    },
    howToObtain: {
      type: String,
      default: "No se conoce cómo obtener esta habilidad",
    },
    icon: String,
  },
  { timestamps: true }
);

export default mongoose.model("Ability", abilitySchema);
