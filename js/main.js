
var gBoard
var gGame
var isFirstClick
var timerInterval

const gLevel = {
    SIZE: 4,
    MINES: 2
};

function initGame() {
    initialVariables()
    updateBombLeft()
    updateLives()
    buildBoard()
    renderBoard(gBoard, '.board-container')
    console.log(gBoard)
}

function restart() {
    initGame()
    clearInterval(timerInterval)
    document.querySelector('.restart').innerText = '🙂'
    document.querySelector('.timer').innerText = 'Timer: 000'
    document.querySelector('.msg').innerText = ''
    console.log(gBoard)
}

function initialVariables() {
    isFirstClick = false
    gBoard = []
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3
    }
}

function updateLevel(elButtonLevel) {
    if (elButtonLevel.innerText === 'Easy') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    } else if (elButtonLevel.innerText === 'Medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    } else if (elButtonLevel.innerText === 'Hard') {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    }
    restart()
}

function updateTimer() {
    if (gGame.secsPassed < 1000) {
        var text = 'Timer: '
        gGame.secsPassed++

        if (gGame.secsPassed < 10) text += `00${gGame.secsPassed}`
        else if (gGame.secsPassed < 100 && gGame.secsPassed >= 10) text += `0${gGame.secsPassed}`
        else if (gGame.secsPassed >= 100) text += gGame.secsPassed

        document.querySelector('.timer').innerText = text
    }
}

function updateLives() {
    var lives = ''
    for (var i = 0; i < gGame.lives; i++) {
        lives += '❤️'
    }
    document.querySelector('.lives').innerText = `Lives: ${lives}`
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

function firstCellClick(i, j) {
    gGame.isOn = true
    isFirstClick = true
    timerInterval = setInterval(updateTimer, 1000)
    randomLocateMine(i, j)
    setMinesNegsCount(gBoard)
}

function cellClicked(elCell, i, j) {
    const currCell = gBoard[i][j]
    if (!isFirstClick) {
        firstCellClick(i, j)
        expandShown(gBoard, i, j)
        renderBoard(gBoard, '.board-container')
        console.log(gBoard)
    }
    else if (isFirstClick && gGame.isOn && !currCell.isShown && !currCell.isMarked) {
        if (currCell.isMine) {
            gGame.lives--
            updateLives()
            if (gGame.lives === 0) endGame()
        } else gGame.shownCount++

        // Update the current cell value
        elCell.innerText = currCell.isMine ? BOMB :
            currCell.minesAroundCount === 0 ? '' : currCell.minesAroundCount

        currCell.isShown = true
        // Check if cell is empty
        if (elCell.innerText === '') {
            expandShown(gBoard, i, j)
        }

        checkGameOver()
        renderBoard(gBoard, '.board-container')
    }
}

function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMarked) continue
            if (!currCell.isShown && !currCell.isMine && !currCell.isMarked) {
                currCell.isShown = true
                gGame.shownCount++
                if (currCell.minesAroundCount === 0) {
                    expandShown(board, i, j)
                }
            }
        }
    }
}

function checkGameOver() {
    if ((gGame.markedCount + 3 - gGame.lives) === gLevel.MINES &&
        gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES)) {
        document.querySelector('.msg').innerText = 'Victory'
        document.querySelector('.restart').innerHTML = '😍'
        gGame.isOn = false
        clearInterval(timerInterval)
    }
}

function endGame() {
    gGame.isOn = false
    document.querySelector('.msg').innerText = 'GAME OVER'
    document.querySelector('.restart').innerHTML = '🤯'
    revealeAllMines(gBoard)
    clearInterval(timerInterval)
    renderBoard(gBoard, '.board-container')
    return
}
