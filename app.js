let gameSeq = [];
let userSeq = [];

let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;
let canClick = false; // block user input while sequence is playing

let h2 = document.querySelector("h2");

// Start the game with a keypress (keyboard) or first button click (mobile/touch).
document.addEventListener("keypress", function() {
    if (!started) {
        started = true;
        levelUp();
    }
});

function gameFlash(btn) {
    if (!btn) return; // safety if selector didn't find the element
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
    // disable clicks while playing
    canClick = false;
    console.log('Playing sequence:', gameSeq);
    for (let i = 0; i < gameSeq.length; i++) {
        let color = gameSeq[i];
        let btn = document.querySelector(`.${color}`);
        // schedule flashes spaced by 600ms
        setTimeout(function() {
            gameFlash(btn);
        }, i * 600);
    }
    // enable clicks after the whole sequence has played
    setTimeout(function() {
        canClick = true;
        console.log('Sequence done, user can click');
    }, gameSeq.length * 600);
}

function levelUp() {
    userSeq = [];
    level++;
    if (h2) h2.innerText = `Level ${level}`;

    // random btn choose (use full length of btns array)
    let randIdx = Math.floor(Math.random() * btns.length);
    let randColor = btns[randIdx];

    gameSeq.push(randColor);
    console.log('gameSeq', gameSeq);

    // play full sequence so player can see previous steps
    playSequence();
}

function checkAns(idx) {
    console.log('checkAns', idx, userSeq[idx], gameSeq[idx]);
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) {
            // block clicks while preparing next level
            canClick = false;
            setTimeout(levelUp, 1000);
        }
    } else {
        if (h2) h2.innerHTML = `Game Over! Your score was <b>${level}</b> <br> Press any key to start`;
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function() {
            document.querySelector("body").style.backgroundColor = "white";
        }, 150);
        reset();
    }
}

function btnPress() {
    // If game not started yet, start it (useful on mobile where keypress isn't available).
    if (!started) {
        started = true;
        level = 0; // ensure level starts from 1 inside levelUp
        levelUp();
        return; // ignore this click as a user answer
    }

    // if sequence is playing, ignore clicks
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
