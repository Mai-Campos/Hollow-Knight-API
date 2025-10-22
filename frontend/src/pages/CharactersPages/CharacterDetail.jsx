import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Divider,
  LinearProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { iconsMap } from "../../utils/iconsMap";
import { fetchWithAuth } from "../../utils/fecthWithAuth";

function CharacterDetail() {
  const [character, setCharacter] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

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
    if (!token) return;

    const getCharacter = async () => {
      try {
        const res = await fetchWithAuth(
          `http://localhost:3000/api/characters/${id}`,
          {
            credentials: "include",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Error fetching character data");
        const data = await res.json();
        setCharacter(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getCharacter();
  }, [id, token]);

  if (isLoading) {
    return (
      <Box
        sx={{
          backgroundColor: "#111121",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 6,
        }}
      >
        <LinearProgress color="inherit" sx={{ width: "100%" }} />
      </Box>
    );
  }

  if (!character) {
    return (
      <Box
        sx={{
          backgroundColor: "#111121",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" color="#9A8C98">
          Character not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#111121",
        color: "white",
        minHeight: "100vh",
        py: 6,
        px: { xs: 3, md: 8 },
        mt: 2,
      }}
    >
      <Grid container spacing={4}>
        <Grid>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#E2E8F0",
              mb: 2,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {character.name}
          </Typography>

          <Card
            sx={{
              backgroundColor: "#2A2A35",
              borderRadius: "12px",
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            <CardMedia
              component="img"
              src={character.imageCharacter}
              alt={character.name}
              sx={{
                width: "100%",
                height: 350,
                objectFit: "contain",
                backgroundColor: "#111121",
              }}
            />
          </Card>
        </Grid>

        {/*Descripción, habilidades y región */}
        <Grid item xs={12} md={6}>
          {/*  Descripción */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#C9B6D1", mb: 1 }}
            >
              Description
            </Typography>
            <Typography
              sx={{
                color: "#C3C3C3",
                lineHeight: 1.6,
                textAlign: "justify",
              }}
            >
              {character.description || "No description available."}
            </Typography>
            <Divider
              sx={{ borderColor: "#1f1f97", mt: 3, mb: 2, opacity: 0.5 }}
            />
          </Box>

          {/*Habilidades */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                color: "#C9B6D1",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Abilities
            </Typography>
            {character.abilities?.length ? (
              <Stack
                direction="row"
                flexWrap="wrap"
                spacing={1.5}
                useFlexGap
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                {character.abilities.map((ability) => {
                  const IconComponent = iconsMap[ability.icon];
                  return (
                    <Chip
                      key={ability._id}
                      onClick={() => {
                        navigate(`/abilities/${ability._id}`);
                      }}
                      label={ability.name}
                      icon={IconComponent ? <IconComponent /> : null}
                      sx={{
                        backgroundColor: "#353540",
                        color: "#E0E0E0",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        fontWeight: 600,
                        "& .MuiChip-icon": {
                          color: "#3207cd",
                        },
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            ) : (
              <Typography sx={{ color: "#888", fontSize: 14 }}>
                No abilities found.
              </Typography>
            )}
            <Divider
              sx={{ borderColor: "#1f1f97", mt: 3, mb: 2, opacity: 0.9 }}
            />
          </Box>

          {/*  Región */}
          {character.region && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#C9B6D1",
                  mb: 2,
                }}
              >
                Region
              </Typography>

              <Card
                onClick={() => {
                  navigate(`/regions/${character.region._id}`);
                }}
                sx={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  height: { xs: 200, sm: 250, md: 300 },
                  backgroundColor: "#111121",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  src={character.region.imageRegion}
                  alt={character.region.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Degradado y nombre encima */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))",
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#E2E8F0",
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >
                    {character.region.name}
                  </Typography>
                </Box>
              </Card>

              {/* Descripción de la región */}
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#BDBDBD",
                    textAlign: "justify",
                  }}
                >
                  {character.region.description}
                </Typography>
              </CardContent>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default CharacterDetail;
