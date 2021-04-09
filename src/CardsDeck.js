import React, { useState, useRef, useEffect } from "react";
import Card from "./Card";
import axios from "axios";

const BASE_URL = "https://deckofcardsapi.com/api/deck";

function CardsDeck() {
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState({});
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(function () {
    async function getNewDeck() {
      let deck = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`);
      setDeck(deck.data);
    }
    getNewDeck();
  }, []);

  async function pullCard() {
    if(deck.remaining > 0) {
      let card = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/?count=1`);
      setCards([...cards, card.data.cards[0]]);
      setDeck({...deck, remaining:card.data.remaining})
    }
  }

  useEffect(function(){
    async function shuffleDeck(){
      setCards([]);
      console.log("In shuffleDeck and isShuffling:", isShuffling);
      let shuffledDeck = await axios.get(`${BASE_URL}/${deck.deck_id}/shuffle`);
      setDeck(shuffledDeck.data);
      setIsShuffling(false);
    }

    if(isShuffling){
      shuffleDeck();
    }

  }, [isShuffling, deck.deck_id]);

  function toggleShuffle(){
    setIsShuffling(true);
  }

  console.log(deck);

  return (
    <div>
      {deck.remaining === 0 ? <div>No cards remaining!</div> : <button onClick={pullCard}>Gimme a card!</button>}
      <div>
        {cards.map(card => <Card key={card.code} card={card}/>)}
      </div>
      {isShuffling ?  <button disabled>Shuffle</button> : <button onClick={toggleShuffle}>Shuffle</button>}
    </div>
  );
}

export default CardsDeck;
