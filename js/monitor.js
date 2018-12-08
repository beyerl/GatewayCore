//========== hardgecodete Basisdaten für Details ==========
//Fehlermeldung & Stack Trace
var messages = [
    {'serviceName': 'Merger', 'message': 'AudioMedienobjekt konnte wegen Constraint-Verletzung nicht gespeichert werden: BR_HFDB.UC_ABO_ANR\', \'stackTrace\': \'07.02. 11:03:33 ERROR [schreibmaschine.BRHfdbWriter] trans_2018-02-07_10-57-27-246_ID_UPD_W0446892_Z00_DIG.xml: AudioMedienobjekt mit der Referenz  konnte nicht erzeugt werden 07.02. 11:03:33 ERROR [schreibmaschine.BRHfdbWriter] Fehler 5001(ExternIoFault) bei trans_2018-02-07_10-57-27-246_ID_UPD_W0446892_Z00_DIG.xml: AxisFault faultCode: {http://schemas.xmlsoap.org/soap/envelope/}Server faultSubcode: faultString: javax.ejb.EJBTransactionRolledbackException   AudioMedienobjekt konnte wegen Constraint-Verletzung nicht gespeichert werden: BR_HFDB.UC_ABO_ANR'}
];

var maintenanceReason = ['Standardmässige IDAS-Wartung.'];
var criticalMessage = ['Fault-Queue-Länge: 124'];

//0000000000000000000000000 Monitor 0000000000000000000000000 
//============ Build tab for the first time ============

$(document).ready(function() {

    //read services from JSON-Files
    $.getJSON('json/services.json', function(services){

        //build clickhandlers for sort-dropdown
        $('#by-group').on('click', services, sortByGroup);
        $('#by-name').on('click', services, sortByName);
        $('#by-status').on('click', services, sortByStatus);

        //build tiles for first time, sorted by group
        $('#by-group').trigger('click');

        //count running services, to display them at the bottom of the page
        countServices(services);
    });
});

//============ Sort and rebuild tab ============ 
//========= Alphabetically (serviceName)

function sortByName(handlerEvent) {
    handlerEvent.preventDefault();
    services = handlerEvent.data;
    console.log('sort by name');

    window.location.href = 'monitor.html' + '#' + 'sort-by-name';

    //Bubble Sort
    do{
        var swapped=false;

        for (i=0;i<services.length-1; i++){
            if (services[i]['serviceName'] > services[i+1]['serviceName']){
                var temp = services[i];
                services[i] = services[i + 1];
                services[i + 1] = temp;
                swapped = true;
            }
        }
    }
    while (swapped);

    //remove previously displayed tiles from screen
    removeTiles();

    //insert sorted tiles
    buildTiles(services);
  
}



//========= by group (groupPrio, serviceName)========= 
function sortByGroup(handlerEvent) {
    handlerEvent.preventDefault();
    services = handlerEvent.data;
    console.log('sort by group');

    window.location.href = 'monitor.html' + '#' + 'sort-by-group';


     //1st run: sort by group (Bubble Sort)
    do{
        var swapped=false;

        for (i=0;i<services.length-1; i++){
            if (services[i]['groupPrio'] > services[i+1]['groupPrio']){
                var temp = services[i];
                services[i] = services[i + 1];
                services[i + 1] = temp;
                swapped = true;
            }
        }
    }
    while (swapped);

    //2nd run: sort alphabetically inside group (Bubble Sort)
    do{
        var swapped=false;

        for (i=0;i<services.length-1; i++){
            if (services[i]['serviceName'] > services[i+1]['serviceName'] && services[i]['groupPrio'] == services[i+1]['groupPrio']){
                var temp = services[i];
                services[i] = services[i + 1];
                services[i + 1] = temp;
                swapped = true;
            }
        }
    }
    while (swapped);

    //remove previously displayed tiles from screen
    removeTiles();

    //insert sorted tiles
    buildTiles(services);

}



//========= by status (serviceStatus, serviceName) =========
function sortByStatus(handlerEvent) {
    handlerEvent.preventDefault();    
    services = handlerEvent.data;
    console.log('sort by status');

    window.location.href = 'monitor.html' + '#' + 'sort-by-status';

     //1st run: sort by status (Bubble Sort)
    do{
        var swapped=false;

        for (i=0;i<services.length-1; i++){
            if (services[i]['serviceStatus'] > services[i+1]['serviceStatus']){
                var temp = services[i];
                services[i] = services[i + 1];
                services[i + 1] = temp;
                swapped = true;
            }
        }
    }
    while (swapped);

    //2nd run: sort alphabetically inside group (Bubble Sort)
    do{
        var swapped=false;

        for (i=0;i<services.length-1; i++){
            if (services[i]['serviceName'] > services[i+1]['serviceName'] && services[i]['serviceStatus'] == services[i+1]['serviceStatus']){
                var temp = services[i];
                services[i] = services[i + 1];
                services[i + 1] = temp;
                swapped = true;
            }
        }
    }
    while (swapped);

    
    //remove previously displayed tiles from screen
    removeTiles();

    //insert sorted tiles
    buildTiles(services);

}




//============ create tile-DOM-objects based on array ============
function buildTiles(services){

    for (i=0; i<services.length; i++){

        //basic constructor
        //serviceName and serviceStatus are written into the id-property, so that the tile-clickevent (handlerMonitorDetails) can access them via 'this' and pass them on to the details-constructor (monitorDetailsConstructor)
        var serviceConstructor = '<a href=\'#\' class=\'service btn btn-default col-xs-4 col-sm-4 col-md-2 col-lg-2\' role=\'button\'>\n'+
            '<p id=' + services[i]['serviceName'].replace(/\s/g,'_') + ' class=\'service-title\'>' + services[i]['serviceName'] + '</p>\n'+
            '<p id=' + services[i]['serviceStatus'] + ' class=\'service-status\'></p>\n'+
            '<p class=\'service-group\'></p>\n'+
        '</a>'

        $('.append').append(serviceConstructor);    

        //add status-class based on status as given by array
        switch(services[i]['serviceStatus']){

            //service down
            case 1:
            $('.append > a:last-child').addClass('service-down');
            break;

            //service stopped
            case 2:
            $('.append > a:last-child').addClass('service-stop');
            break;

            //service critical
            case 3:
            $('.append > a:last-child').addClass('service-critical');
            break;

            //service running
            case 4:
            $('.append > a:last-child').addClass('service-run');
            break;
        }

        //add group-class based on goup as given by array
        switch(services[i]['groupPrio']){

            //basic services
            case 1:
            $('.service-group:last').addClass('service-group-basis');
            break;

            //documentbased
            case 2:
            $('.service-group:last').addClass('service-group-dok');
            break;

            //webservice    
            case 3:
            $('.service-group:last').addClass('service-group-web');
            break;

            //clocked
            case 4:
            $('.service-group:last').addClass('service-group-takt');
            break;

            //testservice
            case 5:
            $('.service-group:last').addClass('service-group-test');
            break;
        }        
    }

    //build clickhandler, to be able to open monitor-details
    $('.service').on('click', handlerMonitorDetails);
}

//count number of running services and print in footer

function countServices(services){
var servicesRunning = 0;

        for (i=0; i<services.length; i++){
            if (services[i]['serviceStatus']==3 || services[i]['serviceStatus']==4 ){
            servicesRunning++;
            }
        }

$('.services-running').text(servicesRunning + ' von ' + services.length + ' Diensten laufen.');
}

//============ remove tile-DOM-objects ============
function removeTiles(){
    $('a').remove('.service');
}

//============ remove dropdown-DOM-object ============
function removeDropdown(){
$('li').remove('#monitor-sort-drop');
} 

//0000000000000000000000000 Monitor-Details 0000000000000000000000000 

//========== clickhandler for monitor-details ==========
function handlerMonitorDetails() {
    //passed data from handler:
    //save service name in variable (string read from p-tag with class="service-title") 

    var monDetServiceName = $(this).find('.service-title').attr('id').replace(/_/g,' ');

    //service status (class from p-tag with class service-status e.g. service-group-basis)
    //save in variable
    var monDetServiceStatus = $(this).find('.service-status').attr('id');
    
    //remove sort dropdown box from DOM
    removeDropdown();

    //remove previously displayed Tiles from DOM
    removeTiles();

    //pass data to constructor method, buidl details view
    buildMonitorDetails(monDetServiceName, monDetServiceStatus);
}



//========== constructor method ==========
//data: from handler: serviceName, serviceStatus
//other needed data: error message, stack trace, (logfile)


//=== build HTML-frame ===
//title bar: inser title with string-concatenation of serviceName + '-Details'

function buildMonitorDetails (monDetServiceName, monDetServiceStatus){

    var monitorDetailsConstructor = '<div id=\'details-header\'> ' + monDetServiceName + '-Details</div>\n'+
    '<div id=\'details-wrapper\'>\n' +
        '<div id=\'details-logs\'>\n' +
            '<h4>Systemstatus:</h4>\n' +
            '<p id=\'details-status\'></p>\n' +
            '<div class=\'append\'></div>\n' +
    '</div>\n'+
    
    '<div id=\'details-tools\' data=\'' + monDetServiceName + '\'>\n'+
    
    //append class with service name to heading, to prepare service for access via button click
    '<h4>Dienst</h4>\n'+
    
        '<input id=\'btn-start\' class=\'btn btn-default full-width\' type=\'submit\' value=\'START\'>\n'+
        '<input id=\'btn-stop\' class=\'btn btn-default full-width\' type=\'submit\' value=\'BEENDEN\'>\n'+
        '<input id=\'btn-restart\' class=\'btn btn-default full-width\' type=\'submit\' value=\'NEUSTARTEN\'>\n'+

    '<h4>Funktionen</h4>\n'+
        '<input id=\'mon-det-fehler\' class=\'btn btn-default full-width\' value=\'Fehlermanagement\'>\n'+

        '<a id=\'mon-det-back\' href=\'monitor.html\' class=\'btn btn-default btn-br-blue full-width\'>Zurück</a>\n'+
    '</div>';

    $('.append').append(monitorDetailsConstructor);    


//=== adapt HTML-frame ===
//add systemstatus, based on passed service status
    switch(parseInt(monDetServiceStatus)){

        //service down
        case 1:
        //inser status message 
        $('#details-status').text('Dienst wurde unerwartet beendet.');
        //adapt header farbe
        $('#details-header').addClass('details-down');
        //insert error message and stack trace
        $('#details-logs .append').append(
            '<h4>Fehler:</h4>\n'+
            '<p id=\'details-message\'>' + messages[0]['message'] + '</p>\n' +
            '<h4>Stacktrace:</h4>\n'+
            '<p id=\'details-stack\'>' + messages[0]['stackTrace'] + '</p>');
        break;

        //service stopped    
        case 2:
        //insert status message
        $('#details-status').text('Der Dienst befindet sich in Wartung.');
        //adapt header colour
        $('#details-header').addClass('details-stop');
        //insert reason
        $('#details-logs .append').append(
            '<h4>Begründung:</h4>\n' + 
            '<p id=\'details-reason\'>' + maintenanceReason + '</p>');
        break;

        //service critical
        case 3:
        //insert status message
        $('#details-status').text('Der Dienst befindet sich in kritischem Zustand.');
        //adapt header colour
        $('#details-header').addClass('details-critical');
        //insert problem definition
        $('#details-logs .append').append(
            '<h4>Problem:</h4>\n'+
            '<p id=\'details-problem\'>' + criticalMessage + '</p>');
        break;

        //service running    
        case 4:
        //insert status message
        $('#details-status').text('Der Dienst läuft.');
        //adapt header colour
        $('#details-header').addClass('details-run');
        break;
    }

//build click handler for error management-Button, to be able to pass service name to error management
$('#mon-det-fehler').on('click', serviceToFehler);

//build click handler for statistics-Button, to be able to pass service name to statistics
$('#mon-det-statistik').on('click', serviceToStatistik);
}

function serviceToFehler(){
    var serviceName = $(this).closest('#details-tools').attr('data');

    //replace spaces to avoid problems
    serviceName = serviceName.replace(/\s/g,'_');

    window.location.href = 'fehler.html' + '#' + serviceName;
}

function serviceToStatistik(){
    var serviceName = $(this).closest('#details-tools').attr('data');

    //replace spaces to avoid problems
    serviceName = serviceName.replace(/\s/g,'_');

    window.location.href = 'statistik.html' + '#' + serviceName;
}
