import { parseEncode } from '../helpers.js'

class HostedStats {
    constructor(data) {
        // these ones we're matching to careerStats.LastRacesStats
        this.time = new Date(data.start_time)
        this.incidents = data.incidents
        this.pos_start = data.classstartingposition
        this.pos_finish = data.classfinishingposition
        this.subsession_id = data.sessionid
        this.track = parseEncode(data.track_name)
        this.winner_name = data.winner_displayname

        // these are the extras
        this.bestlaptime = data.bestlaptime
        this.carclassid = data.carclassid
        this.carids = parseEncode(data.carids)
        this.catid = data.catid
        this.created = new Date(data.created)
        this.fixed_setup = data.fixed_setup
        this.fullcoursecautions = data.fullcoursecautions
        this.hardcorelevel = data.hardcorelevel
        this.host_custid = data.host_custid
        this.host_displayname = parseEncode(data.host_displayname)
        this.host_helmet_color1 = data.host_helmet_color1
        this.host_helmet_color2 = data.host_helmet_color2
        this.host_helmet_color3 = data.host_helmet_color3
        this.host_helmet_facetype = data.host_helmet_facetype
        this.host_helmet_helmettype = data.host_helmet_helmettype
        this.host_helmet_pattern = data.host_helmet_pattern
        this.host_licenselevel = data.host_licenselevel
        this.lonequalify = data.lonequalify
        this.max_pct_fuel_fills = parseEncode(data.max_pct_fuel_fills)
        this.maxdrivers = data.maxdrivers
        this.maxir = data.maxir
        this.maxliclevel = data.maxliclevel
        this.minir = data.minir
        this.minliclevel = data.minliclevel
        this.multiclass = data.multiclass
        this.numfasttows = data.numfasttows
        this.overallfinishingposition = data.finishingposition
        this.overallstartingposition = data.startingposition
        this.practicelength = data.practicelength
        this.private = data.private
        this.privatesessionid = data.privatesessionid
        this.qualifylaps = data.qualifylaps
        this.qualifylength = data.qualifylength
        this.qualsetupfilenames = data.qualsetupfilenames
        this.qualsetupids = data.qualsetupids
        this.racefinishedat = new Date(data.racefinishedat)
        this.racelaps = data.racelaps
        this.racelength = data.racelength
        this.racesetupfilenames = parseEncode(data.racesetupfilenames)
        this.racesetupids = data.racesetupids
        this.restarts = data.restarts
        this.rn = data.rn
        this.rollingstarts = data.rollingstarts
        this.sessionfastlap = data.sessionfastlap
        this.sessionname = parseEncode(data.sessionname)
        this.subsessionfinishedat = data.subsessionfinishedat
        this.subsessionid = data.subsessionid
        this.timeofday = data.timeofday
        this.trackid = data.trackid
        this.weather_fog_density = data.weather_fog_density
        this.weather_rh = data.weather_rh
        this.weather_skies = data.weather_skies
        this.weather_temp_units = data.weather_temp_units
        this.weather_temp_value = data.weather_temp_value
        this.weather_type = data.weather_type
        this.weather_wind_dir = data.weather_wind_dir
        this.weather_wind_speed_units = data.weather_wind_speed_units
        this.weather_wind_speed_value = data.weather_wind_speed_value
        this.weight_penalties = parseEncode(data.weight_penalties)
        this.winner_displaynames = parseEncode(data.winner_displaynames)
        this.winner_helmet_color1 = data.winner_helmet_color1
        this.winner_helmet_color2 = data.winner_helmet_color2
        this.winner_helmet_color3 = data.winner_helmet_color3
        this.winner_helmet_pattern = data.winner_helmet_pattern
        this.winner_licenselevel = data.winner_licenselevel
        this.winnersgroupid = data.winnersgroupid
    }
}

const hostedData = {
    HostedStats: HostedStats
}

export default hostedData