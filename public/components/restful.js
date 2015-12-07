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
angular.module("app.restful", ['ngResource'])
    .constant("dataUrl", "http://localhost:5000/api/prods/")
    .factory("dataFactory", dataFactory);

dataFactory.$inject = ['dataUrl', '$resource'];

function dataFactory(dataUrl, $resource) { 

    //var factory = {};
    // isArry: true to specifies that the response will be json (from mongodb)    
    return $resource(dataUrl + ':id', {}, {
        update: { method: 'PUT'}
    });
/*
    factory.get = function() {
        return $http.get(dataUrl);
    }

    factory.find = function(id) {
        return $http.get(dataUrl + id);   
    }

    factory.delete = function(product) {
        // it is important to pass in product._id
        return $http.delete(dataUrl + product._id);       
    }

    factory.create = function (product) {
        return $http.post(dataUrl, product);
    }

    factory.update = function (product) {
        console.log(product);
        return $http.put(dataUrl + product._id, product);
    };
    return factory;
*/    
}