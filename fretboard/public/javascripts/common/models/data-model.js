angular.module('Notemap.App.Service', [])
  .service('NotemapApp', ['$http', function($http, $q) {

    var Notemap = {
    };

    Notemap.App = function () {
      this.initApp_();
    };

    Notemap.App.prototype.initApp_ = function() {
      Notemap.data = {};
      Notemap.fretboard = {};
      Notemap.keyboards = {};
    };

    Notemap.app = new Notemap.App();

    /**
     *	Get data from JSON file for chords and scales
     *	This will be provided to the controllers
     */
    Notemap.data.chords = $http.get('/data/chords.json').then(function(response){
      return response.data;
    });

    Notemap.fretboard.constants = {
      CHROMATIC_SCALE: ['e','f','f#','g','g#','a','a#','b','c','c#','d','d#']
    };

    Notemap.fretboard.selection = {};
    Notemap.fretboard.selection.color = '';
    Notemap.fretboard.selection.note = '';
    Notemap.fretboard.selection.string = '';
    Notemap.fretboard.selection.number = '';

    Notemap.fretboard.selection.group = '';
    Notemap.fretboard.selection.notes = [];
    Notemap.fretboard.selection.groups = {};
    Notemap.fretboard.selection.groups.one = {};
    Notemap.fretboard.selection.groups.one.notes = [];
    Notemap.fretboard.selection.groups.one.subsets = [];
    Notemap.fretboard.selection.groups.two = {};
    Notemap.fretboard.selection.groups.two.notes = [];
    Notemap.fretboard.selection.groups.two.subsets = [];
    Notemap.fretboard.selection.groups.three = {};
    Notemap.fretboard.selection.groups.three.notes = [];
    Notemap.fretboard.selection.groups.three.subsets = [];

    Notemap.App.prototype.findSubset = function(notes) {

      for(var j = 0; j < notes.length; j++) { // scan notes selected
        var noteWeAreLookingFor = notes[i];
        for(var i = 0; self.data.chords.chords.length; i++) { // scan json data 444

        };
      };

      // loop the chords array - the haystack
      for(var i = 0; i < self.data.chords.normal.length; i++) {
        var comparison = self.data.chords.normal[i].notes;

        console.log('against ', comparison); //object

        //loop the notes arrray - the needles
        for(var j = 0; j < notes.length; j++){
          if($.inArray(notes[i].toUpperCase(), comparison) > -1)
            console.log('its here! - - ' + self.data.chords.normal[i].chord);
            return true;
        }
      }
    };

    return Notemap;

}]);
