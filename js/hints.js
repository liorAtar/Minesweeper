var gHints
var gHintInterval
var gSafeClick
var gSafeTimout
var gMegaHint
var gMegaHintTimout

function resetHints() {
    gHints = {
        isOn: false,
        hintLeft: 3
    }
    gMegaHint = {
        isOn: false,
        cellClickedCount: 0,
        cell1: {},
        cell2: {}
    }
    var elMega = document.querySelector('.mega-btn')
    elMega.disabled = false
    updateAllHintsDisable(false)
}

function updateAllHintsDisable(isDisabled) {
    var elHints = document.querySelectorAll('.hint-btn')
    for (var i = 0; i < elHints.length; i++) {
        elHints[i].disabled = isDisabled
    }
}

function hintClicked(elLampBtn) {
    if (!gIsFirstClick) {
        gHints.isOn = true
        elLampBtn.disabled = true
    }
}

function getHint(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            var currCell = gBoard[i][j]
            var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            var cellValue = currCell.isMine ? BOMB : currCell.minesAroundCount === 0 ?
                '' : currCell.minesAroundCount

            if (!currCell.isShown && gHints.isOn) {
                elCurrCell.classList.add('shown')
                renderCell({ i, j }, cellValue)
            } else if (!currCell.isShown && !gHints.isOn) {
                elCurrCell.classList.remove('shown')
                renderCell({ i, j }, currCell.isMarked ? FLAG : '')
            }
        }
    }

    if (!gHints.isOn) clearInterval(gHintInterval)
    gHints.isOn = false
}

function resetSafeClick() {
    gSafeClick = 3
    document.querySelector('.safe-btn').disabled = false
    document.querySelector('.safe-left').innerText = `Left ${gSafeClick}`
}

function safeClicked(elSafeBtn) {
    var nonClickedLeft = (gLevel.SIZE ** 2) - gGame.shownCount

    if (!gIsFirstClick && gSafeClick > 0 && nonClickedLeft !== gLevel.MINES) {
        gSafeClick--
        var safeCell = getSafeClick()
        gSafeTimout = setTimeout(hideSafeCell, 3000, safeCell);
        document.querySelector('.safe-left').innerText = `Left ${gSafeClick}`

        if (gSafeClick === 0) elSafeBtn.disabled = true
    }
}

function getSafeClick() {
    var i = getRandomIntInclusive(0, gLevel.SIZE - 1)
    var j = getRandomIntInclusive(0, gLevel.SIZE - 1)

    var currCell = gBoard[i][j]

    while ((currCell.isShown || currCell.isMine)) {
        i = getRandomIntInclusive(0, gLevel.SIZE - 1)
        j = getRandomIntInclusive(0, gLevel.SIZE - 1)
        currCell = gBoard[i][j]
    }

    var elCurrVell = document.querySelector(`.cell-${i}-${j}`)
    elCurrVell.disabled = true
    elCurrVell.classList.add('shown')
    var cellValue = currCell.isMine ? BOMB : currCell.minesAroundCount === 0 ?
        '' : currCell.minesAroundCount

    renderCell({ i, j }, cellValue)
    return { i, j }
}

function hideSafeCell(cell) {
    var currCell = gBoard[cell.i][cell.j]

    var elCurrVell = document.querySelector(`.cell-${cell.i}-${cell.j}`)
    elCurrVell.classList.remove('shown')
    var cellValue = currCell.isMarked ? FLAG : ''

    renderCell({ i: cell.i, j: cell.j }, cellValue)
    elCurrVell.disabled = false
}

function megaHintClicked(el) {
    if (!gIsFirstClick) {
        gMegaHint.isOn = true
        gMegaHint.isUsed = true
        el.disabled = true
    }
}

function getMegaHint(gBoard) {
    var startPos = gMegaHint.cell1.j < gMegaHint.cell2.j ?
        gMegaHint.cell1 : { i: gMegaHint.cell1.i, j: gMegaHint.cell2.j }
    var endPos = gMegaHint.cell1.j < gMegaHint.cell2.j ?
        gMegaHint.cell2 : { i: gMegaHint.cell2.i, j: gMegaHint.cell1.j }

    showOrHideMega(gBoard, startPos, endPos)
    gMegaHint.isOn = false
    gSafeTimout = setTimeout(showOrHideMega, 2000, gBoard, startPos, endPos);
}

function showOrHideMega(board, startPos, endPos) {
    for (var i = startPos.i; i <= endPos.i; i++) {
        for (var j = startPos.j; j <= endPos.j; j++) {
            var currCell = board[i][j]
            var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            var cellValue = currCell.isMine ? BOMB : currCell.minesAroundCount === 0 ?
                '' : currCell.minesAroundCount

            if (gMegaHint.isOn && !currCell.isShown) {
                elCurrCell.classList.add('shown')
                renderCell({ i, j }, cellValue)
            } else if (!gMegaHint.isOn && !currCell.isShown) {
                elCurrCell.classList.remove('shown')
                renderCell({ i, j }, currCell.isMarked ? FLAG : '')
            }
        }
    }
}
