angular.module('SelCtrl', [])
  .controller('SelectorController', function(NotemapApp) {

		this.chordbankSelected = function(event) {

			NotemapApp.elements.chordbankSelectors.forEach(function(element){
				element.classList.remove('active');
			});

      NotemapApp.setChordbankSelection(event.target.attributes[1].value);

			event.target.classList.add('active');
    };
	});
