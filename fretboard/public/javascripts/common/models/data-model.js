angular.module('Notemap.App.Service', [])
  .service('NotemapApp', ['$http', function($http, $rootscope) {

    var Notemap = {};

		Notemap.const = {
			CHROMATIC_SCALE: ['E','F','F#','G','G#','A','A#','B','C','C#','D','D#'],
			CHORDS_URL: '/data/chords.json',
			SCALES_URL: '/data/scales.json',
			TUNINGS_URL: '/data/tunings.json',
			NECK_LENGTH: 23,
			NUM_STRINGS: 6,
			NUM_KEYS: 12
		};

		Notemap.data = {
			chords: false,
			tunings: false,
			scales: false,
			getChords: function() {
				return $http.get(Notemap.const.CHORDS_URL)
					.then(function(response){
						Notemap.data.chords = response.data;
						return Notemap.data.chords;
					}, function(error) {
							return 'Chords data could not be loaded';
					});
			},
			getTunings: function() {
				return $http.get(Notemap.const.TUNINGS_URL)
					.then(function(response){
						Notemap.data.tunings = response.data;
						return Notemap.data.tunings;
					}, function(error) {
							return 'Tunings data could not be loaded';
					});
			},
			getScales: function() {
				return $http.get(Notemap.const.SCALES_URL)
					.then(function(response){
						Notemap.data.scales = response.data;
						return Notemap.data.scales;
					}, function(error) {
							return 'Scales data could not be loaded';
					});
			},
			tuningSelected: {},
			fretboard: [],
			chordbanks: [],
		};

		Notemap.elements = {
			tuning_pegs: null,
			keyboard: [],
			chord_filters: []
		};

		/**
		 *
		 * Data operation functions
		 *
		 */

		Notemap.getFretboard = function() {

			for(var i = 0; i < Notemap.const.NUM_STRINGS; i++) {
				Notemap.data.fretboard[i] =
					Notemap.listNotes(Notemap.data.tuningSelected.notes[i]);
			}
		};



		Notemap.setFretboard = function() {

			for(var i = 0; i < Notemap.const.NUM_STRINGS; i++) {
				for(var j = 0; j < Notemap.const.NECK_LENGTH; j++) {
					document.getElementById(i + "-" + j)
						.setAttribute("note", Notemap.data.fretboard[i][j]);
				}
			}
		};



		Notemap.setTuningPegs = function() {

			for(var i = 0; i < this.elements.tuning_pegs.length; i++) {
				this.elements.tuning_pegs[i].value =
					Notemap.data.tuningSelected.notes[i];
			}
		};



		Notemap.listNotes = function(startingNote) { //circular array

			var stringOfNotes = [];
			var index = Notemap.const.CHROMATIC_SCALE.indexOf(startingNote);
			var actualIndex = index; // starting point
			for(var i = 0; i < Notemap.const.NECK_LENGTH; i++) {
				stringOfNotes.push(Notemap.const.CHROMATIC_SCALE[actualIndex]);
				if(actualIndex == Notemap.const.CHROMATIC_SCALE.length - 1) { // = 12
					actualIndex = 0;
				} else {
					actualIndex++;
				}
			}
			return stringOfNotes;
		};



		Notemap.getNote = function(string, fret) {

			return Notemap.data.fretboard[string][fret];
		};



		Notemap.addNote = function(fret, note) {

			for (var i = 0; i < this.data.chordbanks.length; i++) {
				if(this.data.chordbanks[i].selected) {
					this.data.chordbanks[i].notes.add(note);
					$(fret).css("background-color", this.data.chordbanks[i].color);
					this.highlightKey(note, this.data.chordbanks[i].color, false);
					this.getSubsets(this.data.chordbanks[i].notes);
				}
			}
		};



		Notemap.deleteNote = function(fret, note) {

			for (var i = 0; i < this.data.chordbanks.length; i++) {
				if(this.data.chordbanks[i].selected) {
					this.data.chordbanks[i].notes.remove(note);
					$(fret).css("background-color", 'none');
					this.unhighlightKey(note, this.data.chordbanks[i].color, true);
					this.getSubsets(this.data.chordbanks[i].notes);
				}
			}
		};



		Notemap.highlightKey = function(note, color, unhighlight) {

			for(var i = 0; i < this.const.NUM_KEYS; i++) {
				var key = this.elements.keyboard[0][i];
				if(key.attributes[1].value == note && !unhighlight){
					key.classList.add('selected');
					$(key).css("background-color", color);
				} else {
					key.classList.remove('selected');
					$(key).css("background-color", 'white');
				}
			}
		};



		Notemap.getSubsets = function(bank) {

			if(bank.size > 2) {

				this.data.chordbanks[0].subsets
					.splice(0, this.data.chordbanks[0].subsets.length); //clear subsets

				for (var i = 0; i < this.data.chords.chords.length; i++) {
					var comparison = new Set(this.data.chords.chords[i].notes);
					var isSuperset = comparison.isSuperset(bank);
					if(isSuperset) {
						this.data.chordbanks[0].subsets.push(this.data.chords.chords[i]);
					}
				}
			} else {
				console.log('too many results, please select more notes');
			}
		};



		Notemap.checkChordTypeFilters = function(type) {

			var boolean = false;
			for(var i = 0; i < this.elements.chord_filters.length; i++) {
				if(this.elements.chord_filters[i].element.value == type) {
					boolean = this.elements.chord_filters[i].isChecked;
					break;
				}
			}
			return boolean;
		};

		Set.prototype.isSuperset = function(subset) {
    for (var elem of subset) {
        if (!this.has(elem)) {
            return false;
        }
    }
    return true;
		};



		Notemap.setChordbank = function(selection) {

			for(var i = 0; i < this.data.chordbanks.length; i++) {
				this.data.chordbanks[i].selected = false;
        if (selection == this.data.chordbanks[i].name)
          this.data.chordbanks[i].selected = true;
      }
		};

    return Notemap;

}]);
