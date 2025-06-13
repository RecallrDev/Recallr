// src/pages/CreateDeckPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateDeck from '../components/CreateDeck';

const CreateDeckPage: React.FC = () => {
  const navigate = useNavigate();

  const [deckName, setDeckName] = useState('');
  const [category, setCategory] = useState('Other');
  const [color, setColor] = useState('#3B82F6');

  const handleCreateSuccess = async () => {
    navigate('/decks');
  };

  return (
    <CreateDeck
      deckName={deckName}
      setDeckName={setDeckName}
      category={category}
      setCategory={setCategory}
      color={color}
      setColor={setColor}
      onCreateSuccess={handleCreateSuccess}
      onCancel={() => navigate('/decks')}
    />
  );
};

export default CreateDeckPage;
