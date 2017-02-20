angular.module('FilterCtrl', [])
  .controller('FilterController', function(NotemapApp){

		var Filters = {};

		Filters.App = function() {
			this.initFilters('normal');
		};


		Filters.App.prototype.initFilters = function(defaultFilterType) {
			NotemapApp.setFilters(defaultFilterType);
		};



		this.filterClicked = function(event) {
			this._filterUiToggle(event.target);
			this.updateService(event.target.attributes[1].value);
		};



		this._filterUiToggle = function(element) {
			element.classList.toggle('active');
		};



		this.updateService = function(filterName) {
			NotemapApp.setFilters(filterName);
		};



		Filters.app = new Filters.App();
})



.filter('chord_filter_name', function(NotemapApp) {
    return function(subset) {

				var f = NotemapApp.getFilters();

				if(f.indexOf(subset.type) >= 0) {
					return subset.name;
				}
    };
})



.filter('chord_filter_notes', function(NotemapApp) {
    return function(subset) {

				var f = NotemapApp.getFilters();

				if(f.indexOf(subset.type) >= 0) {

					return subset.notes.toString();
				}
    };
})


;
