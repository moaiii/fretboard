angular.module('KeyCtrl', [])
  .controller('KeyboardController', function(NotemapApp){



		this.keyClicked = function(event) {

			var note = this._getNote(event);
			var selected = event.target.attributes[4].value;

			if(selected === 'true') {
				selected = 'false';
			} else {
				selected = 'true';
			}

			event.target.classList.toggle('selected');
		};




		this.keyMouseOver = function(event) {

			var note = this._getNote(event);
			NotemapApp.addHighlightNote(note);
		};




		this.keyMouseLeave = function(event) {

			var note = this._getNote(event);
			NotemapApp.removeHighlightNote(note);
		};




		this._getNote = function(event) {

			var notes = [];
			notes.push(event.target.attributes[1].value);

			return notes;
		};

	});
