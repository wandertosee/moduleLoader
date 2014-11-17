(function () {
  'use strict';
  /*global alert, document, window, console, CKM */

  // CURRENTLY ALL PUBLIC
  CKM.Decorator("CKMInt", "Int", [], {
    // RANDOM WITH RANGE
    randomWithRange : function (min, max) {
      return Math.floor(min) + Math.floor(Math.random() * (max - min + 1));
    },

    // RANDOM WITH RANGE EXCLUDE PREVIOUS VALUE
    randomWithRangeNotPrevious : function (min, max, prev) {
      var randomNum;
      randomNum = this.randomWithRange(min, max);
      do {
        randomNum = this.randomWithRange(min, max);
      } while (randomNum === prev);
      return randomNum;
    },

    // RETURNS EQUALLY DISTRIBUTED ARRAY 
    // MOD % FOR BETTER PERFORMANCE?
    equallyDistributedRandom : function (itemCount, numsToReturn) {
      var randomArray = [],
        tempNum = numsToReturn,
        rnd;
      for (tempNum; tempNum >= 0; tempNum -= 1) {
        rnd = this.randomWithRangeNotPrevious(0, itemCount - 1, rnd);
        randomArray.push(rnd);
      }
      return randomArray;
    }
  });

}());