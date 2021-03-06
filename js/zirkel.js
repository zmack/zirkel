(function() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var circle = Math.PI * 2;
  var buffer = document.createElement('div');
  var base_colors = ['#F00', '#0F0', '#00F'];
  var last_color = null;
  var animating = false;

  function drawCircle(x, y, radius, color, start, length, total) {
    radius = radius || 90;
    start = start || 0;
    total = total || 1;
    length = length || 1;
    var growth = circle / total;
    context.lineWidth = 20;
    context.strokeStyle = color;
    context.beginPath();
    context.arc(x, y, radius, start * growth, (start + length ) * growth, false)
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

  function animateBreakDown(last_color, this_color) {
    var current_frame = 0;
    var total_frames = 100;
    var frame_colors = [0];
    var r_step = (last_color[0] - this_color[0]) / total_frames;
    var g_step = (last_color[1] - this_color[1]) / total_frames;
    var b_step = (last_color[2] - this_color[2]) / total_frames;
    animating = true;

    var timer = setInterval(function() {
      current_frame += 1;
      frame_colors[1] = last_color[0] - (r_step * current_frame);
      frame_colors[2] = last_color[1] - (g_step * current_frame);
      frame_colors[3] = last_color[2] - (b_step * current_frame);
      fillCircle(100, 100, formColor(frame_colors));
      drawColorBreakdown(frame_colors)
      if ( current_frame == 100 ) {
        animating = false;
        clearInterval(timer);
      }
    }, 30);

  }

  function drawColor(color) {
    var colors = breakColor(color);
    colors.unshift(0);
    drawColorBreakdown(colors);
  }

  function drawColorBreakdown(colors) {
    var total = colors.reduce(function(before, now) { return before + now });

    context.clearRect(0, 0, canvas.width, canvas.height);
    fillCircle(100, 100, formColor(colors));

    colors.reduce( function(last, current, index) {
      if ( current != 0 ) {
        drawCircle(100, 100, 90, base_colors[index-1], last, current, total);
      }

      return last + current;
    });
  }

  function formColor(colors) {
    return 'rgb('+~~colors[1] + ',' + ~~colors[2] + ',' + ~~colors[3] + ')'
  }

  var form = document.getElementById('form');
  var color_element = document.getElementById('color');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var this_color = breakColor(color_element.value);

    if ( last_color != null && animating == false ) {
      animateBreakDown(last_color, this_color);
    }

    //drawColorBreakdown(color_element.value);
    //drawCircle(250, 25, 10, formColor(last_color)); 
    //drawCircle(270, 25, 10, formColor(this_color)); 

    last_color = breakColor(color_element.value);
  }, false);

})();

