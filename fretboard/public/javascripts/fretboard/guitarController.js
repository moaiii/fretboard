angular.module('GuitarCtrl', [])
  .controller('GuitarController', function($scope, NotemapApp){

		this.service = NotemapApp;

		this.tuning = null;

    this.onTuningChange = function() {
			var select = document.getElementById('tuning-selector');

			NotemapApp.data.tuningSelected.name = select.options[select.selectedIndex].text;
			NotemapApp.data.tuningSelected.notes = select.value.split(",");

			NotemapApp.getFretboard();
			NotemapApp.setFretboard();
			NotemapApp.setTuningPegs();
    };

    this.noteSelected = function(event) {
			console.log('note selected: ' + event.target.attributes[3].value);
			console.log('selected?: ' + event.target.attributes[4].value);

			if(event.target.attributes[4].value == 'true') {
				console.log('to be deleted');
				event.target.setAttribute('selected', 'false');
				NotemapApp.deleteNote( event.target, event.target.attributes[3].value);
				this.unhighlightKey(event.target.attributes[3].value);
			} else {
				console.log('to be added');
				event.target.setAttribute('selected', 'true');
				NotemapApp.addNote( event.target, event.target.attributes[3].value);
				this.highlightKey(event.target.attributes[3].value);
			}
    };

		this.highlightKey = function(note) {
			NotemapApp.highlightKey(note);
		};

    this.chordbankSelected = function(event) {
      NotemapApp.setChordbank(event.target.attributes[1].value);
    };

		this.filterChange = function(event) {
			for(var i = 0; i < NotemapApp.elements.chord_filters.length; i++) {
				if(NotemapApp.elements.chord_filters[i].element.value ==
					event.target.value) {
						NotemapApp.elements.chord_filters[i].isChecked =
							event.target.checked;
					}
			}
		};
});
