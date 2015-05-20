app.directive('focus', function() {
    return function(scope, element) {
        element[0].focus();
    }      
});
app.directive('checkBox', function() {
	 return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).checkboxpicker(scope.$eval(attrs.chcekBox));
        }
    };

});
app.directive('selectDays', function() {
	 return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).labelauty(scope.$eval(attrs.selectDays));
        }
    };

});

app.directive('passwordMatch', [function () {
    return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs,control) {
            var checker = function () {
 
                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel); 
 
                //get the value of the other password  
                var e2 = scope.$eval(attrs.passwordMatch);
                if(e2!=null)
                return e1 == e2;
            };
            scope.$watch(checker, function (n) {
 
                //set the form control to valid if both 
                //passwords are the same, else invalid
                control.$setValidity("passwordNoMatch", n);
            });
        }
    };
}]);
