export function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;

    return mins + ':' + (secs < 10 ? "0" : "") + secs;
}

export function abbreviateNumber(num) {
    if (num > 1000) {
        return (num / 1000).toFixed(1) + "k";
    }

    return num;
}

export function asPercentage(num) {
    return (num*100).toFixed(1) + "%";
}