'use strict';
// paypal restful API
angular.module('app.paypal', []).factory('paypal', function($resource) {
  return $resource('http://movieapp-sitepointdemos.rhcloud.com/api/movies/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    }
  });
});