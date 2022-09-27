var gBoard
var gGame
var gTimerInterval
var gIsSevenBoom
var gIsManual
var gManualMineCount
var gBestScore

const gLevel = {
    SIZE: 4,
    MINES: 2
};

function initGame() {
    restartValues()
    gBestScore = {
        EASY: 999,
        MEDIUM: 999,
        HARD: 999
    }

    var level = gLevel.SIZE === 4? 'EASY' : gLevel.SIZE === 8? 'MEDIUM' : 'HARD'
    window.localStorage.setItem("best-score",  JSON.stringify(gBestScore));
    var currLocalStorage = JSON.parse(localStorage.getItem('best-score'))
    document.querySelector('.best-score').innerText = `Best Score ${currLocalStorage[level]}`
}

function restart() {
    restartValues()
    clearInterval(gTimerInterval)
    clearInterval(gHintInterval)
    document.querySelector('.timer').innerText = 'Timer 000'
    document.querySelector('.msg').innerText = ''
    console.log(gBoard)
}

function restartValues(){
    document.querySelector('.restart').src = './images/start.png'
    initialVariables()
    document.querySelector('.manual-left').innerText = `Left ${gLevel.MINES - gManualMineCount}`
    document.querySelector('.manual-left').style.visibility = 'hidden'
    updateBombLeft()
    updateLives()
    resetHints()
    resetSafeClick()
    buildBoard()
    renderBoard(gBoard, '.board-container')
    console.log(gBoard)
}

function initialVariables() {
    gIsFirstClick = true
    gBoard = []
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: gLevel.SIZE === 4 ? 1 : 3
    }
    gIsSevenBoom = false
    gIsManual = false
    gManualMineCount = 0
}

function updateLevel(elButtonLevel) {
    if (elButtonLevel.innerText === 'EASY') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    } else if (elButtonLevel.innerText === 'MEDIUM') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    } else if (elButtonLevel.innerText === 'HARD') {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    }
    
    var level = gLevel.SIZE === 4? 'EASY' : gLevel.SIZE === 8? 'MEDIUM' : 'HARD'
    document.querySelector('.best-score').innerText = `Best Score ${gBestScore[level]}`

    restart()
}

function updateTimer() {
    if (gGame.secsPassed < 1000) {
        var text = 'Timer '
        gGame.secsPassed++

        if (gGame.secsPassed < 10) text += `00${gGame.secsPassed}`
        else if (gGame.secsPassed < 100 && gGame.secsPassed >= 10) text += `0${gGame.secsPassed}`
        else if (gGame.secsPassed >= 100) text += gGame.secsPassed

        document.querySelector('.timer').innerText = text
    }
}

function updateLives() {
    var lives = ''
    if (gGame.lives === 3) lives = '🤍🤍🤍'
    if (gGame.lives === 2) lives = '🤍🤍🖤'
    if (gGame.lives === 1) lives = '🤍🖤🖤'
    if (gGame.lives === 0) lives = '🖤🖤🖤'
    document.querySelector('.lives').innerText = `Lives ${lives}`
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

function checkGameOver() {
    var allLives = gLevel.SIZE === 4 ? 1 : 3

    if ((gGame.markedCount + allLives - gGame.lives) === gLevel.MINES &&
        gGame.shownCount === (gLevel.SIZE ** 2 - gGame.markedCount)) {
        document.querySelector('.msg').innerText = 'YOU WON!'
        document.querySelector('.restart').src = './images/won.png'
        document.querySelector('.safe-btn').disabled = true
        document.querySelector('.mega-btn').disabled = true
        updateAllHintsDisable(true)
        gGame.isOn = false
        bestScore()
        clearInterval(gTimerInterval)
    }
}

function endGame() {
    gGame.isOn = false
    document.querySelector('.msg').innerText = 'GAME OVER'
    document.querySelector('.restart').src = './images/lost.png'
    document.querySelector('.safe-btn').disabled = true
    document.querySelector('.mega-btn').disabled = true
    updateAllHintsDisable(true)
    revealeAllMines(gBoard)
    clearInterval(gTimerInterval)
    renderBoard(gBoard, '.board-container')
    return
}

function bestScore() {
    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        var currLocalStorage = JSON.parse(localStorage.getItem('best-score'))
        var level = gLevel.SIZE === 4? 'EASY' : gLevel.SIZE === 8? 'MEDIUM' : 'HARD'
        gBestScore[level] = gGame.secsPassed

        if(gGame.secsPassed < currLocalStorage[level]){
            window.localStorage.setItem("best-score", JSON.stringify(gBestScore))
            document.querySelector('.best-score').innerText = `Best Score ${gBestScore[level]}`
        }
    } else {
        // Sorry! No Web Storage support..
    }
}
