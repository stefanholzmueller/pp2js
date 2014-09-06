/*global _ */
var chart = (function () {
    'use strict';

    var colorSuccess = "#108A10",
        colorSuccessLight = "#669666",
        colorFailure = "#BB1010",
        colorFailureLight = "#C55555";

    return {
        toPieData: function (partitioned) {
            var dataPoints = _.map(partitioned[0].partitions, function (p) {
                return {
                    x: p.quality,
                    y: p.count,
                    color: colorSuccess,
                    toolTipContent: "Gelungen mit Qualität {x}"
                };
            });
            dataPoints.push({ y: partitioned[1].count, color: colorFailure, toolTipContent: "Misslungen" });

            return [
                {
                    type: "pie",
                    startAngle: -90,
                    axisX: {
                        margin: 0
                    },
                    axisY: {
                        margin: 0
                    },
                    dataPoints: dataPoints
                }
            ];
        }
    };

}());
