import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { fetchWithAuth } from "../../utils/fecthWithAuth";

const defaultImage =
  "https://res.cloudinary.com/dpylotukc/image/upload/v1761076750/deafult_havb7m.webp";

function ManageCharacters() {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [characters, setCharacters] = useState([]);
  const [regions, setRegions] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [newCharacter, setNewCharacter] = useState({
    name: "",
    description: "",
    regionId: "",
    abilityIds: [],
    imageCharacter: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const tokenNow = localStorage.getItem("accessToken");
    if (!tokenNow) navigate("/access-denied");
    else setToken(tokenNow);
  }, [navigate]);

  const showSnackbar = (message, severity = "info") =>
    setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Fetch inicial
  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [charRes, regionRes, abilityRes] = await Promise.all([
          fetchWithAuth("http://localhost:3000/api/characters", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetchWithAuth("http://localhost:3000/api/regions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetchWithAuth("http://localhost:3000/api/abilities", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const chars = await charRes.json();
        const regs = await regionRes.json();
        const abils = await abilityRes.json();

        if (Array.isArray(chars)) setCharacters(chars);
        if (Array.isArray(regs)) setRegions(regs);
        if (Array.isArray(abils)) setAbilities(abils);
      } catch (e) {
        showSnackbar(e.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) =>
    setNewCharacter({ ...newCharacter, [e.target.name]: e.target.value });

  const handleAbilitiesChange = (e) =>
    setNewCharacter({
      ...newCharacter,
      abilityIds:
        typeof e.target.value === "string"
          ? e.target.value.split(",")
          : e.target.value,
    });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "image/webp") {
      return showSnackbar("Solo se permiten imágenes .webp", "warning");
    }
    setImageFile(file);
  };

  const resetForm = () => {
    setNewCharacter({
      name: "",
      description: "",
      regionId: "",
      abilityIds: [],
      imageCharacter: "",
    });
    setImageFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, regionId, abilityIds } = newCharacter;
    if (!name || !description || !regionId || abilityIds.length === 0) {
      return showSnackbar("Complete todos los campos", "warning");
    }

    try {
      setIsSubmitting(true);
      let imageUrl = newCharacter.imageCharacter || defaultImage;
      if (imageFile)
        imageUrl = await uploadImageToCloudinary(imageFile, "characters");

      const payload = {
        name,
        description,
        regionId,
        abilityIds,
        imageCharacter: imageUrl,
      };

      const url = editingId
        ? `http://localhost:3000/api/characters/${editingId}`
        : "http://localhost:3000/api/characters";
      const method = editingId ? "PUT" : "POST";

      const res = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok)
        throw new Error(
          editingId
            ? "Error al actualizar el personaje"
            : "Error al crear el personaje"
        );

      const result = await res.json();

      if (editingId) {
        setCharacters((prev) =>
          prev.map((c) => (c._id === editingId ? result : c))
        );
        showSnackbar("Personaje actualizado correctamente", "success");
      } else {
        setCharacters((prev) => [...prev, result]);
        showSnackbar("Personaje creado correctamente", "success");
      }

      resetForm();
    } catch (err) {
      showSnackbar(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (character) => {
    setEditingId(character._id);
    setNewCharacter({
      name: character.name,
      description: character.description,
      regionId: character.region?._id || "",
      abilityIds: character.abilities?.map((a) => a._id) || [],
      imageCharacter: character.imageCharacter,
    });
    showSnackbar(`Editando ${character.name}`, "info");
  };

  const confirmDelete = (id) => setDeleteDialog({ open: true, id });
  const closeDeleteDialog = () => setDeleteDialog({ open: false, id: null });

  const handleDelete = async () => {
    const id = deleteDialog.id;
    if (!id) return;

    try {
      setLoading(true);
      const res = await fetchWithAuth(
        `http://localhost:3000/api/characters/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok && res.status !== 204)
        throw new Error("No se pudo eliminar el personaje");

      setCharacters((prev) => prev.filter((c) => c._id !== id));
      showSnackbar("Personaje eliminado correctamente", "success");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setLoading(false);
      closeDeleteDialog();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        backgroundColor: "#111121",
        color: "white",
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
        gap: 4,
        alignItems: "flex-start",
      }}
    >
      {/* Tabla */}
      <Box sx={{ flex: 2, overflowX: "hidden" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 2,
            pl: 2,
            borderLeft: "4px solid #6D28D9",
          }}
        >
          Manage Characters
        </Typography>

        {loading && <LinearProgress color="secondary" />}

        <Paper
          sx={{
            backgroundColor: "#1C1C2A",
            borderRadius: 2,
            minWidth: "900px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Name",
                  "Description",
                  "Region",
                  "Abilities",
                  "Image",
                  "Actions",
                ].map((col) => (
                  <TableCell
                    key={col}
                    sx={{ color: "#C3C3C3", fontWeight: "bold" }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {characters.map((char) => (
                <TableRow key={char._id} hover>
                  <TableCell sx={{ color: "#E2E8F0" }}>{char.name}</TableCell>
                  <TableCell
                    sx={{
                      color: "#9e9e9e",
                      maxWidth: 250,
                      wordBreak: "break-word",
                    }}
                  >
                    {char.description}
                  </TableCell>
                  <TableCell sx={{ color: "#C9B6D1" }}>
                    {char.region.name}
                  </TableCell>
                  <TableCell>
                    {char.abilities?.map((a) => (
                      <Chip
                        key={a._id || a}
                        label={a.name || a}
                        size="small"
                        sx={{
                          mr: 0.5,
                          mb: 0.5,
                          backgroundColor: "#6D28D9",
                          color: "white",
                        }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <img
                      src={char.imageCharacter || defaultImage}
                      alt={char.name}
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      sx={{ color: "#6D28D9" }}
                      onClick={() => handleEdit(char)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: "#E11D48" }}
                      onClick={() => confirmDelete(char._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Formulario */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          flex: 1,
          backgroundColor: "#1C1C2A",
          borderRadius: 2,
          p: 3,
          mt: { md: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#C9B6D1" }}>
          {editingId ? "Edit Character" : "Add Character"}
        </Typography>

        <TextField
          name="name"
          label="Name"
          value={newCharacter.name}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          slotProps={{
            input: { style: { color: "#C3C3C3" } },
            inputLabel: { style: { color: "#C3C3C3" } },
          }}
        />

        <TextField
          name="description"
          label="Description"
          value={newCharacter.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          slotProps={{
            input: { style: { color: "#C3C3C3" } },
            inputLabel: { style: { color: "#C3C3C3" } },
          }}
        />

        <FormControl fullWidth>
          <InputLabel sx={{ color: "#C3C3C3" }}>Region</InputLabel>
          <Select
            name="regionId"
            value={newCharacter.regionId}
            onChange={handleChange}
            sx={{ color: "white" }}
          >
            {regions.map((r) => (
              <MenuItem key={r._id} value={r._id}>
                {r.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel sx={{ color: "#C3C3C3" }}>Abilities</InputLabel>
          <Select
            multiple
            value={newCharacter.abilityIds}
            onChange={handleAbilitiesChange}
            input={<OutlinedInput label="Abilities" />}
            sx={{ color: "white" }}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((id) => {
                  const ability = abilities.find((a) => a._id === id);
                  return (
                    <Chip
                      key={id}
                      label={ability ? ability.name : "Desconocida"}
                      sx={{ backgroundColor: "#6D28D9", color: "white" }}
                    />
                  );
                })}
              </Box>
            )}
          >
            {abilities.map((a) => (
              <MenuItem key={a._id} value={a._id}>
                {a.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            variant="outlined"
            component="label"
            sx={{
              color: "#C9B6D1",
              borderColor: "#6D28D9",
              "&:hover": { borderColor: "#5B21B6" },
            }}
          >
            Select file (.webp)
            <input
              type="file"
              accept="image/webp"
              hidden
              onChange={handleFileSelect}
            />
          </Button>
          {imageFile && (
            <Typography sx={{ color: "#C9B6D1" }}>
              {imageFile.name} selected
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{
            mt: 2,
            backgroundColor: "#6D28D9",
            "&:hover": { backgroundColor: "#5B21B6" },
            height: 48,
            position: "relative",
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={26} sx={{ color: "white" }} />
          ) : editingId ? (
            "Upadte Character"
          ) : (
            "Save Character"
          )}
        </Button>

        {editingId && (
          <Button
            onClick={resetForm}
            fullWidth
            variant="outlined"
            sx={{
              mt: 2,
              color: "#C3C3C3",
              borderColor: "#6D28D9",
            }}
          >
            Cancel edit
          </Button>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Diálogo de eliminación */}
      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
        <DialogTitle>Eliminar personaje </DialogTitle>
        <DialogContent>
          ¿Seguro que deseas eliminar este personaje? Esta acción no se puede
          deshacer.
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} sx={{ color: "#6D28D9" }}>
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageCharacters;
