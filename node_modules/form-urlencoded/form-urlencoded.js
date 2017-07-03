// Filename: formurlencoded.js
// Timestamp: 2016.03.07-12:29:28 (last modified)
// Author(s): Bumblehead (www.bumblehead.com), JBlashill (james@blashill.com), Jumper423 (jump.e.r@yandex.ru)
//
// http://www.w3.org/TR/html5/forms.html#url-encoded-form-data
// input: {one:1,two:2} return: '[one]=1&[two]=2'

module.exports = function (data, opts) {
    "use strict";

    // ES5 compatible version of `/[^ !'()~\*]/gu`, https://mothereff.in/regexpu
    var encodechar = new RegExp([
        '(?:[\0-\x1F"-&\+-\}\x7F-\uD7FF\uE000-\uFFFF]|',
        '[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|',
        '(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])'
    ].join(''), 'g');

    opts = typeof opts === 'object' ? opts : {};

    function encode(value) {
        return String(value)
            .replace(encodechar, encodeURIComponent)
            .replace(/ /g, '+')
            .replace(/[!'()~\*]/g, function (ch) {
                return '%' + ch.charCodeAt().toString(16).slice(-2).toUpperCase();
            });
    }

    function keys(obj) {
        var itemsKeys = Object.keys(obj);

        return opts.sorted ? itemsKeys.sort() : itemsKeys;
    }

    function filterjoin(arr) {
        return arr.filter(function (e) {
            return e;
        }).join('&');
    }

    function objnest(name, obj) {
        return filterjoin(keys(obj).map(function (key) {
            return nest(name + '[' + key + ']', obj[key]);
        }));
    }

    function arrnest(name, arr) {
        return arr.length ? filterjoin(arr.map(function (elem, index) {
            if (opts.skipIndex) {
                return nest(name + '[]', elem);
            } else {
                return nest(name + '[' + index + ']', elem);
            }
        })) : encode(name + '[]');
    }

    function nest(name, value) {
        var type = typeof value,
            f = null;

        if (value === f) {
            f = opts.ignorenull ? f : encode(name) + '=' + f;
        } else if (/string|number|boolean/.test(type)) {
            f = encode(name) + '=' + encode(value);
        } else if (Array.isArray(value)) {
            f = arrnest(name, value);
        } else if (type === 'object') {
            f = objnest(name, value);
        }

        return f;
    }

    return data && filterjoin(keys(data).map(function (key) {
            return nest(key, data[key]);
        }));
};
