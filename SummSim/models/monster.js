const SummMon = function(data) {
    let self = this;
    self.isMissingProp = false;
    self.isMissingRequiredProp = false;

    if (!data) {
        return;
    }
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    if (data.hasOwnProperty('id')) {
        self.id = data.id;
    } else {
        self.isMissingRequiredProp = true;
        console.warn('data was missing id property');
    }

    if (data.hasOwnProperty('name')) {
        self.name = data.name;
    } else {
        self.isMissingRequiredProp = true;
        console.warn('data was missing name property');
    }

    if (data.hasOwnProperty('type')) {
        self.type = data.type;
    } else {
        self.isMissingRequiredProp = true;
        console.warn('data was missing type property');
    }

    if (data.hasOwnProperty('ld')) {
        self.isLegendary = data.ld;
    } else {
        self.isMissingRequiredProp = true;
        console.warn('data was missing ld property');
    }

    if (data.hasOwnProperty('rate')) {
        self.star_level = data.rate;
    } else {
        self.isMissingRequiredProp = true;
        console.warn('data was missing rate property');
    }

    if (data.hasOwnProperty('img_base')) {
        self.image_base = data.img_base;
    } else {
        self.isMissingRequiredProp = true;
        console.warn('data was missing img_base property');
    }

    if (data.hasOwnProperty('img_aw')) {
        self.image_awakened = data.img_aw;
    } else {
        self.isMissingRequiredProp = true;
        console.warn('data was missing img_aw property');
    }

    // TODO: awill: add validation like above to the properties below, and properly set isMissingProp
    self.level = data.level || -1;
    self.base_hp = data.b_hp || -1;
    self.base_attack = data.b_atk || -1;
    self.base_defense = data.b_def || -1;
    self.base_speed = data.b_spd || -1;
    self.base_crit_rate = data.b_crate || -1;
    self.base_crit_damage = data.b_cdmg || -1;
    self.base_resistance = data.b_res || -1;
    self.base_accuracy = data.b_acc || -1;

    return self;
};

SummMon.prototype.MONSTER_ELEMENT = {
    Dark: 'Dark',
    Fire: 'Fire',
    Light: 'Light',
    Water: 'Water',
    Wind: 'Wind',
};

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
