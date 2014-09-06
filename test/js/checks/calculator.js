(function () {
    'use strict';

    /*global module, test, equal, ok, _, calculator */
    module("check.calculator");


// TODO: spruchhemmung true, 20,20,20,0,0 => ~14% failure


    test("no wilde magie", function () {
        var result = calculator.calculatePartitioned({ attributes: [12, 12, 12], value: 4, difficulty: 0, options: { minimumQuality: true } });
        equal(result, '[{"label":"gelungen","count":3688,"partitions":[{"quality":"4","count":1752},{"quality":"3","count":429},{"quality":"2","count":465},{"quality":"1","count":1042}]},{"label":"misslungen","count":4312}]');
    });

}());