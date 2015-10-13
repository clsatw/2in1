/*
Table 21-6. The Methods Supported by Resource Objects
Name        Description
$delete()   Deletes the object from the server; equivalent to calling $remove()
$get()      Refreshes the object from the server, clearing any uncommitted local changes
$remove()   Deletes the object from the server; equivalent to calling $delete()
$save()     Saves the object to the server
The $save method is the simplest to work with. Here is how I used it in the updateProduct behavior
*/
'use strict';
angular.module("app.restful", [])
    .constant("dataUrl", "http://localhost:3000/api/prods/")
    .factory("dataFactory", dataFactory);

dataFactory.$inject = ['dataUrl', '$http', '$routeParams'];

function dataFactory(dataUrl, $http) { 

    var factory = {};
    // isArry: true to specifies that the response will be json (from mongodb)    

    factory.get = function() {
        return $http.get(dataUrl);
    }

    factory.delete = function(product) {
        // it is important to pass in product._id
        return $http.delete(dataUrl + product._id);       
    }

    factory.create = function(product) {
       return $http.post(dataUrl, product);
    };

    factory.update = function(product) {
        console.log(product);
       return $http.put(dataUrl+product._id, product);
    }

    return factory;   
};