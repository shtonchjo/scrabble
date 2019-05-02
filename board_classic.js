board_classic = [
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
];

function setButtonPositions(player) {
    players[player].validatePos = [6, players[player].line];
    players[player].revertPos = [6, players[player].line + 1];
    players[player].shufflePos = [7, players[player].line];
    players[player].calcPos = [7, players[player].line + 1];
    players[player].settingsPos = [-7, players[player].line + 2];
    players[player].hintPos = [7, players[player].line + 2]
}

function cellColor(c) { // single letter codes used in variable 'board'
    switch (c) {
        case "s": // central star cell
            return color(153, 100, 115);
        case "r": // triple-word color
            return color(115, 7, 0)
        case "b": // triple-letter color
            return color(15, 121, 153);
        case "c": // double-letter color
            return color(82, 175, 204);
        case "o": // double-word color
            return color(153, 100, 115);
        case "k": //black
            return color(0, 0, 0);
        case "g": //background
            return color(0, 102, 70);
        case "t": //transparent
            return color(0, 0, 0, 0);
        case "l": //letter tiles
            return color(120, 120, 100);
        case "m": //letter mouse clicked
            return color(220, 220, 200);
        default:
            return color(180, 180, 160);
    }
}