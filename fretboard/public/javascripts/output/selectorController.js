angular.module('SelCtrl', [])
  .controller('SelectorController', function(NotemapApp) {

		this.chordbankSelected = function(event) {

      NotemapApp.setChordbankSelection(event.target.attributes[1].value);
    };
	});
