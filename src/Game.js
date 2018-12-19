import React, {Component} from 'react';
import { runInThisContext } from 'vm';
import './Game.css';

class Game extends Component {
    constructor(props){
        super(props);
        this.state = {
            width:3,
            height:3
        }
    }
    componentDidMount(){
        this.generateGrid();
    }
    render(){
        return <div className="Game">
            <header className="Game-header">
                <h1>Picross Game</h1>
                <button>Start new game</button>
                <input type="text" value="width"></input>
                <input type="text" value="height"></input>
            </header>
            <Gameboard width={this.state.width} height={this.state.height}/>
        </div>
    }

    generateGrid(width=3,height=3){
        this.setState({
            width: width,
            height:height
        })
        var total = width * height;
        var squares = Array(width * height).fill(null);
        for(var i =0;i<total;i++){
            squares[i] = this.createSquareData(i);
        }
        return squares;
    }

    createSquareData(id, filled = false){
        return {
            id: id,
            selected: false,
            filled: filled
        }
    }
}

const Gameboard = function(props){
    var rows = [];
    for(var i=0;i<props.height;i++){
        rows.push(Row({
            start:i * props.width,
            end: (i*props.width)+props.width
        }))
    }
    return <div className="boardContainer">{rows}</div>;
}

const Row = function(props){
    var rowSquares = [];
    for(var i=props.start;i<props.end;i++){
        rowSquares.push(Square({id:i}));
    }
    return <div class="row">{rowSquares}</div>;
}



const Square = function(props){
    let visClass = props.isSelected ? "unselected":"selected";
    return <button id={props.id} className="Square ${visClass}"></button>;
}

export default Game;