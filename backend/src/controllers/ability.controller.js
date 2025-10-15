import Ability from "../models/Ability.js";

export const getAllAbilities = async (req, res) => {
  try {
    const abilities = await Ability.find();
    if (abilities.length < 1) return res.status(200).json([]);

    res.status(200).json(abilities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAbilityById = async (req, res) => {
  try {
    const abilityId = req.params.abilityId;

    const ability = await Ability.findById(abilityId);

    if (!ability)
      return res.status(404).json({ error: "La habilidad no existe" });

    res.status(200).json(ability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAbility = async (req, res) => {
  try {
    const { name, description, effects, howToObtain, iconAbility } = req.body;

    if (!name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const newAbility = new Ability({
      name,
      description,
      effects,
      howToObtain,
      iconAbility,
    });

    await newAbility.save();
    res.status(201).json(newAbility);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAbility = async (req, res) => {
  try {
    const abilityId = req.params.abilityId;
    const updatedAbility = await Ability.findByIdAndUpdate(
      abilityId,
      req.body,
      { new: true }
    );

    if (!updatedAbility)
      return res.status(404).json({ error: "La habilidad no existe" });

    res.status(200).json(updatedAbility);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAbility = async (req, res) => {
  try {
    const abilityId = req.params.abilityId;
    const deletedAbility = await Ability.findByIdAndDelete(abilityId);

    if (!deletedAbility)
      return res.status(404).json({ error: "La habilidad no existe" });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
