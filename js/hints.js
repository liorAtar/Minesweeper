var gHints
var gHintInterval
var gSafeClick
var gSafeTimout

function resetHints() {
    gHints = {
        isOn: false,
        hintLeft: 3
    }

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
            var elCurrVell = document.querySelector(`.cell-${i}-${j}`)
            var cellValue = currCell.isMine ? BOMB : currCell.minesAroundCount === 0 ?
                '' : currCell.minesAroundCount

            if (!currCell.isShown && gHints.isOn) {
                elCurrVell.classList.add('shown')
                renderCell({ i, j }, cellValue)
            } else if (!currCell.isShown && !gHints.isOn) {
                elCurrVell.classList.remove('shown')
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
    var sum = (gLevel.SIZE ** 2) - gGame.shownCount

    if (!gIsFirstClick && gSafeClick > 0 && sum !== gLevel.MINES) {
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
