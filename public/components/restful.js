/*
The $resource service doesn’t come bundled with the main Angular script. 
You need to download a separate file called angular-resource.js and include it
in your HTML page.
$resource expects a classic RESTful backend. This means you should have REST endpoints
in the following format:
The result of the function call is a resource class object which has the following five methods by default:
Name        Description
$delete()   Deletes the object from the server; equivalent to calling $remove()
$remove()   Deletes the object from the server; equivalent to calling $delete()
$query()    get all data from backend
$get()      Refreshes the object from the server, clearing any uncommitted local changes
$save()     Saves the object to the server
The $save method is the simplest to work with. Here is how I used it in the updateProduct behavior
*/
'use strict';
angular.module("app.restful", ['ngResource'])
    .constant("dataUrl", '/api/prods/')
    .factory("dataFactory", dataFactory);

dataFactory.$inject = ['dataUrl', '$resource'];

function dataFactory(dataUrl, $resource) { 

    //var factory = {};
    // isArry: true to specifies that the response will be json (from mongodb)  
    /* returns a $resource class representation which can be used to interact with the REST backend.  
       The second argument to $resource() is a hash indicating what should be the value of the parameter :id
       in the URL. Setting it to @_id means whenever we will call methods like $update() and $delete()
       on the resource instance, the value of :id will be set to the _id property of the instance.
       This is useful for PUT and DELETE requests. Also note the third argument.
       This is a hash that allows us to add any custom methods to the resource class.
       If the method issues a non-GET request it’s made available to the $resource instance with a $ prefix.
       e.g., datFactory.$update(function(){}).
    */
    return $resource(dataUrl + ':id', {id: '@_id'}, {
        update: {method: 'PUT'}
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