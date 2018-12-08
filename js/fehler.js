/*
====================================================================
============================== FEHLER ==============================
====================================================================
*/

$(document).ready(function() {
    //============== Initialize toolbar components ============

    //=== Initialize Date-time-picker ===
    $(function () {
        $('#datetimepicker1').datetimepicker({locale: 'de'});

        $('#datetimepicker2').datetimepicker({locale: 'de'});

        $('#datetimepicker1').datetimepicker();
        $('#datetimepicker2').datetimepicker({
            useCurrent: false
        });
        $("#datetimepicker1").on("dp.change", function (e) {
            $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker2").on("dp.change", function (e) {
            $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
        });
    });

    //=== Initalize Dropdown-Checkbox ===
    //automatically append services to process dropdown
    $.getJSON('json/services.json', function(services){
        for (i in services){
            var processItem = '<li><a href=\'#\' class=\'small\' data-value=\'' + services[i]['serviceName'] + '\' tabIndex=\'-1\'><input type=\'checkbox\'/>&nbsp;' + services[i]['serviceName'] + '</a></li>';
            
            $('#prozess-dropdown .dropdown-menu').append(processItem);
        }


        // Initalize click handlers===
        var optionsStatus = [];

        $( '#status-dropdown .dropdown-menu a' ).on( 'click', function( event ) {

        var $target = $( event.currentTarget ),
            val = $target.attr( 'data-value' ),
            $inp = $target.find( 'input' ),
            idx;

        if ( ( idx = optionsStatus.indexOf( val ) ) > -1 ) {
            optionsStatus.splice( idx, 1 );
            setTimeout( function() { $inp.prop( 'checked', false ) }, 0);
        } else {
            optionsStatus.push( val );
            setTimeout( function() { $inp.prop( 'checked', true ) }, 0);
        }

        $( event.target ).blur();
            
        return false;
        });

        var optionsProzess = [];

        $( '#prozess-dropdown .dropdown-menu a' ).on( 'click', function( event ) {

        var $target = $( event.currentTarget ),
            val = $target.attr( 'data-value' ),
            $inp = $target.find( 'input' ),
            idx;

        if ( ( idx = optionsProzess.indexOf( val ) ) > -1 ) {
            optionsProzess.splice( idx, 1 );
            setTimeout( function() { $inp.prop( 'checked', false ) }, 0);
        } else {
            optionsProzess.push( val );
            setTimeout( function() { $inp.prop( 'checked', true ) }, 0);
        }

        $( event.target ).blur();
            
        return false;
        });

        var options = [optionsStatus, optionsProzess]

        //=== click-handler for search-button ===
        $('#search-button').on('click', options, collectSearchParams);
    });

    //============== initialize main table components ============

    //=== Initialize tablesort  ===
    $("#fehler-table").tablesorter();

    //============== Build View ============
    //=== if url contains parameters, collect the and build view accordingly ===
    if (window.location.hash){
        collectURLParams();           
    }

    //else build standard view
    else {
        //standard setting: show only unresolved errors
        var selectedStatus = ["Fehlerhaft - Zu erledigen"];

        //standard setting: 
        var selectedProzess = ['Service 01', 'Service 02', 'Service 03', 'Service 04'];;
        
        //standard setting: show only errors of last 24 hours
        var von = moment().subtract(1, 'days').format('DD.MM.YYYY HH:mm');
        var bis = moment().format('DD.MM.YYYY HH:mm');

        var searchParams = {
            'id': $('#id-search').val(),
            'fehler': $('#fehler-search').val(),
            'von': $('#von-search').val(),
            'bis': $('#bis-search').val(),
            'status': selectedStatus,
            'prozess': selectedProzess,
        }

        buildView(searchParams);
    }
});

//============ Parameters for building view ============
//=== collect search parameters passed from other tab and add standard settings ===
function collectURLParams(){
    //hide details and loesung if currently shown
    $('#fehler-details').empty();
    $('#loesung-main').empty();
    $('#fehler-table').show();

    //if service name in url, get service name from url
    var serviceName = window.location.hash.substring(1)

    //check if url-parameter is valid service name
    $.getJSON('json/services.json', function(services){

        //convert _ back to spaces
        serviceName = serviceName.replace(/_/g,' ');

        for (i in services){
            if (services[i]['serviceName'] == serviceName){
                var selectedProzess = [serviceName];
                break;
        }

            //if wrong parameter is specified, remove hash
            else { 
                window.location.hash=''
            }
        }

        //standard setting: show only unresolved errors
        var selectedStatus = ["Fehlerhaft - Zu erledigen"];

        //standard setting: show only errors of last 24 hours
        var von = moment().subtract(1, 'days').format('DD.MM.YYYY HH:mm');
        var bis = moment().format('DD.MM.YYYY HH:mm');

        var searchParams = {
            'id': '',
            'fehler': '',
            'von': von,//current moment - 24 hours
            'bis': bis,//current moment
            'status': selectedStatus,
            'prozess': selectedProzess,
        }

        buildView(searchParams); 
    });
}

//=== collect search-parameters from toolbar ===
function collectSearchParams(handlerEvent){
    //hide details and loesung if currently shown
    $('#fehler-details').empty();
    $('#loesung-main').empty();
    $('#fehler-table').show();

    //get status and process from handlerEvent
    var options = handlerEvent.data;
    var selectedStatus = options[0];
    var selectedProzess = options[1];
 
    //get other data from input fields
    var searchParams = {
        'id': $('#id-search').val(),
        'fehler': $('#fehler-search').val(),
        'von': $('#von-search').val(),
        'bis': $('#bis-search').val(),
        'status': selectedStatus,
        'prozess': selectedProzess,
    }

    //invoke function to build view
    buildView(searchParams);
}

//============ build view according to parameters ============
function buildView(searchParams){

    //=== build Search-Tags (Create Tags based on search properties) ===
    //empty search tags list
    $('.search-tags.append li').remove();

    //walk trough keys of searchParams object, if content is not equal to empty string, append li-tag to ul (if typeof content is object, append multiple tags)
    for (i in searchParams){
        if (typeof searchParams[i] === 'string' && searchParams[i] != ''){
            if (i === 'von'){
                $('.search-tags.append').append('<li><span class=\'glyphicon glyphicon-remove-sign\'></span> Von <span class=\'searchParams\'>' + searchParams[i] + '</span></li>');
            }
            else if (i === 'bis'){
                $('.search-tags.append').append('<li><span class=\'glyphicon glyphicon-remove-sign\'></span> Bis <span class=\'searchParams\'>' + searchParams[i] + '</span></li>');
            }
            else {
                $('.search-tags.append').append('<li><span class=\'glyphicon glyphicon-remove-sign\'></span> <span class=\'searchParams\'>' + searchParams[i] + '</span></li>');
            }
        }

        if (typeof searchParams[i] === 'object'){
            for (j in searchParams[i]){
                $('.search-tags.append').append('<li><span class=\'glyphicon glyphicon-remove-sign\'></span> <span class=\'searchParams\'>' + searchParams[i][j] + '</span></li>');
            }
        }
    }

    //=== build click-handler for deleting tags ===
    //on click: alter searchParams and trigger new build of view
    //get id of tagged item and call handler for rest of process
    $('.search-tags .glyphicon').on('click', searchParams, updateTags)  
    
    //=== build error-table in main-window ===

    //hand search params to backend as json-file
    
    //!!!For performance reasons, filtering should be done in the backend, so that the already filtered data is handed to the frontend as a json-file!!!

    //happening in the backend:
        //read unfiltered data from json-files, based on services selected
        //filter data according to search params, write filtered data into a database-object)

    //build datebase-view based on database-object
    //read trigger list from JSON-File

    //empty main table
    $('#fehler-table .append').empty();

    //build main table view
    buildMainTable();
}

function updateTags(handlerEvent){
    var searchParams = handlerEvent.data;
    var removeParam = $(this).parent('li').find('.searchParams').text();


    //search params for id of tagged item and remove corresponding entry
    for (i in searchParams){
        if (typeof searchParams[i] === 'string' && searchParams[i] == removeParam){
            searchParams[i] = '';
        }

        if (typeof searchParams[i] === 'object'){
            for (j in searchParams[i]){
                if (searchParams[i][j] == removeParam && i == 'prozess'){
                    //remove param from url
                    var obj = {Page: 'fehlermanagement', Url: 'fehler.html'};
                    history.pushState(obj, obj.Page, obj.Url);
                }

                //remove param from url searchParams-object
                if (searchParams[i][j] == removeParam){
                    searchParams[i].splice(j, 1);
                }
            }
        }
    }

    //build new view (automatically removes tag)
    buildView(searchParams);
}


//=== build main table ===
function buildMainTable(){
    $.getJSON('json/triggerList.json', function(triggerList){
        for (i in triggerList){
        //parse date format for sorting
        var dateFormated = triggerList[i]["date"].split('.')
        
        //build rows 
            //basic constructor
            var tableRow = 
                '<tr id="id' + i + '" data="' + i + '">' +
                    '<td class="done"><input type="checkbox" checked><span class="glyphicon glyphicon-ok"></span></td>' +
                    //add invisible span with formated date-data for sorting
                    '<td class=\'date open-details\'><span class=\'sort\'>' + dateFormated[2] + dateFormated[1] + dateFormated[0] + ' </span>' + triggerList[i]["date"] + '</td>' +
                    '<td class=\'open-details\'>' + triggerList[i]["time"] + '</td>' +
                    '<td class=\'open-details triggerid\'>' + triggerList[i]["id"] + '</td>' +
                    '<td class=\'open-details\'>' + triggerList[i]["process"] + '</td>' +
                    '<td class=\'open-details\'><div class=\'overflow-ellipsis message\'>' + triggerList[i]["message"] + '</div></span></td>' +
                    '<td class=\'open-details \'><div class=\'overflow-ellipsis stacktrace\'>' + triggerList[i]["stacktrace"][0] + '</div></span></td>' +
                    '<td class="solution align-middle"><span class="glyphicon glyphicon-open-file"></span><span class="glyphicon glyphicon-edit"></td>' +
                '</tr>'

            //build table row
            $('#fehler-table .append').append(tableRow);
          

            //modify based on row type
            //Erfolgreich: Display checkmark, Do not display open or edit button
            if (triggerList[i]['done']=='Erfolgreich'){
                $('#fehler-table #id' + i).find('input[type=\'checkbox\']').hide();
                $('#fehler-table #id' + i).find('.glyphicon-open-file').hide();
                $('#fehler-table #id' + i).find('.glyphicon-edit').hide();
                $('#fehler-table #id' + i).find('.open-details').removeClass('open-details');
                //add invisible spans for sorting
                $('.done').last().append('<span class=\'sort\'>2</span>');
                $('.solution').last().append('<span class=\'sort\'>2</span>');
                //remove 'undefined' in stacktrace
                if ($('.stacktrace').last().text() == 'undefined'){
                    $('.stacktrace').last().text('');
                }
            }

            //Fehlerhaft - Erledigt: Display checked checkbox, open and edit button
            if (triggerList[i]['done']=='Fehlerhaft - Erledigt' && triggerList[i]['solution'] === true){
                $('#fehler-table #id' + i).find('.glyphicon-ok').hide();
                //add invisible spans for sorting
                $('.done').last().append('<span class=\'sort\'>1</span>');
                $('.solution').last().append('<span class=\'sort\'>0</span>');
            }

            //Fehlerhaft - Erledigt: Display checked checkbox and edit button
            if (triggerList[i]['done']=='Fehlerhaft - Erledigt' && triggerList[i]['solution'] === false){
                $('#fehler-table #id' + i).find('.glyphicon-ok').hide();
                $('#fehler-table #id' + i).find('.glyphicon-open-file').hide();
                //add invisible spans for sorting
                $('.done').last().append('<span class=\'sort\'>1</span>');
                $('.solution').last().append('<span class=\'sort\'>1</span>');
            }

            //Fehlerhaft - Zu erledigen: Display checkbox, open and edit button
            if (triggerList[i]['done']=='Fehlerhaft - Zu erledigen' && triggerList[i]['solution'] === true){
                $('#fehler-table #id' + i).find('.glyphicon-ok').hide();
                $('#fehler-table #id' + i).find('input[type=\'checkbox\']').removeAttr('checked');
                //add invisible spans for sorting
                $('.done').last().append('<span class=\'sort\'>0</span>');
                $('.solution').last().append('<span class=\'sort\'>0</span>');
            }

            //Fehlerhaft - Zu erledigen: Display checkbox and edit button
            if (triggerList[i]['done']=='Fehlerhaft - Zu erledigen' && triggerList[i]['solution'] === false){
                $('#fehler-table #id' + i).find('.glyphicon-ok').hide();
                $('#fehler-table #id' + i).find('input[type=\'checkbox\']').removeAttr('checked');
                $('#fehler-table #id' + i).find('.glyphicon-open-file').hide();
                //add invisible spans for sorting
                $('.done').last().append('<span class=\'sort\'>0</span>');
                $('.solution').last().append('<span class=\'sort\'>1</span>');
            }
        }

        //update tablesorter
        $("#fehler-table").trigger("update"); 

        var sorting = [[1,0],[2,0]];
        $("#fehler-table").trigger("sorton",[sorting]); 

        //build click handler for message- and stacktrace info
        $('#fehler-table .open-details').on('click', function() {
            //passed data from handler:
            //save i in variable to be able to access message and stacktrace from triggerlist
            var i = $(this).parent('tr').attr('data');
                        
            //pass data to constructor method to build details view      
            buildFehlerDetails(triggerList, i);
        });
                  
        //build open solution button handler
        $('.glyphicon-open-file').on('click',  function(){
            var edit = false;

            //get triggerId
            var triggerId = $(this).parents('tr').find('.triggerid').text();
            var message = $(this).parents('tr').find('.message').text();
            var stacktrace = $(this).parents('tr').find('.stacktrace').text();
            //save rowId in order to show or hide glyphicons of row later
            var rowId = $(this).parents('tr').attr('id');

            //open solutions-view and pass triggerId and edit mode status
            buildLoesungMain(rowId, triggerId, edit, message, stacktrace);
        });

        //build edit solution button handler
        $('.solution .glyphicon-edit').on('click',  function(){
            var edit = true;

            //get triggerId
            var triggerId = $(this).parents('tr').find('.triggerid').text();
            var message = $(this).parents('tr').find('.message').text();
            var stacktrace = $(this).parents('tr').find('.stacktrace').text();
            //save rowId in order to show or hide glyphicons of row later
            var rowId = $(this).parents('tr').attr('id');

            //open solutions-view and pass triggerId and edit mode status
            buildLoesungMain(rowId, triggerId, edit, message, stacktrace);
        });
    });
    

}

function buildFehlerDetails(triggerList, i){
    //remove table from DOM
    $('#fehler-table').hide();

    //if stacktrace is undefined, change to "" to avoid error
    var stacktrace = "";
    
    //walk through lines of stacktrace saved in an array and append
    for (j in triggerList[i]["stacktrace"]){
        stacktrace += triggerList[i]["stacktrace"][j];
    }

    //constructor for fehler-details
    var fehlerDetailsConst = 
        '<div id="details-header" class="details-stop"> Details</div>' +
            '<div id="fehler-details-wrapper">' +
                '<h4>Fehler:</h4>' +
                '<p id="details-message">' + triggerList[i]["message"] + '</p>' +
                '<h4>Stacktrace:</h4>' +
                '<p id="details-stack">' + stacktrace + '</p>' +
            '</div>' +
            '<input id="fehler-back" type="button" class="btn btn-default btn-br-blue full-width" value="Zurück">' +
        '</div>'
        
    //append constructor
    $('#fehler-details').show();
    $('#fehler-details').append(fehlerDetailsConst);

    //click handler for back-button
    $('#fehler-back').on('click', function() {
        $('#fehler-details').empty();
        $('#fehler-table').show();
    });
};

/*
====================================================================
============================== LÖSUNG ==============================
====================================================================
*/

function buildLoesungMain(rowId, triggerId, edit, message, stacktrace){
    $('#fehler-table').hide();

    //define empty version of solution variable as global variable to be able to use it for appending empty solutions to view later
    var emptyLoesung =
    [
        {
            title: '',
            step:
                [ ''
                ],
            tag:
                [ ''
                ]
        }
    ];

    //define variable, to monitor, if solutions have been changed (necessary to display non-modal dialog later)
    var loesungChanged = false;

    //define solution as global variable to make accessible everywhere without having to pass it to every funtion
    var solution = {};
    solution['text'] = []; //initalize text to avoid errors in save function

    //search for triggerId in solutions database on server (not implemented)

    //get triggerId of selected trigger from passed variable and save it in json file on server



    $(document).ready(function() {
        //get object of found solution from server, passed by json-file
        $.getJSON('json/solutions.json', function(solution){

            //pass object to functions to build view
            buildHeader(solution['triggerId']);
            buildLoesung(solution['text'], edit);
            buildHandlers();
            
        });
    });

    function buildHeader(triggerId){
        //build frame for solutions view
        var loesungFrameConst =
            '<div id=\'loesung\'>' +
            '<span class="loesung-edit edit edit-btn glyphicon glyphicon-edit" title=\'Lösungen bearbeiten\'></span>' + 
            '<span class="loesung-edit cancel edit-btn glyphicon glyphicon-remove-circle" title=\'Änderungen verwerfen\'></span>' + 
            '<span class="loesung-edit trash edit-btn glyphicon glyphicon glyphicon-trash" title=\'Alle Lösungen löschen\'></span>' +
            '<span class="loesung-edit save edit-btn glyphicon glyphicon-floppy-save" title=\'Lösungen speichern\'></span>' +
                '<div id=\'details-header\' class=\'loesung-header\'> Lösungen für ' + triggerId + '</div>' +
                '<div class=\'modeless\' id=\'cancel\'>' +
                    '<p>Alle angezeigten Lösungen löschen?' +
                        '<span class="glyphicon glyphicon-ok-circle" title=\'Ja\'></span>' +
                        '<span class="glyphicon glyphicon-remove-circle" title=\'Nein\'></span>' +
                    '</p>' +
                '</div>' +
                '<ol id=\'loesung-wrapper\'></ol>' +
                '<input id=\'fehler-back\' type=\'button\' class=\'btn btn-default btn-br-blue full-width\' value=\'Zurück\'>' +
            '</div>'


        $('#loesung-main.append').append(loesungFrameConst);
    }

    function buildLoesung(loesung, edit){

        if (edit){
            //hide back button
            $('#fehler-back').hide();

            // ajust height
            $('#loesung-wrapper').addClass('loesung-details');
        }

        if (loesung && loesung.length != 0){
            //append solutions within frame
            for (i in loesung){
                var loesungConst =
                    '<div class=\'loesung-loesung\'>' +
                        '<h4 class=\'loesung-title\'><li>Lösung: <span class=\'title-edit\'>' + loesung[i]['title'] + '</span></li></h4>' +
                        '<ol class=\'loesung-steps\'></ol>' +
                        '<ul class=\'loesung-tags tags\'></ul>' +
                    '</div>';

                $('#loesung-wrapper').append(loesungConst);
                
                //append steps within solutions
                for (j in loesung[i]['step']){
                    var stepConst = '<li>' + loesung[i]['step'][j] + '</li>';
                    
                    $('.loesung-steps').last().append(stepConst);
                }

                //append error message tags within solutions
                for (k in loesung[i]['tag']){
                    var tagConst = '<li><span class=\'glyphicon glyphicon-remove-sign\'></span> <input class=\'tag-edit\' value=\'' + loesung[i]['tag'][k] + '\' readonly/></li>'
                    
                    $('.loesung-tags').last().append(tagConst);
                }
            }
        }
        else if (loesung && loesung.length == 0){

            //append solutions within frame
            var loesungConst =
                '<div class=\'loesung-loesung\'>' +
                    '<h4 class=\'loesung-title\'><li>Lösung: <span class=\'title-edit\'></span></li></h4>' +
                    '<ol class=\'loesung-steps\'><li></li></ol>' +
                    '<ul class=\'loesung-tags tags\'></ul>' +
                '</div>';

            $('#loesung-wrapper').append(loesungConst);

            //if there are no solutions yet, autoappend message and stacktrace of current trigger to first solution
            var tagMessage =
            '<li class=\'tagMessage\'><span class=\'glyphicon glyphicon-remove-sign\'></span> <input class=\'tag-edit\' value=\'' + message + '\'/></li>';

            var tagStacktrace =
            '<li class=\'tagStacktrace\'><span class=\'glyphicon glyphicon-remove-sign\'></span> <input class=\'tag-edit\' value=\'' + stacktrace + '\'/></li>';
            
            $('.loesung-tags').append(tagMessage);
            $('.loesung-tags').append(tagStacktrace);

            //if message or stacktrace are undefined, do not display tags accordingly
            if (message == undefined){
                $('.tagMessage').remove();
            }    

            if (stacktrace == undefined){
                $('.tagStacktrace').remove();
            }             
        }
        else{
            $('#loesung-wrapper').append('<h4 style=\'color: red\'>Fehler: Kein Lösungstext gefunden</h4>');
        }
    }

    

    function buildHandlers(){    
        //=== Basic View ===
        //clickhandler for edit button
        $('.loesung-edit.edit').on('click', function() {

            //Add empty tag on pageload
            addEmptyTag();
            
            //append empty solution, make title, steps and tags editable 
            addEmptyLoesung();
            
            //show save-, trash- and cancel-button
            $('.loesung-edit.save').show();
            $('.loesung-edit.trash').show();
            $('.loesung-edit.cancel').show();
            $('.loesung-edit.edit').hide();

            //if loesung is empty,automatically add message and stacktrace as tags
   
        });

        //trigger edit mode if passed edit variable equals true
        if (edit){
            $('.loesung-edit.edit').trigger('click');
        }

        //=== Edit View ===
        //clickhandler for back button
        $('#fehler-back').on('click', function() {
            //delete view and go back to main table
            $('#loesung-main').empty();
            $('#fehler-table').show();
        });
                    
        //clickhandler for save button
        $('.loesung-edit.save').on('click', function() {  
            $('#cancel.modeless').hide();

            //if loesung does not have list item and title, remove
            $('.loesung-title .title-edit').each(function(){
                if(!$(this).text()) {
                    $(this).find('.loesung-steps li').each(function(){//probalby needs parents here BUGGY
                        if(!$(this).text()) {
                            $(this).parents('.loesung-loesung').remove();
                        }
                    });
                }
            });
            
            //if loesung does not have list item or title, display modeless, change color of missing inputs to red
            //NOT IMPLEMENTED COMPLETELY
            var enteredLoesung = [];

            $('.loesung-title .title-edit').each(function(){
                var title = $(this).text();

                var steps = [];
                $('.loesung-steps li').each(function(){
                    steps.push($(this).text());
                });

                enteredLoesung.push(
                    {
                        'title': title, 
                        'steps': steps
                    });
            });

            console.log(enteredLoesung);

            for (i in enteredLoesung){
                if ((enteredLoesung[i]['title'] != '' && enteredLoesung[i]['steps'] == '') || (enteredLoesung[i]['title'] == '' && enteredLoesung[i]['steps'] != '')){
                    console.log("remove " + i);
                }
            }

            //if tags are empty, remove
            $('.loesung-tags .tag-edit').each(function(){
                if(!$(this).val()) {
                    $(this).parent('li').remove();
                }
            });

            
            //if there are solutions left, save  
            var loesungTitles = []
            $('.loesung-loesung').each(function(i){
                if ($(this).find('.title-edit').text() != ""){
                    loesungTitles[i] = $(this).find('.title-edit').text();
                }
            });

            var loesungSteps = []
            $('.loesung-loesung').find('.loesung-steps li').each(function(i){
                if ($(this).text() != ""){
                    loesungSteps[i] = $(this).text();
                }
            });

            console.log(loesungTitles);
            console.log(loesungSteps);

            //If variables are not empty 
            if (loesungTitles.length != 0 && loesungSteps.length != 0){
                //write contents of input fields to variable
                saveLoesung();

                //delete view and go back to main table
                $('#loesung-main').empty();
                $('#fehler-table').show();

                //show glyphicon-open-file, because file is now accessible
                var selectedRow = '#' + rowId + ' .glyphicon-open-file';
                $(selectedRow).show();
            }

            //else show modeless
            else {
                $('#cancel.modeless').html(
                    'Eine Lösung besitzt keinen Titel oder Inhalt, deswegen kann nicht gespeichert werden');
                $('#cancel.modeless').show();
                $('#loesung-wrapper').css('height', 'calc(100vh - 270px - 28px)');
            }
        });

        //clickhandler for trash button
        $('.loesung-edit.trash').on('click', function() {
            $('#cancel.modeless').html(
                'Alle angezeigten Lösungen löschen?' + 
                '<span class="glyphicon glyphicon-ok-circle" title=\'Ja\'></span>' +
                '<span class="glyphicon glyphicon-remove-circle" title=\'Nein\'></span>');
            $('#cancel.modeless').show();
            $('#loesung-wrapper').css('height', 'calc(100vh - 270px - 28px)');
        
            $('#cancel.modeless .glyphicon-ok-circle').on('click', function(){
                //delete contents of variable
                deleteLoesung();

                //delete view and go back to main table
                $('#loesung-main').empty();
                $('#fehler-table').show();
                //hide glyphicon-open-file, because file is not accessible anymore
                var selectedRow = '#' + rowId + ' .glyphicon-open-file';
                $(selectedRow).hide();
            });

            $('#cancel.modeless .glyphicon-remove-circle').on('click', function(){
                $('#cancel.modeless').hide();
                $('#loesung-wrapper').css('height', 'calc(100vh - 270px)');
            });
        });

        //clickhandler for cancel button
        $('.loesung-edit.cancel').on('click', function() {
            $('#cancel.modeless').html(
                'Alle angezeigten Änderungen verwerfen?' + 
                '<span class="glyphicon glyphicon-ok-circle" title=\'Ja\'></span>' +
                '<span class="glyphicon glyphicon-remove-circle" title=\'Nein\'></span>');
            $('#cancel.modeless').show();
            $('#loesung-wrapper').css('height', 'calc(100vh - 270px - 28px)');
        
            $('#cancel.modeless .glyphicon-ok-circle').on('click', function(){
                //delete view and go back to main table
                $('#loesung-main').empty();
                $('#fehler-table').show();
            });

            $('#cancel.modeless .glyphicon-remove-circle').on('click', function(){
                $('#cancel.modeless').hide();
                $('#loesung-wrapper').css('height', 'calc(100vh - 270px)');
            });
        });


        function clickHandlerToggle(){
            //remove editablity, hide save-, trash and cancel-button, show edit-button
            $('.title-edit').attr('contenteditable','false');
            $('.loesung-steps').attr('contenteditable','false');
            $('.loesung-tags .tag-edit').attr('readonly', 'true');
            $('.loesung-tags').removeClass('editable') //remove class for styling
            $('.loesung-edit.save').hide();
            $('.loesung-edit.trash').hide();
            $('.loesung-edit.cancel').hide();
            $('.loesung-edit.edit').show();
        }

        //create new label, if last label is not empty or if there is no label
        function addEmptyTag() {
            if (($(this).find('.tag-edit').last().val()) || (!($(this).find('.tag-edit').length))){

                $('.loesung-tags').each(function(){
                    //show remove glyphicon of last tag
                    $('.loesung-tags').find('.glyphicon').last().css('visibility', 'visible');

                    //append new tag
                    $(this).append('<li><span class=\'glyphicon glyphicon-remove-sign\'></span> <input class=\'tag-edit\ type=\'text\' value=""/></li>');

                    //hide remove glyphicon of new tag
                    $(this).find('.glyphicon').last().css('visibility', 'hidden');

                    //append clickhandler for remove glyphicon
                    $(this).find('.glyphicon').last().on('click', removeTag);

                    //append handler for entering text in tag field
                    $(this).find('.tag-edit').last().one('keydown', addTag);
                });
            }
        }

        //handler for entering text in tag field
        function addTag(){
            //show remove glyphicon of last tag
            $(this).parents('.loesung-tags').find('.glyphicon').last().css('visibility', 'visible');
            
            //append new tag
            $(this).parents('.loesung-tags').append('<li><span class=\'glyphicon glyphicon-remove-sign\'></span> <input class=\'tag-edit\ type=\'text\' value=""/></li>');

            //hide remove glyphicon of new tag
            $(this).parents('.loesung-tags').find('.glyphicon').last().css('visibility', 'hidden');

            //append clickhandler for glyphicon-remove-sign
            $(this).parents('.loesung-tags').find('.glyphicon').last().on('click', removeTag);

            //append handler for entering text in tag field
            $(this).parents('.loesung-tags').find('.tag-edit').last().one('keydown', addTag);             
        }

        //handler, which remebers, that changes have been made if one of the input fields is used
        $('#loesung-wrapper').one('keydown', function(){
            loesungChanged = true;
        });        

        //clickhandler for remove glyphicon
        $('.loesung-tags').find('.glyphicon').on('click', removeTag);

        function removeTag() {
            $(this).parent().remove();
        }

        //function to append empty solutions and handler for buidling new empty solutions
        function addEmptyLoesung(){
            buildLoesung(emptyLoesung);

            //make added loesung editable
            $('.title-edit').attr('contenteditable','true');
            $('.loesung-steps').attr('contenteditable','true');
            $('.loesung-tags .tag-edit').removeAttr('readonly');
            $('.loesung-tags').addClass('editable') //add class for styling

            //hide remove glyphicon of new tag
            $('.loesung-loesung').find('.glyphicon').last().css('visibility', 'hidden');

            //append clickhandler for remove glyphicon
            $('.loesung-loesung').find('.glyphicon').last().on('click', removeTag);

            //append handler for entering text in tag field
            $('.loesung-loesung').find('.tag-edit').last().one('keydown', addTag);

            //build handler for entering text in empty solution field
            $('.loesung-loesung').last().one('keydown', addEmptyLoesung);
        }
    } 

    //write contents of input fields to variable
    function saveLoesung(){
        //reset variable
        solution['text'].length = 0;

        //fill variable
        $('.loesung-loesung').each(function(i){
            //save title
            solution['text'][i] = {}; //initalize property 'tite'
            solution['text'][i]['title'] = $(this).find('.title-edit').text();

            //save steps
            solution['text'][i]['step'] = []; //initalize property 'step'
            $(this).find('.loesung-steps li').each(function(j){
                solution['text'][i]['step'].push($(this).text());
            });

            //save tags
            solution['text'][i]['tag'] = []; //initalize property 'tag'
            $(this).find('.loesung-tags li').each(function(k){
                solution['text'][i]['tag'].push($(this).find('.tag-edit').val());
            });
        });

        //write variable to json
    }

    //delete contents of variable
    function deleteLoesung(){
        //reset variable
        solution['text'].length = 0;
    }
}