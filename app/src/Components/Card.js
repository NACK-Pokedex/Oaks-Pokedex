import React from 'react';
import ReactDOM from 'react-dom/client';



const Card = (props) => {
  return (
    <div>
      <h1 className="header-pokemon-name">{props.name}</h1>
      <h2 className="header-hp">{props.hp}</h2>
      <div className="image-holder">
        <img src={props.img} id="image" height="150px" width ="150px"/>
      </div>
      <div className="copyright"><strong>Illus. Mitsuhiro Arita</strong> ©1995, 96, 98 Nintendo Creatures, GAMEFREAK ©1999 Wizards. <strong>58/102 ●</strong></div>
    </div>
  )
};

export default Card;

