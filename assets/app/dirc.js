
function commenterDirective($timeout) {
  return {
    restrict:'E',
    templateUrl: 'views/commenter.html',
    link: function(scope, elm, attr) {
      var action, timeout;
      scope.toggled = scope.$eval(attr.toggle) || false;
      scope.btnText = 'add comment';

      scope.toggle = function() {
        scope.toggled = !scope.toggled;
        scope.btnText = (scope.toggled) ? 'add comment' : 'close';
        scope.child = {};
      };

      attr.$observe('action', function(value) {
        action = scope.$eval(value);
      });//wait for compilation ending. cuz we use templateUrl(async directive)

      scope.action = function(val) {
        action(val);
        scope.toggle();
      };
    }//end linkFn
  }
}
