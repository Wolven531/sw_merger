'use strict';

export class SummMon {
    id: number;
    name: string;
    isMissingRequiredProp: boolean;
    isMissingProp: boolean;
    missingFields: Array<string>;
    type: string;
    isLegendary: boolean;
    star: number;
    image_base: string;
    image_awakened: string;
    level = 1;
    hp = 0;
    attack = 0;
    defense = 0;
    speed = 0;
    crit_rate = 0;
    crit_damage = 0;
    resist = 0;
    accuracy = 0;
    _tsCreation = 0;
    _tsLastUpdate = 0;

    constructor() { }
}
