import { parseEncode } from '../helpers.js'
import slugify from 'slugify'

class Car {
    constructor(data) {
        // these ones we're matching to careerStats.LastRacesStats
        this.id = data.id
        this.name = parseEncode(data.name)
        this.slug = slugify(this.name, { lower: true})
        
    }
}

const carsData = {
    Car: Car
}

export default carsData