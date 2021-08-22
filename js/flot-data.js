var data = [],
  totalPoints = 300;

function getRandomData() {
  if (data.length > 0) data = data.slice(1);
  // Do a random walk
  while (data.length < totalPoints) {
    var prev = data.length > 0 ? data[data.length - 1] : 50,
      y = prev + Math.random() * 10 - 5;
    if (y < 0) {
      y = 0;
    } else if (y > 100) {
      y = 100;
    }
    data.push(y);
  }
  // Zip the generated y values with the x values
  var res = [];
  for (var i = 0; i < data.length; ++i) {
    res.push([i, data[i]]);
  }
  return res;
}
// Set up the control widget
var updateInterval = 30;
$("#updateInterval")
  .val(updateInterval)
  .change(function () {
    var v = $(this).val();
    if (v && !isNaN(+v)) {
      updateInterval = +v;
      if (updateInterval < 1) {
        updateInterval = 1;
      } else if (updateInterval > 3000) {
        updateInterval = 3000;
      }
      $(this).val("" + updateInterval);
    }
  });
var plot = $.plot("#placeholder", [getRandomData()], {
  series: {
    shadowSize: 0, // Drawing is faster without shadows
  },
  yaxis: {
    min: 0,
    max: 100,
  },
  xaxis: {
    show: false,
  },
  colors: ["#26c6da"],
  grid: {
    color: "#AFAFAF",
    hoverable: true,
    borderWidth: 0,
    backgroundColor: "#FFF",
  },
  tooltip: true,
  tooltipOpts: {
    content: "Y: %y",
    defaultTheme: false,
  },
});

function update() {
  plot.setData([getRandomData()]);
  // Since the axes don't change, we don't need to call plot.setupGrid()
  plot.draw();
  setTimeout(update, updateInterval);
}
update();

// chart move
$(function () {
  var container = $("#flot-line-chart-moving");
  // Determine how many data points to keep based on the placeholder's initial size;
  // this gives us a nice high-res plot while avoiding more than one point per pixel.
  var maximum = container.outerWidth() / 2 || 300;
  //
  var data = [];

  function getRandomData() {
    if (data.length) {
      data = data.slice(1);
    }
    while (data.length < maximum) {
      var previous = data.length ? data[data.length - 1] : 50;
      var y = previous + Math.random() * 10 - 5;
      data.push(y < 0 ? 0 : y > 100 ? 100 : y);
    }
    // zip the generated y values with the x values
    var res = [];
    for (var i = 0; i < data.length; ++i) {
      res.push([i, data[i]]);
    }
    return res;
  }
  //
  series = [
    {
      data: getRandomData(),
      lines: {
        fill: true,
      },
    },
  ];
  //
  var plot = $.plot(container, series, {
    colors: ["#26c6da"],
    grid: {
      borderWidth: 0,
      minBorderMargin: 20,
      labelMargin: 10,
      backgroundColor: {
        colors: ["#fff", "#fff"],
      },
      margin: {
        top: 40,
        bottom: 20,
        left: 20,
      },
      markings: function (axes) {
        var markings = [];
        var xaxis = axes.xaxis;
        for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 1) {
          markings.push({
            xaxis: {
              from: x,
              to: x + xaxis.tickSize,
            },
            color: "#fff",
          });
        }
        return markings;
      },
    },
    xaxis: {
      tickFormatter: function () {
        return "";
      },
    },
    yaxis: {
      min: 0,
      max: 110,
    },
    legend: {
      show: true,
    },
  });
  // Update the random dataset at 25FPS for a smoothly-animating chart
  setInterval(function updateRandom() {
    series[0].data = getRandomData();
    plot.setData(series);
    plot.draw();
  }, 100);
});
