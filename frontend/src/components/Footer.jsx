import { Box, Container, Grid, Typography, Link } from "@mui/material";
import Email from "@mui/icons-material/Email";
import GitHub from "@mui/icons-material/GitHub";
import Telegram from "@mui/icons-material/Telegram";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0D0D12",
        color: "#E0E0E0",
        mt: 8,
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#9A8C98" }}
            >
              Sobre la Pagina
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "gray",
                fontSize: "0.8rem",
                mt: 2,
                lineHeight: 1.6,
                width: { xs: "100%", md: "60%" },
              }}
            >
              Hollow Knight es una marca registrada de
              <strong>Team Cherry Pty Ltd</strong>. Este proyecto es una
              iniciativa
              <strong>no oficial creada por Maikol Campos Rodriguez</strong>,
              sin afiliación, respaldo ni relación comercial con Team Cherry.
              Todo el contenido relacionado con Hollow Knight pertenece a sus
              respectivos propietarios. Este sitio tiene fines educativos y de
              demostración.
            </Typography>
          </Grid>

          {/* -------------------- CONTACTO -------------------- */}
          <Grid>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#9A8C98" }}
            >
              Contacto
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 1,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Link
                href="mailto:camposmaikol1@gmail.com"
                target="_blank"
                color="inherit"
                underline="none"
                sx={{
                  color: "inherit",
                  transition: "all 0.3s ease",
                  "&:hover": { color: "#EA4335", transform: "scale(1.2)" },
                }}
              >
                <Email sx={{ fontSize: 30 }} />
              </Link>

              <Link
                href="https://github.com/mai-campos"
                target="_blank"
                color="inherit"
                underline="none"
                sx={{
                  color: "inherit",
                  transition: "all 0.3s ease",
                  "&:hover": { color: "#c3c3c3", transform: "scale(1.2)" }, // GitHub gray
                }}
              >
                <GitHub sx={{ fontSize: 30 }} />
              </Link>

              <Link
                href="https://t.me/yuni_dev"
                target="_blank"
                color="inherit"
                underline="none"
                sx={{
                  color: "inherit",
                  transition: "all 0.3s ease",
                  "&:hover": { color: "#0088cc", transform: "scale(1.2)" }, // Telegram blue
                }}
              >
                <Telegram sx={{ fontSize: 30 }} />
              </Link>
            </Box>
          </Grid>
          {/* -------------------- TECNOLOGIAS -------------------- */}
          <Grid>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#9A8C98" }}
            >
              Tecnologías
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              🌀 React + Vite 🎨 Material UI + Stitch ⚙️ Node.js + Express ☁️
              API REST con MongoDB
            </Typography>
          </Grid>
        </Grid>

        {/* -------------------- LINEA SEPARADORA -------------------- */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            mt: 6,
            pt: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "gray" }}>
            © {new Date().getFullYear()} Hollow Knight API — Desarrollado por
            Maikol Campos Rodríguez
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
