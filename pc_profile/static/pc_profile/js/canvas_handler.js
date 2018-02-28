function initializeCanvas(canvas, referenceString) {
  var $container = $(canvas).parent();
  const container = $container.get(0);
  const container_width = $container[0].offsetWidth;
  const container_height = $container[0].offsetHeight;
  $(canvas).attr({width: container_width, height: container_width});

  // can not get correct width until canvas height and width is decided in element
  var rect = $container[0].getBoundingClientRect();

  var paddingLeft = $container.css("padding-left").substring(0, $container.css("padding-left").length - 2);
  var paddingTop = $container.css("padding-top").substring(0, $container.css("padding-top").length - 2);
  paddingLeft = parseInt(paddingLeft);
  paddingTop = parseInt(paddingTop);

  $(canvas).attr({width: (rect.width - paddingLeft * 2) * definition_scale, height: (rect.height - paddingTop * 2) * definition_scale});
  canvas.style.width = (canvas.width / definition_scale).toString() + "px";
  canvas.style.height = (canvas.height / definition_scale).toString() + "px";
  if(!referenceString) {
    const referenceString = handleGridString(ret);

    drawGridFromString(canvas, referenceString);
  } else {
    const referenceStr = handleGridString(referenceString);
    drawGridFromString(canvas, referenceStr);
  }

}

function handleGridString(gridString) {
  var ret = gridString.trim();
  var ret = gridString.split("\n");
  var i = 0;
  while(i < ret.length) {
    if(ret[i] == '')
      ret.splice(i, 1);
    i++;
  }
  for(var i = 0; i < ret.length; ++i) {
    ret[i] = ret[i].trim();
  }
  var rows = ret.length;
  var cols = ret[0].length;
  return ret;
}

function drawGridFromString(canvas, referenceString) {

  const context = canvas.getContext("2d");
  context.translate(0.5, 0.5);

  var padding = 8 * definition_scale;
  const rows = referenceString.length;
  const cols = referenceString[0].length;
  const max_length = Math.max(rows, cols);

  var square_width = 0;
  var grid_margin_top = padding;
  var grid_margin_left = padding;
  // x is the divisor to the relative size of padding to square_width
  const padding_ratio = 2.5;
  if(cols / rows > canvas.width / canvas.height) {
    square_width = (canvas.width) / (cols + (cols + 1) / padding_ratio);
    padding = square_width / padding_ratio
    // square_width = square_width - padding;
    const grid_height = (square_width + padding) * rows - padding;
    grid_margin_top = (canvas.height - grid_height) / 2;
    grid_margin_left = padding;
  } else {
    console.log(canvas.height);
    square_width = (canvas.height) / (rows + (rows + 1) / padding_ratio);
    padding = square_width / padding_ratio;
    // square_width = square_width - padding;
    const grid_width = (square_width + padding) * cols - padding;
    grid_margin_left = (canvas.width - grid_width) / 2;
    grid_margin_top = padding;
  }

  const x_length = padding + (square_width + padding) * cols;
  const y_length = padding + (square_width + padding) * rows;
  const radius = padding / 3.5;
  for(var i = 0, y = grid_margin_top; i < rows; i++) {
    for(var j = 0, x = grid_margin_left; j < cols; j++) {
      const seatState = referenceString[i][j];
      var fillColor;
      if(seatState == '*') {
        context.fillStyle = seat_color;
        fillColor = seat_color;
        context.fillRect(x, y, square_width, square_width);
        drawRoundedSquare(context, x, y, radius, square_width, fillColor);

      } else if(seatState == '#') {
        context.fillStyle = counter_color;
        fillColor = counter_color;
        context.fillRect(x, y, square_width, square_width);
        drawRoundedSquare(context, x, y, radius, square_width, fillColor);
        const path = getCounterPath(i, j, referenceString);
        fillPathRectangle(context, x, y, square_width, radius, padding,
          path["direction"], path["length"]);

      } else if (seatState == '-' || seatState == '|') {
        context.fillStyle = empty_seat_color;
        fillColor = empty_seat_color;
        context.fillRect(x, y, square_width, square_width);
        drawRoundedSquare(context, x, y, radius, square_width, fillColor);
      } else if (seatState == '+') {
        context.fillStyle = seat_color;
        fillColor = seat_color;
        context.fillRect(x, y, square_width, square_width);
        drawRoundedSquare(context, x, y, radius, square_width, fillColor);

      } else {
        // context.fillStyle = "#000";
        // fillColor = "#000";
        // context.fillRect(x, y, square_width, square_width);
        // drawRoundedSquare(context, x, y, radius, square_width, fillColor);
      }

      x += (square_width + padding);
    }
    y += (square_width + padding);
  }

}

function drawRoundedSquare(context, x, y, radius, width, fillColor) {
  context.fillStyle = fillColor;
  // Drawing Circles
  drawCircle(context, x, y, radius, fillColor);
  drawCircle(context, x + width, y, radius, fillColor);
  drawCircle(context, x, y + width, radius, fillColor);
  drawCircle(context, x + width, y + width, radius, fillColor);

  // Drawing rectangles
  context.fillStyle = fillColor;
  context.fillRect(x - radius, y, 2 * radius, width);
  context.fillRect(x, y - radius, width, 2 * radius);
  context.fillRect(x + width - radius, y, 2 * radius, width);
  context.fillRect(x, y + width - radius, width, 2 * radius);
}

function drawCircle(context, x, y, radius, fillColor) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = fillColor;
  context.fill();
}

function getCounterPath(actual_x, actual_y, referenceString) {
  var count = 0;
  var x = actual_x;
  var y = actual_y;
  if(x < referenceString.length - 1 &&
      referenceString[x + 1][y] == '#') {// Going down
    while(referenceString[x+1][y] == '#') {
      count++;
      x++;
    }
    return {"direction": "down", "length": count};
    console.log("Going right");
  } else if(y < referenceString[0].length - 1 &&
      referenceString[x][y + 1] == "#") {// Going right
    while(referenceString[x][y+1] == '#') {
      count++;
      y++;
    }
    return {"direction": "right", "length": count};
  } else {
    return {"direction": "none", "length": 0};
  }

}

function fillPathRectangle(context, x, y, square_width, radius, padding,
  direction, length) {
    if(direction == "right" && length > 0) {
      const startX = x + radius;
      const startY = y - radius;
      const width = square_width + radius + (square_width + radius * 2) * length;
      const height = square_width + radius * 2;
      context.fillRect(startX, startY, width, height);

    } else if(direction == "down" && length > 0) {
      const startX = x - radius;
      const startY = y + radius;
      const width = square_width + radius * 2;
      const height = square_width + radius + (square_width + radius * 2) * length;
      context.fillRect(startX, startY, width, height);
    }

}

function getCurrentGrid(profileID, initializeCanvas) {
  $.ajax({
    url: '/current-grid/' + profileID,
    type: 'GET',
    success: function(data) {
      initializeCanvas(this, data.grid);

    }.bind(this)
  });
}

const definition_scale = 3;

const seat_color = "#263333";
// const seat_color = "#252525";

const counter_color = "#9b9b9b";

const empty_seat_color = "#bfdfff";

// var ret = `-....+.....
// -.+-.--.-.-
// -.+-.++.-.-
// -.--.-+.-.+
// +.-+.+-.+.-
// -.++.-+.-.+
// +.+-.++.-..
// +.++.+-.-..
// -.-+.++.-..
// ...........
// +.+-.-....+
// +.--.-....+
// -.--.-....+
// +.++.-.##.+
// `

var ret = `+++++
-----
++-++
+-+-+
-+++-
`
