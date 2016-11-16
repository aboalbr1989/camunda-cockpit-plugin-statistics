'use strict'
ngDefine('cockpit.plugin.statistics-plugin.controllers', function(module) {

	module.controller('kpiCtrl', ['$scope', '$modal', '$modalStack', 'StateService', 'DataFactory', function($scope, $modal, $modalStack, StateService, DataFactory){

		var modalInstance = null;
		
		$scope.$on("$routeChangeStart", function(args){

			if(modalInstance) {

				closeModal();
			}
		});
		
		$scope.toggleMenu = function() {
			
			if(!modalInstance) {
				// close other modals
				$modalStack.dismissAll('opened another modal');
				
				StateService.setMenuState(true);
				modalInstance = $modal.open({
					templateUrl: 'kpiSettings.html',
					controller: 'kpiSettingsCtrl',
					size: 'md', //lg/sm/md
					windowClass: 'modal-right',
					animation: false,
					backdrop: false
				});
				
				StateService.resetSelectedElement();
												
			} else {
				StateService.setMenuState(false);
				closeModal();
			}
		};
		
		function closeModal() {

			modalInstance.close();
			modalInstance = null;
			DataFactory.bpmnElementsToHighlight = {};
			DataFactory.bpmnElementsToHighlightAsWarning = {};
			DataFactory.activityDurations = {};
		}
	}]);
});