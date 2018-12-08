$(document).ready(function() {

    //read services and maintenanceGroups from JSON-Files
    $.getJSON('json/services.json', function(services){
        $.getJSON('json/maitenanceGroups.json', function(maintenanceGroups){

        buildGroupTiles(services, maintenanceGroups);
        });
    });

  

});

//============ build tile DOM objects based on arrays ============
function buildGroupTiles(services, maintenanceGroups){


    for (i=0; i<maintenanceGroups.length; i++){

        //basic constructor
        var maintenanceGroupConst = 
            '<div id=\'' + maintenanceGroups[i]['groupName'].replace(/\s/g,'_') + '\' class=\'wartung-wrapper btn btn-default col-xs-6 col-sm-6 col-md-3 col-lg-3\' data=\'\' type=\'button\'>\n'+
                '<div id=\'wartung-header\'><span id=\'label\'>' +
                    maintenanceGroups[i]['groupName'] +
                    '</span><span class=\'wartung-edit glyphicon glyphicon-edit\'></span>\n'+
                '</div>\n'+
                '<div id=\'wartung-body\'>\n'+
                    '<ul class=\'wartung-list\'>\n'+
                    '</ul>\n'+
                '</div>\n'+
            '</div>';

        $('.append').append(maintenanceGroupConst);

        //call function to build group list on maintenance group tile
        buildGroupList(services, maintenanceGroups);

        history.pushState(null, null, 'wartung.html');
       
    }

    //build plus-button for adding groups
    buildOverlayButton();

    //build click handler for maintenance edit button, to be able to pass groupe name to maintenance settings
    $('.wartung-edit').on('click', function() {
        //passed data from handler:
        //save groupName in variable (read string from div-Tag with class .wartung-wrapper)
        var maintenanceGroupName = $(this).parents('.wartung-wrapper').attr('id').replace(/_/g,' ');
        
        //remove overlay button from DOM
        removeOverlayButton();

        //remove maintenance tiles from DOM
        removeMaintenanceTiles();

        //pass data to constructor method to build settings view
        buildEditTile(maintenanceGroupName, services, maintenanceGroups);
    });

    //build clickhandler for overlay button, to be able to pass group name to maintenance settings
    $('.overlay-button').on('click', function(){
        console.log('overlay');

        //remove overlay button from DOM
        removeOverlayButton();

        //remove maintenance tiles from DOM
        removeMaintenanceTiles();
        
        var emptyGroupName = '';

        //pass data to constructor method to build settings view
        buildEditTile(emptyGroupName, services, maintenanceGroups);
    });

    //build clickhandler for tile button, to be able to pass group name to maintenance settings
    $('.wartung-wrapper').on('click', function(){
        console.log('tile');

        //passed data from handler:
        //save groupName in variable (read string from div-Tag with class .wartung-wrapper)
        var maintenanceGroupName = $(this).attr('id').replace(/_/g,' ');

        //remove overlay button from DOM
        removeOverlayButton();

        //remove maintenance tiles from DOM
        removeMaintenanceTiles();

        //pass data to constructor method to build details view
        buildDetailsTile(maintenanceGroupName, services, maintenanceGroups);
    });
}


//=== Build group list on group tile ===
function buildGroupList(services, maintenanceGroups){
    for (j=0; j<maintenanceGroups[i]['groupServices'].length; j++){
    
        for (k=0; k<services.length; k++){

            if (maintenanceGroups[i]['groupServices'][j] == services[k]['serviceName']){

                var serviceStatus = services[k]['serviceStatus']

                //select in what color to display the bullet point based on service status in array
                switch(serviceStatus){

                    case 1:
                    var listItem = '<li class=\'wartung-down\'>' + maintenanceGroups[i]['groupServices'][j] + '</li>';
                    break;

                    case 2:    
                    var listItem = '<li class=\'wartung-stop\'>' + maintenanceGroups[i]['groupServices'][j] + '</li>';
                    break;

                    case 3:
                    var listItem = '<li class=\'wartung-critical\'>' + maintenanceGroups[i]['groupServices'][j] + '</li>';
                    break;

                    case 4:
                    var listItem = '<li class=\'wartung-run\'>' + maintenanceGroups[i]['groupServices'][j] + '</li>';
                    break;
                }
            }                    
        } 
        
        $('.wartung-wrapper:last-child .wartung-list').append(listItem);
    }
}         


//=== build overlay button ===
function buildOverlayButton(){
    $('.append').append('<span class=\'overlay-button glyphicon glyphicon-plus-sign\'></span>');
}


//0000000000000000000000000 Wartung-Edit 0000000000000000000000000     
//========== constructor method ==========
//Data: from handler: group name
//Other required data: servicelist (from array services in global scope) service status (on/off) (from maintenanceGroups array in global scope)

//=== build HTML-frame ===
function buildEditTile(maintenanceGroupName, services, maintenanceGroups){            

    
    window.location.href = 'wartung.html' + '#' + maintenanceGroupName.replace(/\s/g,'_');

    var maintenanceEditConst =
        '<div class=\'wartung-wrapper col-xs-12 col-sm-12 col-md-12 col-lg-12 heigthFillsTab settings\' type=\'button\'>' +
            '<div id=\'wartung-header\' class=\'settings\'><input id=\'label\' class=\'wartung-edit-mode\' type=\'text\' placeholder=\'Bitte Titel für Wartungsgruppe eingeben\' value=\'' + maintenanceGroupName + '\'/>' +
                '<span id=\'wartung-cancel\' class="edit-btn cancel glyphicon glyphicon-remove-circle" title=\'Änderungen verwerfen\'></span>' + 
                '<span id=\'wartung-delete\' class="edit-btn trash glyphicon glyphicon glyphicon-trash" title=\'Wartungsgruppe löschen\'></span>' +
                '<span id=\'wartung-confirm\' class="edit-btn save glyphicon glyphicon-floppy-save" title=\'Wartungsgruppe speichern\'></span>' +
            '</div>' +
            '<div class=\'modeless\' id=\'cancel\'>' +
                '<p>Alle angezeigten Lösungen löschen?' +
                    '<span class="glyphicon glyphicon-ok-circle" title=\'Ja\'></span>' +
                    '<span class="glyphicon glyphicon-remove-circle" title=\'Nein\'></span>' +
                '</p>' +
            '</div>' +
            '<div id=\'wartung-body\' class=\'settings heigthFillsElement\'>' +
                '<div class=\'wartung-list-wrapper\'>' +
                    '<h4>In der Gruppe</h4>' +
                    '<ul class=\'wartung-list in settings append\'></ul>' +
                '</div>' +
                '<div class=\'wartung-list-wrapper\'>' +
                    '<h4>Nicht in der Gruppe</h4>' +
                    '<ul class=\'wartung-list out settings append\'></ul>' +
                '</div>' +
            '</div>' +
        '</div>';

    $('.append').append(maintenanceEditConst); 

    //=== adapt HTML-frame ===
    //insert selected services and display based on status (on/off)
    //define variable for checking, to be able to show services even if there is no data set yet
    var newGroup = true;

    for (i=0; i<maintenanceGroups.length; i++){
        
        //select service from maintenanceGroups array based on group name to be able to read activated services of this group
        if (maintenanceGroups[i]['groupName'] == maintenanceGroupName){
            var newGroup = false;

            //pass selected maintenance group by value to maintenanceGroupTemp, so maintenanceGroups can act as a backup if changes in settings-view are abandoned
            var maintenanceGroupTemp = {'groupName': '', 'groupServices': []};

            maintenanceGroupTemp['groupName']= maintenanceGroups[i]['groupName'];

            for (j in maintenanceGroups[i]['groupServices']){
                maintenanceGroupTemp['groupServices'].push(maintenanceGroups[i]['groupServices'][j]);
            }
            
            //walk through all services and build them, but hide them
            for (var j=0; j<services.length; j++){

                //build list of services in the group
                var maintenanceEditLiIn = '<li id=\'id' + j + '\' class=\'\'> <span class=\'remove glyphicon glyphicon-minus-sign\'></span> <span class=\'title\'>' + services[j]['serviceName'] + '</span></li>';
                $('.in.settings.append').append(maintenanceEditLiIn);

                //build list of services outside the group
                var maintenanceEditLiOut = '<li id=\'id' + j + '\' class=\'\'><span class=\'add glyphicon glyphicon-plus-sign\'></span> <span class=\'title\'>' + services[j]['serviceName'] + '</span></li>';
                $('.out.settings.append').append(maintenanceEditLiOut);

                var serviceFound = false;
                
                //walk through services in group to display the ones contained in it as activated
                for (var k=0; k<maintenanceGroups[i]['groupServices'].length; k++){
                    
                    if (services[j]['serviceName'] == maintenanceGroups[i]['groupServices'][k]){
                        console.log(j);
                        $('.out #id' + j).hide();
                        serviceFound = true;               
                    }
                }
            
                if (serviceFound == false){
                    $('.in #id' + j).hide();
                    serviceFound = true;  
                }
            }       
        }
    }

    //if maintenance group does not exist, display services list nevertheless
    if (newGroup == true) {
        var maintenanceGroupTemp = {'groupName': '', 'groupServices': ['']};

        for (var j=0; j<services.length; j++){

            //build list of services in the group
            var maintenanceEditLiIn = '<li id=\'id' + j + '\' class=\'\'> <span class=\'remove glyphicon glyphicon-minus-sign\'></span> <span class=\'title\'>' + services[j]['serviceName'] + '</span></li>';
            $('.in.settings.append').append(maintenanceEditLiIn);

            //build list of services outside the group
            var maintenanceEditLiOut = '<li id=\'id' + j + '\' class=\'\'><span class=\'add glyphicon glyphicon-plus-sign\'></span> <span class=\'title\'>' + services[j]['serviceName'] + '</span></li>';
            $('.out.settings.append').append(maintenanceEditLiOut);
        }       
        $('.in.settings li').hide();      
    }

    //=== clickhandlers for buttons ===
    //clickhandler for 'add'-button
    $('.wartung-list li .add').on('click', function(){
            var addID = $(this).parents('li').attr('id');
            console.log(addID);
            $('.in #' + addID).show();
            $('.out #'+ addID).hide();
            var selectedService = $(this).parents('li').find('.title').text();

            maintenanceGroupTemp['groupServices'].push(selectedService);
            console.log(maintenanceGroupTemp['groupServices']);
            console.log(maintenanceGroups);

    });

    //clickhandler for 'remove'-button
    $('.wartung-list li .remove').on('click', function(){
            var removeID = $(this).parents('li').attr('id');
            $('.in #' + removeID).hide();
            $('.out #' + removeID).show();
            var selectedService = $(this).parents('li').find('.title').text()

            for(var i = 0; i < maintenanceGroupTemp['groupServices'].length; i++) {
                if(maintenanceGroupTemp['groupServices'][i] == selectedService) {
                    maintenanceGroupTemp['groupServices'].splice(i, 1);
                }
            }

            console.log(maintenanceGroupTemp['groupServices']);
            console.log(maintenanceGroups);
    });

    //clickhandler for 'Übernehmen'-button
    $('#wartung-confirm').on('click', function(){
        //save changes in array
        //save entered name and services in array
        var maintenanceGroupNameTemp=$('#wartung-header #label').val();
        console.log(maintenanceGroupNameTemp);
        console.log('maintenanceGroupTemp:'+ maintenanceGroupTemp);

        //ToDo: check if name is empty!
        if (maintenanceGroupNameTemp == ''){
            console.log('ausgelöst');
            maintenanceGroupNameTemp = 'Unbenannt';
        }

        //introduce checking variable, to define behaviour for new maintenance group
        var newGroup = true;

        //search array for existing group with same name, if goup exists: Change name in array to name given in input box
        for (var i = 0; i < maintenanceGroups.length; i++){
            if(maintenanceGroupTemp['groupName'] == maintenanceGroups[i]['groupName']){
                var newGroup = false;
                maintenanceGroups[i] = maintenanceGroupTemp;
                console.log('maintenanceGroups[i]:' + maintenanceGroups[i]);
                maintenanceGroups[i]['groupName'] = maintenanceGroupNameTemp;
                console.log('maintenanceGroups[i]:' + maintenanceGroups[i]);
            }
        }

        //add new group, if name not found
        if (newGroup == true){
            maintenanceGroupTemp['groupName'] = maintenanceGroupNameTemp;
            maintenanceGroups.push(maintenanceGroupTemp);
        }

        removeMaintenanceTiles();
        buildGroupTiles(services, maintenanceGroups);
     });


    //clickhandler for 'Verwerfen'-button
    $('#wartung-cancel').on('click', function(){
        $('#cancel.modeless').html(
            'Alle angezeigten Änderungen verwerfen?' + 
            '<span class="glyphicon glyphicon-ok-circle" title=\'Ja\'></span>' +
            '<span class="glyphicon glyphicon-remove-circle" title=\'Nein\'></span>');
        $('#cancel.modeless').show();
        $('#wartung-body').removeClass('heigthFillsElement');
        $('#wartung-body').css('height', 'calc(90vh - 225px)');
    
        $('#cancel.modeless .glyphicon-ok-circle').on('click', function(){
            //delete view and go back to main table
            removeMaintenanceTiles();
            buildGroupTiles(services, maintenanceGroups);
        });

        $('#cancel.modeless .glyphicon-remove-circle').on('click', function(){
            $('#cancel.modeless').hide();
            $('#wartung-body').addClass('heigthFillsElement');
        });
    });
    
    //clickhandler for 'Löschen'-button
    $('#wartung-delete').on('click', function(){
        $('#cancel.modeless').html(
            'Alle angezeigten Lösungen löschen?' + 
            '<span class="glyphicon glyphicon-ok-circle" title=\'Ja\'></span>' +
            '<span class="glyphicon glyphicon-remove-circle" title=\'Nein\'></span>');
        $('#cancel.modeless').show();
        $('#wartung-body').removeClass('heigthFillsElement');
        $('#wartung-body').css('height', 'calc(90vh - 225px)');

        $('#cancel.modeless .glyphicon-ok-circle').on('click', function(){
            //aktuelle Gruppe suchen
            var currentGroupName = window.location.hash.substring(1).replace(/_/g,' ');
            console.log(currentGroupName);
            
            //Gruppe aus Array löschen
            for (i in maintenanceGroups){
                if (maintenanceGroups[i]['groupName'] == currentGroupName){
                    maintenanceGroups.splice(i, 1);
                }
            }

            //delete view and go back to main table
            removeMaintenanceTiles();
            buildGroupTiles(services, maintenanceGroups);
        });

        $('#cancel.modeless .glyphicon-remove-circle').on('click', function(){
            $('#cancel.modeless').hide();
            $('#wartung-body').addClass('heigthFillsElement');
        });
    });

}


//=== remove overlay button ===
function removeOverlayButton(){
    $('span').remove('.overlay-button');
}


//=== remove tile DOM objects ===
function removeMaintenanceTiles(){
    $('div').remove('.wartung-wrapper');
}

//0000000000000000000000000 Wartung-Details 0000000000000000000000000     
//========== constructor method ==========
//Data: from handler: group name
//Other required data: servicelist (from array services in global scope) service status (on/off) (from maintenanceGroups array in global scope)

//=== build HTML-frame ===
function buildDetailsTile(maintenanceGroupName, services, maintenanceGroups){
    window.location.href = 'wartung.html' + '#' + maintenanceGroupName;

    var maintenanceDetailsConst =
    '<div class=\'wartung-wrapper col-xs-12 col-sm-12 col-md-12 col-lg-12 heigthFillsTab settings\' type=\'button\'>' +
        '<div id=\'wartung-header\' class=\'details wartung-details-mode\'>' + maintenanceGroupName + '</div>' +
        '<div id=\'wartung-body\' class=\'details heigthFillsElement\'>' +
            '<textarea id=\'maintenance-reason\' placeholder=\'Hier kann eine Begründung für die Wartung angegeben werden.\'></textarea>' +
            '<div id=\'button-bar\'>' +
                '<input type=\'button\' class=\'wartung-settings-btn btn btn-default btn-dark\' value=\'Services starten\'>' +
                '<input id=\'wartung-placeholder\' type=\'button\' class=\'wartung-settings-btn btn btn-default\'>' +
                '<input type=\'button\' class=\'wartung-settings-btn btn btn-default btn-dark\' value=\'Services beenden\'>' +
                '<input id=\'wartung-back\' type=\'button\' class=\'wartung-settings-btn btn btn-default btn-br-blue\' value=\'Zurück\'>' +
            '</div>' +
        '</div>' +
    '</div>'

    $('.append').append(maintenanceDetailsConst); 

    //clickhandler for 'Zurück'-button
    $('#wartung-back').on('click', function(){
        removeMaintenanceTiles();
        buildGroupTiles(services, maintenanceGroups);
    });
}


    

    


