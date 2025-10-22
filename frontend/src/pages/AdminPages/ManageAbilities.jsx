/* eslint-disable no-unused-vars */
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { iconsMap } from "../../utils/iconsMap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fecthWithAuth";

function ManageAbilities() {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [abilities, setAbilities] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [newAbility, setNewAbility] = useState({
    name: "",
    description: "",
    effects: [],
    howToObtain: "",
    icon: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const onAuthChanged = () => {
      const tokenNow = localStorage.getItem("accessToken");
      if (!tokenNow) {
        navigate("/access-denied");
      } else {
        setToken(tokenNow);
      }
    };

    window.addEventListener("authChanged", onAuthChanged);
    return () => window.removeEventListener("authChanged", onAuthChanged);
  }, [navigate]);

  const fetchAbilities = async () => {
    try {
      const res = await fetchWithAuth("http://localhost:3000/api/abilities", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error fetching abilities");
      const data = await res.json();
      setAbilities(data);
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  useEffect(() => {
    if (token) fetchAbilities();
  }, [token]);

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    setNewAbility({ ...newAbility, [e.target.name]: e.target.value });
  };

  const handleEffectsChange = (e) => {
    const { value } = e.target;
    setNewAbility({
      ...newAbility,
      effects: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleIconChange = (e) => {
    const value = e.target.value;
    setSelectedIcon(value);
    setNewAbility({ ...newAbility, icon: value });
  };

  const resetForm = () => {
    setNewAbility({
      name: "",
      description: "",
      effects: [],
      howToObtain: "",
      icon: "",
    });
    setSelectedIcon("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, effects, howToObtain, icon } = newAbility;
    if (!name || !description || !effects.length || !howToObtain || !icon) {
      showSnackbar("Please fill in all fields before saving.", "warning");
      return;
    }

    try {
      setIsSubmitting(true);

      const url = editingId
        ? `http://localhost:3000/api/abilities/${editingId}`
        : "http://localhost:3000/api/abilities";

      const method = editingId ? "PUT" : "POST";

      const res = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(newAbility),
      });

      if (!res.ok)
        throw new Error(
          editingId ? "Error updating ability" : "Error creating ability"
        );

      const updatedOrCreated = await res.json();

      if (editingId) {
        setAbilities((prev) =>
          prev.map((a) => (a._id === editingId ? updatedOrCreated : a))
        );
        showSnackbar("Ability updated successfully!", "success");
      } else {
        setAbilities((prev) => [...prev, updatedOrCreated]);
        showSnackbar("Ability created successfully!", "success");
      }

      resetForm();
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (ability) => {
    setEditingId(ability._id);
    setNewAbility({
      name: ability.name,
      description: ability.description,
      effects: ability.effects,
      howToObtain: ability.howToObtain,
      icon: ability.icon,
    });
    setSelectedIcon(ability.icon);
    showSnackbar(`Editing "${ability.name}"`, "info");
  };

  const confirmDelete = (id) => setDeleteDialog({ open: true, id });
  const closeDeleteDialog = () => setDeleteDialog({ open: false, id: null });

  const handleDelete = async () => {
    const id = deleteDialog.id;
    if (!id) return;

    try {
      setDeletingId(id);
      const res = await fetchWithAuth(
        `http://localhost:3000/api/abilities/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (res.status !== 204 && !res.ok)
        throw new Error("Failed to delete ability");

      setAbilities((prev) => prev.filter((a) => a._id !== id));
      showSnackbar("Ability deleted successfully", "success");
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setDeletingId(null);
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
      }}
    >
      {/* TABLA */}
      <Box
        sx={{
          flex: 2,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: "#E2E8F0",
            borderLeft: "4px solid #6D28D9",
            pl: 2,
          }}
        >
          Manage Abilities
        </Typography>

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
                  "Effects",
                  "How To Obtain",
                  "Icon",
                  "Actions",
                ].map((col) => (
                  <TableCell
                    key={col}
                    sx={{
                      color: "#C3C3C3",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {abilities.map((ability) => {
                const IconComp = iconsMap[ability.icon];
                return (
                  <TableRow key={ability._id} hover>
                    <TableCell
                      sx={{
                        color: "#E2E8F0",
                        maxWidth: 250,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {ability.name}
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
                      {ability.description}
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
                      {ability.effects.map((ef) => (
                        <Chip
                          key={ef}
                          label={ef}
                          sx={{
                            color: "white",
                            backgroundColor: "#6D28D9",
                            mr: 0.5,
                            mb: 0.5,
                          }}
                        />
                      ))}
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
                      {ability.howToObtain}
                    </TableCell>
                    <TableCell>
                      {IconComp && (
                        <IconComp sx={{ color: "#6D28D9", fontSize: 28 }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(ability)}
                        sx={{
                          color: "#6D28D9",
                          "&:hover": { color: "#5B21B6" },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => confirmDelete(ability._id)}
                        disabled={deletingId === ability._id}
                        sx={{
                          color: "#E11D48",
                          "&:hover": { color: "#BE123C" },
                          position: "relative",
                        }}
                      >
                        {deletingId === ability._id ? (
                          <CircularProgress
                            size={24}
                            sx={{ color: "#E11D48" }}
                          />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* FORMULARIO */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          flex: 1,
          backgroundColor: "#1C1C2A",
          borderRadius: 2,
          p: 3,
          boxShadow: "0 0 10px rgba(0,0,0,0.4)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: "#C9B6D1",
          }}
        >
          {editingId ? "Edit Ability" : "Add Ability"}
        </Typography>

        <TextField
          label="Name"
          name="name"
          fullWidth
          value={newAbility.name}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          slotProps={{
            input: { style: { color: "#C3C3C3" } },
            inputLabel: { style: { color: "#C3C3C3" } },
          }}
        />

        <TextField
          label="Description"
          name="description"
          fullWidth
          multiline
          rows={3}
          value={newAbility.description}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          slotProps={{
            input: { style: { color: "#C3C3C3" } },
            inputLabel: { style: { color: "#C3C3C3" } },
          }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel sx={{ color: "#C3C3C3" }}>Effects</InputLabel>
          <Select
            multiple
            name="effects"
            value={newAbility.effects}
            onChange={handleEffectsChange}
            sx={{ color: "white" }}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    sx={{ backgroundColor: "#6D28D9", color: "white" }}
                  />
                ))}
              </Box>
            )}
          >
            {["Attack Boost", "Defense Up", "Speed Buff", "Healing"].map(
              (effect) => (
                <MenuItem key={effect} value={effect}>
                  {effect}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        <TextField
          label="How to Obtain"
          name="howToObtain"
          fullWidth
          multiline
          rows={2}
          value={newAbility.howToObtain}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          slotProps={{
            input: { style: { color: "#C3C3C3" } },
            inputLabel: { style: { color: "#C3C3C3" } },
          }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel sx={{ color: "#C3C3C3" }}>Icon</InputLabel>
          <Select
            value={selectedIcon}
            onChange={handleIconChange}
            sx={{ color: "white" }}
          >
            {Object.entries(iconsMap).map(([key, IconEl]) => (
              <MenuItem key={key} value={key}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconEl sx={{ color: "#6D28D9" }} />
                  <Typography>{key}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{
            mt: 4,
            backgroundColor: "#6D28D9",
            "&:hover": { backgroundColor: "#5B21B6" },
            height: 48,
            position: "relative",
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={26} sx={{ color: "white" }} />
          ) : editingId ? (
            "Update Ability"
          ) : (
            "Save Ability"
          )}
        </Button>

        {editingId && (
          <Button
            onClick={resetForm}
            fullWidth
            variant="outlined"
            sx={{ mt: 2, color: "#C3C3C3", borderColor: "#6D28D9" }}
          >
            Cancel Edit
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

      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        color="black"
      >
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

export default ManageAbilities;
