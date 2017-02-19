angular.module('MpcCtrl', [])
  .controller('MpcController', function(NotemapApp){

		this.padClicked = function(event) {

			var note = this._getNote(event);
			var isSelected = this._isSelected(event);

			console.log(note);

			NotemapApp.addNote();

			event.target.classList.toggle('selected');
		};




		this.padMouseOver = function(event) {

			var note = this._getNote(event);
			console.log('pad hover: ' + note);
		};




		this.padMouseLeave = function(event) {

			var note = this._getNote(event);
			console.log('pad un-hover: ' + note);
		};




		this._getNote = function(event) {

			return event.target.attributes[2].value;
		};




		this._isSelected = function(event) {

			return event.target.attributes[4].value;
		};

	});
