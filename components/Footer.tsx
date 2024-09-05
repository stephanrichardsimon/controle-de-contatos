import { Grid2, Typography, Link, Box } from "@mui/material";

export default function Footer() {
  return (
    <Grid2
      container
      sx={{
        width: "100%",
        height: "150px",
        backgroundColor: "#1976D2",
        color: "#fff",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        textAlign: "center",
      }}
    >
      <Typography variant="h6">Controle de Contatos</Typography>
      <Box sx={{ marginTop: 1 }}>
        <Typography variant="body2">
          Desenvolvido por Stephan Richard Simon
        </Typography>
        <Typography variant="body2">
          <Link href="mailto:stephansimon123@gmail.com" color="inherit">
            stephansimon123@gmail.com
          </Link>
        </Typography>
        <Typography variant="body2">
          <Link
            href="https://www.linkedin.com/in/stephan-richard-simon"
            color="inherit"
          >
            LinkedIn
          </Link>{" "}
          |
          <Link href="https://github.com/stephanrichard" color="inherit">
            GitHub
          </Link>
        </Typography>
      </Box>
    </Grid2>
  );
}
