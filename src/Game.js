import React, {Component} from 'react';
import { runInThisContext } from 'vm';
import './Game.css';

class Game extends Component {
    constructor(props){
        super(props);
        this.newGame = this.newGame.bind(this);
        this.widthInput = this.widthInput.bind(this);
        this.heightInput = this.heightInput.bind(this);
        this.clickSquare = this.clickSquare.bind(this);
        this.state = {
            width:3,
            height:3,
            formWidth:0,
            formHeight:0,
            squares: this.generateGrid(3,3)
        }
    }
    componentDidMount(){
        var squares = this.generateGrid(this.state.width, this.state.height);
        this.setState({squares: squares});
    }
    newGame(event){
        var squares = this.generateGrid(this.state.formWidth, this.state.formHeight);
        this.setState({
            width: this.state.formWidth,
            height: this.state.formHeight,
            formWidth:0,
            formHeight:0,
            squares: squares
        })
    }
    widthInput(event){this.setState({formWidth:parseInt(event.target.value)})}
    heightInput(event){this.setState({formHeight:parseInt(event.target.value)})}
    clickSquare(i){
        var localState = this.state;
        for(var prop in this){
            console.log(prop);
        }
        var squares = this.state.squares.slice();
        squares[i].selected = !squares[i].selected;
        this.setState({squares: squares});
    }

    render(){
        return <div className="Game">
            <header className="Game-header">
                <h1>Picross Game</h1>
                
                <button onClick={this.newGame}>Start new game</button>
                <span>Width</span><input type="text" value={this.state.formWidth}
                    onChange={this.widthInput}></input>
                <span>Height</span><input type="text" value={this.state.formHeight}
                    onChange={this.heightInput}></input>
                
            </header>
            <Gameboard width={this.state.width} height={this.state.height} 
                squares={this.state.squares} clickSquare={this.clickSquare}/>
        </div>
    }

    generateGrid(width=3,height=3){
        var total = width * height;
        var squares = Array(total).fill(null);
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
        var startInt = i * props.width;
        var endInt = startInt + props.width;
        rows.push(Row({
            start: startInt,
            end: endInt,
            squares: props.squares,
            clickSquare: props.clickSquare
        }))
    }
    return <div className="boardContainer">{rows}</div>;
}

const Row = function(props){
    var rowSquares = [];
    for(var i=props.start;i<props.end;i++){
        rowSquares.push(Square({id:i, 
                isSelected:props.squares[i].selected,
            clickSquare: props.clickSquare
        }));
    }
    return <div key={props.start} className="row">{rowSquares}</div>;
}



const Square = function(props){
    var visClass = props.isSelected ? "selected":"unselected";
    var classes = 'Square '+visClass;
    return <button key={props.id} className={classes}
            onClick={()=>props.clickSquare(props.id)}></button>;
}

export default Game;