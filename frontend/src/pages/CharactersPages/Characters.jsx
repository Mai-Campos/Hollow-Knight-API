import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Characters() {
  const [search, setSearch] = useState("");
  const [characters, setCharacters] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [isLoading, setIsLoading] = useState(true);
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
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/api/characters", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setCharacters(data);
          setIsLoading(false);
        } else {
          console.error("Error al cargar personajes:", data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCharacters();
  }, [token]);

  const filtered = characters.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        backgroundColor: "#111121",
        mt: 2,
        color: "white",
        minHeight: "100vh",
        py: 5,
        px: { xs: 2, md: 6 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            letterSpacing: 1,
            color: "#E2E8F0",
          }}
        >
          Characters
        </Typography>

        <TextField
          placeholder="Search character..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            backgroundColor: "#111121",
            borderRadius: "8px",
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#3F3F46" },
              "&:hover fieldset": { borderColor: "#9A8C98" },
              "&.Mui-focused fieldset": { borderColor: "#9A8C98" },
            },
            width: { xs: "100%", sm: "300px" },
          }}
        />
      </Box>

      {isLoading && <LinearProgress color="inherit" />}
      <Grid container spacing={4} columns={{ xs: 1, sm: 2, md: 4, lg: 4 }}>
        {filtered.map((char) => (
          <Grid key={char._id}>
            <Card
              onClick={() => {
                navigate(`/characters/${char._id}`);
              }}
              sx={{
                backgroundColor: "#111121",
                borderRadius: "10px",
                cursor: "pointer",

                textAlign: "center",
                p: 2,
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardMedia
                component="img"
                image={char.image}
                alt={char.name}
                sx={{
                  width: "100%",
                  height: 180,
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
              <CardContent sx={{ p: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#E0E0E0", fontWeight: "600" }}
                >
                  {char.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Characters;
