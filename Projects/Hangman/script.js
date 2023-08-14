const letterContainer = document.getElementById("letter-container");
const optionsContainer = document.getElementById("options-container");
const userInputSection = document.getElementById("user-input-section");
const newGameContainer = document.getElementById("new-game-container");
const newGameButton = document.getElementById("new-game-button");
const canvas = document.getElementById("canvas");
const resultText = document.getElementById("result-text");
const correctWord = document.getElementById("correct");
const wrongWord = document.getElementById("wrong");
correctWord.innerHTML = 0;
wrongWord.innerHTML = 0;

let options = {
  fruits: ["Apple", "Watermelon", "Orange", "Mango", "Pineapple", "Peach"],
  animals: ["lion", "zebra", "cheetah", "elephant", "chameleon", "alligator"],
  country: ["israel", "switzerland", "yeman", "italy", "england", "mexico"],
};

let winCount = 0;
let count = 0;

let chosenWord = "";

//display option btn//
const displayOptions = () => {
  optionsContainer.innerHTML = "<h3>Please select a category</h3>";
  let buttonCon = document.createElement("div");
  for (let value in options) {
    buttonCon.innerHTML += `<button class="options" onclick="generateWord('${value}')">${value}</button>`;
  }
  optionsContainer.appendChild(buttonCon);
};

const blocker = () => {
  let optionsButton = document.querySelectorAll(".options");
  let letterButton = document.querySelectorAll(".letters");
  optionsButton.forEach((button) => {
    button.disabled = true;
  });

  letterButton.forEach((button) => {
    button.disabled = true;
  });
  newGameContainer.classList.remove("hide");
};

//word generator//
const generateWord = (optionValue) => {
  let optionsButton = document.querySelectorAll(".options");
  optionsButton.forEach((button) => {
    if (button.innerText.toLowerCase() === optionValue) {
      button.classList.add("active");
    }
    button.disabled = true;
  });
  //initially hide letters,clear prev word.
  letterContainer.classList.remove("hide");
  userInputSection.innerText = "";

  let optionsArrey = options[optionValue];
  //choose random word//
  chosenWord = optionsArrey[Math.floor(Math.random() * optionsArrey.length)];
  chosenWord = chosenWord.toUpperCase();

  //replace every letter with span containing dash//
  let displayItem = chosenWord.replace(/./g, '<span class="dashes">_</span>');
  //display each elem as span//
  userInputSection.innerHTML = displayItem;
};

//Initial function(called when page load/newGame)//

const Initializer = () => {
  winCount = 0;
  count = 0;

  //initially erase all content and hide letters and new game btn//
  userInputSection.innerHTML = "";
  optionsContainer.innerHTML = "";
  letterContainer.classList.add("hide");
  newGameContainer.classList.add("hide");
  letterContainer.innerHTML = "";

  //creating letter btn//
  for (let i = 65; i < 91; i++) {
    let button = document.createElement("button");
    button.classList.add("letters");
    //number to ascii[A-Z]//
    button.innerText = String.fromCharCode(i);
    button.addEventListener("click", () => {
      let charArrey = chosenWord.split("");
      let dashes = document.getElementsByClassName("dashes");
      if (charArrey.includes(button.innerText)) {
        charArrey.forEach((char, index) => {
          if (char === button.innerText) {
            dashes[index].innerText = char;
            winCount += 1;
            if (winCount === charArrey.length) {
              resultText.innerHTML = `<h2 class="win-msg">You win!</h2> <p>The word was <span>${chosenWord}</span> </p>`;
              blocker();
              correctWord.innerHTML++;
            }
          }
        });
      } else {
        count += 1;
        drawMan(count);
        //Count==6 (head,body,left arm&leg right arm&leg)//
        if (count == 6) {
          resultText.innerHTML = `<h2 class="lose-msg">Game Over!</h2> <p>The word was <span>${chosenWord}</span> </p>`;
          blocker();
          wrongWord.innerHTML++;
        }
      }
      button.disabled = true;
    });
    letterContainer.appendChild(button);
  }
  displayOptions();
  //call canvas creator for clearing prev canvas and creatin initial canvas//
  let { initialDrawing } = canvasCreator();
  //initialDrawing would draw the frame//
  initialDrawing();
};

//Canvas//
const canvasCreator = () => {
  let context = canvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000";
  context.lineWidth = 2;
  const drawLine = (fromX, fromY, toX, toY) => {
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  };
  const head = () => {
    context.beginPath();
    context.arc(70, 30, 10, 0, Math.PI * 2, true);
    context.stroke();
  };
  const body = () => {
    drawLine(70, 40, 70, 80);
  };
  const leftArm = () => {
    drawLine(70, 50, 50, 70);
  };
  const rightArm = () => {
    drawLine(70, 50, 90, 70);
  };
  const leftLeg = () => {
    drawLine(70, 80, 50, 110);
  };
  const rightLeg = () => {
    drawLine(70, 80, 90, 110);
  };

  //initial frame
  const initialDrawing = () => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //bottom line
    drawLine(10, 130, 130, 130);
    //left line
    drawLine(10, 10, 10, 131);
    //top line
    drawLine(10, 10, 70, 10);
    //small top line
    drawLine(70, 10, 70, 20);
  };
  return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

const drawMan = (count) => {
  let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
  switch (count) {
    case 1:
      head();
      break;
    case 2:
      body();
      break;
    case 3:
      leftArm();
      break;
    case 4:
      rightArm();
      break;
    case 5:
      leftLeg();
      break;
    case 6:
      rightLeg();
      break;
    default:
      break;
  }
};

newGameButton.addEventListener("click", Initializer);
window.onload = Initializer;
