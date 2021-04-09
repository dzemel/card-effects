import React, { useState, useRef, useEffect } from "react";
import Card from "./Card";
import axios from "axios";

const BASE_URL = "https://deckofcardsapi.com/api/deck";

function CardsDeck() {
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState({});
  const [isShuffling, setIsShuffling] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const timerId = useRef();

  useEffect(function () {
    async function getNewDeck() {
      let deck = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`);
      setDeck(deck.data);
    }
    getNewDeck();
  }, []);

  useEffect(
    function () {
      async function pullCard() {
        if (deck.remaining > 0) {
          let card = await axios.get(
            `${BASE_URL}/${deck.deck_id}/draw/?count=1`
          );
          console.log("card", card);
          console.log("deck remaining", deck.remaining);
          setCards((cards) => [...cards, card.data.cards[0]]);
          setDeck((deck) => ({ ...deck, remaining: card.data.remaining }));
        } else {
          console.log("are we here?");
          setIsDrawing(false);
        }
      }
      async function drawEverySecond() {
        console.log("EFFECT RAN!");
        if (isDrawing) {
          pullCard();
        }
      }
      timerId.current = setInterval(() => {
        drawEverySecond();
        if (!isDrawing) {
          clearInterval(timerId.current);
        }
      }, 1000);
      return function cleanUpClearTimer() {
        console.log("Unmount ID", timerId.current);
        clearInterval(timerId.current);
      };
    },
    [timerId, isDrawing, deck]
  );

  useEffect(
    function () {
      async function shuffleDeck() {
        setCards([]);
        console.log("In shuffleDeck and isShuffling:", isShuffling);
        let shuffledDeck = await axios.get(
          `${BASE_URL}/${deck.deck_id}/shuffle`
        );
        setDeck(shuffledDeck.data);
        setIsShuffling(false);
      }

      if (isShuffling) {
        shuffleDeck();
      }
    },
    [isShuffling, deck.deck_id]
  );

  function toggleShuffle() {
    setIsShuffling(true);
  }

  function toggleDraw() {
    setIsDrawing((oldState) => !oldState);
  }

  return (
    <div>
      {deck.remaining === 0 ? (
        <div>No cards remaining!</div>
      ) : (
        <button onClick={toggleDraw}>Gimme a card!</button>
      )}
      <div>
        {cards.map((card) => {
          return <Card key={card.code} card={card} />;
        })}
      </div>
      <button onClick={toggleShuffle} disabled={isShuffling}>
        Shuffle
      </button>
    </div>
  );
}

export default CardsDeck;
