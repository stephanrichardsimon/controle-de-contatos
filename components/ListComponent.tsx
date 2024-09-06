import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridOverlay } from "@mui/x-data-grid";
import { Button, IconButton, Typography } from "@mui/material";
import api from "../api/api";
import Swal from "sweetalert2";
import Icon from "@mdi/react";
import {
  mdiDeleteAlertOutline,
  mdiEyeOutline,
  mdiFileEditOutline,
  mdiWhatsapp,
} from "@mdi/js";
import { useRouter } from "next/router";

export default function ListComponent() {
  const router = useRouter();
  const [rows, setRows] = React.useState<any[]>([]);

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
              title: "Oh,não!",
              text: "Falha ao remover!",
              icon: "error",
            });
          });
      } else if (result.isDenied) {
        return;
      }
    });
  }

  const columns: GridColDef[] = [
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "cpf", headerName: "CPF", flex: 1 },
    { field: "email", headerName: "E-mail", flex: 1 },
    { field: "phone", headerName: "Contato", flex: 1 },
    {
      field: "photo",
      headerName: "Tem foto",
      flex: 1,
      renderCell: (params) => {
        return params.value ? "Sim" : "Não";
      },
    },
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
      setRows(response.data);
    } catch (err) {
      Swal.fire({
        title: "Oh,não!",
        text: "Falha ao buscar registros!",
        icon: "error",
      });
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Box sx={{ height: 400, width: "100%" }}>
        {rows.length === 0 ? (
          <Typography mt={8} variant="h6" align="center" color="textSecondary">
            Nenhum registro encontrado
          </Typography>
        ) : (
          <DataGrid
            rows={rows}
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
