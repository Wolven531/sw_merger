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

    self._tsCreation = moment.utc();
    self.missingFields = [];

    if (!data) {
        console.warn(`[${ self.getModelName() }] [cosntructor] data was missing or null`);
        return;
    }
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    // NOTE: awill: consider automating this
    // using the enum, convert below initialization code to loop && function

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.id.internal_prop)) {
        self.id = parseInt(data[SummMon.MONSTER_PROPERTIES.id.internal_prop], 10);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.id.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.id);
        self.id = SummMon.MONSTER_PROPERTIES.id.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.name.internal_prop)) {
        self.name = String(data[SummMon.MONSTER_PROPERTIES.name.internal_prop]);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.name.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.name);
        self.name = SummMon.MONSTER_PROPERTIES.name.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.type.internal_prop)) {
        self.type = String(data[SummMon.MONSTER_PROPERTIES.type.internal_prop]).toLowerCase();
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.type.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.type);
        self.type = SummMon.MONSTER_PROPERTIES.type.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.ld.internal_prop)) {
        self.isLegendary = data[SummMon.MONSTER_PROPERTIES.ld.internal_prop];
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.ld.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.ld);
        self.isLegendary = SummMon.MONSTER_PROPERTIES.isLegendary.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.star_level.internal_prop)) {
        self.star_level = parseInt(data[SummMon.MONSTER_PROPERTIES.star_level.internal_prop], 10);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.star_level.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.star_level);
        self.star_level = SummMon.MONSTER_PROPERTIES.star_level.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.img_base.internal_prop)) {
        self.image_base = String(data[SummMon.MONSTER_PROPERTIES.img_base.internal_prop]);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.img_base.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.img_base);
        self.image_base = SummMon.MONSTER_PROPERTIES.img_base.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.img_awakened.internal_prop)) {
        self.image_awakened = String(data[SummMon.MONSTER_PROPERTIES.img_awakened.internal_prop]);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.img_awakened.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.img_awakened);
        self.image_awakened = SummMon.MONSTER_PROPERTIES.img_awakened.default;
    }

    // NOTE: begin non-required properties

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.level.internal_prop)) {
        self.level = parseInt(data[SummMon.MONSTER_PROPERTIES.level.internal_prop], 10);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.level.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.level);
        self.level = SummMon.MONSTER_PROPERTIES.level.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.base_hp.internal_prop)) {
        self.base_hp = parseInt(data[SummMon.MONSTER_PROPERTIES.base_hp.internal_prop], 10);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.base_hp.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.base_hp);
        self.base_hp = SummMon.MONSTER_PROPERTIES.base_hp.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.base_attack.internal_prop)) {
        self.base_attack = parseInt(data[SummMon.MONSTER_PROPERTIES.base_attack.internal_prop], 10);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.base_attack.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.base_attack);
        self.base_attack = SummMon.MONSTER_PROPERTIES.base_attack.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.base_defense.internal_prop)) {
        self.base_defense = parseInt(data[SummMon.MONSTER_PROPERTIES.base_defense.internal_prop], 10);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.base_defense.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.base_defense);
        self.base_defense = SummMon.MONSTER_PROPERTIES.base_defense.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.base_speed.internal_prop)) {
        self.base_speed = parseInt(data[SummMon.MONSTER_PROPERTIES.base_speed.internal_prop], 10);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.base_speed.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.base_speed);
        self.base_speed = SummMon.MONSTER_PROPERTIES.base_speed.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.base_crit_rate.internal_prop)) {
        self.base_crit_rate = parseInt(data[SummMon.MONSTER_PROPERTIES.base_crit_rate.internal_prop], 10);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.base_crit_rate.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.base_crit_rate);
        self.base_crit_rate = SummMon.MONSTER_PROPERTIES.base_crit_rate.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.base_crit_damage.internal_prop)) {
        self.base_crit_damage = parseInt(data[SummMon.MONSTER_PROPERTIES.base_crit_damage.internal_prop], 10);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.base_crit_damage.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.base_crit_damage);
        self.base_crit_damage = SummMon.MONSTER_PROPERTIES.base_crit_damage.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.base_resistance.internal_prop)) {
        self.base_resistance = parseInt(data[SummMon.MONSTER_PROPERTIES.base_resistance.internal_prop], 10);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.base_resistance.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.base_resistance);
        self.base_resistance = SummMon.MONSTER_PROPERTIES.base_resistance.default;
    }

    if (data.hasOwnProperty(SummMon.MONSTER_PROPERTIES.base_accuracy.internal_prop)) {
        self.base_accuracy = parseInt(data[SummMon.MONSTER_PROPERTIES.base_accuracy.internal_prop], 10);
    } else {
        console.warn(SummMon.PROPERTY_MISSING_TAG`${ SummMon.MONSTER_PROPERTIES.base_accuracy.display }`);
        self.missingFields.push(SummMon.MONSTER_PROPERTIES.base_accuracy);
        self.base_accuracy = SummMon.MONSTER_PROPERTIES.base_accuracy.default;
    }

    if (!opts.memOnly) {
        self.saveToFile();
    }

    return self;
};

/*
    @summary This method determines wheter or not this model is missing a property
    @return bool - true if a property is missing from the model, false otherwise
*/
SummMon.prototype.isMissingProp = function() {
    const self = this;
    return Array.isArray(self.missingFields) && (self.missingFields.length > 0);
};

/*
    @summary This method determines wheter or not this model is missing a required property
    @return bool - true if a required property is missing from the model, false otherwise
*/
SummMon.prototype.isMissingRequiredProp = function() {
    const self = this;
    let missingRequiredFields = [];

    if (!Array.isArray(self.missingFields) || (self.missingFields.length < 1)) {
        return false;
    }

    missingRequiredFields = self.missingFields.filter(function(field, ind, arr) {
        return SummMon.MONSTER_PROPERTIES[field] && SummMon.MONSTER_PROPERTIES[field].required;
    });

    return missingRequiredFields.length > 0;
};

/*
    @enum
*/
SummMon.MONSTER_ELEMENT = {
    Dark: 'dark',
    Fire: 'fire',
    Light: 'light',
    Water: 'water',
    Wind: 'wind',
};

/*
    @enum
*/
SummMon.MONSTER_PROPERTIES = {
    id: {
        internal_prop: 'id',
        required: true,
        default: null,
        display: 'ID',
    },
    name: {
        internal_prop: 'name',
        required: true,
        default: '',
        display: 'Name',
    },
    type: {
        internal_prop: 'type',
        required: true,
        default: SummMon.MONSTER_ELEMENT.Light,
        display: 'Type',
    },
    ld: {
        internal_prop: 'ld',
        required: true,
        default: '',
        display: 'Legendary',
    },
    star_level: {
        internal_prop: 'rate',
        required: true,
        default: 1,
        display: 'Star Level',
    },
    img_base: {
        internal_prop: 'img_base',
        required: true,
        default: '',
        display: 'Img Base',
    },
    img_awakened: {
        internal_prop: 'img_aw',
        required: true,
        default: '',
        display: 'Img Awakened',
    },
    level: {
        internal_prop: 'level',
        required: false,
        default: 1,
        display: 'Level',
    },
    base_hp: {
        internal_prop: 'b_hp',
        required: false,
        default: 0,
        display: 'Base HP',
    },
    base_attack: {
        internal_prop: 'b_atk',
        required: false,
        default: 0,
        display: 'Base Attack',
    },
    base_defense: {
        internal_prop: 'b_def',
        required: false,
        default: 0,
        display: 'Base Defense',
    },
    base_speed: {
        internal_prop: 'b_spd',
        required: false,
        default: 0,
        display: 'Base Speed',
    },
    base_crit_rate: {
        internal_prop: 'b_crate',
        required: false,
        default: 0,
        display: 'Base Crit Rate',
    },
    base_crit_damage: {
        internal_prop: 'b_cdmg',
        required: false,
        default: 0,
        display: 'Base Crit Dmg',
    },
    base_resistance: {
        internal_prop: 'b_res',
        required: false,
        default: 0,
        display: 'Base Resistance',
    },
    base_accuracy: {
        internal_prop: 'b_acc',
        required: false,
        default: 0,
        display: 'Base Accuracy',
    },
};

/*
    @summary This method is an ES6 tagged template literal
    @param string[] strings - An array representing parts of the string (substrings) surrounding the tag expression
    @param string propExp - The property name that is missing (likely from SummMon.MONSTER_PROPERTIES)
    @return string
*/
SummMon.PROPERTY_MISSING_TAG = function(strings, propExp) {
    return `[PROPERTY_MISSING_TAG] data was missing "${propExp}" property`;
};

/*
    @summary This method returns a file name to use when serializing this model
    @return string - If a required property is missing (`id`, `type`), the method will issue a warning and return null
*/
SummMon.prototype.getFileName = function() {
    const self = this;

    if (!self.id) {
        console.warn(`[${ self.getModelName() }] [getFileName] Missing "${ SummMon.MONSTER_PROPERTIES.id.display }" property, unable to generate file name`);
        return null;
    }
    if (!self.type) {
        console.warn(`[${ self.getModelName() }] [getFileName] Missing "${ SummMon.MONSTER_PROPERTIES.type.display }" property, unable to generate file name`);
        return null;
    }

    return path.join(
        path.resolve(__dirname, `..${ path.sep }data${ path.sep }${ self.type }`)
        + `${ path.sep }${ self.id }.json`
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
        console.warn(`[${ self.getModelName() }] [saveToFile] No path, unable to save to file`);
        return;
    }

    // NOTE: if the file does not exist, create it now
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, self.serialize(), { encoding: 'utf8', flag: 'w', mode: 0o644 });
    } else {
        // NOTE: if the file exists, check if it has been updated recently enough
        const stats = fs.statSync(path);
        const now = moment();
        const oneDayAgo = now.subtract(1, 'days');
        const fileModifiedTime = moment(stats.mtime.getMilliseconds());
        const isLessThanOneDay = fileModifiedTime.isBefore(oneDayAgo);

        if (opts.force || !isLessThanOneDay) {
            fs.writeFileSync(path, self.serialize(), { encoding: 'utf8', flag: 'w', mode: 0o644 });
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
        isMissingRequiredProp: self.isMissingRequiredProp(),
        isMissingProp: self.isMissingProp(),
        missingFields: self.missingFields,
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
        _tsCreation: self._tsCreation,
        _tsSerialize: moment.utc(),
    };

    return JSON.stringify(returnVal);
};

/*
    @summary This method is used to ensure each model has a unique name (maintenance)
    @return string
*/
SummMon.prototype.getModelName = function() {
    return 'SummMon';
};

/*
    @toString
*/
SummMon.prototype.toString = function() {
    let self = this;
    return `[${ self.getModelName() }]
        isMissingRequiredProp: ${ self.isMissingRequiredProp() }
        isMissingProp: ${ self.isMissingProp() }
        missingFields: ${ self.missingFields.join(',') }
        _tsCreation: ${ self._tsCreation }
        _tsSerialize: ${ self._tsSerialize }
        id: ${ self.id }
        name: ${ self.name }
        type: ${ self.type }
        isLegend: ${ self.isLegendary }
        star level: ${ self.star_level }
        img: ${ self.image_base }
        img awake: ${ self.image_awakened }
        level: ${ self.level }
        hp: ${ self.base_hp }
        attack: ${ self.base_attack }
        def: ${ self.base_defense }
        speed: ${ self.base_speed }
        crit %: ${ self.base_crit_rate }
        crit dmg: ${ self.base_crit_damage }
        resist: ${ self.base_resistance }
        accuracy: ${ self.base_accuracy }`;
};

module.exports = SummMon;
