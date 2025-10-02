import mongoose from "mongoose";

const regionSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String, default: "No se sabe nada sobre esta región" },
    imageRegion: String,
  },
  { timestamps: true }
);

export default mongoose.model("Region", regionSchema);
