import * as React from "react";
import { Button, IconButton, Typography, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Icon from "@mdi/react";
import {
  mdiDeleteAlertOutline,
  mdiEyeOutline,
  mdiFileEditOutline,
  mdiWhatsapp,
} from "@mdi/js";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import api from "../api/api";

export default function ListComponent() {
  const router = useRouter();
  const [rows, setRows] = React.useState<any[]>([]);
  const [filteredRows, setFilteredRows] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  function remove(id) {
    Swal.fire({
      title: "Tem certeza que deseja remover o registro?",
      showCancelButton: true,
      confirmButtonText: "Sim",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`/contacts/${id}`)
          .then(() => {
            Swal.fire({
              title: "Bom trabalho!",
              text: "Registro removido com sucesso!",
              icon: "success",
            }).then(() => fetchData());
          })
          .catch(() => {
            Swal.fire({
              title: "Oh, não!",
              text: "Falha ao remover!",
              icon: "error",
            });
          });
      }
    });
  }

  const columns: GridColDef[] = [
    {
      field: "photo",
      headerName: "Avatar",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const img = params.row.photo ? params.row.photo : "/noPhoto.jpg";
        return (
          <Box sx={{ display: "flex", height: "3rem" }}>
            <Box
              component="img"
              src={img}
              alt="Pré-visualização da Foto"
              sx={{
                width: 35,
                height: 35,
                mt: 2,
                margin: "auto",
                borderRadius: 999,
                objectFit: "cover",
                objectPosition: "50% 50%",
              }}
            />
          </Box>
        );
      },
    },
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "cpf", headerName: "CPF", flex: 1 },
    { field: "email", headerName: "E-mail", flex: 1 },
    { field: "phone", headerName: "Contato", flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box display="flex" justifyContent="space-evenly">
            <IconButton
              onClick={() =>
                window.open(
                  `https://web.whatsapp.com/send?phone=55${params.row.phone.replace(
                    /[\s\(\)-]/g,
                    ""
                  )}`,
                  "_blank"
                )
              }
            >
              <Icon style={{ color: "green" }} path={mdiWhatsapp} size={1} />
            </IconButton>
            <IconButton onClick={() => router.push(`view/${params.row.id}`)}>
              <Icon style={{ color: "orange" }} path={mdiEyeOutline} size={1} />
            </IconButton>
            <IconButton onClick={() => router.push(`update/${params.row.id}`)}>
              <Icon
                style={{ color: "#1976D2" }}
                path={mdiFileEditOutline}
                size={1}
              />
            </IconButton>
            <IconButton onClick={() => remove(params.row.id)}>
              <Icon
                style={{ color: "red" }}
                path={mdiDeleteAlertOutline}
                size={1}
              />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const fetchData = React.useCallback(async () => {
    try {
      const response = await api.get("/contacts");
      const sortedData = response.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setRows(sortedData);
      setFilteredRows(sortedData);
    } catch (err) {
      Swal.fire({
        title: "Oh, não!",
        text: "Falha ao buscar registros!",
        icon: "error",
      });
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setFilteredRows(
      rows.filter((row) => row.name.toLowerCase().includes(value.toLowerCase()))
    );
  };

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <TextField
        label="Buscar por nome"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Box sx={{ height: 400, width: "100%" }}>
        {filteredRows.length === 0 ? (
          <Typography mt={8} variant="h6" align="center" color="textSecondary">
            Nenhum registro encontrado
          </Typography>
        ) : (
          <Box sx={{ backgroundColor: "#FFF" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              getRowId={(row) => row.guid}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
          </Box>
        )}
      </Box>
      <Box mt={5} textAlign="center">
        <Button href="register" variant="contained">
          Adicionar
        </Button>
      </Box>
    </Box>
  );
}
