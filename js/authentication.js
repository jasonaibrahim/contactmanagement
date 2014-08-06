ContactManagement.service('Authentication', 
function($cookies, $http, $q, $window, API, AUTH) {

    var _this = this;

    this.getToken = function() {
        var success = $q.defer();
        if (window.otag && otag.auth) {
            success.resolve(otag.auth.otagtoken);
        } 
        else if($cookies.otagtoken) {
            success.resolve($cookies.otagtoken);
        }
        else {
            success.reject('error getting otagtoken');
        }
        return success.promise;
    };

    this.setToken = function(token) {
        if(token) {
            $http.defaults.headers.common.otagtoken = token;
        }
    };

    this.getTicket = function() {
        var success = $q.defer();
        $http({
            method:'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({username: AUTH.username, password: AUTH.password}),
            url: API.baseUrl + '/auth'
        })
        .success(function(result) {
            success.resolve(result.ticket);
        })
        .error(function(reason) {
            console.log(reason);
            success.reject('error getting ticket');
        });
        return success.promise;
    };

    this.setTicket = function(ticket) {
        if(ticket) {
            $http.defaults.headers.common.otcsticket = ticket;
        }
    };

    this.authenticate = function() {
        var success = $q.defer();
        _this.getToken().then(function(token) {
            _this.setToken(token);
        }).then(_this.getTicket).then(function(ticket) {
            _this.setTicket(ticket)   
             success.resolve(true);
        }, function(error) {
            success.reject('Unable to authenticate');
        });
        return success.promise;
    };
});