import fetch from 'node-fetch';
// console.log(`FETCH: ${fetch}`);
// import fetch from 'node-fetch';
// import { URL, URLSearchParams } from 'url';
import { URL, URLSearchParams } from 'url';
import ct from './constants.js';
import chartData from './responseObjects/chartData.js';
import careerData from './responseObjects/careerStats.js';
import hostedData from './responseObjects/hostedStats.js';
import carsData from './responseObjects/cars.js';
import tracksData from './responseObjects/trackData.js';
// import * as ct from './constants.js';
// import * as chartData from './responseObjects/chartData.js';
// import * as careerData from './responseObjects/careerStats.js';


export class Client {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.cookiesRaw = [];
        this.cookies = {};
        // this.cookie = "AWSALB=zudMQlDImSA3FMFFURutO04KLS1xQdrjGn7m1T8XLsRdN4wmgVJR/Sol9+u5kGhnsiukW13yS3yS7sJWJqEmUKHZ6luj0yhb+tNR3tuSkUbbqOFuI/62VrOX92o0; AWSALBCORS=zudMQlDImSA3FMFFURutO04KLS1xQdrjGn7m1T8XLsRdN4wmgVJR/Sol9+u5kGhnsiukW13yS3yS7sJWJqEmUKHZ6luj0yhb+tNR3tuSkUbbqOFuI/62VrOX92o0; XSESSIONID=ATC02a|YYUnA|YYUmU; JSESS_members-membersite-tc02-1=487D07184C76EDC5380C80CB676EA5A5; _ga=GA1.2.2139190762.1636116043; _gid=GA1.2.878657719.1636116043; _gat_UA-431973-1=1; _gcl_au=1.1.2069746902.1636116047; AWSALB=rDCsp91QhRrd6ycOWwt57EIHi68Wbzdmpp/CvfnnIPWDdUt3eEEBJNV08TayeQxiHkScSXTytGvN8b4ikosFd2b1gvnQbbrou8IgKW0WNaipET0CpIidG9e8HeCj; AWSALBCORS=rDCsp91QhRrd6ycOWwt57EIHi68Wbzdmpp/CvfnnIPWDdUt3eEEBJNV08TayeQxiHkScSXTytGvN8b4ikosFd2b1gvnQbbrou8IgKW0WNaipET0CpIidG9e8HeCj; irsso_membersv2=0F8EC382F851BBFED2E592727531E4EC4E369C7B5E7935F55AF88441298A71D65DD52F98D3847E0F9A4330F8D7ED7459F06D82FCD7621CCDCF65765F4E6B371C5019BC84340A98AA1B6057082519A076B0EA7E7427F65D085F059D3196CF0CAF8679A0BA7424584D949E3696581F3A4E6E0DEA7D8AE8763E00FB1CA8FD364485; WSENV=som; XSESSIONID=ATC02a|YYUmX|YYUmU";
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
        }
        this.homeSource = null;

        // this.headers["Cookie"] = this.cookie
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
                // console.log(res.url);
                console.log("Successful login");
                this.cookiesRaw = [...this.cookiesRaw, ...res.headers.raw()['set-cookie']]
                this.cookies = Object.assign({}, ...this.cookiesRaw.map((c) => {
                    const parts = c.split(';');
                    const cookiePart = parts[0];
                    const cookiePartParts = cookiePart.split('=');
                    return {[cookiePartParts[0]]: cookiePartParts[1]}
                }));
                // console.log(this.cookies);
                this.cookie = Object.entries(this.cookies).map(a => (`${a[0]}=${a[1]}`)).join(";")
                this.headers['Cookie'] = this.cookie;
            }
        })

    }

    async _get_home_source(){
        const res = await this._build_request(ct.URL_HOME, {});
        const text = await res.text()
        this.homeSource = text;
        console.log("Got source of home page")
    }
    
    async _build_request(url, params) {
        // Builds the final GET request from url and params
        if (!this.cookie) {
            console.log("No cookies in cookie jar.")
            await this._authenticate()
        }

        // console.log(`Cookie: ${this.cookie}`);
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

    async hostedRacesStats(cust_id) {
        const payload = {
            'participant_custid': cust_id, 
            'start_time_lowerbound': new Date().setDate(new Date().getDate()-30), 
            'sort': 'start_time', 
            'order': 'desc'
        }
        const url = ct.URL_PRIVATE_RESULTS;
        const response = await this._build_request(url, payload);

        try {
            // response.json().then(text => console.log(text));
            const data = await response.json();
            if (data.rows) {
                return data.rows.map(x => new hostedData.HostedStats(x))
            } else {
                return [];
            }
            
        } catch(error) {
            console.error(error);
            return [];
        }
    }
        
    async carClass(car_class_id=0) {
        // Returns the CarClass data for the associated car_class_id
        // The default "0" is a "master" CarClass containing a list of CarClass
        // names and their respective car_class_id.
        const payload = {'carclassid': car_class_id}
        const url = ct.URL_CAR_CLASS

        const response = await this._build_request(url, payload)

        try {
            const data = await response.json();
            if (data.carclass.carsinclass) {
                // console.log(data.carclass.carsinclass);
                const cars = Object.assign({}, ...data.carclass.carsinclass.map((c) => ({[c.id]: c.name})));
                // console.log(cars);
                return data.carclass.carsinclass.map(x => new carsData.Car(x));
            } else {
                return {};
            }
        } catch(error) {
            console.log(`Response: ${response}`);
            console.error(error);
            return {}
        }
        
    }

    async tracks() {
        if (!this.homeSource) {
            await this._get_home_source();
        }

        const regex = /var TrackListing = extractJSON\('(.*)'\);/
        const match = this.homeSource.match(regex)[1];
        try {
            const tracks = JSON.parse(match);
            if (tracks) {
                return tracks.map(x => new tracksData.Track(x));
            } else {
                console.log(this.homeSource);
            }
        } catch(error) {
            console.log(match);
            console.error(error);
        }
        
        
    }
}


export default {Client}