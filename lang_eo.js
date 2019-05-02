let translations = [{
    label: "Tiles need be on same line or column",
    eo: "Teguloj estu sur sama vico aŭ kolumno"
}, {
    label: "Place first tiles on the star",
    eo: "Havu unu el la unuaj teguloj sur la stelo"
}, {
    label: "Tiles need be connected",
    eo: "Teguloj estu konektitaj"
}, {
    label: "Scored: ",
    eo: "Poentita: "
}, {
    label: "Score: ",
    eo: "Poentoj: "
}, {
    label: "Invalid play",
    eo: "Nevalida ludado"
}, {
    label: "Please play a tile",
    eo: "Bonvolu ludi tegulon"
}, {
    label: "back",
    eo: "reen"
}, {
    label: "calc",
    eo: "kiom"
}, {
    label: "done",
    eo: "ludi"
}, {
    label: "draw",
    eo: "nova"
}, {
    label: "options",
    eo: "agordi"
}, {
    label: "hint",
    eo: "help"
}];

function cellText(c) { // first is displayed, second is code
    switch (c) {
        case "s": // central star cell
            return ["★", "W2"];
        case "r": // triple-word color
            return ["W3", "W3"]; //TODO translate according to chosen language
        case "b": // triple-letter color
            return ["L3", "L3"];
        case "c": // double-letter color
            return ["L2", "L2"];
        case "o": // double-word color
            return ["W2", "W2"];
        case "k": //black
            return ["", ""];
        case "g": //background
            return ["", ""];
        case "t": //transparent
            return ["", ""];
        case "l": //letter tiles
            return ["", ""];
        case "m": //letter mouse clicked
            return ["", ""];
        default:
            return ["", ""];
    }
}