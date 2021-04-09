import React, { useState, useRef, useEffect } from "react";
import Card from "./Card";
import axios from "axios";

const BASE_URL = "https://deckofcardsapi.com/api/deck";

function CardsDeck() {
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState();

  useEffect(function () {
    async function getNewDeck() {
      let deck = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`);
      setDeck(deck.data);
    }
    getNewDeck();
  }, []);

  async function pullCard() {
    let card = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/?count=1`);
    setCards([...cards, card.data.cards[0]]);
  }
  console.log(deck);
  console.log(cards);
  return (
    <div>
      <button onClick={pullCard}>Gimme a card!</button>
    </div>
  );
}

export default CardsDeck;
