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
      this._createTuningSelector(this.frets, this.tuning);
      NotemapApp.getFretboard();
      this.frets = this._initFrets();
      this.initChordBanks();
      this.getKeys();
			this.initFilters();
    };

    Init.App.prototype._initTuning = function() {
      NotemapApp.data.tuningSelected.name = "Standard";
      NotemapApp.data.tuningSelected.notes = NotemapApp.data.tunings.STANDARD;
    };

    Init.App.prototype._createTuningPegs = function() {

      var pegs = [];

      for(var i = 0; i < NotemapApp.const.NUM_STRINGS; i++) { // selects
        pegs[i] = document.createElement("select");
        pegs[i].setAttribute("id", "peg-" + i);
        pegs[i].setAttribute("class", "tuning-peg");

        for(var j = 0; // options
          j < NotemapApp.const.CHROMATIC_SCALE.length; j++){
            var option = document.createElement("option");
            option.setAttribute("value",
              NotemapApp.const.CHROMATIC_SCALE[j]);
            option.text = NotemapApp.const.CHROMATIC_SCALE[j];
            pegs[i].appendChild(option);
        }
        var startingTuning = NotemapApp.data.tuningSelected.notes[i];
        var index = NotemapApp.const.CHROMATIC_SCALE.indexOf(startingTuning);
        pegs[i].selectedIndex = index;
      }
      return pegs;
    };


    Init.App.prototype._createTuningSelector = function() {
      NotemapApp.data.tuningSelected.element =
				document.getElementById("tuning-selector");

      for(var key in NotemapApp.data.tunings) {
        var value = NotemapApp.data.tunings[key];
        var option = document.createElement("option");
        option.setAttribute("value", value);
        option.text = key;
        NotemapApp.data.tuningSelected.element.appendChild(option);
      }

      return NotemapApp.data.tuningSelected.element;
    };


    Init.App.prototype._appendPegs = function(pegs){
      for(var i = 1; i <= NotemapApp.const.NUM_STRINGS; i++){
          document.getElementsByClassName("peg-" + i)[0].appendChild(pegs[i-1]);
      }
    };


    Init.App.prototype._getStrings = function() {
      return document.getElementsByClassName("string");
    };


     Init.App.prototype._initFrets = function() {
       for(var i = 0; i < 6; i++){
         for(var j = 0; j < NotemapApp.const.NECK_LENGTH; j++){
           document.getElementById(i + "-" + j)
             .setAttribute("note", NotemapApp.getNote(i, j));
         }
       }
     };


     Init.App.prototype.initChordBanks = function() {
       var domElements = document.getElementsByClassName('chord-bank');
       for(var i = 0; i < domElements.length; i++) {
         NotemapApp.data.chordbanks.push(
           {
             name: domElements[i].attributes[1].value,
             notes: new Set(),
             color: $(domElements[i]).css("background-color"),
             selected: false,
             subsets: []
           }
         );
       }
     };


    Init.App.prototype.getKeys = function() {
      var keys = document.getElementsByClassName('key');
      NotemapApp.elements.keyboard.push(keys);
    };


		Init.App.prototype.initFilters = function() {
			var filters = document.getElementsByClassName('chord_filter-input');
			for(var i = 0; i < filters.length; i++){
				var filter = {};
				filter.element = filters[i];
				filter.isChecked = filters[i].checked;
				NotemapApp.elements.chord_filters.push(filter)
			}
		};


     window.onload = function() {
       Init.app = new Init.App();
     };

});
