(function () {
  'use strict';
  /*global alert, document, window, console */
  /*jshint -W099 */
  /*jshint smarttabs:true */
  /*jslint browser:true */
  /*jslint regexp: true */

  var CKM = {};

  CKM = {
    i : 0,
    includes : [],
    includesLength : 0,
    includeAttempts : 0,
    modsLoaded : [],
    modLoadComplete : {},
    modsDeferred : [],
    loading : true,
    totalChecks : 0,
    minifiedExt : false,
    path : "",

    // DYNAMICALLY INCLUDE External Modules
    // LOAD FILE UNLESS THE CKM OBJECT 
    // HAS A PROPERTY MATCHING THE FILES NAME
    includeFile : function (path, scriptSrc) {
      if (this.isModuleLoaded(scriptSrc)) {
        var head, script;
        head = document.getElementsByTagName('body')[0];
        script = document.createElement('script');
        script.type = 'text/javascript';
        if (this.minifiedExt) {
          scriptSrc = scriptSrc + this.minifiedExt;
        }
        if (path === 'undefined') {
          path = this.path;
        }
        script.src = path + scriptSrc + ".js";
        head.appendChild(script);
      } else {
        this.includeAttempts += 1;
        this.removeFromModuleList(scriptSrc);
      }
    },

    // IF MODULE IS LOADED RETURN TRUE
    // SOMETHINGS WRONG
    isModuleLoaded : function (property) {
      property = property.replace("CKM", "");
      return (CKM[property] === undefined);
    },

    // ADD MODULE TO CKM OBJECT
    // IF THE MODULE DOES NOT EXIST ON OBJECT
    addModule : function (property, fileName, module) {
      if (this.isModuleLoaded(property)) {
        CKM[property] = module;
        this.removeFromModuleList(fileName);
      }
    },

    removeFromModuleList : function (fileName) {
      var index;
      index = this.includes.indexOf(fileName);
      this.includes.splice(index, 1);
    },

    // RETRY LOADING DEFERRED MODULES
    loadDeferredModules : function () {
      var i = this.modsDeferred.length,
        x,
        moduleToLoad,
        deferLoading = false;

      // CHECK DEFERRED MODULES TO SEE IF REQUIRED DEPENDENCIES HAVE BEEN LOADED
      for (i -= 1; i >= 0; i -= 1) {
        moduleToLoad = this.modsDeferred[i];
        x = moduleToLoad.dependencies.length - 1;
        deferLoading = false;
        for (x; x >= 0; x -= 1) {
          if (CKM[moduleToLoad.dependencies[x].replace("CKM", "")] === undefined) {
            deferLoading = true;
          }
        }
        // DEFER OR LOAD MODULE
        if (!deferLoading) {
          this.addModule(moduleToLoad.property, moduleToLoad.fileName, moduleToLoad.module);
        }
      }
    },

    // THIS FUNCTION IS CALLED BY EACH LOADED FILE
    // DECORATE MAIN OBJECT WITH RETURNED OBJ
    // FILENAME IS RETURNED TO REMOVE IT FROM THE INCLUD  ES ARRAY
    // PROPERTY IS USED TO ADD MODULE TO THE PRIMARY CKM MODULE
    Decorator : function (fileName, property, dependencies, module) {
      var i = dependencies.length,
        deferLoading = false;
      this.includeAttempts += 1;
      this.totalChecks += 1;
      // CHECK FOR MODULE DEPENDENCIES
      if (i > 0) {
        for (i -= 1; i >= 0; i -= 1) {
          if (CKM[dependencies[i]] === undefined) {
            deferLoading = true;
          }
        }
      }

      // LOAD MODULE 
      // EITHER NO DEPENDENCIES OR DEPENDENCIES LOADED ARE TRUE
      if (!deferLoading) {
        this.addModule(property, fileName, module);
      } else {
        // MODULE DEFERRED
        this.modsDeferred.push({
          fileName : fileName,
          property : property,
          dependencies : dependencies,
          module : module
        });
      }

      // IF ATTEMPTS HAVE BEEN MADE TO LOAD ALL INCLUDES
      // RETRY LOADING DEFERRED INCLUDES
      if (this.includeAttempts === this.includesLength) {
        do {
          this.loadDeferredModules();
          // IF INCLUDES (MODULES) ARE ALL LOADED
          // LOAD MAIN JS FILE
          if (this.includes.length === 0) {
            this.loading = false;
            this.includeFile(this.path, this.modLoadComplete);
          }
          this.totalChecks += 1;
        } while (this.includes.length > 0);
      }
    },

    // THIS CONFIGURES THE EXPECTED MODULES
    // THE PATH TO THE MODULES
    // THE LOCATIONS OF THE MODULES
    // AND THE COMPLETION CALLBACK (modLoadComplete)
    //
    // OPTIONAL ITEMS CONFIGURED DIRECTLY ON CKM OBJECT
    // MINIFIED = EXT     (Ex "-min")
    // MINIFIEDPATH = EXT (Ex "/min")

    // PATH TO JS FILES   (Ex "js/")
    // INCLUDES ARRAY     (Ex ["Module1", "Module2"])
    // MODLOADCOMPLETE = PRIMARY JS FILE NAME (Ex "main")
    // MOD LOAD COMPLETE IS TRIGGERED ONCE DEPENDENCIES ARE LOADED AND IS MAIN JS FILE

    /*  
    EXAMPLE set up 
      <script type="text/javascript" src="js/CKM.js"></script>
      <script type="text/javascript">
        CKM.minifiedExt = "-min";
        CKM.minifiedPath = "min/";
        CKM.init("js/min/", ["CKMUtils", "CKMURL"], "main"); 
      <script>
    */
    init : function (path, includes, modLoadComplete) {
      this.path = path;
      this.includes = includes;
      this.includesLength = includes.length;
      // CALLBACK WHEN ALL SCRIPTS AND DEPENDENCIES ARE LOADED
      this.modLoadComplete = modLoadComplete;
      for (this.i = this.includes.length - 1; this.i >= 0; this.i -= 1) {
        this.includeFile(path, includes[this.i]);
      }
    }
  };
  // GLOBAL EXPORT
  window.CKM = CKM;
}());