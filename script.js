$(document).ready(function () {
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext('2d'),
        xCoords = [25, 25, 200, 390,
        25, 208, 398, 25, 208, 398, 25, 208, 398],
        yCoords = [200, 390, 25, 25,
        25, 25, 25, 208, 208, 208, 398, 398, 398],
        heights = [8, 8, 550, 550,
        175, 175, 175, 182, 182, 182, 177, 177, 177],
        widths = [550, 550, 8, 8,
        175, 182, 177, 175, 182, 177, 175, 182, 177],
        cornerRadius = 8,
        elemLeft = canvas.offsetLeft,
        elemTop = canvas.offsetTop,
        elements = [],
        box = [false, false, false, false,
        true, true, true, true, true, true, true, true, true],
        names = ['h1', 'h2', 'v1', 'v2',
        1, 2, 3, 4, 5, 6, 7, 8, 9],
        turn = false, //true = X's, false = O's
        current = [], //applied as 0-8 being the 'X' or 'O' value
        newGame = true;

    //event listener for canvas clicks
    canvas.addEventListener('click', function (event) {
        var x = event.pageX - canvas.offsetLeft,
            y = event.pageY - canvas.offsetTop;
        console.log(x, y);
        elements.forEach(function (element) {
            if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
                if (newGame) build();
                else {
                    addSymbol(element.name);
                    checkWinner();
                }
            }
        });
    });
    //add's X
    var addSymbol = function (box) { // 'x' or 'o', #1-9
        var el = elements[box + 3];
        if (current[box - 1] !== undefined) return;
        else if (turn) {
            //maroon x's #691414
            context.beginPath();
            context.lineWidth = 15;
            context.moveTo(el.left + 25, el.top + 25);
            context.lineTo(el.left + el.width - 25, el.top + el.height - 25);

            context.moveTo(el.left + 25, el.top + el.height - 25);
            context.lineTo(el.left + el.width - 25, el.top + 25);

            context.strokeStyle = '#691414';
            context.stroke();

            current[box - 1] = 'X';
        } else {
            //navyblue o's #33446a
            var radius = 60;
            context.beginPath();
            context.lineWidth = 15;
            context.arc(el.left + el.width / 2, el.top + el.height / 2, radius, 0, Math.PI * 2, false);
            context.closePath();
            context.strokeStyle = '#33446a';
            context.stroke();

            current[box - 1] = 'O';
        }
        turn = !turn;
    },
    checkWinner = function () {
        var xs = [],
            os = [],
            winning = [
                [1, 2, 3],
                [1, 5, 9],
                [1, 4, 7],
                [2, 5, 8],
                [3, 6, 9],
                [3, 5, 7],
                [4, 5, 6],
                [7, 8, 9]
            ];
        //builds X's array and O's array for this turn
        for (var i = 0; i < 9; i++) {
            if (current[i] === 'X') xs.push(i + 1);
            if (current[i] === 'O') os.push(i + 1);
        }
        //function(a,b){return a - b}
        xs.sort();
        os.sort();
        //roll winning combos
        winning.forEach(function (combo) {
            for (var i = 0; i < 9; i++) {
                if (xs.indexOf(combo[0]) !== -1 && xs.indexOf(combo[1]) !== -1 && xs.indexOf(combo[2]) !== -1) {
                    win(combo, 'X');
                    return;
                } else if (os.indexOf(combo[0]) !== -1 && os.indexOf(combo[1]) !== -1 && os.indexOf(combo[2]) !== -1) {
                    win(combo, 'O');
                    return;
                }
            }
        });
        //count how many filled (for tie)
        var count = 0;
        current.forEach(function (box) {
            if (box !== undefined) count++;
        });
        //alert if full
        if (count === 9) {
            win(undefined, 'T');
        }
    },
    win = function (combo, type) { //type = 'X' | 'O' | 'T' // combo = []
        console.log('Win!');
        if (type === 'T') {
            alert('Tie!');
            newGame = true;
            build();
            current = [];
        }
        var start = elements[combo[0] + 3],
            end = elements[combo[2] + 3],
            x1, x2, y1, y2;
        switch (start.name) {
            case 1:
                if (end.name === 9) {
                    x1 = start.left;
                    y1 = start.top;
                } else if (end.name === 3) {
                    x1 = start.left;
                    y1 = start.top + start.height / 2;
                } else if (end.name === 7) {
                    x1 = start.left + start.width / 2;
                    y1 = start.top;
                }
                break;
            case 2:
                x1 = start.left + start.width / 2;
                y1 = start.top;
                break;
            case 3:
                if (end.name === 7) {
                    x1 = start.left + start.width;
                    y1 = start.top;
                } else if (end.name === 9) {
                    x1 = start.left + start.width / 2;
                    y1 = start.top;
                }
                break;
            case 4:
            case 7:
                x1 = start.left;
                y1 = start.top + start.height / 2;
                break;
        }
        switch (end.name) {
            case 3:
            case 6:
                x2 = end.left + end.width;
                y2 = end.top + end.height / 2;
                break;
            case 7:
                if (start.name === 1) {
                    x2 = end.left + end.width / 2;
                    y2 = end.top + end.height;
                } else if (start.name === 3) {
                    x2 = end.left;
                    y2 = end.top + end.height;
                }
                break;
            case 8:
                x2 = end.left + end.width / 2;
                y2 = end.top + end.height;
                break;
            case 9:
                if (start.name === 1) {
                    x2 = end.left + end.width;
                    y2 = end.top + end.height;
                } else if (start.name === 3) {
                    x2 = end.left + end.width / 2;
                    y2 = end.top + end.height;
                } else if (start.name === 7) {
                    x2 = end.left + end.width;
                    y2 = end.top + end.height / 2;
                }
                break;
            default:
                x1 = start.left;
                y1 = start.top;
                break;
        }
        //Line
        context.beginPath();
        context.lineCap = "round";
        context.strokeStyle = "#333";
        context.lineWidth = 12;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        //Message        
        context.lineJoin = "round";
        context.fillStyle = "#888";
        context.strokeStyle = "#333";
        context.strokeRect(175, 255, 250, 85);
        context.fillRect(175, 255, 250, 85);
        context.fillStyle = type === 'X' ? "#691414" : "#33446a";
        context.font = "italic 50pt Times";
        context.textAlign = "center";
        context.fillText((type === 'X' ? "X\'s Win!" : "O\'s Win!"), 300, 320);
        newGame = true;
        current = [];
        turn = false;
    },
    build = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);

        elements.forEach(function (element) {
            if (!element.box) {
                context.lineJoin = "round";
                context.lineWidth = element.radius;
                context.fillStyle = 'antiquewhite';
                context.strokeStyle = '#333';
                context.strokeRect(element.left + (element.radius / 2),
                element.top + (element.radius / 2),
                element.width - element.radius,
                element.height - element.radius);
            } else {
                context.fillRect(element.left, element.top, element.width, element.height);
            }
        });
        newGame = false;
    };
    //End of Definitions Start of Active Code:

    //loops using arrays above to construct grid for game
    for (var i = 0; i < 13; i++) {
        elements.push({
            //color: (box[i] ? '#333':'antiquewhite'),
            width: widths[i],
            height: heights[i],
            top: yCoords[i],
            left: xCoords[i],
            radius: cornerRadius,
            box: box[i],
            name: names[i]
        });
    }

    build();
    gameStart = true;
});
