// FIXED VALUES in vw and vh
const liftWidth = 10; //in vw
const floorHeight = 20; //in vh
const liftHeight = floorHeight * 0.9; //in vh
const liftGap = 5; //in vw
const floorGap = 3; //in vh
const floorVerticalPad = 5; //in vh
const floorHorizontalPad = 5; //in vw
const liftHorizontalPad = 2; //in vw
const liftVerticalPad = 0.05 * floorHeight; //in vh
const controlsWidth = 10; //in vw
const controlsHeight = 0.3 * floorHeight; //in vh
const controlsHorizontalPad = 5; //in vw
const controlsVerticalPad = 0.15 * floorHeight; //in vh
const controlsGap = 0.1 * floorHeight; //in vh
const controlsBorderRadius = 15; // in px
const floorNumHeight = controlsVerticalPad;
const floorNumWidth = controlsWidth;
const singleControlUp = 0;
const singleControlBot = 0;
const customTopGap = 50; //in vh
const customBottomGap = 0; //in vh
const doorWidth = 0.4 * liftWidth;
const doorHeight = 0.9 * liftHeight;
const doorVerticalPad = 0.1 * liftHeight;
const doorHorizontalPad = 0.1 * liftWidth;
let gateTimeout = 30;
let closeRate = 0.2;
let doorDelay = 700;
let liftTravelRate = 0.1;
let liftTimeout = 10;
let translateDistance = 0.1;
var floorWidth = 0; //in vw
var bgWidth = 0; //in vw
var bgHeight = 0; //in vh
var numFloors = 0;
var numLifts = 0;

let gateClose = 1;
let gateOpen = 0;

// COLOR SELECTION
const bgColor = "aqua";
const floorBgColor = "green";
const liftBgColor = "yellowgreen";
const controlsTopColor = "orchid";
const controlsBotColor = "orange";
const doorColor = "whitesmoke";

//
/**
 * { status: 0, currentFloor: 0, targetFloor: 0 };
 * Object stored in liftState
 * status -> moving - 1, notMoving - 0
 */
var liftState = [];

// RENDER FUNCTIONS
function dimensionCalc() {
  floorWidth =
    numLifts * liftWidth + (numLifts - 1) * liftGap + liftHorizontalPad * 2;
  bgWidth =
    floorWidth + floorHorizontalPad * 2 + controlsWidth + controlsHorizontalPad;
  bgHeight =
    floorVerticalPad * 2 +
    numFloors * floorHeight +
    (numFloors - 1) * floorGap +
    customTopGap +
    customBottomGap;
}

function renderBuilding() {
  dimensionCalc();
  var bg = document.getElementById("bg-div");
  bg.style.height = bgHeight + "vh";
  bg.style.width = bgWidth + "vw";
  bg.style.backgroundColor = bgColor;

  // console.log(bg.style.height, bg.style.width);

  let i = 0;
  while (i < numFloors) {
    console.log(i);
    var floor = document.createElement("div");
    floor.setAttribute("class", "dem-floor");
    floor.setAttribute("id", "floor-" + i);
    floor.style.width = floorWidth + "vw";
    floor.style.height = floorHeight + "vh";
    floor.style.top =
      floorVerticalPad +
      (numFloors - i - 1) * (floorHeight + floorGap) +
      customTopGap +
      "vh";
    floor.style.bottom =
      floorVerticalPad + i * (floorHeight + floorGap) + customBottomGap + "vh";
    floor.style.left =
      controlsHorizontalPad + controlsWidth + floorHorizontalPad + "vw";
    floor.style.backgroundColor = floorBgColor;
    bg.appendChild(floor);

    var floorNum = document.createElement("div");
    floorNum.setAttribute("class", "dem-floor-num");
    floorNum.setAttribute("id", "floor-num-" + i);
    floorNum.style.width = floorNumWidth + "vw";
    floorNum.style.height = floorNumHeight + "vh";
    floorNum.style.top =
      parseFloat(floor.style.top) + 0.5 * controlsVerticalPad + "vh";
    floorNum.style.left = controlsHorizontalPad + "vw";
    floorNum.innerText = "FLOOR - " + (i + 1).toString();
    bg.appendChild(floorNum);

    if (i == numFloors - 1);
    else {
      var upBut = document.createElement("button");
      upBut.setAttribute("class", "dem-controls");
      upBut.setAttribute("id", "up-floor-" + i);
      upBut.style.width = controlsWidth + "vw";
      upBut.style.height = controlsHeight + "vh";
      upBut.style.top =
        parseFloat(floor.style.top) + controlsVerticalPad * 1.7 + "vh";
      console.log(upBut.style.top);
      upBut.style.left = controlsHorizontalPad + "vw";
      upBut.style.borderRadius = controlsBorderRadius + "px";
      upBut.style.backgroundColor = controlsTopColor;
      upBut.innerText = "UP";
      console.log(i);
      /// WHY i do not work here DIRECTLY??????????
      const floorNum = i;
      upBut.addEventListener("click", function () {
        callLift(floorNum, 1);
      });
      bg.appendChild(upBut);
    }

    if (i == 0);
    else {
      var botBut = document.createElement("button");
      botBut.setAttribute("class", "dem-controls");
      botBut.setAttribute("id", "down-floor-" + i);
      botBut.style.width = controlsWidth + "vw";
      botBut.style.height = controlsHeight + "vh";
      botBut.style.top =
        parseFloat(floor.style.top) +
        controlsVerticalPad * 1.7 +
        controlsHeight +
        controlsGap +
        "vh";
      botBut.style.left = controlsHorizontalPad + "vw";
      botBut.style.borderRadius = controlsBorderRadius + "px";
      botBut.style.backgroundColor = controlsBotColor;
      botBut.innerText = "DOWN";
      console.log(i);
      /// WHY i do not work here DIRECTLY??????????
      const floorNum = i;
      botBut.addEventListener("click", function () {
        callLift(floorNum, 0);
      });
      bg.appendChild(botBut);
    }

    i++;
  }

  i = 0;
  while (i < numLifts) {
    // console.log(i);
    var lift = document.createElement("div");
    var groundFloor = document.getElementById("floor-0");
    lift.setAttribute("class", "dem-lift");
    lift.setAttribute("id", "lift-" + i);
    lift.style.width = liftWidth + "vw";
    lift.style.height = liftHeight + "vh";
    lift.style.top = parseFloat(groundFloor.style.top) + liftVerticalPad + "vh";
    // console.log(lift.style.top);
    lift.style.bottom =
      parseFloat(groundFloor.style.bottom) + liftVerticalPad + "vh";
    lift.style.left =
      i * (liftGap + liftWidth) +
      parseFloat(groundFloor.style.left) +
      liftHorizontalPad +
      "vw";
    lift.style.backgroundColor = liftBgColor;
    // console.log(lift.style.left);
    bg.appendChild(lift);

    var doorLeft = document.createElement("div");
    doorLeft.setAttribute("class", "door");
    doorLeft.setAttribute("id", "door-left-" + i);
    doorLeft.style.width = doorWidth + "vw";
    doorLeft.style.height = doorHeight + "vh";
    doorLeft.style.top = parseFloat(lift.style.top) + doorVerticalPad + "vh";
    doorLeft.style.left =
      parseFloat(lift.style.left) + doorHorizontalPad + "vw";
    doorLeft.style.backgroundColor = doorColor;
    bg.appendChild(doorLeft);

    var doorRight = document.createElement("div");
    doorRight.setAttribute("class", "door");
    doorRight.setAttribute("id", "door-right-" + i);
    doorRight.style.width = doorWidth + "vw";
    doorRight.style.height = doorHeight + "vh";
    doorRight.style.top = parseFloat(lift.style.top) + doorVerticalPad + "vh";
    doorRight.style.left =
      parseFloat(lift.style.left) + doorHorizontalPad + doorWidth + "vw";
    doorRight.style.backgroundColor = doorColor;
    bg.appendChild(doorRight);

    liftState[i] = { status: 0, currentFloor: 0, targetFloor: 0 };

    i++;
  }
}

function findLift(floorNum, directionOfCall) {
  var i = 0;
  while (i < numLifts) {
    if (liftState[i].status == 0) {
      return i;
    } else {
      i++;
    }
  }
  return -1;
}

function callLift(floorNum, directionOfCall) {
  var liftId = findLift(floorNum, directionOfCall);
  let direction = 0;
  if (liftState[liftId].currentFloor > floorNum) {
    direction = -1;
  } else if (liftState[liftId].currentFloor < floorNum) {
    direction = 1;
  } else if (liftState[liftId].currentFloor == floorNum) {
    direction = 0;
  }
  let t = setInterval(function () {
    var lift = document.getElementById("lift-" + liftId);
    liftState[liftId].status = 1;
    liftState[liftId].targetFloor = floorNum;
    var floor = document.getElementById("floor-" + floorNum);
    translateLift(liftId, direction, translateDistance);
    if (
      parseFloat(lift.style.top) ==
      parseFloat(floor.style.top) + liftVerticalPad
    ) {
      clearInterval(t);
      // liftState[liftId].status = 0;
      liftState[liftId].currentFloor = floorNum;
      toggleGate(liftId);
      console.log(lift.style.top, floor.style.top, liftVerticalPad);
    }
  }, liftTimeout);
}

function translateLift(liftId, direction, distance) {
  var lift = document.getElementById("lift-" + liftId);
  var leftDoor = document.getElementById("door-left-" + liftId);
  var rightDoor = document.getElementById("door-right-" + liftId);
  if (direction == 1) {
    lift.style.transform = "translateY(-" + distance + "vh)";
    lift.style.top = parseFloat(lift.style.top) - liftTravelRate + "vh";
    leftDoor.style.transform = "translateY(-" + distance + "vh)";
    leftDoor.style.top = parseFloat(leftDoor.style.top) - liftTravelRate + "vh";
    rightDoor.style.transform = "translateY(-" + distance + "vh)";
    rightDoor.style.top =
      parseFloat(rightDoor.style.top) - liftTravelRate + "vh";
  } else if (direction == -1) {
    lift.style.transform = "translateY(" + distance + "vh)";
    lift.style.top = parseFloat(lift.style.top) + liftTravelRate + "vh";
    leftDoor.style.transform = "translateY(" + distance + "vh)";
    leftDoor.style.top = parseFloat(leftDoor.style.top) + liftTravelRate + "vh";
    rightDoor.style.transform = "translateY(" + distance + "vh)";
    rightDoor.style.top =
      parseFloat(rightDoor.style.top) + liftTravelRate + "vh";
  } else if (direction == 0) {
    console.log("Have Lift");
  }
}

function toggleGate(liftId) {
  var leftDoor = document.getElementById("door-left-" + liftId);
  var rightDoor = document.getElementById("door-right-" + liftId);
  let o = setInterval(function () {
    leftDoor.style.width = parseFloat(leftDoor.style.width) - closeRate + "vw";
    rightDoor.style.width =
      parseFloat(rightDoor.style.width) - closeRate + "vw";
    rightDoor.style.left = parseFloat(rightDoor.style.left) + closeRate + "vw";
    console.log(leftDoor.style.width);
    if (parseFloat(leftDoor.style.width) == 0) {
      clearInterval(o);
      setTimeout(function () {
        openGate(liftId);
      }, doorDelay);
    }
  }, gateTimeout);
}

function openGate(liftId) {
  var leftDoor = document.getElementById("door-left-" + liftId);
  var rightDoor = document.getElementById("door-right-" + liftId);
  let c = setInterval(function () {
    leftDoor.style.width = parseFloat(leftDoor.style.width) + closeRate + "vw";
    rightDoor.style.width =
      parseFloat(rightDoor.style.width) + closeRate + "vw";
    rightDoor.style.left = parseFloat(rightDoor.style.left) - closeRate + "vw";
    if (parseFloat(leftDoor.style.width) >= doorWidth) {
      clearInterval(c);
      liftState[liftId].status = 0;
    }
  }, gateTimeout);
}

numFloors = prompt("Enter Number of Floors");
numLifts = prompt("Enter Number of Lifts");
console.log(numFloors, numLifts);
// Make a input section which will take inputs of floors and lifts and remove prompt box
renderBuilding();
