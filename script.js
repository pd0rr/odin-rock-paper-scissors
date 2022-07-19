"use strict"

function computerPlay() {
    let randint = Math.floor(Math.random() * 3);
    switch (randint) {
        case 0:
            return "Rock";
        
        case 1:
            return "Paper";
        
        case 2:
            return "Scissors";
    }
}

/*function computerPlay_freq() {
    let rand = Math.random();
    console.log(rand);
    if (rand < frequencies[0]) return "Paper";
    else if (rand < frequencies[0] + frequencies[1]) return "Scissors";
    else return "Rock";
}*/

function vectorSum(v, w) {
    return v.map((e,i) => e+w[i]);
}

function scale(a, v) {
    return v.map((el) => el * a);
}

function squashed(dim) {
    if (dim == 0) {
        return counts.map(row => row.reduce((a, el) => vectorSum(a,el), [0,0,0]));
    } else if (dim == 1) {
        return counts.reduce((a,el) => a.map((e, i) => vectorSum(e, el[i])), [[0,0,0],[0,0,0],[0,0,0]])
    } else {
        return counts.map(row => row.reduce((a, el) => vectorSum(a,el), [0,0,0])).reduce((a, el) => vectorSum(a, el), [0,0,0]);
    }

}

function find_pattern() {
    let cs = counts[lmPlayer][lmCPU];

    // first probability, then confidence weight.
    let lplc = [[1/3, 1/3, 1/3], 0];
    // last player move + last computer move.
    let tot = cs.reduce((a, x) => a+x, 0);
    if (tot != 0)
        lplc[0] = cs.map(x => x / tot);
    else
        lplc[0] = [1/3, 1/3, 1/3];
    lplc[1] = tot;

    // only player move.
    let pc = [[1/3, 1/3, 1/3], 0];
    let mat = squashed(0)[lmPlayer];
    tot = mat.reduce((a, x) => a+x, 0);
    if (tot != 0)
        pc[0] = mat.map(x => x / tot);
    else
        pc[0] = [1/3, 1/3, 1/3];
    pc[1] = tot;

    // only computer move.
    let cc = [[1/3, 1/3, 1/3], 0];
    mat = squashed(1)[lmCPU];
    tot = mat.reduce((a, x) => a+x, 0);
    if (tot != 0)
        cc[0] = mat.map(x => x / tot);
    else
        cc[0] = [1/3, 1/3, 1/3];
    cc[1] = tot;

    // Just frequency.
    let fc = [[1/3, 1/3, 1/3], 0];
    mat = squashed(2);
    tot = mat.reduce((a, x) => a+x, 0);
    if (tot != 0)
        fc[0] = mat.map(x => x / tot);
    else
        fc[0] = [1/3, 1/3, 1/3];
    fc[1] = tot;

    console.log(mat, tot);
    // now average the probabilities, accounting for confidence. Should we detrend?
    let ws = [lplc[1], pc[1], cc[1], fc[1]];
    tot = lplc[1] + pc[1] + cc[1] + fc[1];

    let sum = [scale(lplc[1], lplc[0]), scale(pc[1], pc[0]), scale(cc[1], cc[0]), scale(fc[1], fc[0])].reduce(vectorSum, [0,0,0]);
    let avg = scale(1/tot, sum);

    console.log(ws, tot, sum, avg);

    return avg;
}

function computerPlay_freq() {

    // if this is the first move, just play randomly.
    if (lmPlayer === undefined || lmCPU === undefined) return computerPlay();

    let rand = Math.random();
    let cs = counts[lmPlayer][lmCPU];

    let tot = cs.reduce((a, x) => a+x, 0);
    let weights = find_pattern();//cs.map(x => x / tot);

    let confidence = Math.sqrt(tot) / tot;

    //console.log(tot, weights);

    let max = Math.max(...weights);
    let f = weights.map(x => x == max);
    let count = f.reduce((a, x) => x? a+1 : a, 0);
    let choice = Math.floor(rand * count)

    let pChoice;
    let c = 0;
    for (let i = 0; i < 3; i++) {
        if (f[i]) {
            console.log(c, choice, c==choice);
            if (c == choice){
                pChoice = i;
                break;
            }
        c++;
        }
    }

    //console.log(`Hello! ${f}, ${choice}, ${pChoice}`);

    if (pChoice == 0) return "Paper";
    else if (pChoice == 1) return "Scissors";
    else return "Rock";
}

function playRound(playerSelection, computerSelection) {
    function ston(s) {
        switch (s.toLowerCase()) {
            case "rock": return 0;
            case "paper": return 1;
            case "scissors": return 2;
        }
    }
    function myMod(n, m) {
        return ((n % m) + m) % m;
    }
    function capitalize(s) {
        return s[0].toUpperCase() + s.slice(1);
    }

    let pn = ston(playerSelection);
    let cn = ston(computerSelection);
    let score = myMod(pn - cn, 3);

    updateData(pn, cn);

    return score;
}


function game() {
    // play 5 rounds of rock-paper-scissors.
    let playerScore = 0;
    let computerScore = 0;

    for(let i = 0; i < 10; i++) {
        function printScore(you, CPU) {
            console.log(`You: ${you} CPU: ${CPU}`);
        }

        let playerChoice = prompt("Player choice (Rock/Paper/Scissors): ");
        let computerChoice = computerPlay_freq();
        console.log(`Computer choice: ${computerChoice}`)

        let gameResult = playRound(playerChoice, computerChoice);

        switch (gameResult) {
            case 0:
                console.log("You Tie!");
                break;
            case 1:
                console.log(`You Win! ${playerChoice} beats ${computerChoice}`);
                playerScore += 1;
                break;
            case 2:
                console.log(`You Lose! ${computerChoice} beats ${playerChoice}`);
                computerScore += 1;
                break;
        }
        printScore(playerScore, computerScore);
    }
}

function gameResultString(gameResult, playerChoice, computerChoice) {
    let s;
    s = `<p>Player choice (Rock/Paper/Scissors): ${playerChoice}</p>\n`;
    s += `<p>Computer choice: ${computerChoice}</p>\n`;
    switch (gameResult) {
        case 0:
            return s + "<p>You Tie!";
        case 1:
            return s + `<p>You Win! ${playerChoice} beats ${computerChoice}</p>\n`;
        case 2:
            return s + `<p>You Lose! ${computerChoice} beats ${playerChoice}</p>\n`;
    }
}

function addGameResultElements(resultElement, gameResult, playerChoice, computerChoice) {
    let pc = document.createElement("p");
    let cc = document.createElement("p");
    let gr = document.createElement("p");
    let score = document.createElement("p");

    pc.textContent = `Player choice (Rock/Paper/Scissors): ${playerChoice}`;
    cc.textContent = `Computer choice: ${computerChoice}`;
    switch (gameResult) {
        case 0:
            gr.textContent = "You Tie!";
            break;
        case 1:
            gr.textContent = `You Win! ${playerChoice} beats ${computerChoice}`;
            break;
        case 2:
            gr.textContent = `You Lose! ${computerChoice} beats ${playerChoice}`;
            break;
    }
    
    score.textContent = scoreString();

    // clear resultElement content.
    resultElement.innerHTML = '';

    resultElement.appendChild(pc);
    resultElement.appendChild(cc);
    resultElement.appendChild(gr);
    resultElement.innerHTML += scoreString();
}

function makeChoiceEventListener(playerChoice, resultElement) {
    return function() {
        let computerChoice = computerPlay_freq();

        //resultElement.textContent = gameResultString(playRound(playerChoice, computerChoice), playerChoice, computerChoice);
        let roundResult = playRound(playerChoice, computerChoice);
        updateScore(roundResult);
        addGameResultElements(resultElement, roundResult, playerChoice, computerChoice);
    };
}

// global variables
var playerScore = 0;
var computerScore = 0;

// player last move, cpu last move, rock paper scissors.
var counts = [[[0,0,0], [0,0,0], [0,0,0]],
              [[0,0,0], [0,0,0], [0,0,0]],
              [[0,0,0], [0,0,0], [0,0,0]]];
var lmPlayer;
var lmCPU;

// update opponent analytics
function updateData(playerChoice, computerChoice) {
    // over time, revert to zero
    counts.map(x => x.map(y => y.map(z => 0.95 * z)));

    // update move counts
    if (lmPlayer !== undefined && lmCPU !== undefined) {
        counts[lmPlayer][lmCPU][playerChoice] += 1;
    }

    lmPlayer = playerChoice;
    lmCPU = computerChoice;
}

/*function updateData(playerChoice) {

    // let's do a moving average over 10 rounds
    let f = frequencies[playerChoice];
    frequencies[playerChoice] = f * 9/10 + 1/10;
    let total = frequencies.reduce((a,b) => a+b, 0);

    // renormalize
    for (let i = 0; i < 3; i++)
        if (i != playerChoice) {
            frequencies[i] = frequencies[i] / total;
        }

    // now take care of patterns.
    f = pattern[lastMove][playerChoice];
    pattern[lastMove][playerChoice] = f * 9/10 + 1/10;
    total = pattern[lastMove].reduce((a,b)=>a+b, 0);
    for (let i = 0; i < 3; i++)
        if (i != playerChoice) {
            pattern[lastMove][i] = pattern[lastMove][i] / total;
        }
    
    lastMove = playerChoice;
}*/

function updateScore(roundResult) {
    if (playerScore < 100 && computerScore < 100) {
        switch (roundResult) {
            case 0:
                break;
            case 1:
                playerScore += 1;
                break;
            case 2:
                computerScore += 1;
                break;
        }
    }
}

function scoreString() {
    let res = `<p>You: ${playerScore} CPU: ${computerScore}</p>`;
    if (playerScore == 100)
        res += `<p>YOU WON THE GAME!</p>`;
    else if (computerScore == 100)
        res += `<p>YOU LOST THE GAME!</p>`;
    return res;
}

function key_event_listener(key) {
    let playerChoice = "";
    if (key.key == "q") playerChoice = "rock";
    else if (key.key == "w") playerChoice = "paper";
    else if (key.key == "e") playerChoice = "scissors";
    else return;

    let computerChoice = computerPlay_freq();

    let roundResult = playRound(playerChoice, computerChoice);
    updateScore(roundResult);
    addGameResultElements(resultDiv, roundResult, playerChoice, computerChoice);
}

// add event listeners
let resultDiv = document.querySelector("#result");

let rock_el = makeChoiceEventListener('rock', resultDiv);
let paper_el = makeChoiceEventListener('paper', resultDiv);
let scissors_el = makeChoiceEventListener('scissors', resultDiv);

let rock = document.querySelector("#rock");
rock.addEventListener('click', rock_el);

let paper = document.querySelector("#paper");
paper.addEventListener('click', paper_el);

let scissors = document.querySelector("#scissors");
scissors.addEventListener('click', scissors_el);

addEventListener('keyup', key_event_listener);