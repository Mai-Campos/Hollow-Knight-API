import mongoose from "mongoose";

const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: {
      type: String,
      default: "No se conoce nada acerca de este personaje",
    },
    imageCharacter: String,

    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      default: null,
    },

    abilities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ability",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Character", characterSchema);
