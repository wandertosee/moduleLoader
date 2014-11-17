// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext.createAnalyser
(function (CKM) {
  'use strict';
  /*global alert, document, window, console, setTimeout, CKM*/

  var gameCallBack,
    gameEnd,
    gameStart,
    // TRACK GAME STATE AS ATTRS IN BODY TAG
    clickOrder = "data-gameclickorder",
    gameSeq = "data-gameseq",
    gameCount = "data-gameCount";

  // EACH TIME A PIECE IS PLAYED / IN THIS INSTANCE CLICKED
  // UPDATE GAME STATE / IN THIS INSTANCE IN BODY ATTRIBUTES
  // IF THE GAME IS COMPLETE TRIGGER GAME END
  gameCallBack = function () {
    // NUMBER OF LAST ITEM CLICKED
    var clicked = document.body.getAttribute(clickOrder),
      // VALUE OF CLICKED ITEM
      currentSeq = this.getAttribute(gameSeq),
      // CLIgameCount = TOTAL NUM REQUIRED TO WIN
      count = parseInt(document.body.getAttribute(gameCount), 10),
      // DATA ATTRS HELD AS ARRAY TO ALLOW DUPLICATE PIECES
      clickedItemVals = currentSeq.split(" "),
      // CHECK THE ARRAY AGAINST THE LAST CLICKED ITEM
      indexOfValue = clickedItemVals.indexOf(clicked);
    // ITEM CLICKED IS NEXT IN GAME SEQUENCE / UPDATE SCORE
    if (indexOfValue !== -1) {
      // CONVERT STRING BACK TO INT / ADD 1 TO SCORE
      clicked = parseInt(clickedItemVals[indexOfValue], 10) + 1;
      document.body.setAttribute(clickOrder, clicked);
    }
    if (clicked === count) {
      gameEnd();
    }
  };

  // GAME HAS BEEN WON
  // VISUAL REWARD TRIGGERED HERE
  // ADDITIONAL REWARD TRIGGERED BELOW
  gameEnd = function () {
    var items = CKM.CSS.GetItems(".item"),
      msgStr = "You Win Random Song!",
      msg2Str = "Listen up & fuck off!",
      msg = msgStr.split(''),
      msg2 = msg2Str.split(''),
      ln = msg.length,
      msgComplete = false,
      blah = true,
      newItems = [],
      callBack = function (x) {
        if (msgComplete === true) {
          items[x].innerHTML = msg2[x];
        } else {
          items[x].innerHTML = msg[x];
        }
      },
      x;

    // FUNCTION, TIME, VARIABLE PASSED
    // USING SET TIMEOUT FOR SINGLE INSTANCES
    for (x = 0; x < ln; x += 1) {
      setTimeout(callBack, 100 * x, x);
    }

    // AUDIO REWARD
    //CKM.SoundCloud.RequestURL("cda390685b625014d7cc105aaf41de7d");

    // RESTART GAME AFTER SONG
    
    if (CKM.BandCamp !== 'undefined') {
      CKM.BandCamp.RequestURL("2453851907");
      CKM.BandCamp.band = "Local Girls";
      var restartGame = function () {
          var lightbox,
            audioPlayer;
          lightbox = CKM.Html.getNode(".lightbox");
          lightbox[0].innerHtml = '';
          CKM.CSS.toggle(".lightbox", "hidden");
          audioPlayer = CKM.Html.getNode("#audioPlayer");
          audioPlayer[0].innerHtml = '';
          document.querySelector("#audioPlayer").removeEventListener("ended", restartGame, false);
          console.log("AUDIO ENDED");
          gameStart();
        };
      setTimeout(function () {
        document.querySelector("#audioPlayer").addEventListener("ended", restartGame, false);
      }, 13000);
    }
    CKM.URL.includeFile(bandCampURL, bandCampCallback);
    
    // VISUAL REWARD
    setTimeout(CKM.Flickr.RequestURL("c35fb01bf3720cd16b1249c1974b8f90"), 1000);

    // SQUARE TRANSITION
    setTimeout(function () {
      items = CKM.CSS.GetItems(".item");
      CKM.Events.Items = items;
      CKM.Events.Increment = 0;
      CKM.Events.withReverse = false;
      CKM.Events.NumberOfTimes = newItems.length;
      CKM.Events.Styles = ['border-radius: 0', 'transition: border-radius .5s ease-in-out '];
      CKM.Events.startInterval(100, CKM.Events.callbackIncrementor, items.length);
    }, 12000);

    // OPACITY TRANSITION
    setTimeout(function () {
      CKM.CSS.addStyle("#mainContent", ["spinEffect"]);
      CKM.Events.Increment = 0;
      CKM.Events.NumberOfTimes = items.length;
      CKM.Events.Styles = ['opacity: 0', 'transition: opacity .5s ease-out ', 'width: 10px'];
      CKM.Events.startInterval(100, CKM.Events.callbackIncrementor, items.length);
    }, 15000);


    // SHOW LARGE IMAGE
    if (blah !== false) {
      setTimeout(function () {

        var lightbox = CKM.Html.getNode(".lightbox"),
          docfrag = document.createDocumentFragment(),
          xInterval = {},
          classes = ["hidden"],
          link,
          img,
          backgroundImageCallback,
          id;

        for (x = 0; x < CKM.Flickr.imagesLarge.length; x += 1) {
          id = "img" + x;
          link = CKM.Html.makeEl("a", classes, id, "");
          img = CKM.Html.makeEl("img", "", "", CKM.Flickr.imagesLarge[x]);
          link.appendChild(img);
          docfrag.appendChild(link);
        }

        lightbox[0].appendChild(docfrag);
        CKM.CSS.removeStyle(".lightbox", "hidden");
        backgroundImageCallback = function (x) {
          if (x > 0) {
            CKM.CSS.toggle("#img" + (x - 1), "hidden");
          } else if (x === CKM.Flickr.imagesLarge.length) {
            clearInterval(xInterval);
          }
          CKM.CSS.toggle("#img" + x, "hidden");
        };
        console.log(CKM.Flickr.imagesLarge.length);
        for (x = 0; x < CKM.Flickr.imagesLarge.length; x += 1) {
          console.log(CKM.Flickr.imagesLarge.length);
          xInterval = setTimeout(backgroundImageCallback, 1500 * x, x);
        }
      }, 20000);
    }
  };

  gameStart = function () {
    // CONFIGURATION
    var itemRef = ".item",
      newItems,
      num = CKM.URL.hashParams.num - 1 || 4, // 5 Yeah index 0
      testC,
      testItems,
      // COLOR RANGE CONFIG
      start = CKM.Int.randomWithRange(0, 255) || 0,
      limit = CKM.Int.randomWithRange(150, 255) || 255,
      hsla;

    CKM.CSS.UnStyleElements(itemRef);

    // SET HTML / FIX THIS
    //el = CKM.Html.makeEl("li", ["item", "grow"]);
    //CKM.Html.appendToEl(el, "#grid", 20);

    // RANDOMIZE BACKGROUND COLORS AND BORDER COLORS
    CKM.CSS.GetVendorPrefix();
    CKM.CSS.randomizeElementsColor(itemRef, 1, "backgroundColor", "", start, limit);
    CKM.CSS.randomizeElementsColor(itemRef, ".5", "border", " 10px solid", start, limit);
    CKM.CSS.addStyle(".item", "radiused");
    CKM.CSS.removeStyle("#mainContent", ["spinEffect"]);
    //CKM.CSS.randomizeElementsColor(itemRef, ".5", "border", " 10px solid", start, limit);
    //CKM.CSS.getHue(testC.r, testC.g, testC.b);
    testC = CKM.CSS.getRGB();
    console.dir(testC);
    testItems = CKM.CSS.GetItems(itemRef);
    hsla = CKM.CSS.getHSLAHarmony(CKM.CSS.rgbToHsl(testC.r, testC.g, testC.b), 0.2);

    //CKM.CSS.ElementIterator(testItems, "backgroundColor", CKM.CSS.getRGBA(testC, 1), "", "");
    CKM.CSS.ElementIterator(testItems, "border", hsla, " 10px solid");
    //CKM.CSS.removeStyle(document.querySelector("#mainContent"), ["spinEffect"]);

    setTimeout(function () {
      // RANDOMLY CHOOSE GAME PIECES
      newItems = CKM.CSS.getRandomElements(itemRef, num, true);
      CKM.Events.Items = newItems;
      CKM.Events.Increment = 0;

      // SET GAME VALUES ORDER / COUNTER AND COUNT REQUIRED TO WIN
      CKM.Html.addAttrs(newItems, [gameSeq], "idx");
      // SET CURRENT AND WINNING SEQUENCE
      document.body.setAttribute(clickOrder, 0);
      document.body.setAttribute(gameCount, num + 1);

      // TRANSITIONS
      // TRIGGER TRANSITION FOR EACH OF THE GAME ELEMENTS
      // ANIMATE GAME PIECES AT PAGE LOAD
      CKM.Events.withReverse = true;
      CKM.Events.Increment = 0;
      //CKM.Events.Development = true;  
      CKM.Events.NumberOfTimes = newItems.length;
      //CKM.Events.Styles = ['border-radius: 0px', '-moz-transition: all .5s ease-in-out'];
      CKM.Events.Styles = ['opacity: 0', 'transition: all .5s ease-in-out'];

      CKM.Events.startInterval(1000, CKM.Events.callbackIncrementor, newItems.length);

      // SET UP ITEMS TO RECEIVE FLICKR PICS
      CKM.Flickr.init(CKM.CSS.GetItems(".item"));
      CKM.Events.addEventsAndCallback(newItems, "click", gameCallBack);
    }, 500);
  };
  CKM.URL.parseUrl(window.location);
  setTimeout(gameStart(), 2000);


  // CUSTOM 2 WAY BINDING
  // CUSTOM CALLBACK WHEN CELSIUS IS CHANGED
  function convertCF(src, dst) {
    src = document.getElementById(src);
    dst = document.getElementById(dst);    
    dst.value = (9/5 * src.value + 32).toFixed(0);
  }
  CKM.Binder.bindObj("#celsius", "#fahrenheit", convertCF);


  CKM.Router.init();
  CKM.Binder.bindObj("#fahrenheit", "#total");
}(CKM));

// FROM GAMEEND
    // HIDE ELEMENT TRANSITION
    /*
    setTimeout(function () {
      var player = document.getElementById('audioPlayer'),
        self = this,
        audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
        analyser = audioCtx.createAnalyser(),
        source = audioCtx.createMediaElementSource(player); 
        // this is where we hook up the <audio> element
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        var sampleAudioStream = function() {
            // This closure is where the magic happens. Because it gets called 
            // with setInterval below, it continuously samples the audio data
            // and updates the streamData and volume properties. This the 
            // SoundCouldAudioSource function can be passed to a visualization routine and 
            // continue to give real-time data on the audio stream.
            analyser.getByteFrequencyData(self.streamData);
            // calculate an overall volume value
            var total = 0;
            for (var i = 0; i < 80; i++) { 
              // get the volume from the first 80 bins, 
              //else it gets too loud with treble
                total += self.streamData[i];
            }
            self.volume = total;
            //console.log(total);
        };
      setInterval(sampleAudioStream, 20); // 
      // public properties and methods
      this.volume = 0;
      this.streamData = new Uint8Array(128); 
      // This just means we will have 128 "bins" 
      //(always half the analyzer.fftsize value), 
      //each containing a number between 0 and 255. 
      var canvasElement = document.getElementById('canvas');
      var context = canvasElement.getContext("2d");

      var draw = function() {
          // you can then access all the frequency and volume data
          // and use it to draw whatever you like on your canvas
          for(bin = 0; bin < audioSource.streamData.length; bin ++) {
              // do something with each value. Here's a simple example
              var val = audioSource.streamData[bin];
              var red = val;
              var green = 255 - val;
              var blue = val / 2; 
              context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
              context.fillRect(bin * 2, 0, 2, 200);
              // use lines and shapes to draw to the canvas is various ways. Use your imagination!
          }
          requestAnimationFrame(draw);
      };
      clearInterval(sampleAudioStream);
    }, 17000);
    */
/*
http://css-tricks.com/controlling-css-animations-transitions-javascript/
http://www.smashingmagazine.com/2013/04/26/css3-transitions-thank-god-specification/
http://lea.verou.me/
<h1>Typing animation by Lea Verou.</h1>
@-webkit-keyframes typing {
    from { width: 0 }
    to { width:16.3em }
}

@-moz-keyframes typing {
    from { width: 0 }
    to { width:16.3em }
}

@-webkit-keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: black }
}

@-moz-keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: black }
}

body { font-family: Consolas, monospace; }

h1 { 
    font-size:150%;
    width:16.3em;
    white-space:nowrap;
    overflow:hidden;
    border-right: .1em solid black;
    
    -webkit-animation: typing 17s steps(30, end),
                        blink-caret 1s step-end infinite;
    -moz-animation: typing 17s steps(30, end),
                        blink-caret 1s step-end infinite;
}*/
// NOTES AND LINKS
// http://greensock.com/tweenlite
// http://www.css3.info/preview/css3-transitions/
// http://javascript.crockford.com/inheritance.html
// http://tech.pro/blog/1402/five-patterns-to-help-you-tame-asynchronous-javascript
// http://css-tricks.com/how-do-you-structure-javascript-the-module-pattern-edition/
// http://toddmotto.com/mastering-the-module-pattern/
// http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
// http://addyosmani.com/resources/essentialjsdesignpatterns/book/
// http://libraryinstitute.wordpress.com/2010/12/01/loading-javascript-modules/
// http://css3.bradshawenterprises.com/transitions/
// http://dorey.github.io/JavaScript-Equality-Table/
// http://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example
// http://css3.bradshawenterprises.com/cfimg/
// http://html5please.com/#flexbox
// http://stackoverflow.com/questions/10371539/why-define-anonymous-function-and-pass-jquery-as-the-argument