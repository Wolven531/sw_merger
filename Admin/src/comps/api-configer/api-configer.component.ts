import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'api-configer-cont',
    templateUrl: './api-configer.component.html',
    styleUrls: ['./api-configer.component.css'],
})
export class ApiConfigerComponent implements OnInit {
    public base_url:string = 'http://127.0.0.1:5555';
    // TODO: awill: make sure the hide actually works
    private hideNav:boolean = true;

    constructor(private http: Http) { };
    checkLocal(): Promise<void> {
        return this.http.get(this.base_url)
            .toPromise()
            .then(resp => {
                if (resp.status !== 200) {
                    alert('API is not running locally. To start it, run start.sh in the API directory.');
                    return;
                }
                this.base_url = resp.json().base;
            })
            .catch(err => {
                alert('API is not running locally. To start it, run start.sh in the API directory.');
            });
    };
    goToServer(): void {
        window.open(this.base_url, '_blank');
    };
    ngOnInit(): void {
        this.checkLocal();
    };
};
