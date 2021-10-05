import { parseEncode } from '../helpers.js';

export class LastRacesStats {
    constructor(data) {
        this.date = data['date']
        this.incidents = data['incidents']
        this.laps_led = data['lapsLed']
        this.points_champ = data['champPoints']
        this.points_club = data['clubPoints']
        this.pos_finish = data['finishPos']
        this.pos_start = data['startPos']
        this.season_id = data['seasonID']
        this.series_id = data['seriesID']
        this.strength_of_field = data['sof']
        this.subsession_id = data['subsessionID']
        this.time = new Date(data['time'])
        this.track = parseEncode(data['trackName'])
        this.winner_cust_id = data['winnerID']
        this.winner_laps_led = data['winnerLL']
        this.winner_name = parseEncode(data['winnerName'])
    }
}
