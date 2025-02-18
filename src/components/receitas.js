import axios from "axios";
import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, IconButton, Stack, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import ReactPaginate from 'react-paginate';
import RefreshIcon from '@mui/icons-material/Refresh'; 
import Footer from "./footer";

const fetchRandomDrinks = async () => {
    try {
        const requests = Array.from({ length: 12 }).map(() =>
            axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        );
        const responses = await Promise.all(requests);
        const drinks = [];

        for (const response of responses) {
            const data = response.data;
            const drink = data.drinks?.[0];
            if (drink) {
                drinks.push({
                    id: drink.idDrink,
                    name: drink.strDrink,
                    image: drink.strDrinkThumb,
                });
            }
        }
        return drinks;
    } catch (error) {
        console.error('Erro ao buscar drinks:', error);
        return [];
    }
};

const fetchDrinkDetails = async (id) => {
    try {
        const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = response.data;
        return data.drinks?.[0];
    } catch (error) {
        console.error('Erro ao buscar detalhes do drink:', error);
        return null;
    }
};

export default function Receitas() {
    const [drinks, setDrinks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const ITEMS_PER_PAGE = 9;

    const refreshDrinks = async () => {
        setLoading(true);
        const fetchedDrinks = await fetchRandomDrinks();
        setDrinks(fetchedDrinks);
        setLoading(false);
    };

    useEffect(() => {
        refreshDrinks();
    }, []);

    const lstDrinks = useMemo(() => {
        const startIndex = currentPage * ITEMS_PER_PAGE;
        return drinks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, drinks]);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleCardClick = async (id) => {
        setLoading(true);
        const details = await fetchDrinkDetails(id);
        setSelectedDrink(details);
        setOpen(true);
        setLoading(false);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDrink(null);
    };

    return (
        <Box sx={{ padding: 10 }}>
            <Box display="flex" justifyContent="center" mb={5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h5" component="span">
                        Não encontrou o que procurava? Clique no ícone para novas sugestões
                    </Typography>
                    <IconButton color="primary" onClick={refreshDrinks}>
                        <RefreshIcon />
                    </IconButton>
                </Stack>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {lstDrinks.map((drink) => (
                        <Grid item xs={12} sm={6} md={4} key={drink.id}>
                            <Card sx={{ cursor: 'pointer' }} onClick={() => handleCardClick(drink.id)}>
                                <Box sx={{ position: 'relative', height: 300, backgroundSize: 'cover', backgroundImage: `url(${drink.image})` }} />
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {drink.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Próximo"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={Math.ceil(drinks.length / ITEMS_PER_PAGE)}
                    previousLabel="Anterior"
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    nextClassName="page-item"
                    previousLinkClassName="page-link"
                    nextLinkClassName="page-link"
                />
            </Box>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{selectedDrink?.strDrink}</DialogTitle>
                <DialogContent>
                    {selectedDrink ? (
                        <>
                            <Box sx={{ textAlign: 'center' }}>
                                <img src={selectedDrink.strDrinkThumb} alt={selectedDrink.strDrink} style={{ width: '100%', borderRadius: '8px' }} />
                            </Box>
                            <Typography variant="body1" sx={{ marginTop: 2 }}>
                                <strong>Instruções:</strong> <br /><br />{selectedDrink.strInstructions}
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 2 }}>
                                <strong>Ingredientes:</strong>
                                <ul>
                                    {Object.keys(selectedDrink)
                                        .filter((key) => key.includes('strIngredient') && selectedDrink[key])
                                        .map((key) => (
                                            <li key={key}>{selectedDrink[key]}</li>
                                        ))}
                                </ul>
                            </Typography>
                        </>
                    ) : (
                        <CircularProgress />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
            <Footer />
        </Box>
    );
}