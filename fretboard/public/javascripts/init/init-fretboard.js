angular.module('InitCtrl', [])
  .controller('InitController', function(NotemapApp){


    var Init = {};


    Init.App = function() {
      this.pegs = this.createTuningPegs_();
      this.appendPegs_(this.pegs);
      this.strings = this.getStrings_(); //<Array>
      this.tuning = this.initTuning_(); //<Array>
      this.frets = this.initFrets_(); //<Array>
      this.loadFrets_(this.frets, this.tuning);
    };


    Init.constants = {
      NUM_STRINGS: 6,
      NECK_LENGTH: 23,
      CHROMATIC_LENGTH: 12
    };


		Init.tunings = {
			STANDARD: ['e', 'a', 'd', 'g', 'b', 'e']
		};


    Init.App.prototype.createTuningPegs_ = function() {

      var pegs = [];

      for(var i = 0; i < Init.constants.NUM_STRINGS; i++) {
        pegs[i] = document.createElement("select");
				pegs[i].setAttribute("id", "peg-" + i);
				pegs[i].setAttribute("class", "tuning_selector");

        for(var j = 0;
          j < NotemapApp.fretboard.constants.CHROMATIC_SCALE.length; j++){
						var option = document.createElement("option");
						option.setAttribute("value",
							NotemapApp.fretboard.constants.CHROMATIC_SCALE[j]);
						option.text = NotemapApp.fretboard.constants.CHROMATIC_SCALE[j];
						pegs[i].appendChild(option);
        }
      }
      return pegs;
    };


    Init.App.prototype.appendPegs_ = function(pegs){
      for(var i = 1; i <= Init.constants.NUM_STRINGS; i++){
          document.getElementsByClassName("peg-" + i)[0].appendChild(pegs[i-1]);
      }
    };


    Init.App.prototype.getStrings_ = function() {
      return document.getElementsByClassName("string");
    };


     Init.App.prototype.initTuning_ = function() {
       var tuning = [];

       for(var i = 0; i < this.strings.length; i++){
         tuning.push(document.getElementById(this.strings[i]
           .attributes[2].nodeValue).innerHTML);
       }
       return tuning;
     };


     Init.App.prototype.initFrets_ = function() {
       var frets = [];
        for(var i = 0; i < this.strings.length; i++){
          frets.push(document.getElementById(this.strings[i]
            .attributes[1].nodeValue));
        }
        return frets;
     };


     Init.App.prototype.loadFrets_ = function(frets, tuning) {

			 console.log(tuning);

			 for(var i = 0; i < frets.length; i++) {
				 for(var j = 0; j < Init.constants.NECK_LENGTH; j++) {
					 var fret = document.createElement("div");
					//  var id = tuning + "-" + i + "-" + fretNote.innerHTML;
					 fret.classList.add("fret");
					//  fret.setAttribute("id", id);
					 frets[i].appendChild(fret);

					 var fretNumber = document.createElement("p");
					 fretNumber.classList.add("fret_number");
					 fretNumber.innerHTML = i;

					 var fretNote = document.createElement("p");
					 fretNote.classList.add("fret_note");
					 fretNote.innerHTML = this.getNote_(tuning, i);

					 frets[i].setAttribute("data-fret-number", fretNumber.innerHTML);
					 frets[i].setAttribute("data-fret-note", fretNote.innerHTML);
					 frets[i].setAttribute("data-string-note", tuning);
				 }
			 }
     };

     Init.App.prototype.getNote_ = function(tuning, fretNumber) {
       var note = this.getStartingNote_(tuning);
       var increment = fretNumber % Init.constants.NECK_LENGTH;
       var relative = note + increment;
       var finalIndex =
         (relative > Init.constants.CHROMATIC_LENGTH) ?
          Math.abs(Init.constants.CHROMATIC_LENGTH - relative) : relative;

       return NotemapApp.fretboard.constants.CHROMATIC_SCALE[finalIndex];
     };


     Init.App.prototype.getStartingNote_ = function(tuning) {
       for(var i=0; i<11; i++) {
         if(NotemapApp.fretboard.constants.CHROMATIC_SCALE === tuning)
           return i;
       }
     };


     window.onload = function() {
       Init.app = new Init.App();
     };

})
.directive('fret', function() {
  return {
    restrict: 'E',
    scope: {
      fretData: '=id'
    },
    templateUrl: 'fret.html'
  };
});
