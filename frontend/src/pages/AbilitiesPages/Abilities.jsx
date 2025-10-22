import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { iconsMap } from "../../utils/iconsMap";
import { fetchWithAuth } from "../../utils/fecthWithAuth";

function Abilities() {
  const [search, setSearch] = useState("");
  const [abilities, setAbilities] = useState([]);
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
    const getAbilities = async () => {
      if (!token) return;

      try {
        const res = await fetchWithAuth("http://localhost:3000/api/abilities", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setAbilities(data);
        } else {
          console.error("Error al cargar habilidades:", data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getAbilities();
  }, [token]);

  const filtered = abilities.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        mt: 2,
        backgroundColor: "#111121",
        color: "white",
        minHeight: "100vh",
        py: 6,
        px: { xs: 2, md: 8 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 5,
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
            borderLeft: "4px solid #6D28D9",
            pl: 2,
          }}
        >
          Abilities
        </Typography>

        <TextField
          placeholder="Search ability..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            backgroundColor: "#1C1C2A",
            borderRadius: "10px",
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

      {isLoading && <LinearProgress color="secondary" />}

      <Grid container spacing={4} justifyContent="center">
        {filtered.map((ability) => {
          const IconComponent = iconsMap[ability.icon];
          return (
            <Grid item key={ability._id}>
              <Card
                onClick={() => navigate(`/abilities/${ability._id}`)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#1C1C2A",
                  borderRadius: "16px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                  p: 3,
                  width: { xs: 280, sm: 340, md: 420 },
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0px 6px 16px rgba(109,40,217,0.4)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    flexDirection: "column",
                  }}
                >
                  {IconComponent && (
                    <IconComponent
                      sx={{ fontSize: 48, color: "#6D28D9", flexShrink: 0 }}
                    />
                  )}
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#E0E0E0",
                      fontWeight: "bold",
                      mb: 0.5,
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      textAlign: "left",
                    }}
                  >
                    {ability.name}
                  </Typography>
                </Box>

                <CardContent
                  sx={{
                    px: 0,
                    pt: 2,
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#b7a8a8",
                      fontSize: "0.95rem",
                      mb: 1,
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                      maxHeight: 70,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {ability.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Abilities;
