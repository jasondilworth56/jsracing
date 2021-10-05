import * as ct from '../constants.js';

export class ChartData {
    constructor(category, type, content) {
        this.category = category;
        this.type = type;
        this.content = content;
    }
    
    // The last thing in the list, which is chronologically, the most recent
    current() {
        return this.content[this.content.length - 1];
    }
        
    type_string() {
        return ct.ChartType[this.type].name
    }
        

    category_string() {
        return ct.Category[this.category].name
    }
       
}
    
export class IRating {
    constructor (timestamp, value) {
        this.value=value;
        this.timestamp=timestamp;
    }

    datetime() {
        return new Date(this.timestamp);
    }
        
}
    