const { start } = require('repl');

var boardSize;
var boardWidth;
var boardHeight;
var boardState = [];
var previousPlayer = null;
const players = [];
theMainFn();

async function theMainFn() {
    gameConfig(3, 2); // Has to be a square
    renderBoard(boardState, true, boardSize)
    gameLoop(players)
}

async function gameLoop(peoples) {
    var currentplayer = getPlayer(previousPlayer, peoples);
    previousPlayer = currentplayer;

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    qst()
    function qst() {
        readline.question(`Player ${currentplayer.symbol} to move: `, (result) => {
            readline.close()
            const move = result.toLowerCase()
            
            // check if it starts with a letter or is a number, not perfect but its still a buffer ig
            var mhm = move.substring(start).match(/[a-z]/i)
            if (!(move === "" || move === " ")) {
                if (mhm != null) {
                    boardState.forEach(element => {
                        if (element.name === move && element.state === null) {
                            element.state = currentplayer;
                        } else qst()
                    });
                    // check the name
                } else if (!isNaN(move)) {
                    boardState.forEach(element => {
                        if (element.index === move && element.state === null) {
                            element.state = currentplayer
                        } else qst()
                    });
                    // check the index
                }
            }
            renderBoard(boardState, true, boardSize)
            gameLoop(peoples)
        })
    }

    function getPlayer(previous, allPlayers) {
        if (previous === null){
            const player = allPlayers[Math.floor(Math.random() * allPlayers.length)]
            return player;
        } else {
            if ((previousPlayer.id + 1) === players.length) {
                return allPlayers[0]
            } else {
                return allPlayers[previousPlayer.id + 1]
            }
        }
    }

}

function gameConfig(sideLengh, playerCount) {
    // max players = symbols array length, 6
    var symbols = ["x","o","#","@","0","%"]
    for (let i = 0; i < playerCount && i < symbols.length; i++) {
        const symbol = symbols[i];
        players.push(
            { name:`player${i}`, symbol: symbol, id: i}
        )
    }

    // max size = alphabet array length, 26
    var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    boardHeight = sideLengh;
    boardWidth= sideLengh;
    //board size is the total squares, so it is equal to sidelength squared (sideLength ** 2)
    boardSize = sideLengh ** 2;
    for (let i = 0; i < sideLengh; i++) {
        const char = alphabet[i];
        for (let j = 0; j < sideLengh; j++) {
            const num = j + 1;
            boardState.push(
                { 
                    name: `${char}${num}`, 
                    postion: { x: j, y: i }, 
                    index: ((i * sideLengh) + j),
                    state: null
                }
            )
        }
    }
}

function renderBoard(board, clear, size) {
    if (clear) console.log(`\n\n\n`); console.clear();
    temp = [];
    for (let i = 0; i < board.length; i++) {
        const element = board[i].state;
        if (element === null) {
            temp.push(" ");
        } else {
            temp.push(element.symbol);
        }
    }
    var asciiBoard = `
    ${temp[0]} | ${temp[1]} | ${temp[2]} 
   -----------
    ${temp[3]} | ${temp[4]} | ${temp[5]} 
   -----------
    ${temp[6]} | ${temp[7]} | ${temp[8]} 
    ` 
    console.log(asciiBoard);
}

/* 
 x | o | x 
-----------
 x | x | x 
-----------
 x | o | x 
*/