const { fetch } = require('node-fetch');
// import fetch from 'node-fetch';
// import { URL, URLSearchParams } from 'url';
const {URL, URLSearchParams} = require('url');
const { ct } = require('./constants.js');
const { chartData } = require('./responseObjects/chartData.js')
const { careerData } = require('./responseObjects/careerStats.js')
// import * as ct from './constants.js';
// import * as chartData from './responseObjects/chartData.js';
// import * as careerData from './responseObjects/careerStats.js';

class Client {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.cookie = null;
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
        }
    }
    

    async _authenticate() {
        // Sends a POST request to iRacings login server, initiating a
        // persistent connection stored in this.session

        console.log('Authenticating...');

        const login_data = {
            'username': this.username,
            'password': this.password,
            'utcoffset': -60,
            'todaysdate': ''  // Unknown purpose, but exists as a hidden form.
        }
        await fetch(ct.URL_LOGIN2, {
            method: 'POST',
            body:    new URLSearchParams(login_data),
            headers: this.headers,
            redirect: 'manual',
        })
        .then(res => {
            if (res.url.includes('failedlogin')) {
                console.log(`The login POST request was redirected to /failedlogin, 
                             indicating an authentication failure. If credentials are 
                             correct, check that a captcha is not required by manually 
                             visiting members.iracing.com`);
            } else {
                console.log("Successful login");
                this.cookie = res.headers.raw()['set-cookie'].join("; ")
                this.headers['Cookie'] = this.cookie
            }
           
        })
        
    }

    async _build_request(url, params) {
        // Builds the final GET request from url and params
        if (!this.cookie) {
            console.log("No cookies in cookie jar.")
            await this._authenticate()
        }

        url = new URL(url);
        url.search = new URLSearchParams(params).toString();

        console.info(`Request being sent to: ${url.href} with params: ${params.toString()}`);
        const res = await fetch(url.href, {
            headers: this.headers
        })
        // .then(res => { return res; })
        .catch(error => {
            console.error(error);
            this._authenticate();
            this._build_request(url, params)
        })

        return res; 
    }

    async _stats_chart(cust_id, category, chart_type) {
        // Returns a list in the form of time:value for the race category
        // specified. chart_type changes values between iRating, ttRating, or
        // Safety Rating. Category chooses 1 of the 4 disciplines.
        // NOTE: if you are using this, you should use `irating`, `ttrating`
        // or `license_class` instead. This is used by those methods for the
        // specific types of each of them.
        const payload = {
            'custId': cust_id,
            'catId': category,
            'chartType': chart_type
        }
        const url = ct.URL_STATS_CHART
        return await this._build_request(url, payload)
    }
   
    async irating(cust_id, category) {
        // Utilizes the stats_chart class to return a list of iRating values
        // that are used in the /CareerStats charts. Accessing
        // get_irating().current() will give the most recent irating of a cust_id
        const chartType = ct.ChartType.irating
        const response = await this._stats_chart(cust_id, category, chartType)
        const data = await response.json();
        const irList =data.map(irating => new chartData.IRating(irating[0], irating[1]));
        return new chartData.ChartData(category, chartType, irList);
    }
        
    async lastRacesStats(cust_id) {
        // Returns stat summary for the driver's last 10 races as seen
        // on the /CareerStats page.
        const payload = {'custid': cust_id};
        const url = ct.URL_LASTRACE_STATS;
        const response = await this._build_request(url, payload);

        try {
            const data = await response.json();
            return data.map(x => new careerData.LastRacesStats(x))
        } catch(error) {
            console.error(error);
            return [];
        }
        
    }
        
        
    
}


module.exports = {Client}