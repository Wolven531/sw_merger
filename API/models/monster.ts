'use strict';

import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';

export default class SummMon {
    public static MONSTER_ELEMENT = {
        Dark: 'dark',
        Fire: 'fire',
        Light: 'light',
        Water: 'water',
        Wind: 'wind',
        asArray: (): string[] => {
            return ['dark', 'fire', 'light', 'water', 'wind'];
        },
        validate: (testElem: string): boolean => {
            return SummMon.MONSTER_ELEMENT.asArray().indexOf(testElem) > -1;
        },
    };

    /*
        @summary This method is used to ensure each model has a unique name (maintenance)
        @return string
    */
    public static getModelName(): string {
        return 'SummMon';
    };

    public missingFields: string[] = new Array<string>();

    public _tsCreation: number;
    public _tsLastUpdate: number;

    public id: number;

    public name: string;
    public type: string;
    public image_base: string;
    public image_awakened: string;
    public isLegendary = false;
    public star_level: number;
    public level: number;

    public base_hp: number;
    public base_attack: number;
    public base_defense: number;
    public base_speed: number;
    public base_crit_rate: number;
    public base_crit_damage: number;
    public base_resistance: number;
    public base_accuracy: number;

    /*
        @summary This is the constructor for the SummMon model
        @constructor
        @param data object - The map/object to use to populate this model
        @param opts object - See properties below
        @param opts.memOnly bool - Whether or not this model should save to file after initilization
    */
    constructor(private data: any = null, private opts: any = null) {
        if (!opts) {
            opts = {
                memOnly: true,
            };
        }

        if (!data) {
            console.warn(`[${SummMon.getModelName()}] [constructor] data was missing or null`);
            return;
        }
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        // NOTE: carry forward the ID
        if (data.hasOwnProperty('id')) {
            this.id = parseInt(data['id'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('id'));
            this.missingFields.push('id');
        }
        // NOTE: carry forward the creation time
        if (data.hasOwnProperty('_tsCreation')) {
            this._tsCreation = data._tsCreation;
        } else {
            this._tsCreation = moment.utc().valueOf();
        }
        // NOTE: carry forward the last update time
        if (data.hasOwnProperty('_tsLastUpdate')) {
            this._tsLastUpdate = data._tsLastUpdate;
        } else {
            this._tsLastUpdate = this._tsCreation;
        }

        if (data.hasOwnProperty('name')) {
            this.name = String(data['name']);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('name'));
            this.missingFields.push('name');
            this.name = '';
        }

        if (data.hasOwnProperty('type')) {
            this.type = String(data['type']).toLowerCase();
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('type'));
            this.missingFields.push('type');
            this.type = 'unknown';
        }

        if (data.hasOwnProperty('ld') || data.hasOwnProperty('isLegendary')) {
            if (data.hasOwnProperty('ld')) {
                this.isLegendary = Boolean(data['ld']);
            } else {
                this.isLegendary = Boolean(data['isLegendary']);
            }
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('isLegendary'));
            this.missingFields.push('isLegendary');
            this.isLegendary = false;
        }

        if (data.hasOwnProperty('rate') || data.hasOwnProperty('star_level')) {
            this.star_level = parseInt(data['rate'] || data['star_level'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('star_level'));
            this.missingFields.push('star_level');
        }

        if (data.hasOwnProperty('img_base') || data.hasOwnProperty('image_base')) {
            this.image_base = String(data['img_base'] || data['image_base']);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('base image'));
            this.missingFields.push('image_base');
            this.image_base = '';
        }

        if (data.hasOwnProperty('img_aw') || data.hasOwnProperty('image_awakened')) {
            this.image_awakened = String(data['img_aw'] || data['image_awakened']);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('awakened image'));
            this.missingFields.push('image_awakened');
            this.image_awakened = '';
        }

        // NOTE: begin non-required properties

        if (data.hasOwnProperty('level')) {
            this.level = parseInt(data['level'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('level'));
            this.missingFields.push('level');
        }

        if (data.hasOwnProperty('b_hp') || data.hasOwnProperty('base_hp')) {
            this.base_hp = parseInt(data['b_hp'] || data['base_hp'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('base hp'));
            this.missingFields.push('base_hp');
        }

        if (data.hasOwnProperty('b_atk') || data.hasOwnProperty('base_attack')) {
            this.base_attack = parseInt(data['b_atk'] || data['base_attack'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('base attack'));
            this.missingFields.push('base_attack');
        }

        if (data.hasOwnProperty('b_def') || data.hasOwnProperty('base_defense')) {
            this.base_defense = parseInt(data['b_def'] || data['base_defense'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('base defense'));
            this.missingFields.push('base_defense');
        }

        if (data.hasOwnProperty('b_spd') || data.hasOwnProperty('base_speed')) {
            this.base_speed = parseInt(data['b_spd'] || data['base_speed'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('base speed'));
            this.missingFields.push('base_speed');
        }

        if (data.hasOwnProperty('b_crate') || data.hasOwnProperty('base_crit_rate')) {
            this.base_crit_rate = parseInt(data['b_crate'] || data['base_crit_rate'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('base crit rate'));
            this.missingFields.push('base_crit_rate');
        }

        if (data.hasOwnProperty('b_cdmg') || data.hasOwnProperty('base_crit_damage')) {
            this.base_crit_damage = parseInt(data['b_cdmg'] || data['base_crit_damage'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('base crit dmg'));
            this.missingFields.push('base_crit_damage');
        }

        if (data.hasOwnProperty('b_res') || data.hasOwnProperty('base_resistance')) {
            this.base_resistance = parseInt(data['b_res'] || data['base_resistance'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('base resistance'));
            this.missingFields.push('base_resistance');
        }

        if (data.hasOwnProperty('b_acc') || data.hasOwnProperty('base_accuracy')) {
            if (data.hasOwnProperty('b_acc')) {
                this.base_accuracy = parseInt(data['b_acc'], 10);
            } else {
                this.base_accuracy = parseInt(data['base_accuracy'], 10);
            }
        } else {
            console.warn(this.PROPERTY_MISSING_TAG('b_acc'));
            this.missingFields.push('base_accuracy');
        }

        if (isNaN(this.id)) {
            this.id = -1;
        }
        if (isNaN(this.star_level)) {
            this.star_level = 1;
        }
        if (isNaN(this.level)) {
            this.level = 1;
        }
        if (isNaN(this.base_hp)) {
            this.base_hp = 0;
        }
        if (isNaN(this.base_attack)) {
            this.base_attack = 0;
        }
        if (isNaN(this.base_defense)) {
            this.base_defense = 0;
        }
        if (isNaN(this.base_speed)) {
            this.base_speed = 0;
        }
        if (isNaN(this.base_crit_rate)) {
            this.base_crit_rate = 0;
        }
        if (isNaN(this.base_crit_damage)) {
            this.base_crit_damage = 0;
        }
        if (isNaN(this.base_resistance)) {
            this.base_resistance = 0;
        }
        if (isNaN(this.base_accuracy)) {
            this.base_accuracy = 0;
        }

        if (!opts.memOnly) {
            this.saveToFile();
        }
    }

    /*
        @summary This method determines wheter or not this model is missing a property
        @return bool - true if a property is missing from the model, false otherwise
    */
    public isMissingProp(): boolean {
        return this.missingFields.length > 0;
    };

    /*
        @summary This method determines wheter or not this model is missing a required property
        @return bool - true if a required property is missing from the model, false otherwise
    */
    public isMissingRequiredProp(): boolean {
        const requiredFields = ['id', 'name', 'type'];
        let missingRequiredFields = [];

        if (!Array.isArray(this.missingFields) || (this.missingFields.length < 1)) {
            return false;
        }

        missingRequiredFields = this.missingFields.filter((field: string, ind: number, arr: string[]) => {
            return requiredFields.indexOf(field) > -1;
        });

        return missingRequiredFields.length > 0;
    };

    /*
        @summary This method converts this model into a string (for persistence)
        @return string - The JSON-safe string version of this model
    */
    public serialize(): string {
        const returnVal = {
            id: this.id,
            name: this.name,
            type: this.type,
            isLegendary: this.isLegendary,
            star_level: this.star_level,
            image_base: this.image_base,
            image_awakened: this.image_awakened,
            level: this.level,
            base_hp: this.base_hp,
            base_attack: this.base_attack,
            base_defense: this.base_defense,
            base_speed: this.base_speed,
            base_crit_rate: this.base_crit_rate,
            base_crit_damage: this.base_crit_damage,
            base_resistance: this.base_resistance,
            base_accuracy: this.base_accuracy,
            isMissingRequiredProp: this.isMissingRequiredProp(),
            isMissingProp: this.isMissingProp(),
            missingFields: this.missingFields,
            _tsCreation: this._tsCreation,
            _tsLastUpdate: this._tsLastUpdate,
        };

        return JSON.stringify(returnVal);
    };

    /*
        @toString
    */
    public toString(): string {
        return `[${SummMon.getModelName()}]
            isMissingRequiredProp: ${ this.isMissingRequiredProp()}
            isMissingProp: ${ this.isMissingProp()}
            missingFields: ${ this.missingFields.join(',')}
            _tsCreation: ${ this._tsCreation}
            _tsLastUpdate: ${ this._tsLastUpdate}
            id: ${ this.id}
            name: ${ this.name}
            type: ${ this.type}
            isLegendary: ${ this.isLegendary}
            star level: ${ this.star_level}
            img: ${ this.image_base}
            img awake: ${ this.image_awakened}
            level: ${ this.level}
            hp: ${ this.base_hp}
            attack: ${ this.base_attack}
            def: ${ this.base_defense}
            speed: ${ this.base_speed}
            crit %: ${ this.base_crit_rate}
            crit dmg: ${ this.base_crit_damage}
            resist: ${ this.base_resistance}
            accuracy: ${ this.base_accuracy}`;
    };

    /*
        @summary This method supports an options object with the following properties available:
        @param opts object - See properties below
        @param opts.force bool - Whether or not to force the method to overwrite the last save file
    */
    public saveToFile = (opts: any = null): void => {
        const pathStr = this.getFileName();
        console.info(`[${SummMon.getModelName()}] [saveToFile] pathStr=${ pathStr }`);

        if (!opts) {
            opts = {
                force: false,
            };
        }

        if (!path) {
            console.warn(`[${SummMon.getModelName()}] [saveToFile] No path, unable to save to file`);
            return;
        }

        // NOTE: if the file does not exist, create it now
        if (!fs.existsSync(pathStr)) {
            fs.writeFileSync(pathStr, this.serialize(), { encoding: 'utf8', flag: 'w', mode: 0o644 });
        } else {
            // NOTE: if the file exists, check if it has been updated recently enough
            const stats = fs.statSync(pathStr);
            const now = moment();
            const oneDayAgo = now.subtract(1, 'days');
            const fileModifiedTime = moment(stats.mtime.getMilliseconds());
            const isLessThanOneDay = fileModifiedTime.isBefore(oneDayAgo);

            if (opts.force || !isLessThanOneDay) {
                fs.writeFileSync(pathStr, this.serialize(), { encoding: 'utf8', flag: 'w', mode: 0o644 });
            }
        }
    };

    /*
        @summary Get a string to pretty print a missing property
        @param string propName - A string representing the property name that is missing
        @return string
    */
    private PROPERTY_MISSING_TAG = (propName: string): string => {
        return `[PROPERTY_MISSING_TAG] data was missing "${propName}" property`;
    };

    /*
        @summary This method returns a file name to use when serializing this model
        @return string - If a required property is missing (`id`, `type`), the method will issue a warning and return null
    */
    private getFileName(): string {
        if (!this.id) {
            console.warn(`[${SummMon.getModelName()}] [getFileName] Missing id property, unable to generate file name`);
            return null;
        }
        if (!this.type) {
            console.warn(`[${SummMon.getModelName()}] [getFileName] Missing type property, unable to generate file name`);
            return null;
        }

        const fp = path.join(
            path.resolve(__dirname, `..${path.sep}..${path.sep}data${path.sep}${this.type}`) + `${path.sep}${this.id}.json`
        );

        console.info(`[${SummMon.getModelName()}] [getFileName] fp=${fp}`);

        return fp;
    };
};

export { SummMon as SummMon };
