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
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

function Regions() {
  const [search, setSearch] = useState("");
  const [regions, setRegions] = useState([]);
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
    const getRegions = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:3000/api/regions", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const data = await res.json();
        if (Array.isArray(data)) setRegions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getRegions();
  }, [token]);

  const filtered = regions.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        backgroundColor: "#111121",
        color: "white",
        minHeight: "100vh",
        py: 5,
        px: { xs: 2, md: 6 },
      }}
    >
      {/* Header y buscador */}
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
          sx={{ fontWeight: "bold", letterSpacing: 1, color: "#E2E8F0" }}
        >
          Regions
        </Typography>
        <TextField
          placeholder="Search region..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            style: { color: "white" },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9A8C98" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: "8px",
            width: { xs: "100%", sm: "300px" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "transparent" },
              "&:hover fieldset": { borderColor: "#9A8C98" },
              "&.Mui-focused fieldset": { borderColor: "#9A8C98" },
            },
          }}
        />
      </Box>

      {/* Loading */}
      {isLoading && <LinearProgress color="secondary" sx={{ mb: 3 }} />}

      {/* Grid de regiones */}
      <Grid container spacing={4}>
        {filtered.map((reg) => (
          <Grid key={reg._id}>
            <Card
              onClick={() => navigate(`/regions/${reg._id}`)}
              sx={{
                backgroundColor: "#1C1C2A",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                },
              }}
            >
              <CardMedia
                component="img"
                src={reg.imageRegion || "/placeholder.webp"}
                alt={reg.name}
                sx={{
                  height: 300,
                  objectFit: "cover",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              />
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                <Typography
                  variant="h5"
                  sx={{ color: "#E0E0E0", fontWeight: "600" }}
                >
                  {reg.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Regions;
