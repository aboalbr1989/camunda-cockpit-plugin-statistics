'use strict'
ngDefine('cockpit.plugin.statistics-plugin.controllers', function(module) {

	module.filter('transformDatetime', function() {
		return function(input) {
			if(angular.isDefined(input)) {
				var datetime = input.toString().split(' ');
				return datetime[0] + ", " + datetime[2] + " " + datetime[1] + " " + datetime[3] + ", " + datetime[4];
			}
			return "";
		}
	});
	
	module.filter('formatTime', function() {
		return function(input) {
			if(angular.isDefined(input)) {
				var milliseconds = parseInt(Math.floor(input%1000));
				var seconds = parseInt(Math.floor(input/1000)%60);
				var minutes = parseInt(Math.floor(input/(1000*60))%60);
				var hours = parseInt(Math.floor(input/(1000*60*60))%24);
				var days = parseInt(Math.floor(input/(1000*60*60*24)));
	
				if(hours < 0) hours = "00";
				else hours = (hours < 10) ? "0" + hours : hours;
				if(minutes < 0) minutes = "00";
				else minutes = (minutes < 10) ? "0" + minutes : minutes;
				if(seconds < 0) seconds = "00";
				else seconds = (seconds < 10) ? "0" + seconds : seconds;
				if(milliseconds < 0) milliseconds = "000";
	
				return days + ":" + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
			}
			return "";
		}
	});
	
	module.controller('activityHistoryCtrl', ['$scope', '$rootScope', '$modalInstance', 'DataFactory', 'SettingsFactory', 'activityId', '$filter', function($scope, $rootScope, $modalInstance, DataFactory, SettingsFactory, activityId, $filter){
		
		$scope.$on('showSparklineValue', function(event, index) {
			$scope.currentValueData = $scope.historicActivityPlotData[index];
			$scope.$apply();
		});
		
		$scope.$on('hideSparklineValue', function(event) {
			$scope.$apply();
		});
		
		$scope.$on('durationLimitChanged', function() {
			getInstanceCount(SettingsFactory.lowerDurationLimitInMs, SettingsFactory.upperDurationLimitInMs);
			$scope.$apply();
		});
		
		$scope.$on('datetimeRangeChanged', function(event, start, end) {
			$scope.start = start;
			$scope.end = end;
			$scope.showPlot();
			$scope.$evalAsync();
		});
				
		var durations = {
				data: [],
		};

		var data = DataFactory.activityDurations[activityId];
//		var times = [];
//		for(var i in data) {
//			if(times.indexOf(data[i].endTime)==-1) times.push(data[i].endTime);
//		}
//		times.sort();
//		$scope.timeOptions = times; 
		
//		$scope.start = {
//				datetime: stringToDate($scope.timeOptions[0]),
//				dateOptions: {
//					minDate: stringToDatestring($scope.timeOptions[0]),
//					maxDate: stringToDatestring($scope.timeOptions[$scope.timeOptions.length-1]),
//				},
//				isOpen: false
//		};
//
//		$scope.end = {
//				datetime: stringToDate($scope.timeOptions[$scope.timeOptions.length-1]),
//				dateOptions: {
//					minDate: stringToDatestring($scope.timeOptions[0]),
//					maxDate: stringToDatestring($scope.timeOptions[$scope.timeOptions.length-1])
//				},
//				isOpen: false
//		};
//		
//		$scope.viewportStart = $scope.start.datetime;
//		$scope.viewportEnd = $scope.end.datetime;
//
//		$scope.openStart = function($event) {
//			$event.preventDefault();
//			$event.stopPropagation();
//
//			$scope.end.isOpen = false;
//			$scope.start.isOpen = true;
//		};
//
//		$scope.openEnd = function($event) {
//			$event.preventDefault();
//			$event.stopPropagation();
//
//			$scope.start.isOpen = false;
//			$scope.end.isOpen = true;
//		};

		$scope.init = function() {
//			$scope.durationLimit = SettingsFactory.durationLimitInMs;
			$scope.showPlot();
			$rootScope.$broadcast("init");
		}

		$scope.closeModal = function() {
			$modalInstance.close();
		}
		
//		$scope.updatePlot = function() {
//			$scope.start.datetime = $scope.viewportStart;
//			$scope.end.datetime = $scope.viewportEnd;
//			$rootScope.$broadcast('datetimeChanged', datetimeToMs($scope.viewportStart), datetimeToMs($scope.viewportEnd));
//			$scope.showPlot();
//		}

		$scope.showPlot = function() {
			var data = DataFactory.activityDurations[activityId];
			
//			// check time (no options for min/max time in timepicker)
//			var minmaxDate = getMinMaxDate(data);
//			var minDate = minmaxDate[0];
//			var maxDate = minmaxDate[1];
//			var startDate = datetimeToMs($scope.start.datetime);
//			var endDate = datetimeToMs($scope.end.datetime);
//			if(startDate < minDate) $scope.start.datetime = msToDatetimeString(minDate);
//			if(endDate > maxDate) $scope.end.datetime = msToDatetimeString(maxDate);
			
			var filteredData = [];
			var datetime;
			durations.data = [];
//			var start = datetimeToMs($scope.start);
//			var end = datetimeToMs($scope.end);
			var start = $scope.start;
			var end = $scope.end;
			var min = Number.MAX_VALUE;
			var max = 0;
			for(var i in data) {
				datetime = datetimeToMs(stringToDate(data[i].endTime));
				if((angular.isUndefined($scope.start)) || (datetime >= start && datetime <= end)) {
					filteredData.push({
					"x": i,
					"y": data[i].duration,
					"processId": data[i].procInstId,
					"processDefId": data[i].procDefId,
					"processKey": data[i].procDefKey,
					"activityId": data[i].id,
					"activityName": data[i].name,
					"activityDefId": data[i].defId,
					"start": stringToDate(data[i].startTime),
					"end": stringToDate(data[i].endTime),
					"datetime": datetimeToMs(data[i].endTime), 
					"assignee": data[i].assignee
					});
					durations.data.push([datetimeToMs(data[i].endTime), data[i].duration]);
					if(data[i].duration < min) min = data[i].duration;
					if(data[i].duration > max) max = data[i].duration;
				}
			}
			SettingsFactory.lowerDurationLimitInMs = min;
			SettingsFactory.upperDurationLimitInMs = max;
			
			$scope.historicActivityPlotData = filteredData;

			getInstanceCount(SettingsFactory.lowerDurationLimitInMs, SettingsFactory.upperDurationLimitInMs);
		}
		
//		function getMinMaxDate(data) {
//			var min = Number.MAX_VALUE, max = 0, date;
//			angular.forEach(data, function(value, index) {
//				date = datetimeToMs(value.endTime);
//				if(date < min) min = date;
//				if(date > max) max = date;
//			});
//			return [min, max];
//		}

		function getInstanceCount(lowerLimit, upperLimit) {
			$scope.instanceCountBelowLimitRange = 0;
			$scope.instanceCountInLimitRange = 0;
			$scope.instanceCountAboveLimitRange = 0;
			var time;
			angular.forEach(durations.data, function(point, index) {
				time = point[1];
				if (time < lowerLimit) $scope.instanceCountBelowLimitRange++;
				else if (time <= upperLimit) $scope.instanceCountInLimitRange++;
				else $scope.instanceCountAboveLimitRange++;
			});
			$scope.instanceCount = durations.data.length;
		}

		function datetimeToMs(datetime) {
			return Date.parse(datetime);
		}

		function stringToDatestring(string) {
			var splitted = string.split('T');
			var date = splitted[0];
			var datesplitted = date.split('-');
			return "'" + datesplitted[0] + "-" + datesplitted[1] + "-" + datesplitted[2] + "'";
		}
		
		function msToDatetimeString(time) {
			var datetime = (new Date(time)).toString().split(' ');
			return datetime[0] + ", " + datetime[2] + " " + datetime[1] + " " + datetime[3] + ", " + datetime[4];
		}

		function stringToDate(string) {
			var splitted = string.split('T');
			var date = splitted[0];
			var datesplitted = date.split('-');
			var time = splitted[1];
			var timesplitted = time.split(':');
			return new Date(datesplitted[0], datesplitted[1]-1, datesplitted[2], timesplitted[0], timesplitted[1], timesplitted[2]);
		}

		function formatDate(date) {
			return date.toUTCString();
			//return date.toLocaleDateString() + ", " + date.toLocaleTimeString();
		}

	}]);
});