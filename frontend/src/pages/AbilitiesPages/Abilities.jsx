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
        const res = await fetch("http://localhost:3000/api/abilities", {
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
          Abilities
        </Typography>

        <TextField
          placeholder="Search ability..."
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
        {filtered.map((ability) => {
          const IconComponent = iconsMap[ability.icon];
          return (
            <Grid key={ability._id}>
              <Card
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#141c2e",
                  borderRadius: "10px",
                  boxShadow: "0px 1px 1px rgba(0,0,0,0.25)",
                  p: 3,
                  height: 200,
                  maxWidth: 320,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "flex-start",
                    gap: 1.5,
                  }}
                >
                  {IconComponent && (
                    <IconComponent
                      sx={{
                        fontSize: 40,
                        color: "#3207cd",
                      }}
                    />
                  )}
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#E0E0E0",
                      fontWeight: "bold",
                    }}
                  >
                    {ability.name}
                  </Typography>
                </Box>

                <CardContent sx={{ p: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#b7a8a8",
                      fontSize: "0.9rem",
                      mt: 1,
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
