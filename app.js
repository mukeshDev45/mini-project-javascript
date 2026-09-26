let gameSeq = [];
let userSeq = [];

let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;
let canClick = false;

let h2 = document.querySelector("h2");

// Keyboard se game start hoga.
document.addEventListener("keypress", function() {
    if (!started) {
        started = true;
        levelUp();
    }
});

function gameFlash(btn) {
    if (!btn) return;
    btn.classList.add("flash");
    setTimeout(function () {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn) {
    if (!btn) return;
    btn.classList.add("userflash");
    setTimeout(function () {
        btn.classList.remove("userflash");
    }, 250);
}

function playSequence() {
    canClick = false;

    for (let i = 0; i < gameSeq.length; i++) {
        let btn = document.querySelector(`.${gameSeq[i]}`);
        setTimeout(function() {
            gameFlash(btn);
        }, i * 600);
    }

    // Puri sequence dikhne ke baad hi user click kar sakta hai.
    setTimeout(function() {
        canClick = true;
    }, gameSeq.length * 600);
}

function levelUp() {
    userSeq = [];
    level++;

    if (h2) h2.innerText = `Level ${level}`;

    let randIdx = Math.floor(Math.random() * btns.length);
    let randColor = btns[randIdx];
    gameSeq.push(randColor);

    playSequence();
}

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) {
            canClick = false;
            setTimeout(levelUp, 1000);
        }
    } else {
        // Current level ko score me count nahi karna hai,
        // kyunki player ne is level ko complete nahi kiya.
        let score = Math.max(0, level - 1);

        if (h2) {
            h2.innerHTML = `Game Over! Your score was <b>${score}</b> <br> Press any key to start`;
        }

        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function() {
            document.querySelector("body").style.backgroundColor = "white";
        }, 150);

        reset();
    }
}

function btnPress() {
    // Mobile/touch par pehla click game start karega.
    if (!started) {
        started = true;
        level = 0;
        levelUp();
        return;
    }

    // Sequence play hone ke dauran clicks ignore honge.
    if (!canClick) return;

    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    canClick = false;
}
