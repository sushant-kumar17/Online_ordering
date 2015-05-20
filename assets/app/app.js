'use strict';
var app = angular.module('myApp', ['ngRoute', 'ngAnimate', 'toaster','leaflet-directive']);

app.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/login', {
            title: 'Login',
            templateUrl: 'partials/login.html',
            controller: 'authCtrl'
        })
            .when('/signup', {
                title: 'Signup',
                templateUrl: 'partials/signup.html',
                controller: 'authCtrl'
            })
            .when('/dashboard', {
                title: 'Dashboard',
                templateUrl: 'partials/restro_details.html',
                controller: 'mapAddressController'
            })
			.when('/services', {
                title: 'Services',
                templateUrl: 'partials/pickup.html',
                controller: 'servicesController'
            })
			.when('/services/pickup', {
                title: 'Pickup',
                templateUrl: 'partials/pickup.html',
                controller: 'servicesController'
            })
			.when('/services/delivery-zone', {
                title: 'Delivery Zone',
                templateUrl: 'partials/services.html',
                controller: 'mapAddressController'
            })
			.when('/service-tax', {
                title: 'Service Tax',
                templateUrl: 'partials/service-tax.html',
                controller: 'mapAddressController'
            })
			.when('/order-notification', {
                title: 'Order Notification',
                templateUrl: 'partials/login.html',
                controller: 'servicesController'
            })
			.when('/menu-setup', {
                title: 'Set up Menu',
                templateUrl: 'partials/menu-setup.html',
                controller: 'menuSetupController'
            })
			.when('/publish', {
                title: 'Publish on Website',
                templateUrl: 'partials/login.html',
                controller: 'servicesController'
            })
            .when('/', {
                title: 'Login',
                templateUrl: 'partials/restro_details.html',
                controller: 'mapAddressController',
                role: '0'
            })
            .otherwise({
                redirectTo: '/'
            });
  }])
    .run(function ($rootScope, $location, Data) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.authenticated = false;
            Data.get('session').then(function (results) {
                if (results.uid) {
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.uid;
                    $rootScope.name = results.name;
                    $rootScope.email = results.email;
                } else {
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login') {

                    } else {
                        $location.path("/login");
                    }
                }
            });
        });
    });

app.controller('mapAddressController',[ '$scope','$routeParams','$rootScope','$http','Data', function($scope,$rootScope,$routeParams,$http,Data) {
		// Get all the details of the User		
		$scope.tab = 1;			// Initialize the tab	
		$scope.selectTab = function(item) {
			$scope.tab = item;
		};
		// On select the class will be changed to active
		$scope.isSelected = function(checkTab) {
			return $scope.tab == checkTab;
		};
		
			angular.extend($scope, {
                location: {
                    lat: 22.49585431,
                    lng: 88.34660321,
                    zoom: 14
                },
                markers: {
					m1: {
                        lat: 22.495,
                        lng: 88.346,
                        focus: true,
                        draggable: true,
                        message: "Drag it to your exact location!",
                        icon: {
							iconUrl: 'assets/js/images/marker-icon.png',
							shadowUrl: 'assets/js/images/marker-shadow.png',
						}
					}
                },
				layers: {
                    baselayers: {
                        googleRoadmap: {
                            name: 'Google Streets',
                            layerType: 'ROADMAP',
                            type: 'google'
                        }
                    }
                }
            });
			
		$scope.details = {}; 	// Just for initialization 
		//$scope.details = {name:'',phoneNO:'',country:'',city:'',zipcode:'',address:''};
		$scope.putLocationDetails = {};
		$scope.putLocationDetails = { location:'' };
		Data.get('getRestroDetails').then(function(data){
			$scope.details = data;
		});
 
		// POSTing the data to the php
		$scope.putDetails = function(customer,setTab,routeInfo) {
			Data.post( routeInfo, {
				customer: customer
			}).then(function (results) {
				Data.toast(results);
				if (results.status) {
					$scope.tab = setTab;  // Going to the next tab on click 
				}
			});
		};

			// $watch for the values like markers.m1.lat & lng
			$scope.$watch(function() {
				$scope.putLocationDetails.location = $scope.markers.m1.lat + "," + $scope.markers.m1.lng;
				$scope.MarkerLocation = $scope.markers.m1.lat + "," + $scope.markers.m1.lng;
			});
}]);
/* Delivery Zone controller */

app.controller('servicesController', [ '$scope','leafletData','$routeParams','$rootScope','$http','Data', function($scope,leafletData,$rootScope,$routeParams,$http,Data) {
	$scope.tab = 3;			// Initialize the tab	
	$scope.selectTab = function(item) {
		$scope.tab = item;
	};
	// On select the class will be changed to active
	$scope.isSelected = function(checkTab) {
		return $scope.tab == checkTab;
	};
	$scope.restroDetails =  {};
      angular.extend($scope, {
             location: {
                    lat: 22.49585431,
                    lng: 88.34660321,
                    zoom: 16
                },
			  markers: {
					m1: {
                        lat: 22.49585431,
                        lng: 88.34660321,
                        focus: true,
                        draggable: false,
						message: 'Choose your delivery region',
                        icon: {
							iconUrl: 'assets/js/images/marker-icon.png',
							shadowUrl: 'assets/js/images/marker-shadow.png',
						}
					}
                },
                controls: {
                    draw: {
						polyline: {
							fillColor: '#ff00ff'
						},
						polygon: {
							fillColor: '#ff00ff'
						},
						circle: {
							shapeOptions: {
								color: '#ff00f1'
							}
						}
					}
                },
				layers: {
                    baselayers: {
                        googleRoadmap: {
                            name: 'Google Streets',
                            layerType: 'ROADMAP',
                            type: 'google'
                        }
                    }
                },
				geojson: { },
				paths: {
					circle: {}
				},
        });
		
	$scope.addDeliveryZone = function() {
			$scope.reloadZone = true;
			//$scope.chooseShape('CIRCLE');
			//var appendZoneForm = '<form class="form-contro"><div class="zones-layout"><div class="inputbox inline"><input type="radio" class="inline-input" data-labelauty="Circle" ng-click="chooseShape(\'CIRCLE\')" name="delivery-shape" value="CIRCLE" ng-model="shapes" select-days><input type="radio" class="inline-input" data-labelauty="Polygon" ng-click="chooseShape(\'POLYGON\')" name="delivery-shape" value="POLYGON" ng-model="shapes" checked select-days></div><div class="inputbox"><input type="text" class="form-control" placeholder="Delivery Fee"></div><div class="inputbox"><input type="text" class="form-control" placeholder="Min Amout"></div><div class="inputbox inline"><div> <button class="btn btn-complete"> Cancel </button> </div><div> <button class="btn btn-complete btn-success"> Save </button> </div></div></div></form>';
			 //jQuery("#appendZones").toggle(appendZoneForm);
			 jQuery("#addDeliveryZone").hide();
			 jQuery("#cancelDelivery").on('click',function() {
				$scope.reloadZone = false;
			});
		};
		
	$scope.circle = "";
	$scope.MSG = "";
	$scope.delivery = {};
	$scope.delivery = {zone1:'',path1:'',deliveryCharge1:''};
			
	Data.get('getRestroDetails').then(function(data){
				$scope.restroDetails = data;
		}).finally(function(){
			console.log("undr"+ $scope.restroDetails.location.split(',')[0]);
		});	
		$scope.$watch("restroDetails",function(){
			angular.extend($scope, {
				location: { 
					lat: parseFloat($scope.restroDetails.location.split(',')[0]),
					lng: parseFloat($scope.restroDetails.location.split(',')[1]),
					zoom: 14
				},
				 markers: {
					m1: {
                        lat: parseFloat($scope.restroDetails.location.split(',')[0]),
						lng: parseFloat($scope.restroDetails.location.split(',')[1]),
                        focus: true,
                        draggable: false,
						message: 'Choose your delivery region',
                        icon: {
							iconUrl: 'assets/js/images/marker-icon.png',
							shadowUrl: 'assets/js/images/marker-shadow.png',
						}
					}
                }
			});
			if($scope.restroDetails.zone1 == "POLYGON") {
					$scope.geojson = {
						data: JSON.parse($scope.restroDetails.path1),
						style: {
							weight: 2,
							fillColor: '#ff69b4'
						}
					};
				}
				else if($scope.restroDetails.zone1 == "CIRCLE") {
					$scope.paths = {
					   circle: {
							type: 'circle',
							radius: parseFloat($scope.restroDetails.path1),
							color: '#00ff17', opacity:0.3 , weight:3,
							clickable: true,
							draggable: true,
							latlngs: { lat: parseFloat($scope.restroDetails.location.split(',')[0]) , lng: parseFloat($scope.restroDetails.location.split(',')[1]) }
						}
					};
				}
		});
		
	
	$scope.chooseShape = function(shape) {
	  $scope.shapeArray = "";
	  $scope.shapeShow = shape;
	  $scope.$watch(function(){ 
		$scope.delivery.zone1 = shape;
	  });
	  
		leafletData.getMap().then(function(map) {
            var drawnItems = $scope.controls.edit.featureGroup;
				if( $scope.shapeShow == 'CIRCLE') {
						if($scope.MSG == "polygon") {
							drawnItems.removeLayer($scope.polygonLayer);
							$scope.polygon.disable();
						}
						$scope.radiusCircle = function(radii) {
							if(radii < 1000) {
								return radii.toFixed(2) +" m";
							}
							else {
								return (radii / 1000).toFixed(2) + " km";
							}
						};
						if($scope.MSG != "circle") {
							$scope.circle = new L.circle([$scope.restroDetails.location.split(',')[0],$scope.restroDetails.location.split(',')[1]], 500, {color: '#00ff17', opacity:0.3 });
							drawnItems.addLayer($scope.circle);
							$scope.shapeArray = $scope.circle.getRadius();
									$scope.$watch(function(){
										$scope.delivery.path1 = $scope.circle.getRadius().toFixed(2);
									});
							
							$scope.circle.bindPopup("Radius: " + $scope.radiusCircle($scope.circle.getRadius())).openPopup();
							$scope.circle.editing.enable();
							$scope.circle.on('edit',function(e) {
								console.log("edited");
								console.log($scope.circle.getRadius().toFixed(2));
								//$scope.circle.bindPopup("Hello").openPopup();
								$scope.shapeArray = "";
								$scope.shapeArray = $scope.circle.getRadius().toFixed(2);
								$scope.MSG = "circle";
							});
							$scope.circle.on('editstart',function(e) {
								$scope.circle.bindPopup("").openPopup();
								$scope.$watch(function() {
									$scope.circle.bindPopup("Radius: " + $scope.radiusCircle($scope.circle.getRadius()));
								});
							});
							$scope.circle.on('editstop',function(e) {
									$scope.circle.bindPopup("Radius: " + $scope.radiusCircle($scope.circle.getRadius())).openPopup();
							});
							$scope.MSG = "circle";
							
							$scope.$watch(function(){
								$scope.delivery.path1 = $scope.circle.getRadius().toFixed(2);
							});
						}
					}
				else if( $scope.shapeShow =='POLYGON') {
					if($scope.MSG == "circle") {
						$scope.MSG = "Going into this scope";
						drawnItems.removeLayer($scope.circle);
					}
					
					$scope.polygon = new L.Draw.Polygon(map, $scope.draw);
					$scope.polygon.enable();
					$scope.MSG = "polygon";

					map.on('draw:created', function (e) {
						$scope.polygonLayer = e.layer;
						drawnItems.addLayer($scope.polygonLayer);
						$scope.shapeArray = "";
						$scope.shapeArray = JSON.stringify($scope.polygonLayer.toGeoJSON());
							$scope.$watch(function(){
										$scope.delivery.path1 = $scope.shapeArray;
							});
						console.log(JSON.stringify($scope.polygonLayer.toGeoJSON()));
							if($scope.polygon.enable()) 
								$scope.polygon.disable();
						$scope.MSG = "polygon";
					  });
					 
					$scope.$watch(function(){
						$scope.delivery.path1 = $scope.shapeArray ; 
						$scope.pathJSON = $scope.shapeArray;
					});
				}
           });
		   
		   $scope.delivery = {}; 	// Just for initialization 
		   $scope.delivery = {zone1:'',path1:'',deliveryCharge1:''};
		   $scope.saveDelivery = function(delivery,routeInfo) {
				Data.post( routeInfo, {
					delivery: delivery
				}).then(function (results) {
					Data.toast(results);
					if (results.status == "success") {
						$scope.tab = setTab;  // Going to the next tab on click 
					}
				});
		   };
	return ; 
  };
  $scope.colorArray = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
  $scope.addNewCircle = function() {
	prevCircle = $scope.circles[$scope.circles.length-1];
	idno =  prevCircle.id + 1;
	circleRadii = prevCircle.radius + 100;
	circleZindex = prevCircle.zIndex - 2;
	color = $scope.colorArray[ Math.floor(Math.random() * $scope.colorArray.length)];
	simpleCircle = {
                id: idno ,
                center: $scope.marker.coords,
                radius: circleRadii,
                stroke: {
                    color: color,
                    weight: 2,
                    opacity: 1
                },
                fill: {
                    color: color,
                    opacity: 0.2
                },
                geodesic: true, // optional: defaults to false
                draggable: true, // optional: defaults to false
                clickable: true, // optional: defaults to true
                editable: true, // optional: defaults to false
                visible: true, // optional: defaults to true
                control: {},
				zIndex:-11
            };
	$scope.circles.push(simpleCircle);
  };
  $scope.isShape = function(shape) {
	return $scope.shapeShow == shape;
};

}]);

app.controller('menuSetupController',function($scope,$rootScope,$routeParams,$http,Data) {
	$scope.categories = []; // Get the list of categories
	Data.get('categories').then(function(data){
        $scope.categories = data.data;
		
    });
	
	$scope.menuItems = [];  // Get the list of Menu Items
	Data.get('getMenu').then(function(data){
        $scope.menuItems = data.data;
		$scope.categoryFilter = { 'cat_id': $scope.menuItems[0].cat_id }; // Apply filter on the menu items | Select the first category
    });
	
	$scope.chooseCategory = function(catId) {
		$scope.categoryFilter = { 'cat_id': catId };
	};
	$scope.isCategoryFilter = function(index) {
		return $scope.categoryFilter.cat_id == index;
	};
	// Adding the dynamic input text sizes
	$scope.NumberOfExtras = [];	
	$scope.number = 0;
	$scope.addExtras = function() {
		$scope.number++;
		$scope.NumberOfExtras.push($scope.number);
	};
	
	// Storing the extras
	$scope.sizes = [];
	$scope.sizesData = "";
	$scope.$watch('sizes', function (value) {
        $scope.sizesData = $scope.sizes.join(",");
		console.log($scope.sizesData);
    }, true);
	
	$scope.prices = [];
	$scope.pricesData = "";
	$scope.$watch('prices', function (value) {
        $scope.pricesData = $scope.prices.join(",");
		console.log($scope.pricesData);
    }, true);
    
	$scope.checkPr = function() {
		if($scope.number == 0)
			return true;
		else
			return false;
	};
	
	$scope.delExtras = function(position) {
		$scope.number--;
		$scope.NumberOfExtras.pop(position);
		  console.log(position);
		$scope.sizes.splice(position,1);
		$scope.prices.splice(position,1);
	};
	
	$scope.addItem = function(index,data,routeInfo) {
		data.cat_id = $scope.categoryFilter.cat_id;
		if($scope.number > 0) {
			data.sizes = $scope.sizesData;
			data.prices = $scope.pricesData;
			data.price = "";
		}
		$scope.menuItems.push({ 
			cat_id: data.cat_id,
            item_name: data.item_name,
			price: data.price,
            description: data.description
          });
		  
		Data.post( routeInfo, {
				menuItem: data
			}).then(function (results) {
				console.log(results);
				Data.toast(results);
					if (results.status == "success") {
						$scope.sizes = [];
						$scope.prices = [];
						$scope.NumberOfExtras = [];
						//$scope.tab = setTab;  // Going to the next tab on click 
					}
			});
		$scope.hideForm();
	};
	
	/* $scope.editForm = [];
	$scope.editForm = false;
	$scope.showEditForm = function(index){
		$scope.editForm[index] = true;
	};
	$scope.hideEditForm = function(index) {
		$scope.editForm[index] = false;
	};
	$scope.isEditForm = function() {
		return $scope.editForm ;
	}; */
	
	
	$scope.displayForm = false;
	$scope.showForm = function(index){
		$scope.displayForm = true;
	};
	$scope.hideForm = function(index) {
		$scope.displayForm = false;
	};
	$scope.isDisplayForm = function() {
		return $scope.displayForm ;
	};
	
	$scope.editItem = function(index,childIndex,data) {
		$scope.comments[index].children[childIndex] = { 
            name: data.name,
			price: data.price,
            text: data.description
          };
		$scope.hideForm();
	};
	
	$scope.removeItem = function(c,index) {
		if(confirm("Are you sure to remove the product"+c)){
            Data.delete("deleteMenuItem/"+c).then(function(result){
				if(result.status == "success") {
					console.log("Deleted");
				}
                //$scope.products = _.without($scope.products, _.findWhere($scope.products, {id:product.id}));
            });
			for(var i = 0; i < $scope.menuItems.length; i++) {
				if($scope.menuItems[i].item_id == c) {
					$scope.menuItems.splice(i, 1);
					break;
				}
			}
        }
	};
	
	$scope.category = {};
	$scope.category = { catName: '', restroID: ''};
	
	$scope.addCategory = function(category,routeInfo) {
		  $scope.categories.push({ 
            catName: category.catName,
          });
			Data.post( routeInfo, {
				category: category
			}).then(function (results) {
				Data.toast(results);
				if (results.status == "success") { 
					$scope.category.catName = ""; // Going to the next tab on click 
				}
			});
	};
	
});
   
 // Sidebar controller for active classes 
 app.controller("sidebarController",function($scope,$location) {
	$scope.isActive = function(route) {
		return route === $location.path();
	}
});