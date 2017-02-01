angular.module('GuitarCtrl', [])
	.controller('GuitarController', function(NotemapApp){

		var armSelectors = function() {
			var selectors = document.getElementsByClassName("chord-selector");

			for(var i=0; i<selectors.length; i++){
				selectors[i].addEventListener("click", this.chordSelected, false);
			}
	 };


		 var fretClicked = function(e) {

			 $(e.target).css('background-color', self.fretboard.selection.color);

			 self.fretboard.selection.number = e.target.attributes[2].nodeValue;
			 self.fretboard.selection.note = e.target.attributes[3].nodeValue;
			 self.fretboard.selection.string = e.target.attributes[4].nodeValue;

			 /**
				* push note to correct group array in groups object
				* @type {string} key eg. one, two, three
				*/
			 for(var key in self.fretboard.selection.groups){

				 var array = self.fretboard.selection.groups[key].notes;

				 if(key === self.fretboard.selection.group) {
					 array.push(self.fretboard.selection.note);
					 console.log('just added to ' + key + ' : ' + array);
					 self.fretboard.App.prototype.findSubset(array);
				 }
			 }
		};

		var chordSelected = function(e) {
			self.fretboard.selection.group = e.target.attributes[1].nodeValue;
			var color = $(e.target).css("background-color");
			self.fretboard.selection.color = color;
		};

});
