const fs = require('fs');
const moment = require('moment');
const path = require('path');

/*
    @summary This is the constructor for the SummMon model
    @constructor
    @param data object - The map/object to use to populate this model
    @param opts object - See properties below
    @param opts.memOnly bool - Whether or not this model should save to file after initilization
*/
const SummMon = function(data, opts) {
    let self = this;

    if (!opts) {
        opts = {
            memOnly: false,
        };
    }

    self.isMissingProp = false;
    self.isMissingRequiredProp = false;

    if (!data) {
        console.warn('[SummMon] [cosntructor] data was missing or null');
        return;
    }
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    if (data.hasOwnProperty('id')) {
        self.id = parseInt(data.id, 10);
    } else {
        self.isMissingRequiredProp = true;
        console.warn('[SummMon] [cosntructor] data was missing id property');
    }

    if (data.hasOwnProperty('name')) {
        self.name = String(data.name);
    } else {
        self.isMissingRequiredProp = true;
        console.warn('[SummMon] [cosntructor] data was missing name property');
    }

    if (data.hasOwnProperty('type')) {
        self.type = String(data.type).toLowerCase();
    } else {
        self.isMissingRequiredProp = true;
        console.warn('[SummMon] [cosntructor] data was missing type property');
    }

    if (data.hasOwnProperty('ld')) {
        self.isLegendary = data.ld;
    } else {
        self.isMissingRequiredProp = true;
        console.warn('[SummMon] [cosntructor] data was missing ld property');
    }

    if (data.hasOwnProperty('rate')) {
        self.star_level = parseInt(data.rate, 10);
    } else {
        self.isMissingRequiredProp = true;
        console.warn('[SummMon] [cosntructor] data was missing rate property');
    }

    if (data.hasOwnProperty('img_base')) {
        self.image_base = String(data.img_base);
    } else {
        self.isMissingRequiredProp = true;
        console.warn('[SummMon] [cosntructor] data was missing img_base property');
    }

    if (data.hasOwnProperty('img_aw')) {
        self.image_awakened = String(data.img_aw);
    } else {
        self.isMissingRequiredProp = true;
        console.warn('[SummMon] [cosntructor] data was missing img_aw property');
    }

    // TODO: awill: add validation like above to the properties below, and properly set isMissingProp
    self.level = parseInt(data.level, 10) || -1;
    self.base_hp = parseInt(data.b_hp, 10) || -1;
    self.base_attack = parseInt(data.b_atk, 10) || -1;
    self.base_defense = parseInt(data.b_def, 10) || -1;
    self.base_speed = parseInt(data.b_spd, 10) || -1;
    self.base_crit_rate = parseInt(data.b_crate, 10) || -1;
    self.base_crit_damage = parseInt(data.b_cdmg, 10) || -1;
    self.base_resistance = parseInt(data.b_res, 10) || -1;
    self.base_accuracy = parseInt(data.b_acc, 10) || -1;

    if (!opts.memOnly) {
        self.saveToFile();
    }

    return self;
};

/*
    @enum
*/
SummMon.prototype.MONSTER_ELEMENT = {
    Dark: 'Dark',
    Fire: 'Fire',
    Light: 'Light',
    Water: 'Water',
    Wind: 'Wind',
};

/*
    @summary This method returns a file name to use when serializing this model
    @return string - If a required property is missing (`id`, `type`), the method will issue a warning and return null
*/
SummMon.prototype.getFileName = function() {
    const self = this;

    if (!self.id) {
        console.warn('[SummMon] [getFileName] No `id`, unable to generate file name');
        return null;
    }
    if (!self.type) {
        console.warn('[SummMon] [getFileName] No `type`, unable to generate file name');
        return null;
    }

    return path.join(
        path.resolve(__dirname, '..' + path.sep + 'data' + path.sep + self.type) + path.sep + self.id + '.json'
    );
};

/*
    @summary This method supports an options object with the following properties available:
    @param opts object - See properties below
    @param opts.force bool - Whether or not to force the method to overwrite the last save file
*/
SummMon.prototype.saveToFile = function(opts) {
    const self = this;
    const path = self.getFileName();

    if (!opts) {
        opts = {
            force: false,
        };
    }

    if (!path) {
        console.warn('[SummMon] [saveToFile] No path, unable to save to file');
        return;
    }

    // NOTE: if the file has not been created previously, create it now
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, self.serialize());
    } else {
        // NOTE: if the file does exist, check if it has been updated recently enough
        const stats = fs.statSync(path);
        const oneDayAgo = moment() - moment('24 hours');
        const isLessThanOneDay = moment(stats.mtime) < oneDayAgo;

        if (force || !isLessThanOneDay) {
            fs.writeFileSync(path, self.serialize());
        }
    }
};

/*
    @summary This method converts this model into a string (for persistence)
    @return string - The JSON-safe string version of this model
*/
SummMon.prototype.serialize = function() {
    const self = this;

    let returnVal = {
        id: self.id,
        name: self.name,
        isMissingRequiredProp: self.isMissingRequiredProp,
        isMissingProp: self.isMissingProp,
        type: self.type,
        isLegend: self.isLegendary,
        star: self.star_level,
        img: self.image_base,
        img_a: self.image_awakened,
        level: self.level,
        hp: self.base_hp,
        attack: self.base_attack,
        def: self.base_defense,
        speed: self.base_speed,
        crit_r: self.base_crit_rate,
        crit_d: self.base_crit_damage,
        resist: self.base_resistance,
        accuracy: self.base_accuracy,
    };

    return JSON.stringify(returnVal);
};

/*
    @toString
*/
SummMon.prototype.toString = function() {
    let self = this;
    return 'isMissingRequiredProp: ' + self.isMissingRequiredProp
        + ' isMissingProp: ' + self.isMissingProp
        + ' id: ' + self.id
        + ' name: ' + self.name
        + ' type: ' + self.type
        + ' isLegend: ' + self.isLegendary
        + ' star level: ' + self.star_level
        + ' img: ' + self.image_base
        + ' img awake: ' + self.image_awakened
        + ' level: ' + self.level
        + ' hp: ' + self.base_hp
        + ' attack: ' + self.base_attack
        + ' def: ' + self.base_defense
        + ' speed: ' + self.base_speed
        + ' crit %: ' + self.base_crit_rate
        + ' crit dmg: ' + self.base_crit_damage
        + ' resist: ' + self.base_resistance
        + ' accuracy: ' + self.base_accuracy;
};

module.exports = SummMon;
