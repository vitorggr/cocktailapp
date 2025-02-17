import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Container,
  Typography,
  Snackbar,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

export default function Contato() {
  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [cidades, setCidades] = useState([]);
  const [estados, setEstados] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState("");

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axios.get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );
        setEstados(response.data);
      } catch (error) {
        console.error("Erro ao carregar estados:", error)
      }
    }

    fetchEstados();
  }, []);

  useEffect(() => {
    const fetchCidades = async () => {
      if (selectedEstado) {
        try {
          const response = await axios.get(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedEstado}/municipios`
          );
          setCidades(response.data);
        } catch (error) {
          console.error("Erro ao carregar cidades:", error);
        }
      }
    };
    fetchCidades();
  }, [selectedEstado]);

  useEffect(() => {
    setSelectedEstado(watch("estado"));
  }, [watch("estado")]);

  const onSubmit = async (data) => {
    try {
      setMessage("Formulário enviado com sucesso!");
      console.info(data);
      setOpen(true);
      reset();
    } catch (error) {
      setMessage("Erro ao enviar o formulário. Tente novamente.");
      console.error(error);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fale conosco
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message={message}
          action={
            <Button color="inherit" onClick={handleClose}>
              Fechar
            </Button>
          }
        />
        <Controller
          name="titulo"
          control={control}
          defaultValue=""
          rules={{ required: "O título é obrigatório" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Título"
              variant="outlined"
              margin="normal"
              error={!!errors.titulo}
              helperText={errors.titulo ? errors.titulo.message : ""}
            />
          )}
        />
        <Controller
          name="nome"
          control={control}
          defaultValue=""
          rules={{ required: "O nome é obrigatório" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Nome"
              variant="outlined"
              margin="normal"
              error={!!errors.nome}
              helperText={errors.nome ? errors.nome.message : ""}
            />
          )}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Estado</InputLabel>
          <Controller
            name="estado"
            control={control}
            defaultValue=""
            rules={{ required: "Estado é obrigatório" }}
            render={({ field }) => (
              <Select {...field} error={!!errors.estado}>
                {estados.map((estado) => (
                  <MenuItem key={estado.id} value={estado.sigla}>
                    {estado.sigla} - {estado.nome}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        {selectedEstado && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Cidade</InputLabel>
            <Controller
              name="cidade"
              control={control}
              defaultValue=""
              rules={{ required: "Cidade é obrigatória" }}
              render={({ field }) => (
                <Select {...field} error={!!errors.cidade}>
                  {cidades.map((municipio) => (
                    <MenuItem key={municipio.id} value={municipio.nome}>
                      {municipio.nome}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        )}
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: "O e-mail é obrigatório",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "E-mail inválido",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="E-mail"
              variant="outlined"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          )}
        />
        <Controller
          name="descricao"
          control={control}
          defaultValue=""
          rules={{ required: "A descrição é obrigatória" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Descrição"
              multiline
              rows={4}
              variant="outlined"
              margin="normal"
              error={!!errors.descricao}
              helperText={errors.descricao ? errors.descricao.message : ""}
            />
          )}
        />
        <Box sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ width: "100%" }}
          >
            Enviar
          </Button>
        </Box>
      </form>
    </Container>
  );
}
