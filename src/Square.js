import React, {Component} from 'react';
import './Square.css';

const Square = function(props){
    let visClass = props.isSelected ? "unselected":"selected";
    return <button className="Square ${visClass}"></button>;
}

export default Square;