<!DOCTYPE html>
<html lang="en" ng-app="myApp">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Restaurant Admin Panel</title>
<!-- Bootstrap -->
<link href="assets/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="assets/css/angular-material.min.css">
<link href="assets/css/icomoon.css" rel="stylesheet">
<link href="assets/css/custom.css" rel="stylesheet">

<link href="assets/css/toaster.css" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style_main.css" type="text/css" />

<link rel="stylesheet" href="assets/css/leaflet.css" type="text/css" />
<link rel="stylesheet" href="assets/css/leaflet.draw.css" type="text/css" />
<!-- <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'> -->
<style>
		 .navbar-inverse { background:#383957; }
		 .sidebar { background:#383957;  }
		.sidebar ul li {  border-bottom: 0; color:#A4A4C0; }
		.sidebar ul li a { color: #A4A8BD; font-weight:600;}
		.sidebar ul li a:hover, .sidebar ul li a:focus, .sidebar ul li.active a:hover { background:#424A6B;  color:#d2d1d1; }
		.sidebar ul li.active a, .sidebar ul li.active a:focus {
			background:#424A6B;
			border-left-color:#D9000E;
			color:#fff;
		}
		.panel { border:0; }
		.box-content .panel-title { background:#383957; color:#fff; }
		.top-head ul li.active a { 
			color:#fff; background: #383957; 
			border-bottom: 3px solid #100d41; 
			}
		.arrow { 	border-color:#100d41 transparent transparent transparent;  }
		.inputbox .btn-next { background:transparent; border:2px solid #fff; } 
		.inputbox .btn-next.disabled { background:transparent; opacity:0.5; }
</style>
                <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
                <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
                <!--[if lt IE 9]><link href= "css/bootstrap-theme.css"rel= "stylesheet" >

<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->
</head>

  <body ng-cloak="">
  <header>
    <nav class="navbar navbar-inverse" role="navigation">
	  <div class="container-fluid">
		<!-- Brand and toggle get grouped for better mobile display -->
		<div class="navbar-header">
		  <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
			<span class="sr-only">Toggle navigation</span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
		  </button>
		  <a class="navbar-brand" href="#"><img src="assets/img/logo.png"></a>
		</div>
   </nav>
   <nav class="nav navbar navbar-default nav-head" role="navigation">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#"> <span class="icon-place"> <i aria-hidden="true" class="icon-rocket"></i></span> Hudson's Cafe - Cafetaria</a>
    </div>
	<ul class="nav navbar-nav head-icon pull-right">
		<li class="new-order"><a href="#" class="btn-green"> New Orders <span>2</span></a> </li>
		<li> <a href="#"><span class="icon-place"> <i aria-hidden="true" class="icon-bell"></i></span> </a> </li>
	</ul>
   </div>
</nav>
</header>
	<div class="row">
		<div class="col-md-3 sidebar" ng-controller="sidebarController">
			<ul class="nav nav-pills nav-stacked">
				 <li ng-class="{ active:isActive('/') }"><a href="#/"><span class="icon-place"> <i aria-hidden="true" class="icon-location"></i></span> Location Details </a></li>
				 <li ng-class="{ active:isActive('/services') || isActive('/services/delivery-zone')}"><a href="#/services"><span class="icon-place"> <i aria-hidden="true" class="icon-history-2"></i></span> Services and Opening Hours </a></li>
				 <li ng-class="{ active:isActive('/service-tax') }"><a href="#/service-tax"><span class="icon-place"> <i aria-hidden="true" class="icon-share-2"></i></span> Service Tax Details </a></li>
				 <li ng-class="{ active:isActive('/order-notification') }"><a href="#/order-notification"><span class="icon-place"> <i aria-hidden="true" class="icon-bell"></i></span> Order Notification </a></li>
				 <li ng-class="{ active:isActive('/menu-setup') }"><a href="#/menu-setup"><span class="icon-place"> <i aria-hidden="true" class="icon-book"></i></span> Set up Menu </a></li>
				 <li ng-class="{ active:isActive('/publish') }"><a href="#"><span class="icon-place"> <i aria-hidden="true" class="icon-upload-4"></i></span> Publish it on </a></li>
				 <li ng-class="{ active:isActive('/customer-details') }"><a href="#"><span class="icon-place"> <i aria-hidden="true" class="icon-chart"></i></span> Customer Details </a></li>
				 <li ng-class="{ active:isActive('/loyalty') }"><a href="#"><span class="icon-place"> <i aria-hidden="true" class="icon-gift"></i></span> Loyalty (Coupon Code) </a></li>
				 <li ng-class="{ active:isActive('/settings') }"><a href="#"><span class="icon-place"> <i aria-hidden="true" class="icon-settings"></i></span> Advanced Settings </a></li>
				 <li></li>
			</ul>
		</div>
		<div class="col-md-9 box-wrapper center">
			<div ng-view="" id="ng-view" class="slide-animation"></div>
		</div>
	</div>

 </body>
  <toaster-container toaster-options="{'time-out': 3000}"></toaster-container>
  <!-- Libs -->

   <script src="assets/js/angular.min.js"></script>
  <!--<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.1.1/angular.min.js" ></script>  -->
  <script src="assets/js/angular-route.min.js"></script>
  <script src="assets/js/angular-animate.min.js" ></script>
  <script src="assets/js/angular-sanitize.min.js"></script>
  <script src="assets/js/toaster.js"></script>
  
    <script src="assets/js/jquery-1.8.3.min.js"></script>
  <script src="assets/js/bootstrap.min.js"></script>
  <script src="assets/js/moment.min.js"></script>
  
  <script src="assets/js/ui-comments-0.1.3-SNAPSHOT.js"></script>
  <script src="assets/app/dirc.js"></script>
  <script src="assets/app/app.js"></script>
  <script src="assets/app/data.js"></script>
  <script src="assets/app/directives.js"></script>
  <script src="assets/app/authCtrl.js"></script>
  
  <!--<script src = "https://maps.googleapis.com/maps/api/js?sensor=false"></script> -->
  <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places,geometry,visualization,drawing"></script>
  <script src='assets/js/leaflet.js'></script>
    <script src='assets/js/google.js'></script>
  <script src='assets/js/angular-leaflet-directive.min.js'></script>
  <script src='assets/js/leaflet.draw.js'></script>
  
  <script src="assets/js/checkbox.js"></script> <!--for the checkbox --->
  <script src="assets/js/labelauty.js"></script>
  <script>

	</script>
</html>