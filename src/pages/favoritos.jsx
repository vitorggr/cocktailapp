import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Card, CardContent, Typography, CircularProgress, 
  IconButton, Stack, Dialog, DialogActions, DialogContent, 
  DialogTitle, Button 
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../components/auth/firebase';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Footer from "../components/footer";

export default function Favoritos() {
    const [favoriteDrinks, setFavoriteDrinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const [open, setOpen] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();

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

    const loadFavorites = async () => {
        if (!auth.currentUser) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const q = query(collection(db, 'favorites'), where('userId', '==', auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            
            const drinks = [];
            for (const docSnap of querySnapshot.docs) {
                const drinkId = docSnap.data().drinkId;
                const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`);
                if (response.data.drinks) {
                    drinks.push({
                        id: response.data.drinks[0].idDrink,
                        name: response.data.drinks[0].strDrink,
                        image: response.data.drinks[0].strDrinkThumb,
                    });
                }
            }
            setFavoriteDrinks(drinks);
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (drinkId) => {
        try {
            await deleteDoc(doc(db, 'favorites', `${auth.currentUser.uid}_${drinkId}`));
            setFavoriteDrinks(favoriteDrinks.filter(drink => drink.id !== drinkId));
        } catch (error) {
            console.error('Erro ao remover favorito:', error);
        }
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

    useEffect(() => {
        loadFavorites();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 10 }}>
            {favoriteDrinks.length === 0 ? (
                 <Box display="flex" justifyContent="center" mb={5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h5">
                        Você ainda não tem drinks favoritos. Volte à página de receitas para adicionar alguns!
                    </Typography>
                    <LocalBarIcon color="primary"/>
                    </Stack>
                </Box>
            ) : (
                <>
                    <Box display="flex" justifyContent="center" mb={5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="h5" component="span">
                                Seus Drinks Favoritos
                            </Typography>
                            <LocalBarIcon color="primary"/>
                        </Stack>
                    </Box>
                    <Grid container spacing={4}>
                        {favoriteDrinks.map((drink) => (
                            <Grid item xs={12} sm={6} md={4} key={drink.id}>
                                <Card>
                                    <Box 
                                        sx={{ 
                                            height: 300, 
                                            backgroundSize: 'cover', 
                                            backgroundImage: `url(${drink.image})`,
                                            cursor: 'pointer'
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
                                        >
                                            <FavoriteIcon color="error" />
                                        </IconButton>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    {selectedDrink?.strDrink}
                    <IconButton
                        sx={{ float: 'right' }}
                        onClick={() => {
                            toggleFavorite(selectedDrink?.idDrink);
                            handleClose();
                        }}
                    >
                        <FavoriteIcon color="error" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedDrink ? (
                        <>
                            <Typography variant="caption" sx={{ marginTop: 2 }}>
                                * Para uma melhor compreensão da receita, considere utilizar seu tradutor de preferência<br/>
                            </Typography>
                            <Box sx={{ textAlign: 'center' }}>
                                <img src={selectedDrink.strDrinkThumb} alt={selectedDrink.strDrink} style={{ width: '100%', borderRadius: '8px' }} />
                            </Box>
                            <Typography variant="body3" sx={{ marginTop: 2 }}>
                                <ul>
                                    {Object.keys(selectedDrink)
                                        .filter((key) => key.includes('strIngredient') && selectedDrink[key])
                                        .map((key) => (
                                            <li key={key}>{selectedDrink[key]}</li>
                                        ))}
                                </ul>
                            </Typography>
                            <Typography variant="body3" sx={{ marginTop: 2 }}>
                                {selectedDrink.strInstructions}
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