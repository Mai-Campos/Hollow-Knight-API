import {
  Container,
  Typography,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";
import characterImage from "../assets/characters.webp";
import abilitieImage from "../assets/abilities.webp";
import regionImage from "../assets/regions.webp";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Box
        component="section"
        sx={{
          backgroundColor: "#000000",
          width: "100%",
          minHeight: "40vh",

          py: 5,
          mt: 2,
        }}
      >
        <Container>
          <Typography
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontSize: {
                xs: "1.7rem",
                sm: "3rem",
                md: "3.5rem",
                lg: "5rem",
              },
              fontWeight: "700",
              lineHeight: "1.1",
              textAlign: "center",
              color: "white",
              letterSpacing: "0.1em",
              textShadow: "0 4px 10px rgba(0,0,0,0.5)",
            }}
          >
            EXPLORA LAS PROFUNDIDADES DE HALLOWNEST
          </Typography>
          <Typography
            variant="inherit"
            component="p"
            align="center"
            gutterBottom
            sx={{ fontStyle: "italic" }}
          >
            Bienvenido a la API no oficial de Hollow Knight, tu puerta de
            entrada a un vasto mundo de datos sobre personajes y habilidades
            más. Sumérgete en la rica historia y descubre los secretos ocultos
            de este universo fascinante.
          </Typography>
        </Container>
      </Box>

      <Box component="section">
        <Container>
          <Typography
            component="h2"
            gutterBottom
            align="center"
            sx={{
              mt: 2,
              fontWeight: 700,
              fontSize: {
                xs: "1.25rem",
                sm: "1.5rem",
                md: "2rem",
                lg: "2.5rem",
              },
              lineHeight: 1,
            }}
          >
            UN MUNDO SUBTERRÁNEO
          </Typography>
          <Typography
            component="p"
            align="center"
            sx={{
              mt: 6,
              fontSize: "1.125rem",
              lineHeight: 1.625,
            }}
          >
            Hollow Knight es una épica aventura de acción en 2D. Explora
            cavernas sinuosas, ciudades antiguas y páramos mortales. Lucha
            contra criaturas corruptas, hazte amigo de bichos extraños y
            resuelve antiguos misterios en el corazón del reino.
          </Typography>
          <Typography
            align="center"
            component="p"
            gutterBottom
            sx={{ mt: 4, color: "gray", fontStyle: "italic" }}
          >
            Esta plataforma utiliza una API creada por fans para ofrecerte la
            información más precisa y detallada sobre el universo de Hollow
            Knight. Todos los datos provienen de la comunidad y del propio juego
            desarrollado por Team Cherry.
          </Typography>
        </Container>
      </Box>

      <Box component="section" sx={{ mt: 5, mb: 5 }}>
        <Container
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
            justifyItems: "center",
            mt: 4,
          }}
        >
          {/*----------------------------- CARD 1 ---------------------------------------------------------------------- */}
          <Card
            sx={{
              maxWidth: 345,
              height: 480,
              display: "block",
              borderRadius: "1rem",
              overflow: "hidden",
              border: "1px solid rgba(31, 41, 55, 0.8)",
              backgroundColor: "#111121",
              boxShadow: "0 10px 15px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 10px 25px rgba(59,130,246,0.2)",
                transform: "translateY(-0.5rem)",
                borderColor: "rgba(59,130,246,0.5)",
              },
            }}
          >
            <CardActionArea onClick={() => navigate("/characters")}>
              <CardMedia
                component="img"
                image={characterImage}
                alt="imagen del personaje principal de hollow knight"
              />
              <CardContent sx={{ background: " #111121", padding: 2 }}>
                <Typography
                  component="h5"
                  gutterBottom
                  sx={{ fontSize: {}, color: "#9A8C98" }}
                >
                  Characters
                </Typography>
                <Typography variant="body2" sx={{ color: "#C3C3C3" }}>
                  Conoce a los habitantes de Hallownest, desde el estoico
                  Caballero hasta la enigmática Hornet. Descubre sus historias y
                  su papel en el destino del reino.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          {/*----------------------------- CARD 2 ---------------------------------------------------------------------- */}

          <Card
            sx={{
              maxWidth: 345,
              height: 480,
              display: "block",
              borderRadius: "1rem",
              overflow: "hidden",
              border: "1px solid rgba(31, 41, 55, 0.8)",
              backgroundColor: "#111121",
              boxShadow: "0 10px 15px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 10px 25px rgba(59,130,246,0.2)",
                transform: "translateY(-0.5rem)",
                borderColor: "rgba(59,130,246,0.5)",
              },
            }}
          >
            <CardActionArea onClick={() => navigate("/regions")}>
              <CardMedia
                component="img"
                image={regionImage}
                alt="imagen del personaje principal de hollow knight"
              />
              <CardContent sx={{ background: " #111121" }}>
                <Typography
                  component="h5"
                  gutterBottom
                  sx={{ fontSize: {}, color: "#9A8C98" }}
                >
                  Regions
                </Typography>
                <Typography variant="body2" sx={{ color: "#C3C3C3" }}>
                  Desde el exuberante Sendero Verde hasta la lúgubre Ciudad de
                  Lágrimas, explora los diversos y hermosos paisajes de un reino
                  caído.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          {/*----------------------------- CARD 3 ---------------------------------------------------------------------- */}

          <Card
            sx={{
              maxWidth: 345,
              height: 480,
              display: "block",
              borderRadius: "1rem",
              overflow: "hidden",
              border: "1px solid rgba(31, 41, 55, 0.8)",
              backgroundColor: "#111121",
              boxShadow: "0 10px 15px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 10px 25px rgba(59,130,246,0.2)",
                transform: "translateY(-0.5rem)",
                borderColor: "rgba(59,130,246,0.5)",
              },
            }}
          >
            <CardActionArea onClick={() => navigate("/abilities")}>
              <CardMedia
                component="img"
                image={abilitieImage}
                alt="imagen del personaje principal de hollow knight"
              />
              <CardContent sx={{ background: " #111121" }}>
                <Typography
                  component="h5"
                  gutterBottom
                  sx={{ fontSize: {}, color: "#9A8C98" }}
                >
                  Abilities
                </Typography>
                <Typography variant="body2" sx={{ color: "#C3C3C3" }}>
                  Domina las artes del aguijón y el alma. Aprende sobre las
                  poderosas habilidades y hechizos que te ayudarán en tu
                  peligroso viaje.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Container>
      </Box>
    </>
  );
}

export default Home;
