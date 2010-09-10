(function() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var circle = Math.PI * 2;
  var buffer = document.createElement('div');
  var baseColors = ['#F00', '#0F0', '#00F'];

  function drawCircle(x, y, color, start, length, total) {
    start = start || 0;
    total = total || 1;
    length = length || 1;
    var growth = circle / total;
    context.lineWidth = 20;
    context.strokeStyle = color;
    context.beginPath();
    context.arc(x, y, 90, start * growth, (start + length ) * growth, false)
    context.stroke();
    context.closePath();
  }

  function fillCircle(x, y, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, 90, 0, circle, false)
    context.fill();
    context.closePath();
  }

  function breakColor(color) {
    buffer.style.backgroundColor = color;
    var colors = buffer.style.backgroundColor.match(/\(([^)]+)\)/)[1];
    return colors.split(', ').map(function(e) { return parseInt(e, 10) });
  }

  var form = document.getElementById('form');
  var colorElement = document.getElementById('color');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var colors = breakColor(colorElement.value);
    var total = colors.reduce(function(before, now) { return before + now });

    var green = colors[0] + colors[1];
    var blue = colors[0] + colors[1];

    context.clearRect(0, 0, canvas.width, canvas.height);
    fillCircle(100, 100, colorElement.value);

    colors.unshift(0);
    colors.reduce( function(last, current, index) {
      if ( current != 0 ) {
        drawCircle(100, 100, baseColors[index-1], last, current, total);
      }

      return last + current;
    });

    console.log(colors);
  }, false);

})();

