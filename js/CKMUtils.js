(function () {
  'use strict';
  /*global alert, document, window, console */

  CKM.Decorator("CKMUtils", "Utils", [], {

    // USE CONSOLE.DIR
    print_r : function (obj) {
      console.log(obj);
    },

    printR : function (arr, level, limit) {
      var output = "",
        padding = "",
        j,
        item,
        value;

      if (!level) {
        level = 0;
      }

      for (j = 0; j < level + 1; j += 1) {
        padding += "    ";
      }

      if (level >= limit) {
        return output;
      }

      if (typeof arr === "object") {
        for (item in arr) {
          if (arr.hasOwnProperty(item)) {
            value = arr[item];
            if (typeof value === "object") {
              output += padding + "'" + item;
              if (level + 1 === limit) {
                output += " {}'";
              } else {
                output += " { \n";
                output += this.printR(value, level + 1, limit);
                output += padding + "}',\n";
              }
              output += "\n";
            } else {
              output += padding + "'" + item + "' => \"" + value + "\"\n";
            }
          }
        }
      } else { // NON OBJECT DATA
        output = " " + arr + " (" + typeof arr + ")";
      }
      return output;
    },

    // BASE UTILTIES
    getType : function (obj) {
      return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
    },

    objFromArray : function (chunks, spliter) {
      var obj = {},
        prop,
        key,
        val;
      if (typeof chunks === "object") {
        for (prop in chunks) {
          if (chunks.hasOwnProperty(prop)) {
            val = chunks[prop];
            key = val.split(spliter)[0];
            val = val.split(spliter)[1];
            if (typeof val === 'Object') {
              obj[key] = this.objFromArray(chunks, spliter);
            } else if ((key !== 'undefined' && key !== "") && (val !== 'undefined' && val !== "")) {
              obj[key] = val;
            }
          }
        }
      }
      return obj;
    },

    serializeObj : function (obj, joinStr, delimiterStr) {
      var str = "",
        prop;
      if (typeof obj === "object") {
        for (prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            str += prop + joinStr + obj[prop] + delimiterStr;
          }
        }
      }
      return str;
    },

    each : function (array, func) {
      array.forEach(func);
    },

    isArray : function (item) {
      return Object.prototype.toString.call(item) === '[object Array]';
    },

    arrayContains : function (arr, val) {
      var i;
      for (i = 0; i < arr.length; i += 1) {
        if (arr[i] === val) {
          return true;
        }
      }
      return false;
    },

    GetArrayUsingFunction : function (count) {
      var items = [],
        i;
      for (i = count.length - 1; i >= 0; i -= 1) {
        items[i] = "";
      }
      return items;
    },

    occurrences : function (string, substring) {
      var n = 0,
        pos = 0;
      while (true) {
        pos = string.indexOf(substring, pos);
        if (pos !== -1) {
          n += 1;
          pos += substring.length;
        } else {
          break;
        }
      }
      return n;
    },

    lenCheck : function (item, add) {
      // ?
      if (add !== 'undefined' && add.length < 1) {
        add = "";
      }
      return (item !== 'undefined' && item.length > 0) ? item + add : "";
    },

    GetScrollXY : function (offSetFromTop, element) {
      var scrOfX = 0, scrOfY = 0;
      scrOfY = element.scrollTop;
      scrOfX = element.scrollLeft;
      return [ scrOfX, scrOfY + offSetFromTop];
    },

    PositionFromTop : function (classOrIdRef, offSetFromTop) {
      var scrOfXY = [0, 0],
        scrOfY;
      scrOfXY = this.getScrollXY(offSetFromTop);
      scrOfY = (scrOfXY[1] < 0) ? -scrOfXY[1] + "px" : scrOfXY[1] + "px";
      document.querySelectorAll(classOrIdRef).offset({left: scrOfXY[0], top: 0});
      document.querySelectorAll(classOrIdRef).css("top", scrOfY);
    }
  });

}(CKM));