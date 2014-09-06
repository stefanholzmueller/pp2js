/*global _ */
var chart = (function () {
    'use strict';

    var percentageToolTipContent = " (#percent%)",
        colorSuccess = "#108A10",
        colorSuccessLight = "#669666",
        colorFailure = "#BB1010",
        colorFailureLight = "#C55555";

    return {
        toPieData: function (partitioned) {
            var dataPoints = _.map(partitioned.success.partitions, function (p) {
                return {
                    x: p.quality,
                    y: p.count,
                    color: colorSuccess,
                    toolTipContent: "Gelungen mit Qualität {x}" + percentageToolTipContent
                };
            });
            dataPoints.push({ y: partitioned.failure.count, color: colorFailure, toolTipContent: "Misslungen" + percentageToolTipContent });

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
