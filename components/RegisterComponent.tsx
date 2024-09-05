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
}

export default function RegisterComponent({ id }: RegisterComponentProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
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
      reset(response.data);
      if (response.data.photo) {
        setPhotoPreview(response.data.photo);
      }
    } catch (err) {
      Swal.fire({
        title: "Oh,não!",
        text: "Falha ao buscar registros!",
        icon: "error",
      });
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "400px",
        margin: "auto",
        mt: 5,
      }}
    >
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
            {photoPreview && (
              <Box
                component="img"
                src={photoPreview}
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
            )}
            {errors.photo && (
              <Typography color="error" variant="body2">
                {errors.photo.message}
              </Typography>
            )}
          </>
        )}
      />

      <TextField
        label="Nome"
        InputLabelProps={{ shrink: true }}
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        variant="outlined"
      />

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

      <TextField
        label="E-mail"
        {...register("email")}
        InputLabelProps={{ shrink: true }}
        error={!!errors.email}
        helperText={errors.email?.message}
        variant="outlined"
      />

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

      <Button type="submit" variant="contained" color="primary">
        {id ? "Atualizar" : "Cadastrar"}
      </Button>
      <Button onClick={() => router.back()} variant="outlined" color="primary">
        Voltar
      </Button>
    </Box>
  );
}
