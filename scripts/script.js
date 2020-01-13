//Goal: have as little global code as possible
//Try Tuck everything inside a module or factory


var gameboard = (() => {
    var gameArray = ["", "", "", "", "", "", "", "", ""];
    var updateBoard = (i, content) => gameArray[i] = content;
    var getSquare = (i) => gameArray[i];
    var isLegalMove = (i) => gameArray[i] == "";
    return {
        updateBoard,
        getSquare, 
        isLegalMove
    };
})();


var game = (() => {
    var players = [];
    var currentTurn = 0;
    var setPlayers = (player1, player2) => {
        players.push(player1);
        players.push(player2);
        currentTurn = 0;
    }
    var getTurn = () => currentTurn;
    var updateTurn = () => {
        currentTurn == 0 ? currentTurn = 1 : currentTurn = 0
        return;
    };
 
    return{currentTurn,
        setPlayers,
        getTurn,
        updateTurn
    };

})();


var PlayerFactory = (name, x) => {
    var name = name;
    
    return {
        name,
    };
};

var displayController = (() => {
    //Should request the game to make a move
    //game checks if it's legal
    //If it is, updates view -> says illegal move or updates board

    var checkLegal = (i) => gameboard.isLegalMove(i);
    var checkTurn = () => game.getTurn();
    var executeMove = (e) => {
        let i = parseInt(e.target.id.match(/(\d+)/));
        console.log(i);
        if(checkLegal(i)) {
            //Check the player turn to know if x or y
            if(checkTurn() == 0) {
                gameboard.updateBoard(i, "X");
                renderSquare(i, "X");
                
            } else {
                gameboard.updateBoard(i, "O");
                renderSquare(i, "O");
            }

            //update turn
            game.updateTurn();
            renderPlayerTurn(checkTurn());
            
            
        }
    }
    return {
        executeMove
    };
})();

function render() {
    let squares = document.querySelectorAll(".square");
    for(var i = 0; i < squares.length; i++) {
        squares[i].textContent = gameboard.getSquare(i);
    }
};

function renderSquare(i, content) {
    let square = document.getElementById('square-'+i);
        square.textContent = content;

}

function renderPlayerTurn(turn) {
    let playerTurn = document.querySelector(".player-turn")
    if(turn == 0) {
        playerTurn.textContent = "Player 1's Turn";
    } else {
        playerTurn.textContent = "Player 2's Turn";
    }
}
function addSquareListeners() {
    let squares = document.querySelectorAll(".square");
    for(var i = 0; i < squares.length; i++) {
        squares[i].addEventListener("click", displayController.executeMove);
    }
}



addSquareListeners();
render();