//Goal: have as little global code as possible
//Try Tuck everything inside a module or factory


var gameboard = (() => {
    var gameArray = ["", "", "", "", "", "", "", "", ""];
    var updateBoard = (i, content) => gameArray[i] = content;
    var getSquare = (i) => gameArray[i];
    var isLegalMove = (i) => gameArray[i] == "";
    var checkThree = (i) => checkThreeAlgos.algos[i](gameArray);
    var checkTie = () => gameArray.indexOf("") == -1 ? 1 : 0;
    //checkTie checks to see if gameboard is full.  Assumes already checked for winner.  
    
    var refreshBoard = () => {
        gameArray = ["", "", "", "", "", "", "", "", ""];
    };
    return {
        updateBoard,
        getSquare, 
        isLegalMove, 
        checkThree,
        checkTie, 
        refreshBoard
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
    };
    var resetGame = () => {
        currentTurn = 0;
        
    };
 
    return{
        players,
        currentTurn,
        setPlayers,
        getTurn,
        updateTurn, 
        resetGame
    };

})();


var PlayerFactory = (name) => {
    var name = name;
    
    return {
        name,
    };
};

const checkThreeAlgos = ((board) => {    
    const xOrO = (x) => x == "X" ? 0 : 1;
    //assumes the square checked is NOT blank, since only check algo on LEGAL moves.  
    const zero = (board) => {
        //we already assume square checked is not blank
        if(board[0] == board[1] && board[0] == board[2]) {
            return xOrO(board[0]);
        } else if (board[0] == board[3] && board[0] == board[6]) {
            return xOrO(board[0]);
        } else if (board[0] == board[4] && board[0] == board[8]) {
            return xOrO(board[0]);
        } 
        return -1; //no winner
    };
    const one = (board) => {
        if(board[1] == board[0] && board[1] == board[2]) {
            return xOrO(board[1]);
        } else if (board[1] == board[4] && board[1] == board[7]) {
            return xOrO(board[1]);
        } 
        return -1; 
    };
    const two = (board) => {
        if(board[2] == board[0] && board[2] == board[1]) {
            return xOrO(board[2]);
        } else if (board[2] == board[5] && board[2] == board[8]) {
            return xOrO(board[2]);
        } else if (board[2] == board[4] && board[2] == board[6]) {
            return xOrO(board[2]);
        } 
        return -1; 
    };

    const three = (board) => {
        if(board[3] == board[4] && board[3] == board[5]) {
            return xOrO(board[3]);
        } else if (board[3] == board[0] && board[3] == board[6]) {
            return xOrO(board[3]);
        } 
        return -1; 
    };

    const four = (board) => {
        if(board[4] == board[3] && board[4] == board[5]) {
            return xOrO(board[4]);
        } else if (board[4] == board[1] && board[4] == board[7]) {
            return xOrO(board[4]);
        } else if (board[4] == board[0] && board[4] == board[8]) {
            return xOrO(board[4]);
        } else if (board[4] == board[2] && board[4] == board[6]) {
            return xOrO(board[4]);
        } 
        return -1; 
    };

    const five = (board) => {
        if(board[5] == board[3] && board[5] == board[4]) {
            return xOrO(board[5]);
        } else if (board[5] == board[2] && board[5] == board[8]) {
            return xOrO(board[5]);
        } 
        return -1; 
    };

    const six = (board) => {
        if(board[6] == board[7] && board[6] == board[8]) {
            return xOrO(board[6]);
        } else if (board[6] == board[0] && board[6] == board[3]) {
            return xOrO(board[6]);
        } else if (board[6] == board[2] && board[6] == board[4]) {
            return xOrO(board[6]);
        } 
        return -1; 
    };

    const seven = (board) => {
        if(board[7] == board[6] && board[7] == board[8]) {
            return xOrO(board[7]);
        } else if (board[7] == board[1] && board[7] == board[4]) {
            return xOrO(board[7]);
        } 
        return -1; 
    };

    const eight = (board) => {
        if(board[8] == board[6] && board[8] == board[7]) {
            return xOrO(board[8]);
        } else if (board[8] == board[2] && board[8] == board[5]) {
            return xOrO(board[8]);
        } else if (board[8] == board[0] && board[8] == board[4]) {
            return xOrO(board[8]);
        } 
        return -1; 
    };

    //array of algos
    const algos = [zero, one, two, three, four, five, six, seven, eight];

    return {
        algos
    };

})();

var displayController = (() => {
    //Should request the game to make a move

    var setPlayerNames = () => {
        let playerNames = View.getPlayerNamesFromView();
        console.log(PlayerFactory(playerNames[0]));
        console.log(PlayerFactory(playerNames[1]));
        game.setPlayers(PlayerFactory(playerNames[0]), PlayerFactory(playerNames[1]));
        View.renderHidePlayerNamesInput();
        
    };
    var checkLegal = (i) => gameboard.isLegalMove(i);
    var checkTurn = () => game.getTurn();
    
    var executeMove = (e) => {
        let i = parseInt(e.target.id.match(/(\d+)/));
        if(checkLegal(i)) {
            View.renderNotIllegalMove();
            //Check the player turn to know if x or o
            if(checkTurn() == 0) {
                gameboard.updateBoard(i, "X");
                View.renderSquare(i, "X");
                
            } else {
                gameboard.updateBoard(i, "O");
                View.renderSquare(i, "O");
            }
            //check for winner
            let winner = gameboard.checkThree(i);
            if(winner > -1) {
                View.renderWinner(winner);
            }
            //check for tie, board filled
            let isTie = gameboard.checkTie(); 
            if (isTie == 1) {
                View.renderTie();
            }

            //otherwise 
            //update turn
            game.updateTurn();
            View.renderPlayerTurn(checkTurn());
            
            
        } else {
            View.renderIllegalMove();
        }
    };

    var restart = () => {
        //clear gameboard
        gameboard.refreshBoard();
        game.resetGame();
        View.renderReset();

    };
    return {
        executeMove,
        restart,
        setPlayerNames
    };
})();



const View = (() => {
    const render = () => {
        let squares = document.querySelectorAll(".square");
        for(var i = 0; i < squares.length; i++) {
            squares[i].textContent = gameboard.getSquare(i);
        }
    };

    const renderSquare = (i, content) => {
        let square = document.getElementById('square-'+i);
            square.textContent = content;
    
    };

    const renderPlayerTurn = (turn) => {
        let playerTurn = document.querySelector(".player-turn")
        if(turn == 0) {
            playerTurn.textContent = "Player 1's Turn";
        } else {
            playerTurn.textContent = "Player 2's Turn";
        }
    };

    const renderIllegalMove = () => {
        let message = document.querySelector(".announcement-message");
        message.textContent="Illegal Move, Move Somewhere Else";
    };

    const renderNotIllegalMove = () => {
        let message = document.querySelector(".announcement-message");
        message.textContent="";
    };

    const renderWinner = (i) => {
        let message = document.querySelector(".announcement-message");
        let winner = i+1;
        message.textContent = "Player " + winner + " wins!";
    };

    const renderTie = () => {
        let message = document.querySelector(".announcement-message");
        message.textContent = "Stalemate! No winner this game!"
    };



    const renderReset = () => {
        render();
        renderPlayerTurn(0);
    };

    const getPlayerNamesFromView = () => {
        let playerNames = [];
        let playerName1 = document.querySelector("#player-1").value;
        let playerName2 = document.querySelector("#player-2").value;
        playerNames.push(playerName1);
        playerNames.push(playerName2);
        return playerNames;
    };

    const renderHidePlayerNamesInput = () => {
        let playerNamesInput = document.querySelector(".player-names");
        playerNamesInput.style.visibility = "hidden";
    };
    return {
        render, 
        renderSquare,
        renderPlayerTurn, 
        renderIllegalMove, 
        renderNotIllegalMove, 
        renderWinner, 
        renderTie, 
        renderReset, 
        getPlayerNamesFromView,
        renderHidePlayerNamesInput
    };

})();

const Setup = (() => {
    const addSquareListeners = () => {
        let squares = document.querySelectorAll(".square");
        for(var i = 0; i < squares.length; i++) {
            squares[i].addEventListener("click", displayController.executeMove);
        }
    };

    const addRestartListener = () => {
        let restartButton = document.querySelector(".restart");
        restartButton.addEventListener("click", displayController.restart);
    };

    const addNamesListener = () => {
        let enterButton = document.querySelector("#enter-names");
        enterButton.addEventListener("click", displayController.setPlayerNames);
    }

    const initialize = () => {
        addSquareListeners();
        addRestartListener();
        addNamesListener();
    }
    return {
        addSquareListeners,
        addRestartListener,
        addNamesListener,
        initialize
    };
})();

Setup.initialize();
//View.render();
