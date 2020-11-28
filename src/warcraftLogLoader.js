
class WarcraftLogLoader {
    constructor() {
        this.key = "e422378c419a25cc1accb41845b259ab";
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
            this.getClassCastEvents(start_time, end_time, "paladin"),

            this.getProtectionPotionHealingEvents(start_time, end_time),
            this.getProtectionPotionCastEvents(start_time, end_time),
        ])
        //.then(res => Promise.all(res.map(response => response.json())))
        .then(res => new Promise((resolve, _reject) => resolve(res.reduce((accum,current) => {
            accum = [...accum, ...current];

            return accum;
        }, []))));
    }

    getProtectionPotionHealingEvents(start_time, end_time, events = []) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/events/healing/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time
        + "&filter=ability.id=17546 OR ability.id=7254 OR ability.id=17548 OR ability.id=7242 OR ability.id=17544 OR ability.id=7240 OR ability.id=17543 OR ability.id=7230 OR ability.id=17549")
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`${response.stats}: ${response.statusText}`);
            }
            response.json().then(data => {
                events = events.concat(data.events);

                if (data.nextPageTimestamp) {
                    this.getProtectionPotionHealingEvents(data.nextPageTimestamp, end_time, events)
                    .then(resolve).catch(reject);
                } else {
                    resolve(events);
                }
            }).catch(reject);
        }).catch(reject));
    }

    getProtectionPotionCastEvents(start_time, end_time, events = []) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/events/casts/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time
        + "&filter=ability.id=17546 OR ability.id=7254 OR ability.id=17548 OR ability.id=7242 OR ability.id=17544 OR ability.id=7240 OR ability.id=17543 OR ability.id=7230 OR ability.id=17549")
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`${response.stats}: ${response.statusText}`);
            }
            response.json().then(data => {
                events = events.concat(data.events);

                if (data.nextPageTimestamp) {
                    this.getProtectionPotionCastEvents(data.nextPageTimestamp, end_time, events)
                    .then(resolve).catch(reject);
                } else {
                    resolve(events);
                }
            }).catch(reject);
        }).catch(reject));
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