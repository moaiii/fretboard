angular.module('GuitarCtrl', [])
  .controller('GuitarController', function($scope, NotemapApp){

		this.service = NotemapApp;


    this.fretClicked = function(event) {

			var stringId = event.target.attributes[1].value.split('-')[0];
			var fretId = event.target.attributes[1].value.split('-')[1];
			var note = event.target.attributes[3].value;
			var isSelected = event.target.attributes[4].value;

			if(isSelected === 'true') {
				event.target.attributes[4].value = 'false';
        NotemapApp.deleteNote(note, null, stringId, fretId);

      } else {
				event.target.attributes[4].value = 'true';
        NotemapApp.addNote(note, stringId, fretId);
      }

			event.target.classList.toggle('selected');
    };



		this.fretMouseOver = function() {

			var note = this._getNote(event);
			NotemapApp.addHighlightNote(note);
		};



		this.fretMouseLeave = function() {

			var note = this._getNote(event);
			NotemapApp.removeHighlightNote(note);
		};


		/**
		 *	@todo better way to push notes to an array here, slowing things down
		 */
		this._getNote = function(event) {

			var notes = [];
			notes.push(event.target.attributes[3].value);

			return notes;
		};


		this.onTuningChange = function() {
			var select = document.getElementById('tuning-selector');

			NotemapApp.data.tuning_selected.name = select.options[select.selectedIndex].text;
			NotemapApp.data.tuning_selected.notes = select.value.split(",");

			NotemapApp.getFretboard();
			NotemapApp.setFretboard();
			NotemapApp.setTuningPegs();
		};

});
