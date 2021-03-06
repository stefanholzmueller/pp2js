/*global angular, _ */

var module = angular.module('pp2.ranged', [ 'pp2.utils' ]);

module.controller('RangedController', [ '$scope', 'RangedService', function ($scope, service) {
    'use strict';

    $scope.options = service.options;

    $scope.modifications = {
        size: service.options.size[3],
        range: service.options.range[1],
        movement: {
            type: "target",
            target: service.options.movement[2],
            combat: {
                h: 0,
                ns: 0
            }
        },
        zone: {
            type: "",
            humanoid: service.options.zone.humanoid[3],
            quadruped: service.options.zone.quadruped[2],
            moving: false
        },
        sight: service.options.sight[0],
        second: false,
        steep: "",
        sidewind: "",
        fast: true,
        aim: 0,
        other: 0
    };

    $scope.character = {
        sf: {
            shooter: "m" // "n", "s"
        },
        weapon: {
            type: "shoot" // "sling", "thrown"
        }
    };

    function recalculate(newValue) {
        $scope.difficulty = service.calculateDifficulty(newValue[0], newValue[1]);
        $scope.difficultySum = _.reduce($scope.difficulty, function(a, b) { return a + b; }, 0);
    }

    $scope.$watch('[ modifications, character ]', recalculate, true);
} ]);

module.factory('RangedService', [ function () {
    'use strict';

    return {
        calculateDifficulty: function (mods, character) {
            function lookup(key, map, otherwise) {
                return map.hasOwnProperty(key) ? map[key] : otherwise;
            }

            function calculcateAim(difficulty, character) {
                var aim = mods.aim;
                var ease = character.sf.shooter === "n" ? Math.floor(aim / 2) : Math.min(aim, 4);
                var difficultyForAim = _.reduce(difficulty, function(a, b) { return a + b; }, 0) - difficulty.zone - difficulty.bidding;
                var positiveDifficulty = Math.max(difficultyForAim, 0);
                return -Math.min(positiveDifficulty, ease);
            }

            var difficulty = {
                size: mods.size.difficulty,
                range: mods.range.difficulty,
                movement: mods.movement.type === "target" ? mods.movement.target.difficulty : 0,
                combat: mods.movement.type === "combat" ? (mods.movement.combat.h * 3 + mods.movement.combat.ns * 2) : 0,
                zone: lookup(mods.zone.type, {
                    "humanoid": mods.zone.humanoid.difficulty[character.sf.shooter],
                    "quadruped": mods.zone.quadruped.difficulty[character.sf.shooter]
                }, 0) + (mods.zone.moving ? 2 : 0),
                bidding: 0, // TODO not yet implemented
                sight: mods.sight.difficulty,
                steep: character.sf.shooter === "m" ? 0 : lookup(mods.steep, {
                    "down": character.weapon.type === "sling" ? 8 : 2,
                    "up": character.weapon.type === "thrown" ? 8 : 4
                }, 0),
                sidewind: character.sf.shooter === "m" ? 0 : lookup(mods.sidewind, {
                    "normal": 4,
                    "strong": 8
                }, 0),
                fast: mods.fast ? lookup(character.sf.shooter, {
                    "m": 0,
                    "s": 1
                }, 2) : 0,
                second: mods.second ? (character.weapon.type === "thrown" ? 2 : 4) : 0,
                other: mods.other
            };

            difficulty.aim = calculcateAim(difficulty, character);

            return difficulty;
        },
        options: {
            size: Object.freeze([
                {
                    text: "winzig",
                    difficulty: 8
                },
                {
                    text: "sehr klein",
                    difficulty: 6
                },
                {
                    text: "klein",
                    difficulty: 4
                },
                {
                    text: "mittel",
                    difficulty: 2
                },
                {
                    text: "groß",
                    difficulty: 0
                },
                {
                    text: "sehr groß",
                    difficulty: -2
                }
            ]),

            range: Object.freeze([
                {
                    text: "sehr nah",
                    difficulty: -2
                },
                {
                    text: "nah",
                    difficulty: 0
                },
                {
                    text: "mittel",
                    difficulty: 4
                },
                {
                    text: "weit",
                    difficulty: 8
                },
                {
                    text: "extrem weit",
                    difficulty: 12
                }
            ]),

            movement: Object.freeze([
                {
                    text: "unbewegliches / fest montiertes Ziel",
                    difficulty: -4
                },
                {
                    text: "stillstehendes Ziel",
                    difficulty: -2
                },
                {
                    text: "leichte Bewegung des Ziels",
                    difficulty: 0
                },
                {
                    text: "schnelle Bewegung des Ziels",
                    difficulty: 2
                },
                {
                    text: "sehr schnell / Ausweichbewegungen",
                    difficulty: 4
                }
            ]),

            sight: Object.freeze([
                {
                    text: "normal",
                    difficulty: 0
                },
                {
                    text: "Dunst",
                    difficulty: 2
                },
                {
                    text: "Nebel",
                    difficulty: 4
                },
                { // TODO missing attribute 'darkness : true'
                    text: "Dämmerung",
                    difficulty: 2
                },
                {
                    text: "Mondlicht",
                    difficulty: 4
                },
                {
                    text: "Sternenlicht",
                    difficulty: 6
                },
                {
                    text: "Finsternis",
                    difficulty: 8
                },
                {
                    text: "Unsichtbares Ziel",
                    difficulty: 8
                }
            ]),

            zone: {
                humanoid: Object.freeze([
                    {
                        text: "Kopf",
                        difficulty: {
                            n: 10,
                            s: 7,
                            m: 5
                        }
                    },
                    {
                        text: "Brust",
                        difficulty: {
                            n: 6,
                            s: 4,
                            m: 3
                        }
                    },
                    {
                        text: "Arme",
                        difficulty: {
                            n: 10,
                            s: 7,
                            m: 5
                        }
                    },
                    {
                        text: "Bauch",
                        difficulty: {
                            n: 6,
                            s: 4,
                            m: 3
                        }
                    },
                    {
                        text: "Beine",
                        difficulty: {
                            n: 8,
                            s: 5,
                            m: 4
                        }
                    },
                    {
                        text: "Hand/Fuß",
                        difficulty: {
                            n: 16,
                            s: 11,
                            m: 8
                        }
                    },
                    {
                        text: "Auge/Herz",
                        difficulty: {
                            n: 20,
                            s: 13,
                            m: 10
                        }
                    }
                ]),
                quadruped: Object.freeze([
                    {
                        text: "Rumpf",
                        difficulty: {
                            n: 4,
                            s: 3,
                            m: 2
                        }
                    },
                    {
                        text: "Bein",
                        difficulty: {
                            n: 10,
                            s: 7,
                            m: 5
                        }
                    },
                    {
                        text: "verwundbare Stelle",
                        difficulty: {
                            n: 12,
                            s: 8,
                            m: 6
                        }
                    },
                    {
                        text: "Kopf",
                        difficulty: {
                            n: 16,
                            s: 11,
                            m: 8
                        }
                    }
                ])
            }
        }
    };
} ]);