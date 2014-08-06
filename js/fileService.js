ContactManagement.service('FileService', 
function($q, $http, $rootScope, AUTH, API, DATA, VIEW) {

	this.addFolder = function(id, name, desc) {
		return $http({
			method: 'POST',
			url: API.baseUrl + '/nodes',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: $.param({type: 0, parent_id: id, name: name, description: desc})
		});
	};

	this.delete = function(nodeId) {
		return $http({
			method: 'DELETE',
			url: API.baseUrl + '/nodes/' + nodeId
		});
	};
	
	this.getContact = function(nodeId) {
		var success = $q.defer();
		var contact = {};

		/* get the base info for contact */
		$http.get(API.baseUrl + '/nodes/' + nodeId)
		.success(function(data) {
			contact = JSON.parse(data.data.description);
			contact.id = nodeId;

			/* fetch all files associated with contact */
			$http.get(API.baseUrl + '/nodes/' + nodeId + '/nodes')
			.success(function(data) {
				contact.files = data.data;
				success.resolve(contact);
			});

		});
			
		return success.promise;
	};

	this.init = function() {
		$http.get(API.baseUrl + '/nodes/' + API.root + '/nodes' + '?expand=user')
		.success(function(data) {
			$rootScope.$broadcast(DATA.contacts, data.data);
		});
	};

	this.uploadFile = function(id, data) {
		return $http.post(API.baseUrl + '/nodes', data, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined }
		});
	};

	this.viewFile = function(nodeId) {
		var success = $q.defer();
		var file = {};
		$http.get(API.baseUrl + '/nodes/' + nodeId + '/versions')
		.success(function(data) {
			file = data.data[0];
			success.resolve(file);
		});
		return success.promise;
	};
	
});