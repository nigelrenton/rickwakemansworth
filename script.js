// JavaScript Document

/* eslint-disable no-undef*/

var stopPoint = "940GZZLURKW";
var count = 0;

function SortByTimeToStation(a, b) {
  return a.timeToStation < b.timeToStation
    ? -1
    : a.timeToStation > b.timeToStation
    ? 1
    : 0;
}

function refresh() {
  var now = new Date();

  /* set moring and evening dates between which trains do not stop i.e., picadilly at Turnham Green*/
  var morning = new Date();
  morning.setHours(6); //6
  morning.setMinutes(30); //30
  morning.setSeconds(0);
  if (morning.getDay() === 0) {
    // sundays are later...
    morning.setHours(7); //7
    morning.setMinutes(45); //45
  }
  var evening = new Date();
  evening.setHours(22); //22
  evening.setMinutes(30); //30
  evening.setSeconds(0);

  /* get the JSON */
  $.getJSON(
    "https://api.tfl.gov.uk/StopPoint/" + stopPoint + "/Arrivals",
    function (e) {
      /* pass over the list returned, clean it up and sort it */
      var trainData = [];

      $.each(e, function (idx, train) {
        /* undef destinations fix */
        if (typeof train.destinationName === "undefined") {
          train.destinationName = "Check front of synthesizer";
        }

        /* create a nice minutesToStation string for display */

        var m = Math.round(train.timeToStation / 60);
        if (m === 0) {
          train.minutesToStation = "due";
        } else if (m === 1) {
          train.minutesToStation = "1 min";
        } else {
          train.minutesToStation = m + " mins";
        }

        /*do annoyging time checks and set our best guess at train.stops and set lineId */
        var arrivalTime = new Date(now.getTime() + train.timeToStation * 1000);

        if (
          arrivalTime > morning &&
          arrivalTime < evening &&
          train.lineId === "piccadilly"
        ) {
          train.stops = false;
        } else {
          train.stops = true;
        }

        trainData.push(train);
      });
      trainData.sort(SortByTimeToStation);

      $.each(trainData, function (idx, train) {
        //       if (train.stops) {
        var li = $("<li></li>", {
          class: train.lineId
        });
        // line image url
        //var lineImg = ('https://via.placeholder.com/100x40.png?text='+train.lineId);
        
        /* create a new <li> item for each train */
        li.append(
          /* add information of interest */
            
   
			"<container id='counter' align='middle'>" +
			train.minutesToStation +
            "</container>" +
            " " +
            "<container id='destination'>" +      
            train.destinationName.replace('Underground Station','').replace('Amersham','Topographic Oceans').replace('Aldgate','Cans and Brahms').replace('Chesham','Close to the Edge') +
            "</container>"
        );

        /* add CSS class so we can identify trains not stopping */
        if (train.stops === false) {
          li.addClass("nostop");
        }
        $('ul#'+train.lineId+train.platformName.substring(0,4)).append(li); /* append to the HTML body */
      });
    }
  );
}

refresh();

setTimeout(function () {
  $('ul#'+train.lineId+train.platformName.substring(0,4)).empty();
  console.log("refreshing " + count);
  count++;
  refresh();
}, 1000); 