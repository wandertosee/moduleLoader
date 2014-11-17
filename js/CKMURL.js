(function (window) {
  'use strict';
  /*global alert, document, window, console, canvas, setTimeout, XMLHttpRequest, AudioContext, WebkitAudioContext, CKM*/

  // SUB MODULE TO REQUEST EXTERNAL DATA
  // MODIFY QUERYSTRING
  // MODIFY HASH
  // REQUIRES CKMUTILS
  CKM.Decorator("CKMURL", "URL", ["Utils"], {

    url : "",
    protocol : "",
    host : "",
    port : "",
    path : {},
    queryStr : "",
    qsParams : {},
    hashStr : "",
    hashParams : {},
    u : "",

    parseUrl : function (url) {
      if (url) {
        this.url = url;
      } else {
        this.url = window.location;
      }
      // REGEX FROM CROCKFORD
      var urlRegEx = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/,
        result = urlRegEx.exec(this.url),
        props = ['url', 'protocol', 'slash', 'host', 'port', 'path', 'queryStr', 'hashStr'],
        i;
      for (i = 0; i < props.length; i += 1) {
        if (result[i] !== undefined) {
          this[props[i]] = result[i];
        }
      }
      this.qsParams = CKM.Utils.objFromArray(this.queryStr.split("&"), "=");
      this.hashParams = CKM.Utils.objFromArray(this.hashStr.split("&"), "=");
      // REFACTOR THIS MADNESS
      this.u = this.url.replace(this.queryStr, "").replace(this.hashStr, "").replace("#", "").replace("?", "");
    },

    // GET PARAMETERS
    getParams : function () {
      return this.qsParams;
    },

    // GET NAMED PARAMETER
    getParam : function (name) {
      return this.qsParams[name];
    },

    // UPDATE PARAMETER WITHOUT RELOAD
    setParam : function (name, value) {
      this.qsParams[name] = value;
    },

    // GET CURRENT HASH VALUE
    getHash : function () {
      return this.hash;
    },

    // UPDATE NAMED HASH ELEMENT WITHOUT RELOAD
    setHashParam : function (name, value) {
      this.hashParams[name] = value;
    },

    // SET HASH VALUE AND RELOAD
    reloadHash : function (data) {
      window.location.hash = "#" + data;
    },

    getURL : function () {
      var fullURL = this.protocol + ":" + this.slash + this.host + "/" + this.path;
      if (this.hashParams) {
        fullURL += "?" + CKM.Utils.serializeObj(this.qsParams, "=", "&");
      }
      if (this.hashParams) {
        fullURL += "#" + CKM.Utils.serializeObj(this.hashParams, "=", "&");
      }
      return fullURL;
    },

    // UPDATE URL AND RELOAD
    reloadURL : function () {
      // OBJECT TO STRING
      window.location = this.getURL;
    },

    // INCLUDE SCRIPT / MAKE JSON REQUEST 
    includeFile : function (scriptSrc, callback) {
      var head, script;
      head = document.getElementsByTagName('head')[0];
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = scriptSrc;
      if (callback) {
        script.onreadystatechange = callback;
        script.onload = callback;
      }
      head.appendChild(script);
    },
    // REQUEST JSON FROM EXTERNAL SOURCE
    // RESPONSE IS PUT INTO JSON OBJECT
    // AND RETURNED TO CALLBACK
    // ID USED FOR AUTHENTICATION IF REQUIRED
    requestJSON : function (url, callBack, id) {
      var req = new XMLHttpRequest(),
        index,
        response;
        console.log("GET" + url);
      req.open( "GET", url, true );
      req.setRequestHeader("Content-type", "application/json");
      req.onreadystatechange = function() {
        if (req.readyState === 4 && req.status === 200) {
          // WTF SOUNDCLOUD RETURNS JSONP WITH LEADING /**/
          index = req.responseText.indexOf("/**/");
          if (index !== -1) {
            response = req.responseText.substring(index+4, req.responseText.length -1);
            console.log(callBack + " : " + response);
          } else {
            response = JSON.parse(req.responseText);
          }
          callBack(response, id);
        }
      };
      req.send();
    }

  });
}());
