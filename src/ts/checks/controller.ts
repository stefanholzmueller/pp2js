/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="calculate.ts" />
"use strict";

declare var CanvasJS : any;

var module = angular.module('pp2.check', []);

module.controller('CheckController', [ '$scope', function ($scope) {
	var check : Checks.Check = $scope.check = {
		attributes: [12, 12, 12],
		value: 4,
		difficulty: 0,
		options: {
			minimumQuality: true
		}
	};

	$scope.canvasjsPieChart = new CanvasJS.Chart("canvasjsPieChart", {
		animationEnabled: false,
//		creditLink: null,
//		creditText: null,
		data: [
			{
				type: "pie",
				startAngle: -90,
				axisX: {
					margin: 0
				},
				axisY: {
					margin: 0
				},
				dataPoints: []
			}
		]
	});

	$scope.canvasjsBarChart = new CanvasJS.Chart("canvasjsBarChart", {
		data: [
		]
	});

	$scope.$watch("check", function (newCheck) {
		var partitioned = Checks.calculatePartitionedMemoized(newCheck);
		$scope.canvasjsPieChart.options.data[0].dataPoints = toCanvasjsPieDataPoints(partitioned);
		$scope.canvasjsPieChart.render();

		var difficulties = _.uniq([12, 8, 4, 0, -4, -8, -12, newCheck.difficulty]).sort((a, b) => a - b);
		var checks = _.map(difficulties, function (difficulty) {
			var check : any = _.merge(_.cloneDeep(newCheck), { difficulty: difficulty});
			check.result = Checks.calculatePartitionedMemoized(check);
			return check;
		});
		var dataPoints = _.map(checks, function (check : any) {
			return { y: check.result[1].count, label: "difficulty = " + check.difficulty };
		});

		$scope.canvasjsBarChart.options.data = [
			{
				type: "stackedBar100",
				color: "#bb0000",
				dataPoints: dataPoints
			}
		];
		$scope.canvasjsBarChart.render();

//	$scope.canvasjsBarChart.options.data = [
//		{
//			type: "stackedBar100",
//			color: "#008000",
//			dataPoints: [
//				{y: 1 },
//				{y: 5 },
//				{y: 20 }
//
//			]
//		},
//		{
//			type: "stackedBar100",
//			color: "#008000",
//			dataPoints: [
//				{y: 0},
//				{y: 10 },
//				{y: 20, toolTipContent: "gelungen mit 0" }
//
//			]
//		},
//		{
//			type: "stackedBar100",
//			color: "#bb0000",
//			dataPoints: [
//				{y: 99, label: "erschwert um 12" },
//				{y: 85, label: "erschwert um 4" },
//				{y: 60, label: "nicht modifiziert" }
//			]
//		}
//
//	]	;
	}, true);

	function toCanvasjsPieDataPoints(partitioned) {
		var partitions : Array<{count; quality;}> = partitioned[0].partitions;
		var dataPoints : Array<{y;}> = _.map(partitions, function (p) {
			return {
				x: p.quality,
				y: p.count,
				color: "#008000",
				toolTipContent: "gelungen mit {x}"
			};
		});
		dataPoints.push({y: partitioned[1].count, color: "#bb0000", toolTipContent: "misslungen"});
		return dataPoints;
	}

	function toCanvasjsBarData(partitioned) {
		var partitions : Array<{count; quality;}> = partitioned[0].partitions;
		var data : any = _.map(partitions, function (p) {
			return {
				type: "stackedBar100",
				dataPoints: [
					{
						label: "gelungen mit " + p.quality,
						x: p.quality,
						y: p.count,
						color: "#008000",
						toolTipContent: "gelungen mit {x}"
					}
				]
			};
		});
		data.push({
			type: "stackedBar100",
			dataPoints: [
				{
					label: "misslungen",
					y: partitioned[1].count,
					color: "#bb0000",
					toolTipContent: "misslungen"
				}
			]
		});
		return data;
	}
}])
;
