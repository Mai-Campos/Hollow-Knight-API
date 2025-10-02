import Region from "../models/Region.js";

export const getAllRegions = async (req, res) => {
  try {
    const regions = await Region.find();
    if (regions.length < 1) return res.status(200).json([]);

    res.status(200).json(regions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRegionById = async (req, res) => {
  try {
    const regionId = req.params.regionId;

    const region = await Region.findById(regionId);

    if (!region) return res.status(404).json({ error: "La región no existe" });

    res.status(200).json(region);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRegion = async (req, res) => {
  try {
    const { name, description, imageRegion } = req.body;

    if (!name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const newRegion = new Region({
      name,
      description,
      imageRegion,
    });

    newRegion.save();
    res.status(201).json(newRegion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRegion = async (req, res) => {
  try {
    const regionId = req.params.regionId;
    const updatedRegion = await Region.findByIdAndUpdate(regionId, req.body, {
      new: true,
    });

    if (!updatedRegion)
      return res.status(404).json({ error: "La región no existe" });

    res.status(200).json(updatedRegion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRegion = async (req, res) => {
  try {
    const regionId = req.params.regionId;
    const deletedRegion = await Region.findByIdAndDelete(regionId);

    if (!deletedRegion)
      return res.status(404).json({ error: "La región no existe" });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
