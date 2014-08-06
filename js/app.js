'use strict';

var ContactManagement = angular.module('ContactManagement', ['ngCookies']);

ContactManagement.filter('bytes', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
});

ContactManagement.value('API', {
    baseUrl: 'http://10.26.38.128:8080/cs/api/v1',
    endpoint: "http://win-ora-test/alpha/livelink.exe",
    root: 71410,
    workspace: 141
});

ContactManagement.constant('AUTH', {
    username: 'Admin',
    password: 'livelink'
});

ContactManagement.value('DATA', {
    contact: 'contact',
    contacts: 'contacts',
    file: 'file'
});

ContactManagement.value('VIEW', {
    addFolder: 'addFolder',
    addContact: 'addContact',
    viewContact: 'viewContact',
    viewContacts: 'viewContacts',
    upload: 'upload',
    viewFile: 'viewFile',
    viewFiles: 'viewFiles'
});

ContactManagement.controller('ApplicationController', 
function($scope, Authentication, DATA, FileService, VIEW) {

    /* initialization */
    $scope.currentView = VIEW.defaultView;
    Authentication.authenticate().then(function(success) {
        FileService.init();
    }, function(error) {
        alert(error);
    });

});