'use strict';

import * as fs from 'fs';
import * as moment from 'moment';
import * as path from 'path';

export default class Crawler {
    private static counter = 0;

    /*
        @summary This method is used to ensure each model has a unique name (maintenance)
        @return string
    */
    public static getModelName(): string {
        return 'Crawler';
    };

    public _tsCreation: number;
    public _tsLastUpdate: number;
    public id: number;

    public name: string;
    public url: string;
    public domSelector: string;

    /*
        @summary This is the constructor for the Crawler model
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
            console.warn(`[${Crawler.getModelName()}] [constructor] data was missing or null`);
            return;
        }
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        Crawler.counter++;

        // NOTE: carry forward the ID, if it exists (it will not for new crawlers)
        if (data.hasOwnProperty('id') && (data.id !== null)) {
            console.info(`Carrying forward crawler ID, data.id=${data.id}`);
        } else {
            data.id = Crawler.counter;
            console.info(`Using Crawler.counter for ID, Crawler.counter=${Crawler.counter}`);
        }

        this.id = data.id;

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

        this.name = String(data.name);
        this.url = String(data.url);
        this.domSelector = String(data.domSelector);

        if (!opts.memOnly) {
            this.saveToFile();
        }
    }

    /*
        @summary This method converts this model into a string (for persistence)
        @return string - The JSON-safe string version of this model
    */
    public serialize(): string {
        const returnVal = {
            id: this.id,
            name: this.name,
            url: this.url,
            domSelector: this.domSelector,
            _tsCreation: this._tsCreation,
            _tsLastUpdate: this._tsLastUpdate,
        };

        return JSON.stringify(returnVal);
    };

    /*
        @toString
    */
    public toString(): string {
        return `[${Crawler.getModelName()}]
            _tsCreation: ${ this._tsCreation}
            _tsLastUpdate: ${ this._tsLastUpdate}
            id: ${ this.id}
            name: ${ this.name}
            url: ${ this.url}
            domSelector: ${ this.domSelector}`;
    };

    /*
        @summary This method supports an options object with the following properties available:
        @param opts object - See properties below
        @param opts.force bool - Whether or not to force the method to overwrite the last save file
    */
    public saveToFile = (opts: any = null): void => {
        const pathStr = this.getFileName();

        if (!opts) {
            opts = {
                force: false,
            };
        }

        if (!path) {
            console.warn(`[${Crawler.getModelName()}] [saveToFile] No path, unable to save to file`);
            return;
        }

        // NOTE: if the file does not exist, create it now and return
        if (!fs.existsSync(pathStr)) {
            fs.writeFileSync(pathStr, this.serialize(), { encoding: 'utf8', flag: 'w', mode: 0o644 });
            return;
        }

        // NOTE: if the file exists, check if it has been updated recently enough
        const stats = fs.statSync(pathStr);
        const now = moment();
        const oneDayAgo = now.subtract(1, 'days');
        const fileModifiedTime = moment(stats.mtime.getMilliseconds());
        const isLessThanOneDay = fileModifiedTime.isBefore(oneDayAgo);

        if (opts.force || !isLessThanOneDay) {
            // NOTE: update the last update property
            this._tsLastUpdate = moment.utc().valueOf();
            fs.writeFileSync(pathStr, this.serialize(), { encoding: 'utf8', flag: 'w', mode: 0o644 });
        }
    };

    /*
        @summary This method attempts to remove the serialized file that represents this crawler
    */
    public eraseFile = (opts: any = null): void => {
        const pathStr = this.getFileName();

        if (!opts) {
            opts = { };
        }

        if (!path) {
            console.warn(`[${Crawler.getModelName()}] [eraseFile] No path, unable to erase file`);
            return;
        }

        // NOTE: if the file does not exist, nothing more to do
        if (!fs.existsSync(pathStr)) {
            return;
        }
        fs.unlinkSync(pathStr);
    };

    /*
        @summary This method returns a file name to use when serializing this model
        @return string - If a required property is missing (`id`, `type`), the method will issue a warning and return null
    */
    private getFileName(): string {
        if (!this.id && (this.id !== 0)) {
            console.warn(`[${Crawler.getModelName()}] [getFileName] Missing id property, unable to generate file name`);
            return null;
        }
        if (!this.name) {
            console.warn(`[${Crawler.getModelName()}] [getFileName] Missing type property, unable to generate file name`);
            return null;
        }

        const fp = path.join(
            path.resolve(__dirname, `..${path.sep}..${path.sep}crawlers${path.sep}${this.id}.json`)
        );

        console.info(`[${Crawler.getModelName()}] [getFileName] Using fp=${fp}`);

        return fp;
    };
};

export { Crawler as Crawler };
