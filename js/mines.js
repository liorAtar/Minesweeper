const BOMB = '💣'
const FLAG = '🚩'

function randomLocateMine(firstI, firstJ) {
    for (var index = 0; index < gLevel.MINES; index++) {
        var i = getRandomIntInclusive(0, gLevel.SIZE - 1)
        var j = getRandomIntInclusive(0, gLevel.SIZE - 1)

        while (gBoard[i][j].isMine ||
            (i === firstI && j === firstJ) ||
            (i === firstI - 1 && j === firstJ - 1) ||
            (i === firstI - 1 && j === firstJ) ||
            (i === firstI - 1 && j === firstJ + 1) ||
            (i === firstI && j === firstJ - 1) ||
            (i === firstI && j === firstJ + 1) ||
            (i === firstI + 1 && j === firstJ - 1) ||
            (i === firstI + 1 && j === firstJ) ||
            (i === firstI + 1 && j === firstJ + 1)
        ) {
            console.log('entered', index, 'i', i, 'j', j)

            i = getRandomIntInclusive(0, gLevel.SIZE - 1)
            j = getRandomIntInclusive(0, gLevel.SIZE - 1)
        }

        console.log('index', index, 'i', i, 'j', j)

        gBoard[i][j] = {
            minesAroundCount: 0,
            isShown: false,
            isMine: true,
            isMarked: false
        }
    }
}

function setMinesNegsCount(board) {
    var bombCount = 0

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            bombCount = getCellMinesAround(board, i, j)
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = bombCount
            }
        }
    }
}

function revealeAllMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if(board[i][j].isMine) {
                board[i][j].isShown = true
                board[i][j].isMarked = false
            }
        }
    }
}
