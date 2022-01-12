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