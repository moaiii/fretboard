angular.module('InitCtrl', [])
  .controller('InitController', function(NotemapApp){

    var Init = {};

    Init.App = function() { // wait for tunings to be loaded
      var self = this;

      NotemapApp.data.getTunings().then(function(response) {
        self._init();
      }, function(error) {
        alert(error);
      });

      NotemapApp.data.getChords().then(function(response) {
      }, function(error) {
        alert(error);
      });
    };



    Init.App.prototype._init = function() {

      this.tuning = this._initTuning();
      NotemapApp.elements.tuning_pegs = this._createTuningPegs();
      this._appendPegs(NotemapApp.elements.tuning_pegs);
      this.strings = this._getStrings();
      // this._createTuningSelector(this.frets, this.tuning);
      NotemapApp.getFretboard();
      this.frets = this.getFretboardElements();
			this.frets = NotemapApp.setFretboard();
      this.initChordBanks();
      NotemapApp.elements.keyboard = this.getKeys();
      NotemapApp.elements.mpc = this.getPads();
			NotemapApp.elements.chordbankSelectors = this.getChordbankSelectors();
    };



    Init.App.prototype._initTuning = function() {

      NotemapApp.data.tuning_selected.name = "Standard";
      NotemapApp.data.tuning_selected.notes = NotemapApp.data.tunings.STANDARD;
    };



    Init.App.prototype._createTuningPegs = function() {

      var pegs = [];

      for(var i = 0; i < NotemapApp.const.NUM_STRINGS; i++) { // selects
        pegs[i] = document.createElement("select");
        pegs[i].setAttribute("id", "peg-" + i);
        pegs[i].setAttribute("class", "tuning-peg");

        for(var j = 0;
          j < NotemapApp.const.CHROMATIC_SCALE.length; j++){
            var option = document.createElement("option");
            option.setAttribute("value",
              NotemapApp.const.CHROMATIC_SCALE[j]);
            option.text = NotemapApp.const.CHROMATIC_SCALE[j];
            pegs[i].appendChild(option);
        }
        var startingTuning = NotemapApp.data.tuning_selected.notes[i];
        var index = NotemapApp.const.CHROMATIC_SCALE.indexOf(startingTuning);
        pegs[i].selectedIndex = index;
      }
      return pegs;
    };



    Init.App.prototype._createTuningSelector = function() {
			console.log(NotemapApp.data.tunings);
      // NotemapApp.data.tuning_selected.element =
      //   document.getElementById("tuning-selector");
			//
      // for(var tuning in NotemapApp.data.tunings) {
      //   var value = NotemapApp.data.tunings[tuning];
      //   var option = document.createElement("option");
      //   option.setAttribute("value", value);
      //   option.text = tuning;
			// 	if(tuning == 'STANDARD') {
			// 		option.selected = true;
			// 	}
      //   NotemapApp.data.tuning_selected.element.appendChild(option);
      // }
      // return NotemapApp.data.tuning_selected.element;
    };



    Init.App.prototype._appendPegs = function(pegs){

      for(var i = 1; i <= NotemapApp.const.NUM_STRINGS; i++){
          document.getElementsByClassName("peg-" + i)[0].appendChild(pegs[i-1]);
      }
    };



    Init.App.prototype._getStrings = function() {

      return document.getElementsByClassName("string");
    };



     Init.App.prototype.getFretboardElements = function() {

       for(var i = 0; i < NotemapApp.const.NUM_STRINGS; i++){
				 var string = [];

				 for(var j = 0; j < NotemapApp.const.NECK_LENGTH; j++){
           var fret = document.getElementById(i + "-" + j);
					 string.push(fret);
         }
				 NotemapApp.elements.fretboard.push(string);
       }
     };



     Init.App.prototype.initChordBanks = function() {

       var domElements = document.getElementsByClassName('chord-bank');
       for(var i = 0; i < domElements.length; i++) {
         NotemapApp.data.chordbanks.push(
           {
             name: domElements[i].attributes[1].value,
             notes: new Set(),
						 array: [],
             color: $(domElements[i]).css("background-color"),
             selected: false,
             subsets: []
           }
         );
       }
     };



		/**
		 *	Gets keys from the dom
		 *  @returns {Array}
		 */

    Init.App.prototype.getKeys = function() {

      return [].slice.call(document.getElementsByClassName('key'))
    };




		/**
		 *	Gets pads from the dom
		 *  @returns {Array}
		 */

    Init.App.prototype.getPads = function() {

      return [].slice.call(document.getElementsByClassName('pad'));
    };

    /**
		 *	Gets chord bank selectors from the dom
		 *  @returns {Array}
		 */
    Init.App.prototype.getChordbankSelectors = function() {

      return [].slice.call(document.getElementsByClassName('chord-bank'));
    };


     window.onload = function() {
       Init.app = new Init.App();
     };

});
