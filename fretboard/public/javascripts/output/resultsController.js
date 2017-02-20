angular.module('ResCtrl', [])
  .controller('ResultsController', function(NotemapApp){

		this.service = NotemapApp;



		this.chordMouseOver = function(event) {

			var chordNotes = this._getNotes(event);
			NotemapApp.addHighlightNote(chordNotes);
		};



		this.chordMouseLeave = function() {

			var chordNotes = this._getNotes(event);
			NotemapApp.removeHighlightNote(chordNotes);
		};



		this._getNotes = function(event) {

			return event.target.attributes[3].value.split(',');
		};

	});
