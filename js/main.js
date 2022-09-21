
var gBoard = []
var isFirstClick = false

const gLevel = {
    SIZE: 8,
    MINES: 14
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame() {
    buildBoard()
    renderBoard(gBoard, '.board-container')
    console.log(gBoard)
}

function buildBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i].push({
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            })
        }
    }
}

function getCellMinesAround(board, rowIdx, colIdx) {
    var bombCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) {
                bombCount++
            }
        }
    }

    return bombCount
}

function cellClicked(elCell, i, j) {
    if (!isFirstClick) {
        gGame.isOn = true
        isFirstClick = true
        console.log('i', i, 'j', j)
        randomLocateMine(i, j)
        setMinesNegsCount(gBoard)
        expandShown(gBoard, i, j)
        renderBoard(gBoard, '.board-container')
        console.log(gBoard)
    }
    else if (isFirstClick && gGame.isOn && !gBoard[i][j].isShown) {
        if (gBoard[i][j].isMine) {
            gGame.isOn = false
            revealeAllMines(gBoard)
            console.log('game over!')
        }
        else if (gBoard[i][j].isMarked) {
            gBoard[i][j].isMarked = !gBoard[i][j].isMarked
            gGame.markedCount--
            gGame.shownCount++
            console.log('2 gGame.shownCount', gGame.shownCount)
        }
        else if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
            gGame.shownCount++
            console.log('3 gGame.shownCount', gGame.shownCount)
            checkGameOver()
        }

        elCell.innerText = gBoard[i][j].isMine ? BOMB :
            gBoard[i][j].minesAroundCount === 0 ? '' : gBoard[i][j].minesAroundCount

        if (elCell.innerText === '') {
            expandShown(gBoard, i, j)
        } else {
            gBoard[i][j].isShown = true
        }

        renderBoard(gBoard, '.board-container')
    }
}

function addFlag(elCell, event, i, j) {
    const cell = gBoard[i][j]

    if (event.which === 3 && !cell.isShown) {
        cell.isMarked = !cell.isMarked
        elCell.innerText = cell.isMarked ? FLAG : ''
        if (cell.isMarked) { gGame.markedCount++ }
        else {
            gGame.markedCount--
        }
        checkGameOver()
    }
}

function checkGameOver() {
    if (gGame.markedCount === gLevel.MINES &&
        gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES)) {
        console.log('victorious!')
        gGame.isOn = false
    }
}

function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]

            if (i === rowIdx && j === colIdx) {
               continue
            }
            if (!currCell.isShown && !currCell.isMine) {
                currCell.isShown = true
                gGame.shownCount++
                console.log('i', i, 'j', j)
                console.log('4 gGame.shownCount', gGame.shownCount)
                if (currCell.minesAroundCount === 0) {
                    expandShown(board, i, j)
                }
            }
        }
    }
}