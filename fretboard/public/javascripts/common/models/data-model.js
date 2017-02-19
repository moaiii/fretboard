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
      tuningSelected: {},
      fretboard: [],
      chordbanks: [],
      chord_filters: [],

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
      }

    };

    Notemap.elements = {
      tuning_pegs: null,
      fretboard: [],
      keyboard: [],
      mpc: []
    };




    /**
     *
     * DATA OPERATION FUNCTIONS
     *
     */


     /**
      *  Re-calculate fretboard
      *  @returns {Array} of {FretObjects}
      */

    Notemap.getFretboard = function() {

      for(var i = 0; i < this.const.NUM_STRINGS; i++) {
        let string = this.listNotes(this.data.tuningSelected.notes[i]);
        this.data.fretboard[i] = string;
      }

      return this.data.fretboard;
    };


    /**
     *	@param {Array} arrayOfNotes
     *  @param {String} color in rgba format
     */

    Notemap.setFretboard = function() { // set id params of fretboard

      for(var i = 0; i < Notemap.const.NUM_STRINGS; i++) {
        for(var j = 0; j < Notemap.const.NECK_LENGTH; j++) {
           this.elements.fretboard[i][j].attributes[3].value =
             this.data.fretboard[i][j];
        }
      }
    };


    /**
     *	@param {String} note
     *	@return {Array}
     * 	@todo look at array.prototype.map
     */

    Notemap.findFretboardId = function(note) {
      var idList = [];

      for(var i = 0; i < Notemap.const.NUM_STRINGS; i++) {
        for(var j = 0; j < Notemap.const.NECK_LENGTH; j++) {
          if(this.data.fretboard[i][j] == note) {
            idList.push(i+"-"+j);
          }
        }
      }
      console.log(idList);
      return idList[0];
    }




    /**
     *	@param {String} startingNote
     *  @returns {Array} of {Objects} stringofNotes
     *  @todo implement map array
     */

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






    /**
      *	@param {string} stringId
      *	@param {string} fretId
      *	@param {string} note eg: G# || B
      */

    Notemap.addNote = function(note) {

      var bank = this.getChordbankSelection();

      this.setChordbank(bank, note, true);
      this.highlightKey(note, bank.color, true);
      this.highlightMpc(note, bank.color, true);
    };


    /**
      *	@param {string} stringId
      *	@param {string} fretId
      *	@param {string} note eg: G# || B
      */

    Notemap.deleteNote = function(stringId, fretId, note) {

      var bank = this.getChordbankSelection();

      this.setChordbank(bank, note, false);
      this.highlightKey(note, bank.color, false);
      this.highlightMpc(note, bank.color, false);
    };




		/**
			*	@param {string} stringId
			*	@param {string} fretId
			*	@param {string} note eg: G# || B
			*/

		Notemap.highlightNote = function(stringId, fretId, note) {

			var bank = this.getChordbankSelection();

			// get notes difference

			this.setChordbank(bank, note, false);
			this.highlightKey(note, bank.color, false);
			this.highlightMpc(note, bank.color, false);
		};


		/**
     *	@param {String} stringId
     *	@param {String} stringId
     *  @returns {String} note on the fretboard
     */

    Notemap.getNote = function(stringId, fretId) {

      return Notemap.data.fretboard[stringId][fretId];
    };






    /**
      *	@param {Array} bank
      *	@param {String} note
      *	@param {boolean} addMode
      * @returns {Array}
      */

    Notemap.setChordbank = function(bank, note, addMode) {

      if(addMode) { //switch
        bank.notes.add(note);
      } else {
        bank.notes.delete(note);
      }

      bank.array.splice(0, bank.array.length);
      bank.array = Array.from(bank.notes);

      if(bank.notes.size > 1) { //gate
        bank.subsets = this.getSubsets(bank.notes);
      }

      return bank;
    };


    /**
    * finds and returns the selected chord bank
    * @returns {Array}
    */

    Notemap.getChordbankSelection = function() {

      for (var i = 0; i < this.data.chordbanks.length; i++) {
        if(this.data.chordbanks[i].selected){

          return this.data.chordbanks[i];
        }
      }
    };

		/**
		 *	@param {String} chordbankSelected
		 */

		Notemap.setChordbankSelection = function(chordbankSelected) {

			for(var i = 0; i < this.data.chordbanks.length; i++) {
				this.data.chordbanks[i].selected = false;
				if (chordbankSelected == this.data.chordbanks[i].name)
					this.data.chordbanks[i].selected = true;
			}
		};






    /**
      *	@param {Array} bankNotes chord bank
      * @returns {Array} chord subsets of notes in bank
      * @todo implement map array
      */

    Notemap.getSubsets = function(bankNotes) {

      let subsetsFound = [];

      for (var i = 0; i < this.data.chords.chords.length; i++) {
        var chordJsonData = new Set(this.data.chords.chords[i].notes);
        var isSuperset = chordJsonData.isSuperset(bankNotes);

        if(isSuperset) {
          subsetsFound.push(this.data.chords.chords[i]);
        }
      }

      return subsetsFound;
    };


    Set.prototype.isSuperset = function(subset) {

      for (var elem of subset) {
          if (!this.has(elem)) {
              return false;
          }
      }
      return true;
    };






    Notemap.highlightKey = function(note, color, highlight) {

      for(var i = 0; i < this.const.NUM_KEYS; i++) {
        var key = this.elements.keyboard[i];

        if(key.attributes[1].value == note && highlight){
          key.classList.add('selected');
          key.classList.remove('default');
          $(key).css("background-color", color);

        } else if (key.attributes[1].value == note && !highlight) {
          key.classList.remove('selected');
          key.classList.add('default');
        }
      }
    };


		/**
    *	@param {String} stringId
    *	@param {String} fretId
    *	@param {Color} color in rgba format
    */

    Notemap.highlightMpc = function(note, color, highlight) {

      var padToBeHighlighted = this.elements.mpc.filter(function(pad){
        return pad.attributes[2].value == note;
      });

			console.log(padToBeHighlighted);

      padToBeHighlighted.style.backgroundColor = color;
    };


    /**
    *	@param {String} stringId
    *	@param {String} fretId
    *	@param {Color} color in rgba format
    */

    Notemap.highlightFretboard = function(stringId, fretId, color) {

      this.elements.fretboard[stringId][fretId].setAttribute('selected', true);
      this.elements.fretboard[stringId][fretId].style.backgroundColor = color;
    };


    /**
    *	@param {String} stringId
    *	@param {String} fretId
    */

    Notemap.unhighlightFretboard = function(stringId, fretId) {

      let color = 'rgba(0, 0, 0, 0)';
      this.elements.fretboard[stringId][fretId].setAttribute('selected', false);
      this.elements.fretboard[stringId][fretId].style.backgroundColor = color;
    };






		/**
     *	@returns {Array} list of chord filters
     */

    Notemap.getFilters = function() {

      return this.data.chord_filters;
    };


    /**
     *	@param {String} searchName
     */

    Notemap.setFilters = function(searchName) {

      if(!this.data.chord_filters.includes(searchName)){
        this.data.chord_filters.push(searchName);
      } else {
        let i = this.data.chord_filters.indexOf(searchName);
        this.data.chord_filters.splice(i, 1);
      }
    };






    Notemap.setTuningPegs = function() {

      for(var i = 0; i < this.elements.tuning_pegs.length; i++) {
        this.elements.tuning_pegs[i].value =
          Notemap.data.tuningSelected.notes[i];
      }
    };



    /**
     *	@returns {Object} Data service object
     */
     console.log(Notemap);
    return Notemap;

}]);
