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
  IconButton,
  Snackbar,
  Alert,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { fetchWithAuth } from "../../utils/fecthWithAuth";

const defaultImage =
  "https://res.cloudinary.com/dpylotukc/image/upload/v1761076750/deafult_havb7m.webp"; // tu imagen por defecto

function ManageRegions() {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [regions, setRegions] = useState([]);
  const [newRegion, setNewRegion] = useState({
    name: "",
    description: "",
    imageRegion: "",
  });
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

  const navigate = useNavigate();

  useEffect(() => {
    const tokenNow = localStorage.getItem("accessToken");
    if (!tokenNow) navigate("/access-denied");
    else setToken(tokenNow);
  }, [navigate]);

  useEffect(() => {
    const fetchRegions = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await fetchWithAuth("http://localhost:3000/api/regions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setRegions(data);
      } catch (e) {
        showSnackbar(e.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchRegions();
  }, [token]);

  const showSnackbar = (message, severity = "info") =>
    setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "image/webp") {
      return showSnackbar("Solo se permiten imágenes .webp", "warning");
    }
    setImageFile(file);
  };

  const handleChange = (e) => {
    setNewRegion({ ...newRegion, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setNewRegion({ name: "", description: "", imageRegion: "" });
    setImageFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newRegion.name || !newRegion.description) {
      return showSnackbar("Complete todos los campos", "warning");
    }

    try {
      setIsSubmitting(true);
      let imageUrl = newRegion.imageRegion || defaultImage;
      if (imageFile)
        imageUrl = await uploadImageToCloudinary(imageFile, "region");

      if (editingId) {
        const res = await fetchWithAuth(
          `http://localhost:3000/api/regions/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...newRegion, imageRegion: imageUrl }),
          }
        );

        if (!res.ok) throw new Error("Error al actualizar la región");

        const updated = await res.json();
        setRegions((prev) =>
          prev.map((r) => (r._id === editingId ? updated : r))
        );
        showSnackbar("Región actualizada correctamente", "success");
      } else {
        const res = await fetchWithAuth("http://localhost:3000/api/regions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...newRegion, imageRegion: imageUrl }),
        });

        if (!res.ok) throw new Error("Error al crear región");

        const created = await res.json();
        setRegions((prev) => [...prev, created]);
        showSnackbar("Región creada correctamente", "success");
      }

      resetForm();
    } catch (err) {
      showSnackbar(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (region) => {
    setEditingId(region._id);
    setNewRegion({
      name: region.name,
      description: region.description,
      imageRegion: region.imageRegion,
    });
    setImageFile(null);
    showSnackbar(`Editando ${region.name}`, "info");
  };

  const confirmDelete = (id) => setDeleteDialog({ open: true, id });
  const closeDeleteDialog = () => setDeleteDialog({ open: false, id: null });

  const handleDelete = async () => {
    const id = deleteDialog.id;
    if (!id) return;

    try {
      setLoading(true);
      const res = await fetchWithAuth(
        `http://localhost:3000/api/regions/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok && res.status !== 204)
        throw new Error("No se pudo eliminar la región");

      setRegions((prev) => prev.filter((r) => r._id !== id));
      showSnackbar("Región eliminada correctamente", "success");
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
          Manage Regions
        </Typography>

        {loading && <LinearProgress color="secondary" />}

        <Paper
          sx={{
            backgroundColor: "#1C1C2A",
            borderRadius: 2,
            maxWidth: "900px",
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {["Name", "Description", "Image", "Actions"].map((col) => (
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
              {regions.map((region) => (
                <TableRow key={region._id}>
                  <TableCell
                    sx={{
                      color: "#E2E8F0",
                      maxWidth: 250,
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {region.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#9e9e9e",
                      maxWidth: 250,
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {region.description}
                  </TableCell>
                  <TableCell>
                    <img
                      src={region.imageRegion || defaultImage}
                      alt={region.name}
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
                      onClick={() => handleEdit(region)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: "#E11D48" }}
                      onClick={() => confirmDelete(region._id)}
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
          p: { xs: 3, md: 2 },
          mt: { md: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: { md: "fit-content" },
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#C9B6D1" }}>
          {editingId ? "Edit Region" : "Add Region"}
        </Typography>

        <TextField
          name="name"
          label="Name"
          value={newRegion.name}
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
          value={newRegion.description}
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
            Seleccionar archivo (.webp)
            <input
              type="file"
              accept="image/webp"
              hidden
              onChange={handleFileSelect}
            />
          </Button>
          {imageFile && (
            <Typography sx={{ color: "#C9B6D1" }}>
              {imageFile.name} seleccionado
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
            "Actualizar Región"
          ) : (
            "Guardar Región"
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
            Cancelar edición
          </Button>
        )}
      </Box>

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

      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this ability? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} sx={{ color: "#6D28D9" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageRegions;
