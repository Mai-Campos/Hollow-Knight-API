import {
  Box,
  Typography,
  Card,
  CardMedia,
  LinearProgress,
  CardContent,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function RegionDetail() {
  const [region, setRegion] = useState(null);
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

    const getRegion = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/regions/${id}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });
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

  if (!region) {
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
  }

  return (
    <Box
      sx={{
        backgroundColor: "#111121",
        color: "white",
        minHeight: "100vh",
        py: 6,
        px: { xs: 3, md: 8 },
        textAlign: "center",
        mt: 1,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          color: "#E2E8F0",
          mb: 4,
          textShadow: "0px 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        {region.name}
      </Typography>

      <Card
        sx={{
          backgroundColor: "#111121",
          borderRadius: "16px",
          overflow: "hidden",
          maxWidth: "1100px",
          mx: "auto",
          mb: 4,
          p: { xs: 1, sm: 2 },
        }}
      >
        <CardMedia
          component="img"
          image={region.image || "/region-placeholder.jpg"}
          alt={region.name}
          sx={{
            width: "100%",
            height: { xs: 300, sm: 400, md: 500 },
            objectFit: "contain",
            objectPosition: "center",
            borderRadius: "12px",
          }}
        />
      </Card>

      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
          textAlign: "left",
          backgroundColor: "#111121",
          borderRadius: "12px",
          p: { xs: 2, sm: 3, md: 4 },
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#C9B6D1",
            mb: 1,
          }}
        >
          Description
        </Typography>

        <Divider
          sx={{
            borderColor: "#2E2E58",
            mb: 2,
            opacity: 0.5,
          }}
        />

        <Typography
          sx={{
            color: "#9e9e9e",
            fontSize: 16,
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
