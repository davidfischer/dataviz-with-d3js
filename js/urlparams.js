/**
 *  Returns an object of URL parameters
 */
function urlparams () {
    var params = {}, i, vals, queries;
    queries = window.location.search.substring(1).split('&');
    for (i = 0; i < queries.length; i += 1) {
        vals = queries[i].split('=');
        if (vals.length === 2) {
            params[decodeURI(vals[0])] = decodeURI(vals[1]).replace(/\+/g," ");
        }
    }
    return params;
}
