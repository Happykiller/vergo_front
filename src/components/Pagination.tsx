import React from 'react';
import { Box, Pagination, Typography } from '@mui/material';

interface PaginationProps {
  totalItems: number;    // Nombre total d'éléments
  limit: number;         // Nombre d'éléments par page
  onPageChange: (offset: number, limit: number) => void;  // Fonction de rappel pour envoyer offset et limit au parent
}

const PaginationComponent: React.FC<PaginationProps> = ({ totalItems, limit, onPageChange }) => {
  const [currentPage, setCurrentPage] = React.useState(1);  // Page courante

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(totalItems / limit);

  // Gérer le changement de page
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);

    // Calcul de l'offset à partir de la nouvelle page
    const offset = (newPage - 1) * limit;

    // Appel de la fonction de rappel pour transmettre l'offset et le limit
    onPageChange(offset, limit);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
      {/* Texte pour afficher la page actuelle */}
      <Typography variant="body2" color="textSecondary">
        Page {currentPage} sur {totalPages}
      </Typography>

      {/* Composant Pagination de MUI */}
      <Pagination
        count={totalPages}   // Nombre total de pages
        page={currentPage}    // Page actuelle
        onChange={handlePageChange}  // Fonction appelée lors d'un changement de page
        color="primary"
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default PaginationComponent;
