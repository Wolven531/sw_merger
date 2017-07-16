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

    public id: number;
    public _tsCreation: number;
    public _tsSerialize: number;
    public missingFields: string[];

    public name: string;
    public type: string;
    public isLegendary: boolean;
    public star_level: number;
    public image_base: string;
    public image_awakened: string;
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
            console.warn(`[${this.getModelName()}] [constructor] data was missing or null`);
            return;
        }
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        // NOTE: for now carry forward the serialize time
        if (data.hasOwnProperty('_tsSerialize')) {
            this._tsSerialize = data._tsSerialize;
        }

        this._tsCreation = moment.utc().valueOf();

        // NOTE: awill: consider automating this
        // using the enum, convert below initialization code to loop && function

        if (data.hasOwnProperty('id')) {
            this.id = parseInt(data['id'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`id`);
            this.missingFields.push('id');
            this.id = -1;
        }

        if (data.hasOwnProperty('name')) {
            this.name = String(data['name']);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`name`);
            this.missingFields.push('name');
            this.name = '';
        }

        if (data.hasOwnProperty('type')) {
            this.type = String(data['type']).toLowerCase();
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`type`);
            this.missingFields.push('type');
            this.type = 'unknown';
        }

        if (data.hasOwnProperty('ld')) {
            this.isLegendary = data['ld'];
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`isLegendary`);
            this.missingFields.push('isLegendary');
            this.isLegendary = false;
        }

        if (data.hasOwnProperty('rate')) {
            this.star_level = parseInt(data['rate'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`star_level`);
            this.missingFields.push('star_level');
            this.star_level = 1;
        }

        if (data.hasOwnProperty('img_base')) {
            this.image_base = String(data['img_base']);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`base image`);
            this.missingFields.push('image_base');
            this.image_base = '';
        }

        if (data.hasOwnProperty('img_aw')) {
            this.image_awakened = String(data['img_aw']);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`awakened image`);
            this.missingFields.push('image_awakened');
            this.image_awakened = '';
        }

        // NOTE: begin non-required properties

        if (data.hasOwnProperty('level')) {
            this.level = parseInt(data['level'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`level`);
            this.missingFields.push('level');
            this.level = 1;
        }

        if (data.hasOwnProperty('b_hp')) {
            this.base_hp = parseInt(data['b_hp'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`base hp`);
            this.missingFields.push('base_hp');
            this.base_hp = 0;
        }

        if (data.hasOwnProperty('b_atk')) {
            this.base_attack = parseInt(data['b_atk'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`base attack`);
            this.missingFields.push('base_attack');
            this.base_attack = 0;
        }

        if (data.hasOwnProperty('b_def')) {
            this.base_defense = parseInt(data['b_def'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`base defense`);
            this.missingFields.push('base_defense');
            this.base_defense = 0;
        }

        if (data.hasOwnProperty('b_spd')) {
            this.base_speed = parseInt(data['b_spd'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`base speed`);
            this.missingFields.push('base_speed');
            this.base_speed = 0;
        }

        if (data.hasOwnProperty('b_crate')) {
            this.base_crit_rate = parseInt(data['b_crate'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`base crit rate`);
            this.missingFields.push('base_crit_rate');
            this.base_crit_rate = 0;
        }

        if (data.hasOwnProperty('b_cdmg')) {
            this.base_crit_damage = parseInt(data['b_cdmg'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`base crit dmg`);
            this.missingFields.push('base_crit_damage');
            this.base_crit_damage = 0;
        }

        if (data.hasOwnProperty('b_res')) {
            this.base_resistance = parseInt(data['b_res'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`base resistance`);
            this.missingFields.push('base_resistance');
            this.base_resistance = 0;
        }

        if (data.hasOwnProperty('b_acc')) {
            this.base_accuracy = parseInt(data['b_acc'], 10);
        } else {
            console.warn(this.PROPERTY_MISSING_TAG`b_acc`);
            this.missingFields.push('base_accuracy');
            this.base_accuracy = 0;
        }

        if (!opts.memOnly) {
            this.saveToFile();
        }
    }

    /*
        @summary This method is used to ensure each model has a unique name (maintenance)
        @return string
    */
    public getModelName(): string {
        return 'SummMon';
    };

    /*
        @summary This method determines wheter or not this model is missing a property
        @return bool - true if a property is missing from the model, false otherwise
    */
    public isMissingProp(): boolean {
        return Array.isArray(this.missingFields) && (this.missingFields.length > 0);
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
        const returnVal = {};
        returnVal['id'] = this.id;
        returnVal['name'] = this.name;
        returnVal['type'] = this.type;
        returnVal['ld'] = this.isLegendary;
        returnVal['rate'] = this.star_level;
        returnVal['img_base'] = this.image_base;
        returnVal['img_aw'] = this.image_awakened;
        returnVal['level'] = this.level;
        // NOTE: behind non-required props
        returnVal['b_hp'] = this.base_hp;
        returnVal['b_atk'] = this.base_attack;
        returnVal['b_def'] = this.base_defense;
        returnVal['b_spd'] = this.base_speed;
        returnVal['b_crate'] = this.base_crit_rate;
        returnVal['b_cdmg'] = this.base_crit_damage;
        returnVal['b_res'] = this.base_resistance;
        returnVal['b_acc'] = this.base_accuracy;
        returnVal['isMissingRequiredProp'] = this.isMissingRequiredProp();
        returnVal['isMissingProp'] = this.isMissingProp();
        returnVal['missingFields'] = this.missingFields;
        returnVal['_tsCreation'] = this._tsCreation;
        returnVal['_tsSerialize'] = moment.utc();

        return JSON.stringify(returnVal);
    };

    /*
        @toString
    */
    public toString(): string {
        return `[${this.getModelName()}]
            isMissingRequiredProp: ${ this.isMissingRequiredProp()}
            isMissingProp: ${ this.isMissingProp()}
            missingFields: ${ this.missingFields.join(',')}
            _tsCreation: ${ this._tsCreation}
            _tsSerialize: ${ this._tsSerialize}
            id: ${ this.id}
            name: ${ this.name}
            type: ${ this.type}
            isLegend: ${ this.isLegendary}
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
        @summary This method is an ES6 tagged template literal
        @param string[] strings - An array representing parts of the string (substrings) surrounding the tag expression
        @param string propExp - The property name that is missing (likely from SummMon.MONSTER_PROPERTIES)
        @return string
    */
    private PROPERTY_MISSING_TAG = (strings: any, propExpression: any = null): string => {
        return `[PROPERTY_MISSING_TAG] data was missing "${propExpression}" property`;
    };

    /*
        @summary This method returns a file name to use when serializing this model
        @return string - If a required property is missing (`id`, `type`), the method will issue a warning and return null
    */
    private getFileName(): string {
        if (!this.id) {
            console.warn(`[${this.getModelName()}] [getFileName] Missing id property, unable to generate file name`);
            return null;
        }
        if (!this.type) {
            console.warn(`[${this.getModelName()}] [getFileName] Missing type property, unable to generate file name`);
            return null;
        }

        const fp = path.join(
            path.resolve(__dirname, `..${path.sep}..${path.sep}data${path.sep}${this.type}`) + `${path.sep}${this.id}.json`
        );

        console.info(`getFileName is using fp=${fp}`);

        return fp;
    };

    /*
        @summary This method supports an options object with the following properties available:
        @param opts object - See properties below
        @param opts.force bool - Whether or not to force the method to overwrite the last save file
    */
    private saveToFile = (opts: any = null): void => {
        const pathStr = this.getFileName();

        if (!opts) {
            opts = {
                force: false,
            };
        }

        if (!path) {
            console.warn(`[${this.getModelName()}] [saveToFile] No path, unable to save to file`);
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
};

export { SummMon as SummMon };
