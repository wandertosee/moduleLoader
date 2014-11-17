(function () {
  'use strict';
  /*global alert, document, window, console, CKM */

  CKM.Decorator("CKMStr", "Str", [], {
    // MAKE STRING INTO CSS CLASS NAME
    strToClass : function (str) {
      if (str) {
        return str.replace(/\s+/g, '-').toLowerCase();
      }
    },

    toTitleCase : function (str) {
      var i, txt, len, words = str.split(/\W+/);
      str = "";
      if (words.length > 0) {
        for (i = -1, len = words.length; i < len - 1; i += 1) {
          txt = words[i];
          if (txt !== "and" && txt !== "the" && txt !== "of" && txt !== "a" && txt !== "an") {
            str = str + " " + txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          } else {
            str = str + " " + txt;
          }
        }
      }
      return str;
    },

    escape : function (str) {
      return String(str).replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    unescape : function (str) {
      return String(str).replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'');
    },

    decodeHTMLEntities : function (str) {
      var element, entities, i, max;
      if (str && typeof str === 'string') {
        // STRIP HTML
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        // STRIP HTML
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
        element.innerHTML = str;
        str = element.textContent;
        element.textContent = '';
        element = null;
        // REPLACE HTML
        entities = [
          ['apos', '\''],
          ['amp', '&'],
          ['lt', '<'],
          ['gt', '>']
        ];
        for (i = 0, max = entities.length; i < max; i += 1) {
          str = str.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);
        }
      }
      return str;
    }
  });

}());