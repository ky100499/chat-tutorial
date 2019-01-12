"use strict";

function getURLPath(qs) {
    qs = qs.replace(/\+/g, " ");
    var params = [],
        re = /\/([^/]+)/g,
        tokens;

    while (tokens = re.exec(qs)) {
        params.push(decodeURIComponent(tokens[1]));
    }

    return params;
}

/*
** Sticky Footer Block
** Setting <body> margin by footer size
*/
$(document).ready(setBodyPaddingBottom);
$(window).resize(setBodyPaddingBottom);
function setBodyPaddingBottom() {
    $('#chat-input-wrap').css('bottom', $('.footer').outerHeight() + 20 + 'px');
    $('body').css('padding-bottom', $('.footer').outerHeight() + 'px');
}
/*
** Sticky Footer Block End
*/

let params;

$(document).ready(() => {
    params = getURLPath(location.pathname);
    console.log(params);
    if (params.length)
        $("li#" + params[0]).addClass("active");
});

const socket = io();
