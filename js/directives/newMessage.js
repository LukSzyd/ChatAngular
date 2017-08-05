"use strict";

chatApp.directive("newMessageDirective", function() {
    return {
        restrict : "EA",
        template : '<div class="newMessage alert alert-success" role="alert">lorem ipsumlorem ipsumlorem ipsumlorem</div>'
    };
});
//wywołane dyrektywy poprzez <new-Message-Directive></new-Message-Directive>

chatApp.directive("chatDirective", function() {//dyrektywa z czatem dla konkretnego uzytkownika
    return {
        restrict : "EA",
        templateUrl : 'chat.html'
    };
});

chatApp.factory('Contacts', function() {
  return [{
    name: 'Fred Locke',
    age: 30,
    location: 'England',
    avatar: 'http://placehold.it/40x40',
    photo: 'http://placehold.it/100x100',
    phone: '555-1111'
  },{
    name: 'Sally Jones',
    age: 26,
    location: 'France',
    avatar: 'http://placehold.it/40x40',
    photo: 'http://placehold.it/100x100',
    phone: '555-2222'
  },{
    name: 'Jill Smith',
    age: 40,
    location: 'Australia',
    avatar: 'http://placehold.it/40x40',
    photo: 'http://placehold.it/100x100',
    phone: '555-3333'
  }];
});

chatApp.directive('contact', function() {
  return {
    restrict: 'E',
    scope: {
      contact: '=ngModel'
    }
  };
});

chatApp.directive('compact', function() {
  return {
    replace: true,
    template: '<ng-include src="\'compact\'"></ng-include>'
  };
});