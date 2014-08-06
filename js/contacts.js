ContactManagement.controller('ContactsController', 
function($q, $sce, $scope, $rootScope, $timeout, API, AUTH, Authentication, DATA, FileService, VIEW) {

	$scope.API = API;
	$scope.AUTH = AUTH;
	$scope.VIEW = VIEW;

	/* controller functions defined below */
	$scope.addContact = function(isValid, contact) {

		contact.firstName = $scope.capitalize(contact.firstName);
		contact.lastName = $scope.capitalize(contact.lastName);

		var name = contact.firstName + ' ' + contact.lastName;

		var details = {
			firstName: contact.firstName,
			lastName: contact.lastName,
			phone: contact.phone,
			email: contact.email
		};

		/* 	in keeping with the KISS philosophy we are using the name field of the content server folder
			to store the name of the contact, and the description field to store the
			details of the contact as a JSON string. */
		FileService.addFolder(API.root, name, JSON.stringify(details))
		.then(function(data) {
			var id = data.data.id;
			// upload photo if any 
			var formData = new FormData();
			var file = document.getElementById('contact-file').files[0];
			if(file) {
				formData.append('file', file);
				formData.append('name', 'photo');
				formData.append('type', 144);
				formData.append('parent_id', data.data.id);

				FileService.uploadFile(id, formData);
			};
			// clear form and return
			$scope.newcontact = {};

			$scope.viewContact(id);

		}, function(error) {
			success.reject(error);
		});

	};
	$scope.capitalize = function(name) {
		name = name.toLowerCase();
		return name.charAt(0).toUpperCase() + name.slice(1);
	};
	$scope.delete = function(fileId, $event) {
		if(window.confirm("Are you sure you want to delete this?")) {
			FileService.delete(fileId)
			.then(function(data) {
				$scope.init();
			});
		};
	};
	$scope.downloadFile = function(fileId) {
		var src = API.endpoint + '?func=ll&objId=' + fileId + '&objAction=download';
		angular.element('#downloader').attr('src', src);
	};
	$scope.goTo = function(view) {
		if(Object.keys($scope.VIEW).indexOf(view) > 0) {
			$scope.currentView = view;
		}
	};
	$scope.init = function() {
		FileService.init();
	};
	$scope.uploadFile = function(isValid, newfile, id) {
		if(isValid) {
			var formData = new FormData();
			var file = document.getElementById('file').files[0];

			formData.append('file', file);
			formData.append('name', newfile.name);
			formData.append('description', newfile.description);
			formData.append('type', 144);
			formData.append('parent_id', id);

			FileService.uploadFile(id, formData).then(function(data) {
				$scope.viewContact(id);
				$scope.newfile = {};
			});
		}
	};
	$scope.viewContact = function(contactId) {
		FileService.getContact(contactId).then(function(contact) {
			$rootScope.$broadcast(DATA.contact, contact);
		});
	};
	$scope.viewFile = function(fileId) {
		FileService.viewFile(fileId).then(function(file) {
			$rootScope.$broadcast(DATA.file, file);
		});
	};

	/* listen for broadcast messages from other controllers */
	$scope.$on(DATA.file, function(event, file) {
		$scope.file = file;
		$scope.goTo(VIEW.viewFile);
	});

	$scope.$on(DATA.contacts, function(event, contacts) {
		$scope.contacts = contacts;
		$scope.goTo(VIEW.viewContacts);
	});

	$scope.$on(DATA.contact, function(event, contact) {
		$scope.contact = contact;
		$scope.goTo(VIEW.viewContact);
	});

});