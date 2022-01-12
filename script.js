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

    switch (score) {
        case 0:
            return "You Tie!"
        case 1:
            return `You Win! ${playerSelection} beats ${computerSelection}`;
        case 2:
            return `You Lose! ${computerSelection} beats ${playerSelection}`;
    }
}