window.onload = hidePics;
let myAnimals = ['butterfly', 'cat', 'dinosaur', 'dog', 'duck', 'elephant',
                    'gorilla', 'horse', 'ladybird', 'lion', 'pig', 'whale',
                    'butterfly', 'cat', 'dinosaur', 'dog', 'duck', 'elephant',
                    'gorilla', 'horse', 'ladybird', 'lion', 'pig', 'whale'];

// save user fastest time to local storage
let timesArray = JSON.parse(localStorage.getItem('userTimes'));
if (timesArray === null) timesArray = [];
let record = Math.min.apply(Math, timesArray); // find fastest time
convertMs(); // convert fastest time from millieconds to mm:ss:ms
function convertMs() {
    let mins = Math.floor(record / 60000);
    let secs = Math.floor((record - (mins * 60000)) / 1000);
    let ms = record - (mins * 60000) - (secs * 1000);

    recordTime = mins.toString().padStart(2, '0') + ':' +
                    secs.toString().padStart(2, '0') + ':' +
                    ms.toString().padStart(2, '0');
    if ((timesArray === undefined || timesArray.length === 0)) {
        $('.best-time').html('');
    } else {
        $('.best-time').html('Best Time: ' + recordTime);
    }
}
// localStorage.clear(); // to clear storage if needed

// add hidden images to the table in random order            
function hidePics() {
    $(".img").each(function (e) {
        var animal = getRandomAnimal();
        console.log(animal);
        $(this).attr("src", "images/" + animal + ".jpg");
        $(this).attr("data-animal-type", animal);
    });
}  

// ensure hidden images do not repeat
let usedImages = {};
function getRandomAnimal() {
    let randomAnimal;
    do {
        randomAnimal = Math.floor(Math.random() * myAnimals.length);
    } while (usedImages[randomAnimal] === true);
        usedImages[randomAnimal] = true;
    return myAnimals[randomAnimal];
}

let clicked = 0;
let matched = 0;
// reveal images onclick and check for a match
$('.flip').on('click', function(e) {
    start(); // start the clock
    // if user has not yet made two choices AND hasn't clicked a previously revealed card.
    if (2 != clicked && !$(this).hasClass("reveal")) {
        clicked++; // increment click.
        $(this).addClass('reveal').addClass('current'); // reveal and put class current on the card
        if (clicked === 2) {
            $('.flip').addClass('disable-click');
            let guess1, guess2 = null;
            let card_1 = $(".current")[0]; // get the first card
            let card_2 = $(".current")[1]; // get the second card
            guess1 = $(card_1).find(".img").data("animal-type"); // retrieve the value of card 1
            guess2 = $(card_2).find(".img").data("animal-type"); // retrieve the value of card 2
            setTimeout(function() { // timeout for animation
                if (guess1 === guess2) { // it is a match
                    $('.flip').removeClass('disable-click');
                    matched +=2; // +2 to the match count
                    $(".current").addClass("match").removeClass("current reveal"); // lock the card with class match and remove current
                    $('.match img').attr('src', 'images/check.png'); // run match animation
                } else { // it is not a match
                    $('.flip').removeClass('disable-click');
                    $(".current").removeClass("reveal").removeClass("current"); // hide the card and remove the current class
                } 
            }, 500);
            clicked = 0; // reset the counter, user has to guess again
        }
        setTimeout(function() { // timeout for animation
            if (myAnimals.length === matched) {
                $('.message').html('You win!');
                stop(); // stop the clock and check for best time
            }
        }, 1000);
    }
}); 

// init timer
let ms = 0, s = 0, m = 0;
let timer;
let stopwatchEl = document.querySelector('.stopwatch');
let timeTaken;
function start() {
    if (!timer) {
        timer = setInterval(run, 10);
    }
}

function run() {
    stopwatchEl.textContent = getTimer();
    ms++;
    if (ms == 100) {
        ms = 0;
        s++;
    } if (s == 60) {
        s = 0;
        m++;
    }
}

function getTimer() {
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s) + ':' + (ms < 10 ? '0' + ms : ms);
}

// when user completes the game
function stop() {
    clearInterval(timer);
    timer = false;
    $(stopwatchEl).addClass('endgame');
    timeTaken = stopwatchEl.textContent;
    // convert time from string to number
    let timeInMs = ((Number(timeTaken.split(':')[0])*60000) + 
                    (Number(timeTaken.split(':')[1])*1000) + 
                    (Number(timeTaken.split(':')[2]))); 

    let timesArray = JSON.parse(localStorage.getItem('userTimes'));
    if (timesArray === null) timesArray = [];
    localStorage.setItem('timeInMs', JSON.stringify(timeInMs));
    timesArray.push(timeInMs);
    localStorage.setItem('userTimes', JSON.stringify(timesArray));
}

// click to refresh
let playAgain = document.querySelector('#replay');
playAgain.addEventListener('click', restart);
function restart() {
    window.location.reload();
}