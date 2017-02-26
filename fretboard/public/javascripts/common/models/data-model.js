angular.module('Notemap.App.Service', [])
  .service('NotemapApp', ['$http', function($http, $rootscope) {

    var Notemap = {};

    Notemap.const = {
      CHROMATIC_SCALE: ['E','F','F#','G','G#','A','A#','B','C','C#','D','D#'],
      CHORDS_URL: '/data/chords.json',
      SCALES_URL: '/data/scales.json',
      TUNINGS_URL: '/data/tunings.json',
      NECK_LENGTH: 22,
      NUM_STRINGS: 6,
      NUM_KEYS: 12
    };

		Notemap.elements = {
			tuning_pegs: null,
			fretboard: [],
			keyboard: [],
			mpc: []
		};

    Notemap.data = {
      chords: false,
      chordbanks: [],
      chord_filters: [],
      fretboard: [],
      highlight_notes: [],
      scales: false,
      tunings: false,
      tuning_selected: {},

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




    /**
     *
     * DATA OPERATION FUNCTIONS
     *
     */


     /**
      *  Setter function for the fretboard data.
      *  Takes the open notes from each string (i.e. the tuning) and gets the
      *  subseqent notes that follow in accordance with the chromatic scale
      *  with help of listNotes(). Creates a 2d array of the fretboard.
      *  @returns {Array} of {FretObjects}
      */

    Notemap.getFretboard = function() {

      for(var i = 0; i < this.const.NUM_STRINGS; i++) {
        let string = this.listNotes(this.data.tuning_selected.notes[i]);
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

      return idList[0];
    }




    /**
		 *	::: Getter function :::
     *  Based on the starting note of the tuning peg, this function returns all
     *  notes in order using a circular array to loop round the chromatic
     *  scale until all fret notes (array cells) are filled
     *	@param {!String} startingNote
     *  @returns {Array} stringOfNotes
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
      * ::: Setter function :::
      * Based on an element click event from the fretboard, keyboard or pads
      * the note target is collected and passed to the currently selected
      * chord bank array. The info is then passed hightlighting functions in
      * the view.
      *	@param {!String} note
      *	@param {Number} stringId
      *	@param {Number} fretId
      */

    Notemap.addNote = function(note, stringId, fretId) {

      var bank = this.getChordbankSelection();
      var color = bank.color;

      this.setChordbankNotes(bank, note, true);

      this.fretboardHighlight(stringId, fretId, color);
      this.keyboardHighlight(note, color);
      this.mpcHighlight(note, color);
    };


    /**
      * ::: Setter function :::
      * Finds the click event note in the chord bank array and removes it.
      * The info is then passed un-hightlighting functions in
      * the view.
      *	@param {!String} note eg: G# || B
      * @param {?Color} keyColorType rgba
      *	@param {Number} stringId
      *	@param {Number} fretId
      */

    Notemap.deleteNote = function(note, keyColorType, stringId, fretId) {

      var bank = this.getChordbankSelection();
      var color = 'rgba(0,0,0,0)';

      this.setChordbankNotes(bank, note, false);

      this.fretboardUnhighlight(stringId, fretId, color);
      this.keyboardHighlight(note, keyColorType);
      this.mpcHighlight(note, color);
    };


    /**
      * adds notes to highlight array
      *	@param {Array} note eg: G# || B
      */

    Notemap.addHighlightNote = function(notes) {

      var that = this;
      var bank = this.getChordbankSelection();

      if(bank) {
        notes.forEach(function(note){
          if(!bank.notes.has(note)) {
            that.data.highlight_notes.push(note);
            var listOfElements = that.getAllElements(note);
            listOfElements.forEach(function(el){
              el.style.backgroundColor = 'rgba(255,100,10,1)'
            });
          }
        })
      }
    };


    /**
    * removes highlighted notes in the array
    *	@param {Array} note eg: G# || B
    */

    Notemap.removeHighlightNote = function(notes) {

      var that = this;
      var bank = this.getChordbankSelection();

      if(bank) {
        notes.forEach(function(note){

          var index = bank.array.indexOf(note);

          if(index == -1){
            var listOfElements = that.getAllElements(note);
            listOfElements.forEach(function(el){

              if(el.classList.contains('key')){
                var color = el.attributes[5].value;
                el.style.backgroundColor = color;
              } else {
                el.style.backgroundColor = 'rgba(0,0,0,0)'
              }
            });
            that.data.highlight_notes.splice(index, 1);
          };
        });
      }
    };


		Notemap.clearFretboard_ = function() {
			console.log(this.data.highlight_notes);
			this.removeHighlightNote(this.data.highlight_notes);
			console.log(this.data.highlight_notes);
		};


		/**
		  * ::: Getter function :::
      * Using the note as the lookup item, we loop through the element lists
			* of ALL the input instruments and return those who's notes match.
      *	@param {String} note eg: G# || B
			* @returns {?HTMLElements|null}
      */

    Notemap.getAllElements = function(note) {

      var elements = [];

      var frets = this.getFretElements(note);
      var keys = this.getKeyElements(note);
      var pads = this.getPadElements(note);

      elements = elements.concat(frets, keys, pads)

      return elements;
    };


		/**
		  * ::: Getter function :::
      * Using the note as the lookup item, returns exclusively only frets
			* which match the note. If the note is valid on the chromatic scale
			* up to (7*6) 42 items can be returned.
      *	@param {String} note eg: G# || B
			* @returns {?HTMLElements|null}
      */

    Notemap.getFretElements = function(note) {

      var frets = [];

      this.elements.fretboard.forEach(function(string){
        string.forEach(function(fret){
          if(fret.attributes[3].value == note)
          frets.push(fret);
        })
      });

      return frets;
    };


		/**
		  * ::: Getter function :::
      * Using the note as the lookup item, we loop through the element lists
			* of the fretboard and return those who's notes match.
      *	@param {String} note eg: G# || B
			* @returns {?HTMLElements|null}
      */

    Notemap.getKeyElements = function(note) {

      var keys = [];

      this.elements.keyboard.forEach(function(el){
        if(el.attributes[1].value == note)
          keys.push(el);
      });

      return keys;
    };


    Notemap.getPadElements = function(note) {

      var pads = [];

      this.elements.mpc.forEach(function(el){
        if(el.attributes[2].value == note)
          pads.push(el);
      });

      return pads;
    };


    /**
     * Getter function on the fretboard data
     * Takes the string number and fret number and return the corresponding
     * current note on the 2d fretboard array.
     *	@param {!Number} stringId
     *	@param {!Number} stringId
     *  @returns {?Element} ref to the fretboard
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

    Notemap.setChordbankNotes = function(bank, note, addMode) {

      if(addMode) {
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
     * Getter function on chord bank
     * This funciton loops through the list of chord bank elements are checks
     * each one for the selected flag. If found the chord bank reference is
     * passed back to the caller.
     * @returns {?Array}
     * @private
     */

    Notemap.getChordbankSelection = function() {

      for (var i = 0; i < this.data.chordbanks.length; i++) {
        if(this.data.chordbanks[i].selected){

          return this.data.chordbanks[i];
        }
      }
    };


    /**
     * Setter function on chord banks.
     * Loops through the chord bank array looking for name match. Once found it
     * sets the isSelected boolean flag to true and sets all others to false.
     * @param {!String} chordbankSelected name
     * @private
     */

    Notemap.setChordbankSelection = function(chordbankSelected) {

      for(var i = 0; i < this.data.chordbanks.length; i++) {
        this.data.chordbanks[i].selected = false;
        if (chordbankSelected == this.data.chordbanks[i].name)
          this.data.chordbanks[i].selected = true;
      }
    };


    /**
      * This function takes a set of notes and mutates them into a set data
      * data structure. Using the isSuperset() a comparrison is done against
      * the full chord list - if all notes are present the chord is a match
      * and is pushed to the subsetsFound array and returned as a result.
      *	@param {!Array} bankNotes chord bank
      * @returns {?Array} chord subsets of notes in bank
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


		/**
      * Set prototype function to find if a set has an element.
      *	@param {!Object} subset
      * @returns {Boolean}
      */

    Set.prototype.isSuperset = function(subset) {

      for (var elem of subset) {
          if (!this.has(elem)) {
              return false;
          }
      }
      return true;
    };






    /**
    *	@param {String} stringId
    *	@param {String} fretId
    *	@param {Color} color in rgba format
    */

    Notemap.fretboardHighlight = function(stringId, fretId, color) {

      this.elements.fretboard[stringId][fretId].style.backgroundColor = color;
    };


    /**
    *	@param {String} stringId
    *	@param {String} fretId
    */

    Notemap.fretboardUnhighlight = function(stringId, fretId, color) {

      this.elements.fretboard[stringId][fretId].style.backgroundColor = color;
    };


    /**
    *	@param {String} note
    * @param {Color} color
    */

    Notemap.mpcHighlight = function(note, color) {

      var modifiedPad = this.elements.mpc.filter(function(pad){
        return pad.attributes[2].value == note;
      });

      modifiedPad[0].style.backgroundColor = color;
    };


    /**
    *	@param {String} note
    * @param {Color} color
    */

    Notemap.keyboardHighlight = function(note, color) {

      var modifiedKey = this.elements.keyboard.filter(function(key){
        return key.attributes[1].value == note;
      });

      modifiedKey[0].style.background = color;
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
          Notemap.data.tuning_selected.notes[i];
      }
    };



    /**
     *	@returns {Object} Data service object
     */
     console.log(Notemap);
    return Notemap;

}]);
