let gridX, gridY; //board divisions
let l; //width of cells or tiles
let board; //positions of special cells on board
let tileParams; //international versions of Scrabble
let lang = "eo";
let deckTiles = new Array; // all tiles to pick from, to go to playerX or placedTiles
let placedTiles = new Array; // set in place
let players = new Array;
let playing = 0;
let nbPlayers = 2; // max 4
let otherPlayersHidden = true; // false;
let hoverText = "";
let nbTiles = 0;

let dragging = false; // Is the object being dragged?
let allowedCell = true; //
let originalPos;
let dragTileIndex;
let dragPlayer;
let offsetX, offsetY; // Mouseclick offset

let drawVeil = false; // half transparent veil drawn over all game except settings
let records = []; // records the moves played, for displaying on the side
let info = "";
let easyMode = true;
var dict_eo //loading Esperanto dictionary

function preload() {
  bkgd = loadImage("./green.jpg") //, [successCallback], [failureCallback])

  readTextFile("./dict_eo.json", function (text) {
    dict_eo = JSON.parse(text);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gridX = 15;
  gridY = 23;
  l = min(width / gridX, height / gridY);

  board = [
    "tttttr  c   r   c  rttttt",
    "ttttt o   b   b   o ttttt",
    "ttttt  o   c c   o  ttttt",
    "tttttc  o   c   o  cttttt",
    "t432t    o     o    t1ttt",
    "t432t b   b   b   b t1ttt",
    "t432t  c   c c   c  t1ttt",
    "t432tr  c   s   c  rt1ttt",
    "t432t  c   c c   c  t1ttt",
    "t432t b   b   b   b t1ttt",
    "t432t    o     o    t1ttt",
    "tttttc  o   c   o  cttttt",
    "ttttt  o   c c   o  ttttt",
    "ttttt o   b   b   o ttttt",
    "tttttr  c   r   c  rttttt"
  ]; // TODO other board variants

  tileParams = [{
      lang: "eo",
      lettrs: "ABCĈDEFGĜHĤIJĴKLMNOPRSŜTUŬVZ ",
      quanty: "82123822211831444683661441212",
      values: "1444213338A12A212112114118350",
      txPnts: "poentoj",
      txName: "Nomo",
      playerTiles: 7 // TODO in eo is 8 — not yet implemented, only 7 works (hard coded)
    },
    {
      lang: "en",
      lettrs: "ABCDEFGHIJKLMNOPQRSTUVWXYZ ",
      quanty: "9224C2329114268216464221212",
      values: "1332142418513112A11114484A0",
      txPnts: "points",
      txName: "Name",
      playerTiles: 7
    },
    {
      lang: "fr",
      lettrs: "ABCDEFGHIJKLMNOPQRSTUVWXYZ ",
      quanty: "9223F2228115366216666211112",
      values: "1332142418A12113811114AAAA0",
      txPnts: "points",
      txName: "Nom",
      playerTiles: 7
    }
  ];

  // creating all tiles
  let i = 0;
  let tileParam = tileParams.find(o => o.lang === lang);
  for (letr = 0; letr < tileParam.lettrs.length; letr++) {
    nbTiles += parseInt(tileParam.quanty[letr], 16);
    for (qty = 0; qty < tileParam.quanty[letr]; qty++) {
      t = new Tile(-gridX, -gridY, tileParam.lettrs[letr], parseInt(tileParam.values[letr], 16));
      i++
      deckTiles.push(t);
    }
  }

  for (i = 0; i < nbPlayers; i++) {
    p = new Player(i);
    p.pick(7);
    //p.revert();
    players.push(p);
  }

  // for (i=0;i<50;i++){
  //   records.push("Record #" + (i+1))
  // }

  noLoop();
}

function draw() {
  //background(cellInfo("g")[0]);
  background(bkgd);

  push()
  if (width > gridX * l) { //align to the left
    translate((gridX * l - width) / 4, 0);
  }

  rectMode(CORNER); // load bar to show tiles left
  fill(127);
  noStroke();
  rect(width / 2 + gridX / 2 * l - 3.5 * l, height / 2 - gridY * l / 2 + l * 3.25, 3 * l, l / 2, l / 4);
  if (deckTiles.length > 0) {
    fill(150, 0, 200);
    rect(width / 2 + gridX / 2 * l - 3.5 * l, height / 2 - gridY * l / 2 + l * 3.25, 3 * l - l / 4, l / 2, l / 4);
    let progress = map(deckTiles.length, 1, nbTiles, 0, 2.5);
    fill(127);
    rect(width / 2 + gridX / 2 * l - (3.25 - progress) * l, height / 2 - gridY * l / 2 + l * 3.25, l * (2.5 - progress), l / 2);
    // number of tiles remaining
    textAlign(CENTER, TOP);
    textSize(l / 2);
    stroke(127);
    strokeWeight(1);
    fill(0);
    textStyle(BOLD);
    text(deckTiles.length, width / 2 + gridX / 2 * l - (3.25 - progress) * l, height / 2 - gridY * l / 2 + l * 3.3);
  }

  displayBoard();

  // display placed tiles, players' tiles
  for (i = 0; i < placedTiles.length; i++) {
    placedTiles[i].display();
  }
  for (i = 0; i < players.length; i++) {
    players[i].displayName();
    for (j = 0; j < players[i].tiles.length; j++) {
      players[i].tiles[j].display();
    }
  }

  // hover text over buttons - draw after tiles
  if (!drawVeil) {
    mPos = mousePos();
    if (mPos[2] * l + width / 2 < textWidth(hoverText)) {
      textAlign(LEFT, BOTTOM);
    } else {
      textAlign(RIGHT, BOTTOM);
    }
    textSize(l / 2);
    stroke(127);
    strokeWeight(1);
    fill(0);
    textStyle(BOLD);
    text(hoverText, mPos[2] * (l - 1.5) + width / 2, mPos[3] * (l - 1.5) + height / 2);
  }

  // dragging of tiles
  if (dragging) {
    players[playing].tiles[dragTileIndex].posX = mousePos()[0];
    players[playing].tiles[dragTileIndex].posY = mousePos()[1];
  }

  if (drawVeil) { // this is the settings menu
    fill(255, 200)
    rectMode(CENTER);
    stroke(255)
    strokeWeight(4);
    rect(width / 2, height / 2, (gridX - 2) * l, (gridY - 2) * l, l, l, l, 0);
  }

  // display records of played moves on the side
  let recordTextHeight = min(height / gridY / 2, height / records.length)
  textSize(recordTextHeight);
  stroke(127);
  strokeWeight(1);
  fill(255);
  textStyle(NORMAL);
  textAlign(LEFT, BOTTOM)
  for (i = 0; i < records.length; i++) {
    text(records[i], width / 2 + gridX / 2 * l + l, (i + 1) * recordTextHeight);
  }

  // display information
  inform(info);
  pop()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  l = min(width / gridX, height / gridY);
  draw();
}

class Player {
  constructor(nthPlayer) {
    this.tiles = [];
    this.score = 0;
    this.name = "Player " + (nthPlayer + 1);
    this.isActive = nthPlayer == 0; // active player always first in array 'players'
    this.line = (this.isActive ? 9 : -8 - nthPlayer);
    this.buttons = [{
      // TODO object with button positions, text in the right language, callbacks
    }];
    this.revertPos = [];
    this.validatePos = [];
    this.shufflePos = [];
    this.calcPos = [];
    this.pickPos = [];
    this.settingsPos = [];
    this.changeNamePos = [];
    this.hintPos = [];
    this.setButtonPositions();
    this.displaceTerritory(); // decides on the positions of buttons
  }
  displayName() {
    x = width / 2 - l * gridX / 2 + width / 100;
    y = height / 2 + this.line * l;
    fill(220);
    textAlign(LEFT, BOTTOM);
    textSize(l / 2.2);
    stroke(127);
    strokeWeight(1);
    textStyle(BOLD);
    text(this.name, x, y);
    text(this.score, x, y + l / 2);
    if (this.isActive) {
      drawTile(this.revertPos[0], this.revertPos[1], l, color(127), "↶");
      drawTile(this.validatePos[0], this.validatePos[1], l, color(127), "✓");
      drawTile(this.shufflePos[0], this.shufflePos[1], l, color(127), "⟲");
      drawTile(this.calcPos[0], this.calcPos[1], l, color(127), "=");
      drawTile(this.settingsPos[0], this.settingsPos[1], l, color(127), "⚙");
      drawTile(this.hintPos[0], this.hintPos[1], l, color(127), "?");
      // other possible buttons ⭯⮾↯🖩
    }
  }
  onTerritory(posX, posY) {
    return ((posY == this.line) && (posX > -4) && (posX < 4));
  }
  pressedBtn(posX, posY) {
    this.settings(posX, posY);
    if (!drawVeil) {
      this.validate(posX, posY);
      this.calculatePoints(posX, posY);
      this.revert(posX, posY);
      this.shuffle(posX, posY);
      this.changeName(posX, posY);
      this.displayHint(posX, posY);
    }
    return null;
  }
  calculatePoints(posX = this.calcPos[0], posY = this.calcPos[1]) { // return false if invalid
    if ((posX == this.calcPos[0]) && (posY == this.calcPos[1])) {
      let i;
      // 10. create temporary list of tiles on the board
      let tilesPlayed = [];
      // 15. figure out extremes
      let leftmost = gridX + 1;
      let rightmost = -1;
      let topmost = gridY + 1;
      let bottommost = -1;
      for (i = 0; i < this.tiles.length; i++) {
        if (!this.onTerritory(this.tiles[i].posX, this.tiles[i].posY)) {
          tilesPlayed.push(this.tiles[i]);
          if (this.tiles[i].posX < leftmost) {
            leftmost = this.tiles[i].posX
          }
          if (this.tiles[i].posX > rightmost) {
            rightmost = this.tiles[i].posX
          }
          if (this.tiles[i].posY < topmost) {
            topmost = this.tiles[i].posY
          }
          if (this.tiles[i].posY > bottommost) {
            bottommost = this.tiles[i].posY
          }
        }
      }
      let horiz = topmost == bottommost;
      let vertic = leftmost == rightmost;
      // 17. check whether a tile is played
      if (tilesPlayed.length == 0) {
        console.log(i18n("Please play a tile"))
        inform(i18n("Please play a tile"))
        return false;
      }
      // 20. deal with particular case of a single tile played
      let single = tilesPlayed.length == 1;
      let direction = (single ? "" : (horiz ? "H" : "V"))
      // 25. determine whether horizontal or vertical or single tile, if neither return false
      let valid = ((horiz ^ vertic) || single) == 1
      if (!valid) {
        console.log(i18n("Tiles need be on same line or column"))
        inform(i18n("Tiles need be on same line or column"))
        return false;
      }
      // 30. order left to right or top to bottom
      if (horiz && !single) {
        tilesPlayed.sort(dynamicSort("posX"));
      } else if (vertic && !single) {
        tilesPlayed.sort(dynamicSort("posY"));
      }
      // 32. check for first tiles being on the star
      let onStar = false;
      for (i = 0; i < tilesPlayed.length; i++) {
        if ((tilesPlayed[i].posX == 0) && (tilesPlayed[i].posY == 0)) {
          onStar = true;
        }
      }
      if (!placedTiles.length && !onStar) {
        console.log(i18n("Place first tiles on the star"))
        inform(i18n("Place first tiles on the star"))
        return false
      }
      // 34. check whether all tiles are connected
      let areConnected = true;
      if (horiz && !single) {
        let pY = tilesPlayed[0].posY
        for (i = leftmost + 1; i <= rightmost - 1; i++) {
          if (isThereATile(i, pY).length) {
            areConnected = false;
            console.log(i18n("Tiles need be connected"))
            inform(i18n("Tiles need be connected"))
            return false;
          }
        }
      } else if (vertic && !single) {
        let pX = tilesPlayed[0].posX
        for (i = topmost + 1; i <= bottommost - 1; i++) {
          if (isThereATile(pX, i).length) {
            areConnected = false;
            console.log(i18n("tiles need be connected"))
            inform(i18n("tiles need be connected"))
            return false;
          }
        }
      }
      // 40. calculate main word
      let storeL = 0;
      let storeW = 1;
      let storeN = 0;
      let mult = "";
      let word = [""];
      for (i = 0; i <= tilesPlayed.length; i++) {
        if (tilesPlayed[i]) {
          let pX = tilesPlayed[i].posX
          let pY = tilesPlayed[i].posY
          mult = getTileMultiplier(pX, pY); // string like "L2" which is treated as an array
          if (mult[0] == "L") {
            storeL += (mult[1] - 1) * tilesPlayed[i].val;
          }
          if (mult[0] == "W") {
            storeW *= mult[1];
          }
        }
      }
      if (horiz) {
        let pY = tilesPlayed[0].posY
        let beginEnd = extendWord(tilesPlayed[0].posX, pY, 1)
        for (i = beginEnd[0]; i <= beginEnd[1]; i++) {
          word[0] += isThereATile(i, pY).letter
          storeN += isThereATile(i, pY).val;
        }
      } else {
        let pX = tilesPlayed[0].posX
        let beginEnd = extendWord(pX, tilesPlayed[0].posY, -1)
        for (i = beginEnd[0]; i <= beginEnd[1]; i++) {
          word[0] += isThereATile(pX, i).letter
          storeN += isThereATile(pX, i).val;
        }
      }
      let score = (storeN + storeL) * storeW;
      // 50. spawn from tilesPlayed, e.g. vertically if main word is horizontal
      storeL = 0;
      storeW = 1;
      storeN = 0;
      mult = "";
      for (i = 0; i < tilesPlayed.length; i++) {
        let pX = tilesPlayed[i].posX;
        let pY = tilesPlayed[i].posY;
        let beginEnd = extendWord(pX, pY, (horiz ? -1 : 1))
        if (beginEnd[0] != beginEnd[1]) {
          mult = getTileMultiplier(pX, pY);
          if (mult[0] == "L") {
            storeL = (mult[1] - 1) * tilesPlayed[i].val;
          }
          if (mult[0] == "W") {
            storeW = mult[1];
          }
          storeN = 0;
          if (!horiz) {
            for (j = beginEnd[0]; j <= beginEnd[1]; j++) {
              word[i + 1] += isThereATile(j, pY).letter
              storeN += isThereATile(j, pY).val;
            }
          } else {
            for (j = beginEnd[0]; j <= beginEnd[1]; j++) {
              word[i + 1] += isThereATile(pX, j).letter
              storeN += isThereATile(pX, j).val;
            }
          }
          score += (storeN + storeL) * storeW;
        }
      }
      // 70. check whether all tiles are used, then set scrabble bonus
      if (tilesPlayed.length == 7) {
        score += 50;
      }

      //console.log(word[0] + " - " + i18n("Score: ") + score)
      inform(word[0] + " - " + i18n("Score: ") + score)
      return [score, word, tilesPlayed, leftmost, topmost, direction];

      // 80. base count * word multipliers + bonus
    }
  }
  settings(posX = this.settingsPos[0], posY = this.settingsPos[1]) { //TODO settings menu
    if ((posX == this.settingsPos[0]) && (posY == this.settingsPos[1])) {
      drawVeil = !drawVeil;
    }
  }
  validate(posX = this.validatePos[0], posY = this.validatePos[1]) {
    if ((posX == this.validatePos[0]) && (posY == this.validatePos[1])) {
      // TODO: if player hasn't played anything, ask for confirmation to pass

      // check for conformity: 2) tiles are connected to already placed tiles or on the star
      // check for conformity: 3) if first to play, check wether word played on the star
      // check for conformity: 4) (optional) word exists in dictionary (otherwise signal)

      // points are calculated and added to score
      let points = this.calculatePoints();
      if (!points[0]) {
        console.log(i18n("Invalid play"))
        inform(i18n("Invalid play"))
        return false;
      }
      // check for joker tiles, replace by letter - underline unicode is \u0332
      for (let i = 0; i < points[2].length; i++) {
        let wordPrompt = points[1][0].replace(/\s/g, "_")
        if (points[2][i].letter == " ") {
          let replacing = prompt(i18n("Replace jokers in \n                       ") + wordPrompt);
          if (replacing == null) { // TODO check against the alphabet in the chosen language
            replacing = "?"
          }
          points[2][i].letter = replacing.toUpperCase() + "\u0332";
          points[1][0] = points[1][0].replace(" ", replacing.toUpperCase() + "\u0332")
        }
      }

      //console.log(i18n("Scored: ") + points[0])
      records.push(this.name + " - +" + points[0] + " - " + points[1][0] + (points[2].length == 7 ? "[S]" : "") + " - (" + points[3] + "," + points[4] + points[5] + ")")
      inform(this.name + " - +" + points[0] + " - " + points[1][0] + (points[2].length == 7 ? "[S]" : "") + " - (" + points[3] + "," + points[4] + points[5] + ")")
      this.score += points[0];

      // player's tiles on the board (i.e. not on the territory) are placed
      for (i = this.tiles.length - 1; i >= 0; i--) {
        if (!this.onTerritory(this.tiles[i].posX, this.tiles[i].posY)) {
          placedTiles.push(this.tiles.splice(i, 1)[0]);
        }
      }

      // draw max amount of tiles
      this.pick(7);
      //next player becomes active
      this.nextPlayer()
    }
    draw();
  }
  nextPlayer() {
    players.push(players.shift());
    players[0].isActive = true;
    players[0].displaceTerritory(9);
    for (let i = 1; i < players.length; i++) {
      players[i].isActive = false;
      players[i].displaceTerritory(-8 - i);
    }

  }
  displaceTerritory(line = this.line) {
    this.line = line;
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].posY = line;
    }
  }
  setButtonPositions() {
    this.validatePos = [6, this.line];
    this.revertPos = [6, this.line + 1];
    this.shufflePos = [7, this.line];
    this.calcPos = [7, this.line + 1];
    this.settingsPos = [-7, this.line + 2];
    this.hintPos = [7, this.line + 2]
  }
  pick(times = 1, posX = this.pickPos[0], posY = this.pickPos[1]) {
    if ((posX == this.pickPos[0]) && (posY == this.pickPos[1])) {
      this.revert()
      for (let i = 0; i < times; i++) {
        if ((deckTiles.length > 0) && (this.tiles.length < 7)) {
          let newTile = deckTiles.splice(random(deckTiles.length), 1)[0];
          newTile.posX = -3 + this.tiles.length;
          newTile.posY = this.line;
          this.tiles.push(newTile);
        }
      }
    }
    draw();
  }
  revert(posX = this.revertPos[0], posY = this.revertPos[1]) {
    if ((posX == this.revertPos[0]) && (posY == this.revertPos[1])) {
      // TODO: if player hasn't played anything and there remain enough tiles, ask whether he wants to redraw all tiles and pass
      for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i].posX = -3 + i;
        this.tiles[i].posY = this.line;
      }
      draw();
    }
  }
  shuffle(posX = this.shufflePos[0], posY = this.shufflePos[1]) { //TODO max number of shuffles
    if ((posX == this.shufflePos[0]) && (posY == this.shufflePos[1])) {
      if (deckTiles.length >= 7) {
        let putAsideTiles = this.tiles;
        this.tiles = [];
        this.pick(7);
        deckTiles.concat(putAsideTiles);
        this.nextPlayer()
      }
    }
  }
  changeName(posX = floor(-gridX / 2), posY = this.line) {
    if ((posX < -3) && (posY == this.line)) {
      let existingNames = [];
      for (i = 0; i < players.length; i++) {
        existingNames.push(players[i].name)
      }
      let newName = prompt("New name", this.name)
      let alreadyExists = false;
      for (i = 0; i < existingNames.length; i++) {
        alreadyExists = alreadyExists || (newName == existingNames[i])
      }
      if (!(newName == "") && !(newName == null) && !alreadyExists) {
        this.name = newName;
        draw();
      }
    }
  }
  displayHint(posX = this.hintPos[0], posY = this.hintPos[1]) {
    if ((posX == this.hintPos[0]) && (posY == this.hintPos[1])) {
      let hints = searchEOdictionary();
      for (let i = hints.length - 1; i >= 0; i--) {
        if (hints[i].length > 0) {
          inform(hints[i]);
          // TODO record that the player asked for hints
          break;
        }
      }
    }
  }
}

class Tile {
  constructor(posX = -10, posY = -10, letter, val, selected = false) {
    this.x = posX * (l + .5);
    this.y = posY * (l + .5);
    this.posX = posX;
    this.posY = posY;
    this.letter = letter;
    this.val = val;
    this.selected = selected;
    this.hidden = false;
  }
  display() {
    if (this.selected) {
      drawTile(this.posX, this.posY, l, cellInfo("l")[0], this.letter, this.val)
    } else {
      drawTile(this.posX, this.posY, l, cellInfo("m")[0], this.letter, this.val)
    }
  }
}

function displayBoard() {
  for (i = 0; i < gridX; i++) {
    for (j = 0; j < gridY; j++) {
      let val = board[i][j - (gridY - gridX) / 2 + 5]
      if (parseInt(val) > nbPlayers) {
        val = "t";
      }
      let info = cellInfo(val)
      drawTile(i - floor(gridX / 2), j - floor(gridY / 2), l, info[0], info[1]);
    }
  }
}

function drawTile(posX, posY, w, cell_color, tx, pnts = -1) { // draws board cells or tiles
  x = posX * w + width / 2;
  y = posY * w + height / 2;
  corner_f = 0.1;
  tx_f = 0.5;
  val_f = 0.3;
  rectMode(CENTER)
  if (pnts >= 0) { // if there are points, it means it's a tile
    tile_f = 0.85;
    stroke(50);
    strokeWeight(1);
    fill(cell_color)
    rect(x, y, w * tile_f, w * tile_f, w * corner_f);
    if (!this.hidden) {
      fill(0);
      noStroke();
      textAlign(RIGHT, BOTTOM);
      textSize(w * val_f * tile_f);
      textStyle(NORMAL);
      text(pnts, x + 0.45 * w * tile_f, y + 0.45 * w * tile_f); // tile value
    }
  } else { // it's a board cell
    tile_f = 1;
    noStroke();
    fill(cell_color)
    rect(x, y, w, w);
    fill(250);
  }
  if (!this.hidden) {
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(w * tx_f * tile_f);
    textStyle(NORMAL);
    text(tx, x, y); // text on board cell, letter on tile
  }
}

function getTileMultiplier(posX, posY) {
  mult = cellInfo(board[posX + floor(gridX / 2)][posY + floor(gridY / 2) + 1])[2];
  return mult // returns a two-letter code i.e. array [L or W, 2 or 3]
}

function dynamicSort(property) { //dynamic sort array of objects by property. Call "Array.sort(dynamicSort("property"));"
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

function isThereATile(posX, posY, collection = false) {
  let i
  if (!collection) { // by default scans all tiles except other players'
    collection = players[0].tiles.concat(placedTiles)
  }
  for (i = 0; i < collection.length; i++) {
    if ((posX == collection[i].posX) && (posY == collection[i].posY)) {
      return collection[i];
    }
  }
  return {
    val: 0,
    letter: ""
  }
}

function extendWord(posX, posY, dir) {
  // dir: direction -1=down +1=right 0=single tile
  // relies on the default collection of isThereATile
  if (dir == 1) {
    begin = posX;
    end = posX;
    while (isThereATile(--begin, posY).letter != "") {}
    while (isThereATile(++end, posY).letter != "") {}
  }
  if (dir == -1) {
    begin = posY;
    end = posY;
    while (isThereATile(posX, --begin).letter != "") {}
    while (isThereATile(posX, ++end).letter != "") {}
  }
  return [begin + 1, end - 1]
}

function inform(inf) {
  info = inf;
  if (inf == "") {
    return false
  }
  let x = width / 2;
  let y = 10.5 * l + height / 2;
  textSize(l / 2)
  while (textWidth(" " + inf + " ") > l * 8.5) {
    textSize(textSize() - 1);
  }
  rectMode(CENTER)
  stroke(255, 255, 255)
  fill(255, 255, 255, 127)
  rect(x, y, textWidth(" " + inf + " "), textSize() * 1.5)
  textAlign(CENTER, CENTER)
  noStroke()
  fill(0)
  text(inf, x, y)
  return true
}

function mousePos() {
  let offXlargeScreen = 0
  if (width > gridX * l) { //align to the left
    offXlargeScreen = (gridX * l - width) / 4
  }
  mPosX = (mouseX - offXlargeScreen + l / 2 - width / 2) / l;
  mPosY = (mouseY + l / 2 - height / 2) / l;
  return [floor(mPosX), floor(mPosY), mPosX, mPosY]
}

function mouseMoved() { // TODO use a single object in player to scan all buttons
  if ((mousePos()[0] == players[0].revertPos[0]) && ((mousePos()[1] == players[0].revertPos[1]))) {
    hoverText = i18n("back") //TODO translate according to chosen language
    loop();
  } else if ((mousePos()[0] == players[0].validatePos[0]) && (mousePos()[1] == players[0].validatePos[1])) {
    hoverText = i18n("done")
    loop();
  } else if ((mousePos()[0] == players[0].shufflePos[0]) && (mousePos()[1] == players[0].shufflePos[1])) {
    hoverText = i18n("draw")
    loop();
  } else if ((mousePos()[0] == players[0].calcPos[0]) && (mousePos()[1] == players[0].calcPos[1])) {
    hoverText = i18n("calc")
    loop();
  } else if ((mousePos()[0] == players[0].settingsPos[0]) && (mousePos()[1] == players[0].settingsPos[1])) {
    hoverText = i18n("options")
    loop();
  } else if ((mousePos()[0] == players[0].hintPos[0]) && (mousePos()[1] == players[0].hintPos[1])) {
    hoverText = i18n("hint")
    loop();
  } else {
    hoverText = ""
    noLoop()
  }
}

function mousePressed() {
  if (!dragging) {
    for (i = 0; i < players[playing].tiles.length; i++) {
      if ((players[playing].tiles[i].posX == mousePos()[0]) && (players[playing].tiles[i].posY == mousePos()[1])) {
        players[playing].tiles.push(players[playing].tiles.splice(i, 1)[0]); //all this to draw this tile last so it appears above the others
        dragTileIndex = players[playing].tiles.length - 1;
        players[playing].tiles[dragTileIndex].selected = true;
        dragging = true;
        originalPos = [mousePos()[0], mousePos()[1]];
        loop();
        break;
      }
    }
  }
  players[playing].pressedBtn(mousePos()[0], mousePos()[1]);
}

function mouseReleased() {
  if (dragging) {
    posX = players[playing].tiles[dragTileIndex].posX;
    posY = players[playing].tiles[dragTileIndex].posY;

    onBoard = (posX > -gridX / 2) && (posY > -gridX / 2) && (posX < gridX / 2) && (posY < gridX / 2);

    notOnPlacedTile = true;
    for (i = 0; i < placedTiles.length; i++) {
      if ((placedTiles[i].posX == posX) && (placedTiles[i].posY == posY)) {
        notOnPlacedTile = false;
        break;
      }
    }
    notOnCurrentTile = true;
    for (i = 0; i < players[playing].tiles.length; i++) {
      if (!(players[playing].tiles[dragTileIndex] === players[playing].tiles[i])) {
        if ((players[playing].tiles[i].posX == posX) && (players[playing].tiles[i].posY == posY)) {
          notOnCurrentTile = false;
          break;
        }
      }
    }

    withinTerritory = players[playing].onTerritory(posX, posY);

    if (onBoard && notOnPlacedTile && notOnCurrentTile) {
      players[playing].tiles[dragTileIndex].selected = false;
    } else if (withinTerritory) { //swap letters // TODO displace to the left or to the write the arrival tile and the neighbors
      for (i = 0; i < players[playing].tiles.length; i++) {
        if ((players[playing].tiles[i].posX == posX) && (players[playing].tiles[i].posY == posY) && (i != dragTileIndex)) {
          players[playing].tiles[i].posX = originalPos[0];
          break;
        }
      }
      players[playing].tiles[dragTileIndex].selected = false;
    } else {
      players[playing].tiles[dragTileIndex].selected = false;
      players[playing].tiles[dragTileIndex].posX = originalPos[0];
      players[playing].tiles[dragTileIndex].posY = originalPos[1];
    }
    dragging = false;
    noLoop();
  }
}

function mouseOffscreen() {
  hoverText = "";
  mouseReleased();
  draw();
  noLoop();
}

// TODO add keyboard shortcuts for buttons, to select and then move tiles
// 'enter' = validate
// '=' = calculate
// 'backspace' = revert
// 'esc' = shuffle
// 'spacebar' = select/browse through tiles until none is selected
// arrows = move selected tile (borders communicate) 

function cellInfo(c, style) { // single letter codes used in variable 'board'
  switch (style) { //TODO gather in here also the text colors
    // TODO : write stylesheets as separate JSONs
    // format : cell color, cell symbol/text, multiplier code
    default:
      switch (c) {
        case "s": // central star cell
          return [color(153, 100, 115), "★", "W2"];
        case "r": // triple-word color
          return [color(115, 7, 0), "W3", "W3"]; //TODO translate according to chosen language
        case "b": // triple-letter color
          return [color(15, 121, 153), "L3", "L3"];
        case "c": // double-letter color
          return [color(82, 175, 204), "L2", "L2"];
        case "o": // double-word color
          return [color(153, 100, 115), "W2", "W2"];
        case "k": //black
          return [color(0, 0, 0), "", ""];
        case "g": //background
          return [color(0, 102, 70), "", ""];
        case "t": //transparent
          return [color(0, 0, 0, 0), "", ""];
        case "l": //letter tiles
          return [color(120, 120, 100), "", ""];
        case "m": //letter mouse clicked
          return [color(220, 220, 200), "", ""];
        default:
          return [color(180, 180, 160), "", ""];
      }
  }
}

function i18n(message) {
  let translations = [{
    label: "Tiles need be on same line or column",
    eo: "Teguloj estu sur sama vico aŭ kolumno",
    fr: "Les pièces doivent être sur une même ligne ou colonne"
  }, {
    label: "Place first tiles on the star",
    eo: "Havu unu el la unuaj teguloj sur la stelo",
    fr: "Placer une des premières pièces sur l'étoile"
  }, {
    label: "Tiles need be connected",
    eo: "Teguloj estu konektitaj",
    fr: "Les pièces doivent être connectées"
  }, {
    label: "Scored: ",
    eo: "Poentita: ",
    fr: "Points marqués : "
  }, {
    label: "Score: ",
    eo: "Poentoj: ",
    fr: "Points marqués : "
  }, {
    label: "Invalid play",
    eo: "Nevalida ludado",
    fr: "Placement invalide"
  }, {
    label: "Please play a tile",
    eo: "Bonvolu ludi tegulon",
    fr: "Veuillez jouer une lettre"
  }, {
    label: "back",
    eo: "reen",
    fr: "retour"
  }, {
    label: "calc",
    eo: "kiom",
    fr: "calculer"
  }, {
    label: "done",
    eo: "ludi",
    fr: "jouer"
  }, {
    label: "draw",
    eo: "nova",
    fr: "piocher"
  }, {
    label: "options",
    eo: "agordi",
    fr: "options"
  }, {
    label: "hint",
    eo: "help",
    fr: "aide"
  }];
  let translation = translations.find(o => o.label === message);
  if (translation) {
    let toReturn;
    switch (lang) {
      case "eo":
        toReturn = translation.eo;
        if (!toReturn) {
          toReturn = translation.label;
        }
        break;
      case "fr":
        toReturn = translation["fr"];
        if (!toReturn) {
          toReturn = translation["label"];
        }
        break;
      default:
        toReturn = translation["label"];
        break;
    }
    return toReturn;
  }
  return message;
}

// TODO Esperanto dictionary from Reta Vortaro
//  - take all radicals including o,a,e,i,as,ktp
//  - check for combination of radicals 
//  - check joker against any alphabet letter 
//
// TODO if loading get long - set loading bar ◰◳◲◱
//
// TODO easy/cheat mode: the placed tiles are ordered according to the longest/mostpoint radical that can be formed
//
// TODO documentation
//
// TODO tutorial
//
// TODO settings menu 
// - easy/normal modes 
// - how many players 1..4 *
// - play against computer 
// - switch languages *
// - select dictionary (according to language chosen)
// - board variants *
// - color scheme
// (*) restarts game warning
//
// TODO write list of played moves on the right
// Player X - PLAYEDWORD - 123 pts (posX,posY,direction)
// font sized reduced if too many lines
//
// TODO export game played
//
// TODO display with eg a different border color the tiles being played

function saveText(text, filename) {
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
  a.setAttribute('download', filename);
  a.click()
}
// saveText(object_to_save,"filename.json")

function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}

function checkEOdictionary(word) {
  prefixes = ["", "bo", "ĉef", "dis", "ek", "eks", "ge", "mal", "mis", "pra", "re"]
  suffixes = ["", "aĉ", "ad", "aĵ", "an", "ar", "ĉj", "ebl", "ec", "eg", "ej", "em", "end", "er", "estr", "et", "id", "ig", "iĝ", "il", "in", "ind", "ing", "ism", "ist", "nj", "obl", "on", "op", "uj", "ul", "um", "ant", "int", "ont"]
  termin = ["", "n", "a", "aj", "an", "ajn", "e", "en", "i", "o", "oj", "on", "ojn", "u", "as", "os", "is", "us"]
  for (i = 0; i < dict_eo.length; i++) {
    for (p = 0; p < prefixes.length; p++) {
      for (s = 0; s < suffixes.length; s++) {
        for (t = 0; t < termin.length; t++) {
          if (word == prefixes[p] + dict_eo[i] + suffixes[s] + termin[t]) {
            return true
          }
        }
      }
    }
  }
  return false
}


function searchEOdictionary(word = [], withPrefixes = false, withSuffixes = false, withTermination = false, combinationLevel = 0) {
  let timer = Date.now()
  if (word.length == 0) {
    for (i = 0; i < players[playing].tiles.length; i++) {
      word.push(players[playing].tiles[i].letter.toLowerCase())
    }
  } else {
    for (i = 0; i < word.length; i++) {
      word[i] = word[i].toLowerCase();
    }
  }
  let jokerCounter = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] == " ") {
      word.splice(i, 1);
      jokerCounter++;
    }
  }

  function fingerprint(entry) {
    let alphabetLowCase = "abcĉdefgĝhĥijĵklmnoprsŝtuŭvz";
    let toReturn = [];
    let i = 0;
    for (i = 0; i < alphabetLowCase.length; i++) {
      toReturn.push(0);
    }
    for (i = 0; i < entry.length; i++) {
      toReturn[alphabetLowCase.indexOf(entry[i])] += 1;
    }
    return toReturn
  }

  function proximity(fp, w) { // number of missing letters to make word w with letter fingerprint fp
    prox = 0;
    wFp = fingerprint(w)
    for (let i = 0; i < fp.length; i++) {
      prox += max(0, wFp[i] - fp[i]);
    }
    return prox;
  }

  let fp = fingerprint(word);
  let returning = [];
  for (let i = 0; i < 18; i++) {
    returning.push([])
  }
  let prefixes = ["", "bo", "ĉef", "dis", "ek", "eks", "ge", "mal", "mis", "pra", "re"];
  let prefixesL = (withPrefixes ? prefixes.length : 1);
  let suffixes = ["", "aĉ", "ad", "aĵ", "an", "ar", "ĉj", "ebl", "ec", "eg", "ej", "em", "end", "er", "estr", "et", "id", "ig", "iĝ", "il", "in", "ind", "ing", "ism", "ist", "nj", "obl", "on", "op", "uj", "ul", "um", "ant", "int", "ont"];
  let suffixesL = (withSuffixes ? suffixes.length : 1);
  let termin = ["", "n", "a", "aj", "an", "ajn", "e", "en", "i", "o", "oj", "on", "ojn", "u", "as", "os", "is", "us"];
  let terminL = (withTermination ? termin.length : 1);
  let combi = [""].concat(dict_eo);
  let combi1L = (combinationLevel >= 1 ? combi.length : 1);
  let combi2L = (combinationLevel >= 2 ? combi.length : 1);
  let combi3L = (combinationLevel >= 3 ? combi.length : 1);
  // let counter = 0;
  // let loops = dict_eo.length * prefixesL * suffixesL * terminL * combi1L * combi2L * combi3L
  // let loopTimer = Date.now()
  // let timeEstimate = true
  for (let p = 0; p < prefixesL; p++) {
    for (let d = 0; d < dict_eo.length; d++) {
      for (let c1 = 0; c1 < combi1L; c1++) {
        for (let c2 = 0; c2 < combi2L; c2++) {
          for (let c3 = 0; c3 < combi3L; c3++) {
            for (let s = 0; s < suffixesL; s++) {
              for (let t = 0; t < terminL; t++) {
                comb = prefixes[p] + dict_eo[d] + combi[c1] + combi[c2] + combi[c3] + suffixes[s] + termin[t]
                if (proximity(fp, comb) <= jokerCounter) {
                  returning[comb.length].push(comb);
                }
                // if ((counter > 10000) && (timeEstimate)) {
                //   console.log("Estimated: " + ((Date.now() - loopTimer) / 1000) * loops / counter + "s")
                //   timeEstimate = false
                // }
                // counter++
              }
            }
          }
        }
      }
    }
  }
  // console.log("Time spent: " + ((Date.now() - timer) / 1000) + "s")
  return returning
}