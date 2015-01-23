ngDefine('cockpit.plugin.statistics-plugin.services', function(module) {
	module.factory('GraphFactory', function() {
		var GraphFactory = [];
		//add some info that will be displayed as tooltip
		GraphFactory.timeDistViews = [{'name':'chronological development','info':"ich bin ein cooler Plot"},{'name':'distribution', 'info':"ich aber auch!!"}];
		
		GraphFactory.getOptionsForStartEndTimeGraph = function(timeFormat,width){
			var options = {
					 chart: {
			                type: 'scatterChart',
			                height: 400,
			                width: width,
			                color: d3.scale.category10().range(),
			                x: function(d){return d.x;},
			                y: function(d){return d.y;},
			                showLabels: true,
			                interactive:false,
			                transitionDuration: 500,
			                labelThreshold: 0.01,
			                tooltips: true,
			                tooltipContent: function(key, y, e, graph){
			                				return '<h3>' + key + '</h3>' +
			                				'<p>' +  y + '</p><br/> Click for Versioninfo';
			                				},
			                xAxis: {
			                	tickFormat: function(d) {return d3.time.format(timeFormat)(new Date(d))}
			                },
			                
			                yAxis: {
			                	tickFormat: function(){return""}
			                },
			                noData:"sorry data not yet available",
			                legend: {
			                    margin: {
			                        top: 5,
			                        right: 5,
			                        bottom: 5,
			                        left: 5
			                    }
			                }
			            }
			};
			return options;
			
		};
		
		GraphFactory.getOptionsForTimeDistributionGraph = function(bins,thresholds){
			var options = {
					 chart: {
			                type: 'multiBarChart',
			                height: 400,
			                width: 1000,
			                color: d3.scale.category10().range(),
			                x: function(d){return d.x;},
			                y: function(d){return d.y;},
			                showLabels: true,
			                transitionDuration: 500,
			                labelThreshold: 0.01,
			                reduceXTicks : false, //we want all ticks to be displayed!
			                // e is the mouse event
			                tooltip : function(key, x, y, e, graph) {
			                	var String = thresholds[e.point.x].toPrecision(2) + ' - ' + thresholds[e.point.x+1].toPrecision(2);
			                	return '<h3>' + key + '</h3>' +
			                	'<p>' + y + ' on ' +  String + '</p>'
			                	},
			                xAxis: {
//			                	tickFormat: function(d) {return d3.time.format("%Y-%m-%dT%H:%M:%S")(new Date(d))}
//			                	tickFormat: function(d) {return d.toPrecision()}
			                	tickFormat: function(d) {return (d * (100/bins)).toFixed(0) + '-' + ((d+1)*(100/bins)).toFixed(0) + '%'},
			                	axisLabel : "% of range",
			                },
			                
			                yAxis: {
			                	tickFormat: function(d){return d.toPrecision()}
			                },
			                noData:"sorry data not yet available",
			                legend: {
			                    margin: {
			                        top: 5,
			                        right: 5,
			                        bottom: 5,
			                        left: 5
			                    }
			                }
			            }
			};
			return options;
			
		}
		return GraphFactory;
	});
});