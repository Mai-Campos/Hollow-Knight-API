import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authService";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(true);

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  const handleChange = (e) => {
    if (e.target.name === "email") {
      setForm({ ...form, email: e.target.value });
    } else {
      setForm({ ...form, password: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate("/");
    } catch (error) {
      setError(error.message);
      setOpenSnackBar(true);
    }
  };

  return (
    <>
      {error != "" && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackBar}
          onClose={handleCloseSnackBar}
        >
          <Alert
            onClose={handleCloseSnackBar}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          py: 4,
        }}
      >
        <Container maxWidth="xs">
          <Container sx={{ mb: 4 }}>
            <Typography
              align="center"
              component="h1"
              sx={{
                fontSize: {
                  sm: "1rem",
                  md: "1.5rem",
                  lg: "2rem",
                },
                fontWeight: "700",
                lineHeight: "1.1",
              }}
            >
              HOLLOW KNIGHT API
            </Typography>
            <Typography
              align="center"
              component="p"
              sx={{ mt: 1, color: "gray", fontStyle: "italic" }}
            >
              Enter the depths of Hallownest
            </Typography>
          </Container>
          <Paper
            elevation={6}
            sx={{
              backgroundColor: "#1E1E2F",
              p: 4,
              borderRadius: "16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "#9A8C98",
                mb: 3,
                letterSpacing: "1px",
              }}
            >
              Iniciar Sesión
            </Typography>

            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <TextField
                fullWidth
                margin="normal"
                name="email"
                label="Correo electrónico"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                sx={{
                  input: { color: "white" },
                  label: { color: "#C3C3C3" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#374151" },
                    "&:hover fieldset": { borderColor: "#9A8C98" },
                    "&.Mui-focused fieldset": { borderColor: "#9A8C98" },
                  },
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                name="password"
                label="Contraseña"
                type={"password"}
                value={form.password}
                onChange={handleChange}
                required
                sx={{
                  input: { color: "white" },
                  label: { color: "#C3C3C3" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#374151" },
                    "&:hover fieldset": { borderColor: "#9A8C98" },
                    "&.Mui-focused fieldset": { borderColor: "#9A8C98" },
                  },
                }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.2,
                  fontWeight: "bold",
                  backgroundColor: "#9A8C98",
                  color: "#0D0D12",
                  "&:hover": {
                    backgroundColor: "#C9B6D1",
                  },
                }}
              >
                ENTRAR
              </Button>
              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 3, color: "#C3C3C3" }}
              >
                ¿No tienes una cuenta?
                <Box
                  component="span"
                  sx={{
                    color: "#9A8C98",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontWeight: "bold",
                    ml: 1,
                  }}
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  Regístrate
                </Box>
              </Typography>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default Login;
