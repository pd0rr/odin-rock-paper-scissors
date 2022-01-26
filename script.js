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
        console.log(`Computer choice : ${computerChoice}`)

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

// add event listeners
let rock = document.querySelector("#rock");
rock.addEventListener('click', function() {
    console.log(playRound('rock', computerPlay()));
});

let paper = document.querySelector("#paper");
paper.addEventListener('click', function() {
    console.log(playRound('rock', computerPlay()));
});

let scissors = document.querySelector("#scissors");
scissors.addEventListener('click', function() {
    console.log(playRound('scissors', computerPlay()));
});