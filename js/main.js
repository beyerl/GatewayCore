//navbar-toggle bugfix für den Fall, dass Fenster bei offenem Toggle vergrößert wird
$(window).resize(function() {
    if ($(window).width()>=992 && $('#navigation-wrapper').hasClass( 'collapse in' )){
        $('#navigation-wrapper').removeClass( 'collapse in' );
        $('#navigation-wrapper').addClass( 'collapse' );
    }
});

$(document).ready(function() {
    //build shortcuts from server (json)

    //build clickhandlers
    $('#nav-row-one-wrapper .glyphicon-plus-sign').on('click', function(){
        //geht tab from url
        var tab = window.location.pathname;
        console.log(tab);

        //get settings from url
        var settings = window.location.hash.substring(1);
        console.log(settings);

        //write tab and settings to server (json)

        //create button for shortcut with tab and setttings in name and url in handler

    });
});