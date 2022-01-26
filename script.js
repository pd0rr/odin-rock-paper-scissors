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

    return score;
}


function game() {
    // play 5 rounds of rock-paper-scissors.
    let playerScore = 0;
    let computerScore = 0;

    for(let i = 0; i < 5; i++) {
        function printScore(you, CPU) {
            console.log(`You: ${you} CPU: ${CPU}`);
        }

        let playerChoice = prompt("Player choice (Rock/Paper/Scissors): ");
        let computerChoice = computerPlay();
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
    resultElement.appendChild(score);
}

function makeChoiceEventListener(playerChoice, resultElement) {
    return function() {
        let computerChoice = computerPlay();

        //resultElement.textContent = gameResultString(playRound(playerChoice, computerChoice), playerChoice, computerChoice);
        let roundResult = playRound(playerChoice, computerChoice);
        updateScore(roundResult);
        addGameResultElements(resultElement, roundResult, playerChoice, computerChoice);
    };
}

// global variables
var playerScore = 0;
var computerScore = 0;

function updateScore(roundResult) {
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

function scoreString() {
    return `You: ${playerScore} CPU: ${computerScore}`;
}

// add event listeners
let resultDiv = document.querySelector("#result");

let rock = document.querySelector("#rock");
rock.addEventListener('click', makeChoiceEventListener('rock', resultDiv));

let paper = document.querySelector("#paper");
paper.addEventListener('click', makeChoiceEventListener('paper', resultDiv));

let scissors = document.querySelector("#scissors");
scissors.addEventListener('click', makeChoiceEventListener('scissors', resultDiv));