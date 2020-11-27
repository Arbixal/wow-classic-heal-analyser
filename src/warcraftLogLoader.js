
class WarcraftLogLoader {
    constructor() {
        this.key = process.env.REACT_APP_WARCRAFTLOGS_KEY;
        this.domain = "https://classic.warcraftlogs.com/v1/";
        this.reportId = null;
    }

    setReport(reportId) {
        this.reportId = reportId;
    }

    getFights() {
        return fetch(this.domain + "report/fights/" + this.reportId + "?api_key=" + this.key)
                .then(res => res.json());
    }

    getHealEvents(start_time, end_time) {
        return Promise.all([
            this.getClassHealEvents(start_time, end_time, "priest"),
            this.getClassHealEvents(start_time, end_time, "druid"),
            this.getClassHealEvents(start_time, end_time, "shaman"),
            this.getClassHealEvents(start_time, end_time, "paladin"),

            this.getClassCastEvents(start_time, end_time, "priest"),
            this.getClassCastEvents(start_time, end_time, "druid"),
            this.getClassCastEvents(start_time, end_time, "shaman"),
            this.getClassCastEvents(start_time, end_time, "paladin")
        ])
        //.then(res => Promise.all(res.map(response => response.json())))
        .then(res => new Promise((resolve, _reject) => resolve(res.reduce((accum,current) => {
            accum = [...accum, ...current];

            return accum;
        }, []))));
    }

    getClassHealEvents(start_time, end_time, sourceClass, events = []) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/events/healing/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time
        + "&sourceclass=" + sourceClass)
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`${response.stats}: ${response.statusText}`);
            }
            response.json().then(data => {
                events = events.concat(data.events);

                if (data.nextPageTimestamp) {
                    this.getClassHealEvents(data.nextPageTimestamp, end_time, sourceClass, events)
                    .then(resolve).catch(reject);
                } else {
                    resolve(events);
                }
            }).catch(reject);
        }).catch(reject));
    }

    getClassCastEvents(start_time, end_time, sourceClass, events = []) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/events/casts/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time
        + "&sourceclass=" + sourceClass)
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`${response.stats}: ${response.statusText}`);
            }
            response.json().then(data => {
                events = events.concat(data.events);

                if (data.nextPageTimestamp) {
                    this.getClassCastEvents(data.nextPageTimestamp, end_time, sourceClass, events)
                    .then(resolve).catch(reject);
                } else {
                    resolve(events);
                }
            }).catch(reject);
        }).catch(reject));
    }
}

export let LogLoader = new WarcraftLogLoader();