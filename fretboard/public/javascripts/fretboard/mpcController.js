angular.module('MpcCtrl', [])
  .controller('MpcController', function(NotemapApp){

    this.padClicked = function(event) {

      var note = this._getNote(event);
      var selected = event.target.attributes[4].value;

      if(selected === 'true') {
        selected = 'false';
        NotemapApp.deleteNote(note[0], null);

      } else {
        selected = 'true';
        NotemapApp.addNote(note[0], null, null);
      }

      event.target.classList.toggle('selected');
    };




    this.padMouseOver = function(event) {

      var note = this._getNote(event);
      NotemapApp.addHighlightNote(note);
    };




    this.padMouseLeave = function(event) {

      var note = this._getNote(event);
      NotemapApp.removeHighlightNote(note);
    };




    this._getNote = function(event) {

      var notes = [];
      notes.push(event.target.attributes[2].value);

      return notes;
    };

  });
