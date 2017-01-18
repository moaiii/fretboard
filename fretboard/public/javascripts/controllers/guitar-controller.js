angular.module('guitar-controller', [])
	.controller('GuitarController', function($scope, $http){

		$http({
		  method: 'GET',
		  url: '../data/chords.json'
		}).then(function successCallback(data) {
				$scope.chords = data;
		  }, function errorCallback(status) {
		  });

		$scope.numbers = [1, 2, 3, 4];

		var Fretboard = {
			notes:  [],
			tuning: [],
			chromatic: [ 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b', 'c', 'c#', 'd', 'd#' ],
			colorSelection: '',
			noteSelectionBank: {
				"alpha": [],
				"beta": [],
				"gamma": [],
				"delta": [],
				"epsilon": [],
				"zeta": []
			},
			selectedArray: ''
		};

		Fretboard.App = function() {
			this.initApp();
		};

		Fretboard.App.prototype.initApp = function() {
			this.initTuning();
			this.initFrets();
			this.armSelectors();
		};


		Fretboard.App.prototype.initTuning = function() {
			return null;
		};


		Fretboard.App.prototype.initFrets = function() {

			var strings = document.getElementsByClassName("string");

			for(var i=0; i<strings.length; i++){

				var frets = document.getElementById(strings[i].attributes[1].nodeValue);
				var tuning = document.getElementById(strings[i].attributes[2].nodeValue).innerHTML;

				this.loadFrets(frets, tuning);
			}

		};

		Fretboard.App.prototype.loadFrets = function(frets, tuning) {
			var i = 0;

			while(i < 23){
				var fret = document.createElement("div");
				fret.addEventListener("click", this.fretClicked, false);
				fret.classList.add("fret");
				var fretId = "string-"+tuning;
				frets.appendChild(fret);

				var fretNumber = document.createElement("p");
				fretNumber.classList.add("fretNumber");
				fretNumber.innerHTML = i;
				fret.appendChild(fretNumber);

				var fretNote = document.createElement("p");
				fretNote.classList.add("fretNote");
				fretNote.innerHTML = this.getNote(tuning, i);
				fret.appendChild(fretNote);

				var id = tuning + "-" + i + "-" + fretNote.innerHTML;
				fret.setAttribute("id", id);

				fret.setAttribute("data-fret-number", fretNumber.innerHTML);
				fret.setAttribute("data-fret-note", fretNote.innerHTML);
				fret.setAttribute("data-string-note", tuning);

				i++;
			}
		};

		Fretboard.App.prototype.getNote = function(tuning, fretNumber) {
			var note = this.getStartingNote(tuning);
			var increment = fretNumber % 23;
			var relative = note + increment;
			var finalIndex = (relative > 11) ? Math.abs(11-relative) : relative;

			return Fretboard.chromatic[finalIndex];
		};

		Fretboard.App.prototype.getStartingNote = function(tuning) {
			for(var i=0; i<11; i++) {
				if(Fretboard.chromatic[i] === tuning)
					return i;
			}
		};

		Fretboard.App.prototype.fretClicked = function(e) {
			var fretColor = $(e.target).css("background-color", Fretboard.colorSelection);
			var dataFretNumber = e.target.attributes[2].nodeValue;
			var dataFretNote = e.target.attributes[3].nodeValue;
			var dataFretString = e.target.attributes[4].nodeValue;

			for(var key in Fretboard.noteSelectionBank){
				if (!Fretboard.noteSelectionBank.hasOwnProperty(key)) continue;
				var array = Fretboard.noteSelectionBank[key];
				if(key === Fretboard.selectedArray) {
					array.push(dataFretNote);
					console.log(array);
				}
			}
		};

		/**
		 * Selectors
		 */

		Fretboard.App.prototype.armSelectors = function() {
			var selectors = document.getElementsByClassName("chord-selector");

			for(var i=0; i<selectors.length; i++){
				selectors[i].addEventListener("click", this.chordSelected, false);
			}
		};


		Fretboard.App.prototype.chordSelected = function(e) {
			Fretboard.selectedArray = e.target.attributes[1].nodeValue;
			console.log(Fretboard.selectedArray);
			var color = $(e.target).css("background-color");
			Fretboard.colorSelection = color;
		};


		window.onload = function() {
		  Fretboard.app = new Fretboard.App();
		};



	});
