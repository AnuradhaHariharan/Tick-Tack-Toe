const squares = document.querySelectorAll('.square');
let board = Array(9).fill(null);
let isAkiraTurn = true;
let winner = null;

const akiraImage = './kira.webp';  // Replace with actual Akira image URL
const ryukImage = './Ryuk-from-Death-Note-.webp';    // Replace with actual Ryuk image URL

// Function to handle square click
squares.forEach((square, index) => {
    square.addEventListener('click', () => {
        if (board[index] || winner) return; // Do nothing if square is already filled or game over
        
        board[index] = isAkiraTurn ? 'Akira' : 'Ryuk';
        updateBoard();
        checkWinner();
        isAkiraTurn = !isAkiraTurn;

        // If it's Ryuk's turn and no winner, make Ryuk's move
        if (!winner && !isAkiraTurn) {
            setTimeout(() => ryukMove(), 500);
        }
    });
});

// Function to update the board visually
function updateBoard() {
    board.forEach((value, index) => {
        const square = squares[index];
        if (value === 'Akira') {
            square.innerHTML = `<img src="${akiraImage}" alt="Akira" />`;
        } else if (value === 'Ryuk') {
            square.innerHTML = `<img src="${ryukImage}" alt="Ryuk" />`;
        } else {
            square.innerHTML = '';
        }
    });
}

// Function to check for a winner
function checkWinner() {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winner = board[a];
            document.getElementById('message').innerText = winner === 'Akira' ? 'Akira Wins!' : 'Ryuk Wins!';
            return;
        }
    }

    // Check for draw
    if (!board.includes(null)) {
        document.getElementById('message').innerText = "It's a Draw!";
    }
}

// Minimax algorithm to make Ryuk's move
function ryukMove() {
    const bestMove = minimax(board, 'Ryuk');
    board[bestMove.index] = 'Ryuk';
    updateBoard();
    checkWinner();
    isAkiraTurn = true;
}

// Minimax function to calculate the best move
function minimax(board, currentPlayer) {
    const availableSpots = board.map((value, index) => value === null ? index : null).filter(value => value !== null);

    // Base case: check for terminal state (win, loss, or draw)
    if (checkWinnerState(board, 'Ryuk')) return { score: 1 }; // Ryuk wins
    if (checkWinnerState(board, 'Akira')) return { score: -1 }; // Akira wins
    if (availableSpots.length === 0) return { score: 0 }; // Draw

    const moves = [];

    // Loop through available spots and simulate each move
    for (let i = 0; i < availableSpots.length; i++) {
        const spot = availableSpots[i];
        board[spot] = currentPlayer;
        
        const result = minimax(board, currentPlayer === 'Ryuk' ? 'Akira' : 'Ryuk');
        moves.push({ index: spot, score: result.score });
        board[spot] = null; // Undo move

    }

    let bestMove;
    if (currentPlayer === 'Ryuk') {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

// Function to check the winner state
function checkWinnerState(board, player) {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

// Reset the game
document.getElementById('resetButton').addEventListener('click', () => {
    board = Array(9).fill(null);
    winner = null;
    isAkiraTurn = true;
    document.getElementById('message').innerText = '';
    updateBoard();
});

