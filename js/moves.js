var gIsFirstClick

function firstCellClick(i, j) {
    gGame.isOn = true
    gIsFirstClick = false
    gTimerInterval = setInterval(updateTimer, 1000)
    if(!gIsSevenBoom && !gIsManual){
        randomLocateMine(i, j)
    }
    setMinesNegsCount(gBoard)
}

function cellClicked(elCell, i, j) {
    const currCell = gBoard[i][j]
    if(gIsManual && gManualMineCount !== gLevel.MINES){
        gBoard[i][j].isMine = true
        gManualMineCount++
        document.querySelector('.manual-left').innerText = `Left ${gLevel.MINES - gManualMineCount}`
    }
    else if ((gIsFirstClick && gIsManual && gManualMineCount === gLevel.MINES) || (gIsFirstClick && !gIsManual)) {
        firstCellClick(i, j)
        expandShown(gBoard, i, j)
        renderBoard(gBoard, '.board-container')
        console.log(gBoard)
    } else if(gGame.isOn && gMegaHint.isOn && gMegaHint.cellClickedCount < 3){
        gMegaHint.cellClickedCount++
        if(gMegaHint.cellClickedCount == 1){
            gMegaHint.cell1 = {i, j}
        } else{
            gMegaHint.cell2 = {i, j}
            getMegaHint(gBoard)
        }
    } else if (gGame.isOn && gHints.isOn && gHints.hintLeft > 0) {
        gHintInterval = setInterval(getHint, 1000, i, j)
        gHints.hintLeft--
    } else if (gGame.isOn && !currCell.isShown && !currCell.isMarked) {
        if (currCell.isMine) {
            gGame.lives--
            updateLives()
            if (gGame.lives === 0) endGame()
        }

        gGame.shownCount++
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
