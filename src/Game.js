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
        var squares = this.generateGrid(3,3);
        this.state = {
            width:3,
            height:3,
            formWidth:0, //text field for new game width
            formHeight:0, //and height
            squares: squares,
            maxColumnClues:2, //max number of clues per column
            maxRowClues:2, //max number of clues per row,
            topClues:this.generateTopClues(squares, 3, 3, 2),
            sideClues:this.generateSideClues(squares,3,3, 2)
        }
    }
    newGame(event){
        var squares = this.generateGrid(this.state.formWidth, this.state.formHeight);
        var maxColClues = this.maxCluesCounter(this.state.formHeight);
        var maxRowClues = this.maxCluesCounter(this.state.formWidth);
        this.setState({
            width: this.state.formWidth,
            height: this.state.formHeight,
            formWidth:0,
            formHeight:0,
            squares: squares,
            maxColumnClues: maxColClues,
            maxRowClues: maxRowClues,
            topClues: this.generateTopClues(squares, this.state.formWidth, this.state.formHeight, maxColClues),
            sideClues: this.generateSideClues(squares, this.state.formWidth, this.state.formHeight, maxRowClues)
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
            <ClueGrid width={this.state.width} height={this.state.maxColumnClues}
                gridPos="topGrid" clueVals={this.state.topClues} />
            <ClueGrid width={this.state.maxRowClues} height={this.state.height}
                gridPos="sideGrid" clueVals={this.state.sideClues} />
            <Gameboard width={this.state.width} height={this.state.height} 
                squares={this.state.squares} clickSquare={this.clickSquare}/>
        </div>
    }

    maxCluesCounter(size){ return Math.round(size/2); }
    generateTopClues(squares, gridWidth, gridHeight, cluesHeight){
        var squareGridSize = gridWidth * gridHeight;
        var cluesSize = gridWidth * cluesHeight;
        var clueGrid = Array(cluesSize).fill(null);
        for(var colNum = 0;colNum < gridWidth;colNum++){
            var colVals = [];
        //from input squares grid, create temp array of squares from single column
            for(var i = colNum;i<squareGridSize;i+=gridHeight){
                colVals.push(squares[i].filled);
            }
        //loop through column and push clue values to temp array
            var colClues = [];
            var counting = 0;
            for(var i=0;i<colVals.length;i++){
                var square = colVals[i];
                if(square == true){counting++;}
                if(square != true && counting > 0){colClues.push(counting); counting = 0;}
            }
            if(counting > 0){ colClues.push(counting);}
        //add temp array values to clueGrid
            var blankFillerCount = cluesHeight - colClues.length;
            for(var i = 0;i<colClues.length;i++){
                var clueCount = i + blankFillerCount;
                var clueGridPos = colNum + (gridWidth * clueCount);
                clueGrid[clueGridPos] = colClues[i];
            }
        }
        return clueGrid;
    }
    
    generateSideClues(squares, gridWidth, gridHeight, cluesWidth){
        var squareGridSize = gridWidth * gridHeight;
        var cluesSize = gridHeight * cluesWidth;
        var clueGrid = Array(cluesSize).fill(null);
        for(var rowNum = 0;rowNum < gridHeight;rowNum++){
            var rowClues = [];
            var counting = 0;
            var startPos = rowNum * gridWidth;
            for(var i = startPos;i<startPos + gridWidth;i++){
                var square = squares[i].filled;
                if(square == true){ counting++;}
                if(square != true && counting > 0){ rowClues.push(counting); counting = 0;}
            }
            if(counting > 0){ rowClues.push(counting);}
            var blankFillerCount = cluesWidth - rowClues.length;
            for(var i = 0;i<rowClues.length;i++){
                var clueCount = i + blankFillerCount;
                var clueGridPos = (rowNum * cluesWidth) + clueCount
                clueGrid[clueGridPos] = rowClues[i];
            }
        }
        return clueGrid;
    }

    generateGrid(width=3,height=3){
        var total = width * height;
        var squares = Array(total).fill(null);
        for(var i =0;i<total;i++){
            var filled = Math.round(Math.random()) == 1;
            squares[i] = this.createSquareData(i, filled);
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

/*
    Components for top and side clues
*/

const ClueGrid = function(props){
    var rows = [];
    for(var i=0;i<props.height;i++){
        var startClue = i * props.width;
        var endClue = startClue + props.width;
        rows.push(ClueRow({
            start:startClue,
            end: endClue,
            clueVals: props.clueVals
        }))
    }
    var clueClass = "clueGrid "+props.gridPos;
    return <div className={clueClass}>{rows}</div>
}

const ClueRow = function(props){
    var rowClues = [];
    for(var i=props.start;i<props.end;i++){
        rowClues.push(Clue({clueVal:props.clueVals[i]}));
    }
    return <div className="clueRow">{rowClues}</div>;
}

const Clue = function(props){
    return <span className="clue">{props.clueVal}</span>;
}

/*
    Components for gameboard and clickable squares
*/
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
                square:props.squares[i],
            clickSquare: props.clickSquare
        }));
    }
    return <div key={props.start} className="row">{rowSquares}</div>;
}

const Square = function(props){
    var visClass = props.square.selected ? "selected":"unselected";
    if(!props.square.selected && props.square.filled){visClass = "filled";}
    var classes = 'Square '+visClass;
    return <button key={props.id} className={classes}
            onClick={()=>props.clickSquare(props.id)}></button>;
}

export default Game;