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
            i = getRandomIntInclusive(0, gLevel.SIZE - 1)
            j = getRandomIntInclusive(0, gLevel.SIZE - 1)
        }
        gBoard[i][j].isMine = true
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

function updateBombLeft() {
    var allLives = gLevel.SIZE === 4 ? 1 : 3
    const markedLeft = gLevel.MINES - gGame.markedCount - allLives + gGame.lives
    document.querySelector('.marked-left').innerText = `Flag Left: ${markedLeft}`
}

function revealeAllMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) {
                board[i][j].isShown = true
                board[i][j].isMarked = false
            }
        }
    }
}

function addFlag(elCell, event, i, j) {
    const cell = gBoard[i][j]

    if (event.which === 3 && !cell.isShown) {
        if (gIsFirstClick) {
            firstCellClick(i, j)
            console.log(gBoard)
        }

        cell.isMarked = !cell.isMarked
        elCell.innerText = cell.isMarked ? FLAG : ''

        if (cell.isMarked) gGame.markedCount++
        else gGame.markedCount--

        renderBoard(gBoard, '.board-container')
        updateBombLeft()
        checkGameOver()
    }
}

function exterminatorClicked() {
    if (!gIsFirstClick) {
        var allLives = gLevel.SIZE === 4 ? 1 : 3
        gLevel.MINES -= allLives
        updateBombLeft()
        for (var i = 0; i < allLives; i++) {
            mineExterminator();
        }
        renderBoard(gBoard, '.board-container')
    }
}

function mineExterminator() {
    var i = getRandomIntInclusive(0, gLevel.SIZE - 1)
    var j = getRandomIntInclusive(0, gLevel.SIZE - 1)

    var currCell = gBoard[i][j]

    while ((!currCell.isMine || !currCell.isMine && currCell.isShown)) {
        i = getRandomIntInclusive(0, gLevel.SIZE - 1)
        j = getRandomIntInclusive(0, gLevel.SIZE - 1)
        currCell = gBoard[i][j]
    }

    var elCurrVell = document.querySelector(`.cell-${i}-${j}`)
    var cellValue = currCell.isMine ? BOMB : currCell.minesAroundCount === 0 ?
        '' : currCell.minesAroundCount
    elCurrVell.classList.add('shown')


    renderCell({ i, j }, cellValue)
    elCurrVell.disabled = true
    currCell.isMine = false
    setMinesNegsCount(gBoard)
}

function sevenBoom() {
    var bombCount = 0
    var currNum = 1

    restart()
    gIsSevenBoom = true
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            // if (i % 7 === 0 || j % 7 === 0 || (i + '').indexOf('7') > -1) {
            //     console.log('i', i)
            //     console.log('j', j)
            //     gBoard[i][j].isMine = true
            //     bombCount++
            // } else {
            //     gBoard[i][j].isMine = false
            // }

            if (currNum % 7 === 0 || (currNum + '').indexOf('7') > -1) {
                gBoard[i][j].isMine = true
                bombCount++
            } else {
                gBoard[i][j].isMine = false
            }

            currNum++
        }
    }

    gLevel.MINES = bombCount
    updateBombLeft()
}

function manuallyPositioned() {
    restart()
    document.querySelector('.manual-left').innerText = `Left ${gLevel.MINES}`
    document.querySelector('.manual-left').style.visibility = 'visible'
    gIsManual = true
}