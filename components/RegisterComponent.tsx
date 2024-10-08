import { Box, Button, TextField, Typography } from "@mui/material";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import InputMask from "react-input-mask";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import api from "../api/api";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  cpf: z
    .string()
    .min(14, "O CPF deve ter o formato 999.999.999-99")
    .max(14, "O CPF deve ter o formato 999.999.999-99"),
  email: z.string().email("Insira um e-mail válido"),
  phone: z
    .string()
    .min(14, "O telefone deve ter no formato (99) 99999-9999")
    .max(15, "O telefone deve ter no formato (99) 99999-9999"),
  photo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema> & { guid?: string };

interface RegisterComponentProps {
  id?: string;
  readOnly?: boolean;
}

export default function RegisterComponent({
  id,
  readOnly,
}: RegisterComponentProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const generateGuid = () => uuidv4().replace(/-/g, "");

  type Payload = FormData & { guid: string };

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get(`/contacts/${id}`);
      console.log("Response:", response);
      reset(response.data);
      if (response.data.photo) {
        setPhotoPreview(response.data.photo);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  }, [id, reset]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [fetchData]);

  const onSubmit = (data: FormData) => {
    const guid = generateGuid();
    const payload: Payload = { ...data, guid };

    if (id) {
      api
        .patch(`/contacts/${id}`, payload)
        .then(() => {
          Swal.fire({
            title: "Bom trabalho!",
            text: "Cadastro atualizado com sucesso!",
            icon: "success",
          }).then(() => router.back());
        })
        .catch(() => {
          Swal.fire({
            title: "Oh,não!",
            text: "Falha ao editar!",
            icon: "error",
          });
        });
    } else {
      api
        .post("/contacts", payload)
        .then(() => {
          Swal.fire({
            title: "Bom trabalho!",
            text: "Cadastro realizado com sucesso!",
            icon: "success",
          }).then(() => router.back());
        })
        .catch(() => {
          Swal.fire({
            title: "Oh,não!",
            text: "Falha ao cadastrar!",
            icon: "error",
          });
        });
    }
  };

  const removePhoto = () => {
    setValue("photo", "");
    setPhotoPreview(null);
    watch("photo");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setValue("photo", base64);
      setPhotoPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const textStyle = {
    mt: 1,
    mb: 1,
    fontSize: 16,
    fontWeight: 500,
    border: "1px solid #CCC",
    padding: "1rem",
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: "400px",
        margin: "auto",
        mt: 5,
      }}
    >
      {!readOnly && (
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: "#1976D2",
            fontSize: "2rem",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Formulário de Cadastro
        </Typography>
      )}

      {!readOnly && (
        <Controller
          name="photo"
          control={control}
          render={({ field }) => (
            <>
              <Button variant="contained" component="label">
                Carregar Foto
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </>
          )}
        />
      )}
      <Box
        component="img"
        src={photoPreview ? photoPreview : "/noPhoto.jpg"}
        alt="Pré-visualização da Foto"
        sx={{
          width: 100,
          height: 100,
          mt: 2,
          margin: "auto",
          borderRadius: 999,
          objectFit: "cover",
          objectPosition: "50% 50%",
        }}
      />
      {watch("photo") && !readOnly && (
        <Button
          onClick={() => removePhoto()}
          variant="outlined"
          component="label"
        >
          Remover foto
        </Button>
      )}

      {!readOnly ? (
        <TextField
          label="Nome"
          InputLabelProps={{ shrink: true }}
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          variant="outlined"
        />
      ) : (
        <Typography sx={textStyle}>{watch("name")}</Typography>
      )}

      {!readOnly ? (
        <Controller
          name="cpf"
          control={control}
          render={({ field }) => (
            <InputMask
              mask="999.999.999-99"
              value={field.value}
              onChange={field.onChange}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  label="CPF"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.cpf}
                  helperText={errors.cpf?.message}
                  variant="outlined"
                />
              )}
            </InputMask>
          )}
        />
      ) : (
        <Typography sx={textStyle}>{watch("cpf")}</Typography>
      )}

      {!readOnly ? (
        <TextField
          label="E-mail"
          {...register("email")}
          InputLabelProps={{ shrink: true }}
          error={!!errors.email}
          helperText={errors.email?.message}
          variant="outlined"
        />
      ) : (
        <Typography sx={textStyle}>{watch("email")}</Typography>
      )}

      {!readOnly ? (
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <InputMask
              mask="(99) 99999-9999"
              value={field.value}
              onChange={field.onChange}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  label="Telefone"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  variant="outlined"
                />
              )}
            </InputMask>
          )}
        />
      ) : (
        <Typography sx={textStyle}>{watch("phone")}</Typography>
      )}

      {!readOnly && (
        <Button type="submit" variant="contained" color="primary">
          {id ? "Atualizar" : "Cadastrar"}
        </Button>
      )}

      <Button onClick={() => router.back()} variant="outlined" color="primary">
        Voltar
      </Button>
    </Box>
  );
}
