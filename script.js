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

function computerPlay_freq() {
    let rand = Math.random();
    console.log(rand);
    if (rand < pattern[lastMove][0]) return "Paper";
    else if (rand < pattern[lastMove][0] + pattern[lastMove][1]) return "Scissors";
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

    updateData(ston(playerSelection));

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

var frequencies = [1/3, 1/3, 1/3];
var lastMove = 0;
var pattern = [[1/3, 1/3, 1/3],[1/3, 1/3, 1/3],[1/3, 1/3, 1/3]];

// update opponent analytics
function updateData(playerChoice) {

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
    pattern[lastMove][playerChoice] = f * 4/5 + 1/5;
    total = pattern[lastMove].reduce((a,b)=>a+b, 0);
    for (let i = 0; i < 3; i++)
        if (i != playerChoice) {
            pattern[lastMove][i] = pattern[lastMove][i] / total;
        }
    
    lastMove = playerChoice;
}

function updateScore(roundResult) {
    if (playerScore < 10 && computerScore < 10) {
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
    if (playerScore == 10)
        res += `<p>YOU WON THE GAME!</p>`;
    else if (computerScore == 10)
        res += `<p>YOU LOST THE GAME!</p>`;
    return res;
}

function key_event_listener(key) {
    let playerChoice = "";
    if (key.key == "q") playerChoice = "rock";
    if (key.key == "w") playerChoice = "paper";
    if (key.key == "e") playerChoice = "scissors";

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