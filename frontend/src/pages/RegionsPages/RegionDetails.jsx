import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  LinearProgress,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fecthWithAuth";

function RegionDetail() {
  const [region, setRegion] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const onAuthChanged = () => {
      const tokenNow = localStorage.getItem("accessToken");
      if (!tokenNow) navigate("/access-denied");
      else setToken(tokenNow);
    };
    window.addEventListener("authChanged", onAuthChanged);
    return () => window.removeEventListener("authChanged", onAuthChanged);
  }, [navigate]);

  useEffect(() => {
    if (!token) return;
    const getRegion = async () => {
      try {
        const res = await fetchWithAuth(
          `http://localhost:3000/api/regions/${id}`,
          {
            credentials: "include",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Error fetching region data");
        const data = await res.json();
        setRegion(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getRegion();
  }, [id, token]);

  if (isLoading)
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

  if (!region)
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
          Region not found
        </Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        backgroundColor: "#111121",
        color: "white",
        minHeight: "100vh",
        py: 6,
        px: { xs: 3, md: 8 },
      }}
    >
      {/* Título */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          color: "#E2E8F0",
          mb: 3,
          letterSpacing: 1,
          textShadow: "0 2px 15px rgba(0,0,0,0.6)",
          textAlign: "center",
        }}
      >
        {region.name}
      </Typography>

      {/* Imagen destacada */}
      <Card
        sx={{
          position: "relative",
          borderRadius: "18px",
          overflow: "hidden",
          maxWidth: "1000px",
          mx: "auto",
          mb: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        }}
      >
        <CardMedia
          component="img"
          src={region.imageRegion || "/placeholder.webp"}
          alt={region.name}
          sx={{
            width: "100%",
            aspectRatio: "16/9",
            objectFit: "cover",
            borderRadius: 2,
            transition: "transform 0.5s",
            "&:hover": { transform: "scale(1.03)" },
          }}
        />
        {/* Overlay degradado inferior */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "30%",
            background: "linear-gradient(transparent, rgba(17,17,33,0.8))",
          }}
        />
      </Card>

      {/* Caja de descripción */}
      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
          textAlign: "left",
          backgroundColor: "rgba(26,26,40,0.85)",
          borderRadius: "14px",
          p: { xs: 3, sm: 4 },
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
          backdropFilter: "blur(6px)",
          transition: "transform 0.3s ease",
          "&:hover": { transform: "translateY(-3px)" },
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#C9B6D1", mb: 1.5 }}
        >
          Description
        </Typography>

        <Divider sx={{ borderColor: "#2E2E58", mb: 2, opacity: 0.5 }} />

        <Typography
          sx={{
            color: "#C3C3C3",
            fontSize: { xs: 15, sm: 16 },
            lineHeight: 1.8,
            textAlign: "justify",
          }}
        >
          {region.description || "No description available."}
        </Typography>
      </Box>
    </Box>
  );
}

export default RegionDetail;
