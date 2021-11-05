import { parseEncode } from '../helpers.js'
import slugify from 'slugify'

class Track {
    constructor(data) {
        // these ones we're matching to careerStats.LastRacesStats
        this.id = data.id
        this.config = parseEncode(data.config)
        this.detailCopy = parseEncode(data.detail_copy)
        this.hasSvgMap = data.hasSvgMap
        this.latitude = data.latitude
        this.longitude = data.longitude
        this.logo = parseEncode(data.logo)
        this.name = parseEncode(data.name)
        this.fullName = `${this.name} ${this.config}`
        this.nominalLapTime = data.nominalLapTime
        this.slug = slugify(this.name, { lower: true})
    }
}

const tracksData = {
    Track: Track
}

export default tracksData