console.log('hello, world');

// Timer variables
let time = 0;
let seconds = 0;
let minutes = 0;
let displayTimer = document.getElementById('timer');

/* Use to fetch deck from json word bank */
let cards = []

fetchWordBank = () => {
  fetch('/json/articles.json')
  .then(response => {
    return response.json()
  })
  .then(json => {
    cards = json;
    store();
    createDeck(cards);
  })
  .catch(err => {
    console.log('oops, something went wrong ' + err);
  })
}


createDeck = (cards) => {
  shuffleArray(cards);
  // Use fragment to avoid unnecessary reflowing
  let deckFragment = document.createDocumentFragment();
  // Get deck
  let deckSpace = document.getElementById("deck");
  // Clear current deck
  deckSpace.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    // Create DE card
    let cardArticle = document.createElement('li');
    cardArticle.innerText = cards[i].article;
    cardArticle.classList.add(cards[i].id, 'article', 'card');
    // Create EN card
    let cardCase = document.createElement('li');
    cardCase = document.createElement('li');
    cardCase.innerText = cards[i].case;
    cardCase.classList.add(cards[i].id, 'case', 'card');
    // Add both cards to fragment
    deckFragment.appendChild(cardArticle);
    deckFragment.appendChild(cardCase);
  }
  // Add deck fragment to DOM
  deckSpace.appendChild(deckFragment);
  // Shuffle order
  shuffle();
  // Enable flipping
  addFlipEvent();
}

// Shuffle in DOM to mix up en/nl
// with help from https://stackoverflow.com/questions/7070054/javascript-shuffle-html-list-element-order
shuffle = () => {
  let deck = document.getElementById('deck');
  for (var i = deck.children.length; i >= 0; i--) {
    deck.appendChild(deck.children[Math.random() * i | 0]);
  }
}

// Shuffle whole cards array
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Array to store current open cards
let openCards = [];

// Add click event to 'flip' cards
addFlipEvent = () => {
  let deck = document.getElementsByClassName('card');
  for (let i = 0; i < deck.length; i++){
    deck[i].addEventListener('click', function(){
      // Check if card already open or two cards already open
      if (deck[i].classList.contains('open') || openCards.length == 2){
        event.preventDefault();
      } else {
        deck[i].classList.toggle('open');
        // Add card to open array
        openCards.push(this);
        if (openCards.length == 2) {
          checkMatch();
        }
        if (time == 0){
          startTimer();
        }
      }
    })
  }
}

//  Check for match
checkMatch = () => {
  if (openCards[0].classList[0] == openCards[1].classList[0]){
    if(openCards[0].classList[1] != openCards[1].classList[1]){
      setTimeout(match, 250);
    } else {
      setTimeout(noMatch, 1000);
    }
  } else {
    setTimeout(noMatch, 1000);
  }
  move();
}

// Variable to count matches
let matches = 0;

// If cards match
match = () => {
  for (i = 0; i < openCards.length; i++) {
    openCards[i].classList.add('match');
  }
  openCards.splice(0, 2);
  matches++;
  totalMatches();
}

// If cards don't match
noMatch = () => {
  for (let i = 0; i < openCards.length; i++){
    openCards[i].classList.toggle('open');
  }
  openCards.splice(0, 2);
}

// Modal variables set up
let modal = document.getElementById('win');
let close = document.getElementsByClassName('close');
let modalMoves = document.getElementById('modal-moves');
let modalTime = document.getElementById('modal-time');

// Close modal
closeModal = () => {
  modal.style.display = 'none';
  //adminModal.style.display = 'none';
  reset();
}

// Add close event to multiple close buttons
for (i = 0; i < close.length; i++){
  close[i].addEventListener('click', closeModal);
}

// Check if cards left to match
totalMatches = () => {
  if (matches == 8)
  {
    // Stop timer
    clearInterval(time);
    // Show modal
    showModal();
  }
}

// Show modal with stats
showModal = () => {
  modal.style.display = 'block';
  modalTime.innerText = 'You won in '+ (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
  modalMoves.innerText = 'with ' + moves + ' moves';
}

// Variable to count moves
let moves = 0;
let displayMoves = document.getElementById('moves');

// Count moves and display in DOM
move = () => {
  moves++;
  if (moves == 1) {
    displayMoves.innerHTML = moves + ' Move';
  } else {
    displayMoves.innerHTML = moves + ' Moves';
  }
}

// Timer
startTimer = () => {
  time = setInterval(timer, 1000);
}

timer = () => {
  seconds++;
  if (seconds == 60) {
    minutes++;
    seconds = 0;;
    if (minutes == 60) {
      minutes = 0;
      seconds = 0;
    }
  }
  displayTimer.innerHTML = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
}

resetTimer = () => {
  clearInterval(time);
  time = 0;
  seconds = 0;
  minutes = 0;
}

// Reset - clear variables and shuffle cards
reset = () => {
  createDeck(cards);
  // Reset timer
  resetTimer();
  displayTimer.innerHTML = "00:00";
  // Reset moves
  moves = 0;
  displayMoves.innerHTML = "0 Moves";
  // Reset matches
  matches = 0;
}

// Show admin modal
let adminModal = document.getElementById('admin');

const showAdmin = () => {
  adminModal.style.display = 'block';
}

// Control Buttons Functionality
const resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', reset);

/*const addBtn = document.getElementById('addBtn');
addBtn.addEventListener('click', showAdmin);*/



/* LOCAL STORAGE */
const store = () => {
  // Check storage supported
  if (typeof(Storage) !== "undefined") {
    console.log('let\'s store stuff!');
    // Write cards to localStorage
    localStorage.cards = JSON.stringify(cards);
    console.log(localStorage);
  } else {
    console.log("Sorry, storage not available");
  }
}

const getCards = () => {
  if (localStorage.cards){
    cards = JSON.parse(localStorage.cards);
    createDeck(cards);
  } else {
    fetchWordBank();
  }
}

/* Get new card data and add to cards array
addNewCard = () => {
  let en = document.getElementById('en').value;
  let nl = document.getElementById('nl').value;
  let id = document.getElementById('id').value;
  let cat = document.getElementById('cat').value;
  let card = {
    en: en,
    nl: nl,
    id: id,
    cat: cat
  };
  cards.push(card);
  store();
  clearForm();
}

clearForm = () => {
  let inputs = document.getElementsByClassName('input');
  for (i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
}

const addCardForm = document.getElementById('new-card');
addCardForm.addEventListener('submit', function(e) {
  e.preventDefault()
  addNewCard()
});*/

/* Hamburger Navigation*/
const line1 = document.getElementsByClassName('line1')[0];
const line2 = document.getElementsByClassName('line2')[0];
const line3 = document.getElementsByClassName('line3')[0];
const burger = document.getElementsByClassName('burger')[0];

const toggleMenu = () => {
  line1.classList.toggle('close');
  line2.classList.toggle('close');
  line3.classList.toggle('close');
  console.log('opening or closing burger!');
}

burger.addEventListener('click', toggleMenu);

/* Get cards on document load*/
document.addEventListener('DOMContentLoaded', function(){
  fetchWordBank();
});
