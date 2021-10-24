export function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    s = (s - mins) / 60;
    var hours = s % 24;

    return (hours > 0 ? hours + ":" + (mins < 10 ? "0" : "") : "") + mins + ':' + (secs < 10 ? "0" : "") + secs;
}

export function abbreviateNumber(num) {
    if (num > 1000) {
        return (num / 1000).toFixed(1) + "k";
    }

    return num;
}

export function asPercentage(num, decimals = 1) {
    return (num*100).toFixed(decimals) + "%";
}

export function removeDuplicates(array, keyAccessFunction) {
    if (!keyAccessFunction || typeof(keyAccessFunction) !== 'function') {
        keyAccessFunction = (obj) => obj;
    }

    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(keyAccessFunction(a[i]) === keyAccessFunction(a[j]))
                a.splice(j--, 1);
        }
    }

    return a;
};

export function countNonNull(...params) {
    return params.reduce((agg, obj) => {
        if (obj) {
            agg++
        }

        return agg;
    }, 0);
}

export function sumNonNull(...params) {
    return params.reduce((agg, obj) => {
        if (obj) {
            agg += obj;
        }

        return agg;
    }, 0);
}