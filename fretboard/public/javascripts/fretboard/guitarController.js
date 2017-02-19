angular.module('GuitarCtrl', [])
  .controller('GuitarController', function($scope, NotemapApp){

		this.service = NotemapApp;

    this.onTuningChange = function() {
      var select = document.getElementById('tuning-selector');

      NotemapApp.data.tuningSelected.name = select.options[select.selectedIndex].text;
      NotemapApp.data.tuningSelected.notes = select.value.split(",");

      NotemapApp.getFretboard();
      NotemapApp.setFretboard();
      NotemapApp.setTuningPegs();
    };




    this.noteSelected = function(event) {

			var stringId = event.target.attributes[1].value.split('-')[0];
			var fretId = event.target.attributes[1].value.split('-')[1];
			var note = event.target.attributes[3].value;
			var isSelected = event.target.attributes[4].value;

      if(isSelected == 'true') {
        NotemapApp.deleteNote(stringId, fretId, note);

      } else {
        NotemapApp.addNote(stringId, fretId, note);
      }
    };




    this.highlightKey = function(note) {

      NotemapApp.highlightKey(note);
    };




    this.chordbankSelected = function(event) {

      NotemapApp.setChordbankSelection(event.target.attributes[1].value);
    };




		// variables for chord difference hover states
		this.hoverName = null;
		this.hoverNotes = null;
		this.difference = null;
		this.hoverStringIds = [];
		this.hoverFretIds = [];

		this.mouseoverChord = function(event) {

			this.hoverName = event.target.attributes[2].value;
			this.hoverNotes = event.target.attributes[3].value.split(',');
			this.difference = this.getChordDifference(this.hoverNotes);

			this.difference.forEach(function(elem){
				this.difference.id = NotemapApp.findFretboardId(elem.note);
				this.hoverStringsIds.push(this.difference.id.split("-")[0]);
				this.hoverFretIds.push(this.difference.id.split("-")[1]);
			});

			this.highlightElements(true);

		};




		this.highlightElements = function(highlight) {
			this.difference.forEach(function(elm) {
				NotemapApp.highlightKey(elm.note, 'rgb(244, 66, 255)', highlight);
				NotemapApp.highlightFretboard(
					this.hoverStringId, this.hoverFretId, 'rgb(244, 66, 255)');
				});
		};




		this.mouseleaveChord = function() {
			this.difference.forEach(function(elm) {
				NotemapApp.highlightKey(elm, 'rgb(244, 66, 66)', false);
				NotemapApp.unhighlightFretboard(
						this.hoverStringId, this.hoverFretId);
			});
			this.clearHoverStateVariables();
		};




		this.clearHoverStateVariables_ = function() {
			this.hoverName = null;
			this.hoverNotes.splice(0, this.hoverNotes.length);
			this.difference.splice(0, this.difference.length);
			this.hoverStringId = null;
			this.hoverFretId = null;
		};




		this.getChordDifference = function(searchNotes) {
			var difference = [];
			var set = NotemapApp.data.chordbanks[0].notes;
			var setToArray = Array.from(set);
			var obj = {};

			searchNotes.forEach(function(elem){
				if(setToArray.indexOf(elem) < 0) {
					obj.note = elem;
					difference.push(obj);
				}
			});

			return difference;
		};

});
