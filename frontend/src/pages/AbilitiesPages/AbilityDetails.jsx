import {
  Box,
  LinearProgress,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { iconsMap } from "../../utils/iconsMap";

function AbilityDetails() {
  const [ability, setAbility] = useState(null);
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

    const getAbility = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/abilities/${id}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error fetching ability data");
        const data = await res.json();
        setAbility(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getAbility();
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

  if (!ability) {
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
          Ability not found
        </Typography>
      </Box>
    );
  }

  const IconComponent = iconsMap[ability.icon];

  return (
    <Box
      sx={{
        background: "#111121",
        color: "white",
        minHeight: "100vh",
        py: 6,
        px: { xs: 3, md: 8 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: 3,
          backgroundColor: "#111121",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          overflow: "hidden",
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: "900px",
          backdropFilter: "blur(6px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#111121",
            borderRadius: "16px",
            width: { xs: 100, sm: 120 },
            height: { xs: 100, sm: 120 },
            flexShrink: 0,
          }}
        >
          {IconComponent ? (
            <IconComponent sx={{ fontSize: 64, color: "#5E5BFF" }} />
          ) : (
            <Typography color="gray">No Icon</Typography>
          )}
        </Box>

        <CardContent sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: "#5E5BFF",
              letterSpacing: 2,
              fontSize: "0.875rem",
              textTransform: "uppercase",
              fontWeight: 900,
            }}
          >
            Ability
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#E2E8F0",
              mt: 1,
              fontSize: "2rem",
              lineHeight: 1.2,
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {ability.name}
          </Typography>

          <Typography
            sx={{
              color: "#C3C3C3",
              fontSize: "1rem",
              lineHeight: 1.8,
              mt: 2,
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {ability.description || "No description available."}
          </Typography>
        </CardContent>
      </Card>

      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: "#111121",
          borderRadius: "14px",
          p: { xs: 3, sm: 4 },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#C9B6D1",
            mb: 1,
            borderLeft: "4px solid #5E5BFF",
            pl: 2,
          }}
        >
          Effects
        </Typography>

        <Typography
          sx={{
            color: "#9e9e9e",
            fontSize: 16,
            lineHeight: 1.8,
            textAlign: "justify",
            mb: 4,
          }}
        >
          {ability.effects || "No effects described for this ability."}
        </Typography>

        <Divider sx={{ borderColor: "#2E2E58", my: 2, opacity: 0.4 }} />

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#C9B6D1",
            mb: 1,
            borderLeft: "4px solid #5E5BFF",
            pl: 2,
          }}
        >
          How to Obtain
        </Typography>

        <Typography
          sx={{
            color: "#9e9e9e",
            fontSize: 16,
            lineHeight: 1.8,
            textAlign: "justify",
          }}
        >
          {ability.howToObtain ||
            "No information available about how to obtain this ability."}
        </Typography>
      </Box>
    </Box>
  );
}

export default AbilityDetails;
