angular.module('KeyCtrl', [])
  .controller('KeyboardController', function(NotemapApp){

    this.keyClicked = function(event) {

      var note = this._getNote(event);
      var isSelected = event.target.attributes[6].value;
			var defaultColor = event.target.attributes[5].value;

      if(isSelected === 'true') {
        isSelected = 'false';
        NotemapApp.deleteNote(note[0], defaultColor);

      } else {
        isSelected = 'true';
        NotemapApp.addNote(note[0], null, null);
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
