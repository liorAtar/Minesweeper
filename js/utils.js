'use strict'

function renderBoard(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const cellValue = cell.isMine ? BOMB : cell.minesAroundCount === 0 ?
                '' : cell.minesAroundCount
            const className = cell.isShown? 'cell cell-' + i + '-' + j + ' shown': 'cell cell-' + i + '-' + j
            strHTML += `<td class="${className}" oncontextmenu="return false;"`
            strHTML += `onmousedown="addFlag(this, event, ${i}, ${j})"`
            strHTML += `onclick="cellClicked(this, ${i}, ${j})">${cell.isMarked ? FLAG : cell.isShown ? cellValue : ''}</td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
