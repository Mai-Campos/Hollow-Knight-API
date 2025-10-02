import Character from "../models/Character.js";

export const getAllCharacters = async (req, res) => {
  try {
    const characters = await Character.find()
      .populate("abilities")
      .populate("region");
    if (characters.length < 1) return res.status(200).json([]);

    res.status(200).json(characters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCharacterById = async (req, res) => {
  try {
    const characterId = req.params.characterId;

    const character = await Character.findById(characterId)
      .populate("abilities")
      .populate("region");

    if (!character)
      return res.status(404).json({ error: "El personaje no existe" });

    res.status(200).json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCharacter = async (req, res) => {
  try {
    const { name, description, regionId, abilityIds, imageCharacter } =
      req.body;

    if (!name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const newCharacter = new Character({
      name,
      description,
      imageCharacter,
      region: regionId,
      abilities: abilityIds,
    });

    newCharacter.save();
    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCharacter = async (req, res) => {
  try {
    const characterId = req.params.characterId;
    const updatedCharacter = await Character.findByIdAndUpdate(
      characterId,
      req.body,
      { new: true }
    );
    if (!updatedCharacter)
      return res.status(404).json({ error: "El personaje no existe" });
    res.status(200).json(updatedCharacter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCharacter = async (req, res) => {
  try {
    const characterId = req.params.characterId;
    const deletedCharacter = await Character.findByIdAndDelete(characterId);
    if (!deletedCharacter)
      return res.status(404).json({ error: "El personaje no existe" });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
