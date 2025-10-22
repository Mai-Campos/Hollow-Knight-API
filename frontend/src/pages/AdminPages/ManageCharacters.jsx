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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ManageCharacters() {
  //Estados
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [selectedAbilities, setSelectedAbilities] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [regions, setRegions] = useState([]);
  const [abilities, setAbilities] = useState([]);

  // Otros hooks
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

  useEffect(() => {
    const getCharacters = async () => {
      const res = await fetch("http://localhost:3000/api/characters");
      try {
      } catch (error) {
        console.log(error);
      }
    };
  });

  // Funciones
  const handleEdit = (name) => alert(`Edit ${name}`);
  const handleDelete = (name) => alert(`Delete ${name}`);
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Character submitted");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "image/webp") {
      setImageFile(file);
    } else {
      alert("Solo se permiten imágenes en formato .webp");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/webp") {
      setImageFile(file);
    } else {
      alert("Solo se permiten imágenes en formato .webp");
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // Renderizado
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
        mt: 1,
      }}
    >
      <Box sx={{ flex: 2, overflowX: "auto" }}>
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
          Manage Characters
        </Typography>

        <Paper
          sx={{
            backgroundColor: "#1C1C2A",
            borderRadius: 2,
            minWidth: "800px",
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
              {characters.map((char) => (
                <TableRow key={char.name} hover>
                  <TableCell sx={{ color: "#E2E8F0" }}>{char.name}</TableCell>
                  <TableCell sx={{ color: "#9e9e9e" }}>
                    {char.description}
                  </TableCell>
                  <TableCell sx={{ color: "#C9B6D1" }}>{char.region}</TableCell>
                  <TableCell>
                    {char.abilities.map((a) => (
                      <Chip
                        key={a}
                        label={a}
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
                      src={char.image}
                      alt={char.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(char.name)}
                      sx={{
                        color: "#6D28D9",
                        "&:hover": { color: "#5B21B6" },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(char.name)}
                      sx={{
                        color: "#E11D48",
                        "&:hover": { color: "#BE123C" },
                      }}
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
          Add / Edit Character
        </Typography>

        <TextField
          label="Name"
          fullWidth
          variant="outlined"
          margin="normal"
          slotProps={{
            input: { style: { color: "#C3C3C3" } },
            inputLabel: { style: { color: "#C3C3C3" } },
          }}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          margin="normal"
          slotProps={{
            input: { style: { color: "#C3C3C3" } },
            inputLabel: { style: { color: "#C3C3C3" } },
          }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel sx={{ color: "#C3C3C3" }}>Region</InputLabel>
          <Select label="Region" sx={{ color: "white" }} defaultValue="">
            {regions.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel sx={{ color: "#C3C3C3" }}>Abilities</InputLabel>
          <Select
            multiple
            value={selectedAbilities}
            onChange={(e) => setSelectedAbilities(e.target.value)}
            input={<OutlinedInput label="Abilities" />}
            sx={{ color: "white" }}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    sx={{
                      backgroundColor: "#6D28D9",
                      color: "white",
                    }}
                  />
                ))}
              </Box>
            )}
          >
            {abilities.map((ability) => (
              <MenuItem key={ability} value={ability}>
                {ability}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            mt: 3,
            border: "2px dashed #6D28D9",
            borderRadius: "12px",
            p: 3,
            textAlign: "center",
            color: "#9e9e9e",
            cursor: "pointer",
          }}
        >
          {imageFile ? (
            <Typography sx={{ color: "#C9B6D1" }}>
              {imageFile.name} cargado
            </Typography>
          ) : (
            <Typography>Arrastra aquí una imagen .webp</Typography>
          )}

          <Button
            variant="outlined"
            component="label"
            sx={{
              mt: 2,
              color: "#C9B6D1",
              borderColor: "#6D28D9",
              "&:hover": { borderColor: "#5B21B6" },
            }}
          >
            Seleccionar archivo
            <input
              type="file"
              accept="image/webp"
              hidden
              onChange={handleFileSelect}
            />
          </Button>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 4,
            backgroundColor: "#6D28D9",
            "&:hover": { backgroundColor: "#5B21B6" },
          }}
        >
          Save Character
        </Button>
      </Box>
    </Box>
  );
}

export default ManageCharacters;
