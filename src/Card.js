import React from "react";


function Card({card}){;
    return (
        <span>
            <img src={card.image} alt={card.code}></img>
        </span>

    )
}


export default Card;