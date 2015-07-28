// transformation game
// just trying to help the kids learn/practice geometric transformations
// for educational use only
// questions? email: burressd@bsd405.org

var preImage = document.getElementById("preimage"),
image = document.getElementById("image"),
scale = preImage.width / 20, // makes the grid +/- 10, assumes height = width
transformation = '',
userChoices = {},
level = '',
possiblePoints = 0,
userPoints = 0,
roundPoints = 0,
attempt = 1,
correct = true,
transformations = [];

function polygon() {
  this.x = [0,0,0,0];
  this.y = [0,0,0,0];
  this.color = "249,113,37";
  this.randomize = function() {
    this.x[0] = (Math.floor(Math.random() * 5) - 5);
    this.y[0] = Math.floor(Math.random() * 5);
    this.x[1] = Math.floor(Math.random() * 5);
    this.y[1] = Math.floor(Math.random() * 5);
    this.x[2] = Math.floor(Math.random() * 5);
    this.y[2] = (Math.floor(Math.random() * 5) - 5);
    this.x[3] = (Math.floor(Math.random() * 5) - 5);
    this.y[3] = (Math.floor(Math.random() * 5) - 5);
  };
  this.display = function(canvas) {
    var context = canvas.getContext('2d');
    context.beginPath();
      context.moveTo(this.x[0] * scale + canvas.width / 2,-1 * this.y[0] * scale + canvas.height / 2);
      context.lineTo(this.x[1] * scale + canvas.width / 2,-1 * this.y[1] * scale + canvas.height / 2);
      context.lineTo(this.x[2] * scale + canvas.width / 2,-1 * this.y[2] * scale + canvas.height / 2);
      context.lineTo(this.x[3] * scale + canvas.width / 2,-1 * this.y[3] * scale + canvas.height / 2);
    context.fillStyle = "rgba(" + this.color + ",0.5)";
    context.fill();
  };
}

var transformedPolygon = new polygon(), imagePolygon = new polygon(), userPolygon = new polygon(), preImgPolygon = new polygon();

function prettify(canvas) {
  var context = canvas.getContext('2d');
  context.translate(0.5, 0.5);
}

function clearCanvas(canvas) {
  var context = canvas.getContext('2d');
  context.save();
  context.setTransform(1,0,0,1,0,0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.restore();

  context.beginPath();
  var i = 0;
    for (i=0; i<canvas.width; i = i + 20) {
      context.moveTo(i,0);
      context.lineTo(i,canvas.height);
    }
    for (i=0; i<canvas.height; i = i + 20) {
      context.moveTo(0,i);
      context.lineTo(canvas.width,i);
    }
  context.setLineDash([2,2]);
  context.lineWidth = 1;
  context.stroke();

  context.beginPath();
    context.moveTo(canvas.width / 2,0);
    context.lineTo(canvas.width / 2,canvas.height);
    context.moveTo(0,canvas.height / 2);
    context.lineTo(canvas.width,canvas.height / 2);
  context.setLineDash([0]);
  context.lineWidth = 3;
  context.stroke();
}

function translate(x,y,shape) {
  var i, points = shape.x.length, tempPolygon = new polygon();
  for (i = 0; i < points; i++) {
    tempPolygon.x[i] = shape.x[i] + x;
    tempPolygon.y[i] = shape.y[i] + y;
  }
  return tempPolygon;
}

function rotate(type,shape) {
  var i, points = shape.x.length, tempPolygon = new polygon();
  if (type == "90cw") {
    //(x,y)->(y,-x)
    for (i=0; i < points; i++) {
      tempPolygon.x[i] = shape.y[i];
      tempPolygon.y[i] = -1 * shape.x[i];
    }
  } else if (type == "90ccw") {
    //(x,y)->(-y,x)
    for (i=0; i < points; i++) {
      tempPolygon.x[i] = -1 * shape.y[i];
      tempPolygon.y[i] = shape.x[i];
    }
  } else {
    //180
    //(x,y)->(-x,-y)
    for (i=0; i < points; i++) {
      tempPolygon.x[i] = -1 * shape.x[i];
      tempPolygon.y[i] = -1 * shape.y[i];
    }
  }
  return tempPolygon;
}

function reflect(type,shape) {
  var i, points = shape.x.length, tempPolygon = new polygon();
  if (type == "x") {
    //(x,y)->(x,-y)
    for (i=0; i < points; i++) {
      tempPolygon.x[i] = shape.x[i];
      tempPolygon.y[i] = -1 * shape.y[i];
    }
  } else if (type == "y") {
    //(x,y)->(-x,y)
    for (i=0; i < points; i++) {
      tempPolygon.x[i] = -1 * shape.x[i];
      tempPolygon.y[i] = shape.y[i];
    }
  } else if (type == "yx") {
    //(x,y)->(y,x)
    for (i=0; i < points; i++) {
      tempPolygon.x[i] = shape.y[i];
      tempPolygon.y[i] = shape.x[i];
    }
  } else {
    //y = -x
    //(x,y)->(-y,-x)
    for (i=0; i < points; i++) {
      tempPolygon.x[i] = -1 * shape.y[i];
      tempPolygon.y[i] = -1 * shape.x[i];
    }
  }
  return tempPolygon;
}

function randomTransform(shape) {
  var rand = Math.random() * 3, randX = 0, randY = 0;
  if (transformation == "tra" && rand > 2) {
    rand = Math.random() * 2;
  } else if (rand > 1 && (transformation == "90cw" || transformation == "90ccw" || transformation == "180")) {
    while (rand < 2 && rand > 1) {
      rand = Math.random() * 3;
    }
  } else if (transformation == "x" || transformation == "y" || transformation == "yx" || transformation == "y-x") {
    while (rand < 1) {
      rand = Math.random() * 3;
    }
  }
  if (rand > 2) {
    //translate
    randX = Math.floor(Math.random() * 10) - 5;
    randY = Math.floor(Math.random() * 10) - 5;
    transformedPolygon = translate(randX,randY,shape);
    if (level == "level2" || level == "level4") {
      transformations.push("(x, y) -> (x + " + randX + ", y + " + randY + ")");
    } else {
      transformations.push("translate (x + " + randX + ", y + " + randY + ")");
    }
    transformation = "tra";
  } else if (rand > 1) {
    //rotate
    rand = Math.random() * 3;
    if (rand > 2) {
      transformation = '90cw';
      if (level == "level2" || level == "level4") {
        transformations.push("(x, y) -> (y, -x)");
      } else {
        transformations.push("rotate 90&deg; clockwise");
      }
    } else if (rand > 1) {
      transformation = '90ccw';
      if (level == "level2" || level == "level4") {
        transformations.push("(x, y) -> (-y, x)");
      } else {
        transformations.push("rotate 90&deg; counter-clockwise");
      }
    } else {
      transformation = '180';
      if (level == "level2" || level == "level4") {
        transformations.push("(x, y) -> (-x, -y)");
      } else {
        transformations.push("rotate 180&deg;");
      }
    }
    transformedPolygon = rotate(transformation,shape);
  } else {
    //reflect
    rand = Math.random() * 4;
    if (rand > 3) {
      transformation = 'x';
      if (level == "level2" || level == "level4") {
        transformations.push("(x, y) -> (x, -y)");
      } else {
        transformations.push("reflect over x-axis");
      }
    } else if (rand > 2) {
      transformation = 'y';
      if (level == "level2" || level == "level4") {
        transformations.push("(x, y) -> (-x, y)");
      } else {
        transformations.push("reflect over y-axis");
      }
    } else if (rand > 1) {
      transformation = "yx";
      if (level == "level2" || level == "level4") {
        transformations.push("(x, y) -> (y, x)");
      } else {
        transformations.push("reflect over the line y = x");
      }
    } else {
      transformation = "y-x";
      if (level == "level2" || level == "level4") {
        transformations.push("(x, y) -> (-y, -x)");
      } else {
        transformations.push("reflect over the line y = -x");
      }
    }
    transformedPolygon = reflect(transformation,shape);
  }

  console.log(transformations);
  return transformedPolygon;
}

function prepareControls() {
  $('.transformation1').text("");
  $('.transformation2').text("").hide();
  $('.controls_container').show();

  if (level == "level1" || level == "level3") {
    descriptiveControls("transformation1");
  } else {
    coordinateControls("transformation1");
  }

  if (level == "level3") {
    $('.transformation1').prepend('Transformation 1: ');
    $('.transformation2').append('Transformation 2: ');
    descriptiveControls("transformation2");
    $('.transformation2').show();
  } else if (level == "level4") {
    $('.transformation1').prepend('Transformation 1: ');
    $('.transformation2').append('Transformation 2: ');
    coordinateControls("transformation2");
    $('.transformation2').show();
  }

  $('.formSubmit').show();
}

function descriptiveControls(location) {
  $('.'+location).append('<div class="transformationMenu"><ul><li id="tra">Translate</li><li id="ref">Reflect</li><li id="rot">Rotate</li><br /></ul></div>');
  $('.'+location).append('<div class="transformationOptions">');
  $('.'+location+' .transformationMenu').on('click', 'ul li', function(event) {
    $('.'+location+' .transformationMenu ul li').removeClass('selected');
    $(this).addClass('selected');
    $('.'+location+' .transformationOptions').html('<ul>');
    if (event.target.id == "tra") {
      userChoices[location] = event.target.id;
      $('.'+location+' .transformationOptions ul').append('X: <select id="translateX"><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option><option  value="0" selected>0</option><option value="-1">-1</option><option value="-2">-2</option><option value="-3">-3</option><option value="-4">-4</option><option value="-5">-5</option></select><br />');
      $('.'+location+' .transformationOptions ul').append('Y: <select id="translateY"><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option><option  value="0" selected>0</option><option value="-1">-1</option><option value="-2">-2</option><option value="-3">-3</option><option value="-4">-4</option><option value="-5">-5</option></select>');
    } else if (event.target.id == "ref") {
      $('.'+location+' .transformationOptions ul').append('<li id="x">over the x-axis</li><li id="y">over the y-axis</li><li id="yx">over the line y = x</li><li id="y-x">over the line y = -x</li>');
    } else if (event.target.id == "rot") {
      $('.'+location+' .transformationOptions ul').append('<li id="90cw">90&deg; clockwise</li><li id="90ccw">90&deg; counter-clockwise</li><li id="180">180&deg;</li>');
    }
  });
  $('.'+location).append('</ul></div>');

  $('.'+location+' .transformationOptions').on('click', 'ul li', function(event) {
    if (this.id) {
      $('.'+location+' .transformationOptions ul li').removeClass('selected');
      $(this).addClass('selected');
      userChoices[location] = this.id;
    }
  });

  $('.transformationOptions').height($('.transformationMenu').height());
}

function coordinateControls(location) {
  $('.'+location).append('(x, y) -> ( ');
  $('.'+location).append('<select id="coordX"><option value="-x">-x</option><option value="x" selected>x</option><option value="-y">-y</option><option value="y">y</option></select>');
  $('.'+location).append(' + ');
  $('.'+location).append('<select id="translateX"><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option><option  value="0" selected>0</option><option value="-1">-1</option><option value="-2">-2</option><option value="-3">-3</option><option value="-4">-4</option><option value="-5">-5</option></select>');
  $('.'+location).append(', ');
  $('.'+location).append('<select id="coordY"><option>-x</option><option>x</option><option>-y</option><option selected>y</option></select>');
  $('.'+location).append(' + ');
  $('.'+location).append('<select id="translateY"><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option><option  value="0" selected>0</option><option value="-1">-1</option><option value="-2">-2</option><option value="-3">-3</option><option value="-4">-4</option><option value="-5">-5</option></select>');
  $('.'+location).append(' )');
}

function userDescriptiveTransform(num,shape) {
  var tempPolygon = new polygon();
  if (userChoices["transformation"+num] == "tra") {
      userChoices["x"+num] = Number($('.transformation'+num+' .transformationOptions ul select#translateX').val());
      userChoices["y"+num] = Number($('.transformation'+num+' .transformationOptions ul select#translateY').val());
      tempPolygon = translate(userChoices["x"+num],userChoices["y"+num],shape);
    } else if (userChoices["transformation"+num] == "90cw" || userChoices["transformation"+num] == "90ccw" || userChoices["transformation"+num] == "180") {
      tempPolygon = rotate(userChoices["transformation"+num],shape);
    } else if (userChoices["transformation"+num] == "x" || userChoices["transformation"+num] == "y" || userChoices["transformation"+num] == "yx" || userChoices["transformation"+num] == "y-x") {
      tempPolygon = reflect(userChoices["transformation"+num],shape);
    }

    return tempPolygon;
}

function userCoordinateTransform(num,shape) {
  var tempPolygon = new polygon(), i = 0, points = shape.x.length;
  userChoices["coordX"+num] = $('.transformation'+num+' select#coordX').val();
  userChoices["x"+num] = Number($('.transformation'+num+' select#translateX').val());
  userChoices["coordY"+num] = $('.transformation'+num+' select#coordY').val();
  userChoices["y"+num] = Number($('.transformation'+num+' select#translateY').val());

  for (i=0; i < points; i++) {
    if (userChoices["coordX"+num] == "-x") {
      tempPolygon.x[i] = -1 * shape.x[i];
    } else if (userChoices["coordX"+num] == "-y") {
      tempPolygon.x[i] = -1 * shape.y[i];
    } else if (userChoices["coordX"+num] == "y") {
      tempPolygon.x[i] = shape.y[i];
    } else {
      tempPolygon.x[i] = shape.x[i];
    }

    if (userChoices["coordY"+num] == "-x") {
      tempPolygon.y[i] = -1 * shape.x[i];
    } else if (userChoices["coordY"+num] == "x") {
      tempPolygon.y[i] = shape.x[i];
    } else if (userChoices["coordY"+num] == "-y") {
      tempPolygon.y[i] = -1 * shape.y[i];
    } else {
      tempPolygon.y[i] = shape.y[i];
    }
  }
  tempPolygon = translate(userChoices["x"+num],userChoices["y"+num],tempPolygon);

  return tempPolygon;
}

prettify(image);
prettify(preImage);

$('.levelSelect').on('click', function(event) {
  $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  $('.levelSelect').css('background-color','#ffffff');
  $(this).css('background-color','#80e46b');
  clearCanvas(image);
  clearCanvas(preImage);
  preImgPolygon.randomize();
  preImgPolygon.display(preImage);
  level = event.target.id;
  transformations = [];

  if (level == "level1" || level == "level2") {
    imagePolygon = randomTransform(preImgPolygon);
    $('.hints').text('Select the transformation that creates the image from the pre-image.').css('color','#cccccc');
  } else {
    imagePolygon = randomTransform(randomTransform(preImgPolygon));
    $('.hints').text('Select the transformations that create the image from the pre-image.').css('color','#cccccc');
  }
  imagePolygon.display(image);

  prepareControls();
});

$(document).on('change', 'select', function(event) {
  $(this).css('background-color','#80e46b').css('color','#035167');
});

$('.formSubmit').on('click', function(event) {
  event.preventDefault();

  if (level == "level1") {
    if (!userChoices.transformation1) {
      $('.hints').text("Please select a specific transformation!").css('color','#ee0000');
      return;
    }
  } else if (level == "level3") {
    if (!userChoices.transformation2) {
      $('.hints').text("Please select TWO specific transformations!").css('color','#ee0000');
      return;
    }
  }

  if (level == "level1") {
    userPolygon = userDescriptiveTransform("1",preImgPolygon);
    roundPoints = 1;
  } else if (level == "level2") {
    userPolygon = userCoordinateTransform("1",preImgPolygon);
    roundPoints = 2;
  }
  if (level == "level3") {
    userPolygon = userDescriptiveTransform("2",userDescriptiveTransform("1",preImgPolygon));
    roundPoints = 3;
  } else if (level == "level4") {
    userPolygon = userCoordinateTransform("2",userCoordinateTransform("1",preImgPolygon));
    roundPoints = 4;
  }
  if (attempt == 1) {
    possiblePoints += roundPoints;
  }

  $('.hints').text("Good job! To play again, choose a level!").css('color','#cccccc');

  userPolygon.color = "50,205,50";
  for (var i = 0; i < userPolygon.x.length; i++) {
    if (userPolygon.x[i] != imagePolygon.x[i] || userPolygon.y[i] != imagePolygon.y[i]) {
      userPolygon.color = "150,150,150";
      correct = false;
      $('.hints').text("Nope, sorry! Try again?").css('color','#ee0000');
      
      $('.hints').append("<br />The correct answer was "+transformations[0]);
      if (level == "level3" || level == "level4") {
        $('.hints').append(" and then "+transformations[1]);
      }
      break;
    }
  }
  if (attempt == 1 && correct === false) {
    $('.hints').text("Incorrect. Try again for half-credit!").css('color','#ee0000');
    attempt = 2;
    correct = true;
    userPolygon.display(image);
    return;
  } else if (correct === false) {
    roundPoints = 0;
    attempt = 1;
    correct = true;
  }
  if (attempt == 2) {
    roundPoints /= 2;
    attempt = 1;
  }
  userPolygon.display(image);
  userPoints += roundPoints;

  $('.points').text("You have "+userPoints);
  if (userPoints == 1) {
    $('.points').append(" point out of "+possiblePoints+" attempted.");
  } else {
    $('.points').append(" points out of "+possiblePoints+" attempted.");
  }
  $('.points').show();
  $('.controls_container').hide();
  $('button').css('background-color','#ffffff');
  userChoices = {};
});