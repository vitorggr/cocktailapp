import axios from "axios";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Grid, Card, CardContent, Typography, CircularProgress, 
  IconButton, Stack, Dialog, DialogActions, DialogContent, 
  DialogTitle, Button 
} from '@mui/material';
import ReactPaginate from 'react-paginate';
import RefreshIcon from '@mui/icons-material/Refresh';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getAuth } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../components/auth/firebase'; 
import Footer from "../components/footer";

const fetchRandomDrinks = async (count = 12) => {
    try {
        const requests = Array.from({ length: count }).map(() =>
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

const fetchSingleDrink = async () => {
    try {
        const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const drink = response.data.drinks?.[0];
        return drink ? {
            id: drink.idDrink,
            name: drink.strDrink,
            image: drink.strDrinkThumb
        } : null;
    } catch (error) {
        console.error('Erro ao buscar drink:', error);
        return null;
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
    const [favorites, setFavorites] = useState([]);
    const [replacingDrink, setReplacingDrink] = useState(null);
    const auth = getAuth();
    const ITEMS_PER_PAGE = 9;

    const refreshDrinks = async () => {
        setLoading(true);
        try {
            const fetchedDrinks = await fetchRandomDrinks();
            setDrinks(fetchedDrinks);
        } catch (error) {
            console.error('Erro ao atualizar drinks:', error);
        } finally {
            setLoading(false);
        }
    };

    const ensureMinimumDrinks = async () => {
        if (drinks.length < 12) {
            setLoading(true);
            try {
                const additionalDrinks = await fetchRandomDrinks(12 - drinks.length);
                setDrinks(prev => [...prev, ...additionalDrinks]);
            } catch (error) {
                console.error('Erro ao buscar drinks adicionais:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        refreshDrinks();
        loadFavorites();
    }, []);

    useEffect(() => {
        ensureMinimumDrinks();
    }, [drinks.length]);

    const loadFavorites = async () => {
        if (auth.currentUser) {
            const q = query(collection(db, 'favorites'), where('userId', '==', auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            const favs = querySnapshot.docs.map(doc => doc.data().drinkId);
            setFavorites(favs);
        }
    };

    const toggleFavorite = async (drinkId) => {
        if (!auth.currentUser || loading) return;
        
        const favRef = doc(db, 'favorites', `${auth.currentUser.uid}_${drinkId}`);
        
        if (favorites.includes(drinkId)) {
            // Remover dos favoritos
            await deleteDoc(favRef);
            setFavorites(favorites.filter(id => id !== drinkId));
        } else {
            // Adicionar aos favoritos
            setReplacingDrink(drinkId);
            setLoading(true);
            
            try {
                // 1. Adiciona aos favoritos no Firebase
                await setDoc(favRef, {
                    userId: auth.currentUser.uid,
                    drinkId,
                    dateTime: new Date()
                });
                setFavorites([...favorites, drinkId]);
                
                // 2. Remove o drink favoritado da lista local
                setDrinks(prevDrinks => prevDrinks.filter(drink => drink.id !== drinkId));
                
                // 3. Busca um novo drink aleatório
                const newDrink = await fetchSingleDrink();
                if (newDrink) {
                    // 4. Adiciona o novo drink à lista
                    setDrinks(prevDrinks => [...prevDrinks, newDrink]);
                }
            } catch (error) {
                console.error('Erro ao favoritar drink:', error);
            } finally {
                setLoading(false);
                setReplacingDrink(null);
            }
        }
    };

    const lstDrinks = useMemo(() => {
        const startIndex = currentPage * ITEMS_PER_PAGE;
        return drinks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, drinks]);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleCardClick = async (id) => {
        if (loading) return;
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
                    <IconButton 
                        color="primary" 
                        onClick={refreshDrinks}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
                    </IconButton>
                </Stack>
            </Box>

            {loading && !replacingDrink ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {lstDrinks.map((drink) => (
                        <Grid item xs={12} sm={6} md={4} key={drink.id}>
                            <Card>
                                <Box 
                                    sx={{ 
                                        height: 300, 
                                        backgroundSize: 'cover', 
                                        backgroundImage: `url(${drink.image})`,
                                        cursor: 'pointer',
                                        opacity: replacingDrink === drink.id ? 0.7 : 1,
                                        transition: 'opacity 0.3s'
                                    }} 
                                    onClick={() => handleCardClick(drink.id)} 
                                />
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" component="div">
                                        {drink.name}
                                    </Typography>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(drink.id);
                                        }}
                                        sx={{ ml: 1 }}
                                        disabled={loading}
                                    >
                                        {replacingDrink === drink.id ? (
                                            <CircularProgress size={24} />
                                        ) : favorites.includes(drink.id) ? (
                                            <FavoriteIcon color="error" />
                                        ) : (
                                            <FavoriteBorderIcon />
                                        )}
                                    </IconButton>
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
                    disabledClassName="disabled"
                />
            </Box>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    {selectedDrink?.strDrink}
                    <IconButton
                        sx={{ float: 'right' }}
                        onClick={() => toggleFavorite(selectedDrink?.idDrink)}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : selectedDrink && favorites.includes(selectedDrink.idDrink) ? (
                            <FavoriteIcon color="error" />
                        ) : (
                            <FavoriteBorderIcon />
                        )}
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedDrink ? (
                        <>
                            <Typography variant="caption" sx={{ marginTop: 2 }}>
                                * Para uma melhor compreensão da receita, considere utilizar seu tradutor de preferência<br/>
                            </Typography>
                            <Box sx={{ textAlign: 'center' }}>
                                <img 
                                    src={selectedDrink.strDrinkThumb} 
                                    alt={selectedDrink.strDrink} 
                                    style={{ 
                                        width: '100%', 
                                        borderRadius: '8px',
                                        maxHeight: '300px',
                                        objectFit: 'cover'
                                    }} 
                                />
                            </Box>
                            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                                Ingredientes:
                            </Typography>
                            <ul>
                                {Object.keys(selectedDrink)
                                    .filter((key) => key.includes('strIngredient') && selectedDrink[key])
                                    .map((key, index) => (
                                        <li key={index}>
                                            {selectedDrink[key]} - {selectedDrink[`strMeasure${key.slice(13)}`] || 'A gosto'}
                                        </li>
                                    ))}
                            </ul>
                            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                                Instruções:
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                {selectedDrink.strInstructions}
                            </Typography>
                        </>
                    ) : (
                        <CircularProgress />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClose} 
                        color="primary"
                        disabled={loading}
                    >
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
            <Footer />
        </Box>
    );
}