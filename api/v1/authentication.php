<?php 
$app->post('/putDetails', function() use ($app) {
	$response = array();
    $r = json_decode($app->request->getBody());
	verifyRequiredParams(array('name','phoneNo','city','zipcode','country','address'),$r->customer);
    $db = new DbHandler();
    $name = $r->customer->name;
    $phoneNo = $r->customer->phoneNo;
	$country = $r->customer->country;
	$city = $r->customer->city;
	$zipcode = $r->customer->zipcode;
	$address = $r->customer->address;
	
	$tabble_name = "restaurants";
    $column_names = array( 'name','phoneNo','city','zipcode','country','address');
	
    $isUserExists = $db->getOneRecord("select 1 from restaurants where phoneNo='$phoneNo'");
    if(!$isUserExists){
        $result = $db->insertIntoTable($r->customer, $column_names, $tabble_name);
        if ($result) {
            $response["status"] = "success";
            $response["message"] = "User account created successfully";
            //$response["uid"] = $result;
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to create customer. Please try again";
            echoResponse(201, $response);
        }            
    }else{
			$result = $db->updateTable($r->customer, $column_names, $tabble_name);
			if($result) {
				$response["status"] = "error";
				$response["message"] = "Query Update failed Please try again";
				echoResponse(201, $response);
			} 
			else {
				$response["status"] = "error";
				$response["message"] = "failed Please try again";
				echoResponse(201, $response);
			}
    }
});

$app->post('/putLocationDetails', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	verifyRequiredParams(array('location'),$r->customer);
    $db = new DbHandler();
    $location = $r->customer->location;
	$tabble_name = "restaurants";
    $column_names = array('location');
	  $result = $db->updateTable($r->customer, $column_names, $tabble_name);
			if($result) { 
				$response["status"] = "error";
				$response["message"] = $location;
				echoResponse(201, $response);
			 } 
			else {
				$response["status"] = "error";
				$response["message"] = "failed Please try again";
				echoResponse(201, $response);
			}   
});
$app->post('/saveDelivery', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	verifyRequiredParams(array('zone1','path1','deliveryCharge1'),$r->delivery);
	$db = new DbHandler();
	$zone1 = $r->delivery->zone1;
	$path1 = $r->delivery->path1;
	$deliveryChange1 = $r->delivery->deliveryCharge1;
	$tabble_name = "restaurants";
    $column_names = array('zone1','path1','deliveryCharge1');
		$result = $db->updateTable($r->delivery, $column_names, $tabble_name);
			if($result) { 
				$response["status"] = "error";
				$response["message"] = $location;
				echoResponse(201, $response);
			 } 
			else {
				$response["status"] = "error";
				$response["message"] = "failed Please try again";
				echoResponse(201, $response);
			}   
});

$app->post('/addCategory', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	verifyRequiredParams(array('catName'),$r->category);
    $db = new DbHandler();
    $catName = $r->category->catName;
	$restroID = "1";
	$r->category->restroID = $restroID;
	$tabble_name = "categories";
    $column_names = array('restroID','catName');
	  $result = $db->insertIntoTable($r->category, $column_names, $tabble_name);
			if($result) { 
				$response["status"] = "error";
				$response["message"] = $location;
				echoResponse(201, $response);
			 } 
			else {
				$response["status"] = "error";
				$response["message"] = "failed Please try again";
				echoResponse(201, $response);
			}   
});

$app->get('/categories', function() { 
    $db = new DbHandler();
    $rows = $db->select("categories","*","where restroID=1");
    echoResponse(200, $rows);
});
$app->get('/getMenu', function() { 
    $db = new DbHandler();
    $rows = $db->selectQuery("SELECT * FROM categories JOIN menu ON categories.cat_id = menu.cat_id");
    echoResponse(200, $rows);
});

$app->post('/addMenuItem', function() use ($app) {
    $response = array();
	$r = json_decode($app->request->getBody());
	verifyRequiredParams(array('cat_id','item_name','description'),$r->menuItem);
    $db = new DbHandler();
	$cat_id = $r->menuItem->cat_id;
    $item_name = $r->menuItem->item_name;
	$price = $r->menuItem->price;
	$description = $r->menuItem->description;
	$tabble_name = "menu";
	if($price == '') {
		$sizes = $r->menuItem->sizes;
		$prices = $r->menuItem->prices;
		$column_names = array('cat_id','item_name','price','sizes','prices','description');
	}
	else {
		$column_names = array('cat_id','item_name','price','description');
	}
    
	  $result = $db->insertIntoTable($r->menuItem, $column_names, $tabble_name);
			if($result) { 
				$response["status"] = "success";
				$response["message"] = "jii";
				echoResponse(201, $response);
			 } 
			else {
				$response["status"] = "success";
				$response["message"] = "failed Please try again";
				echoResponse(201, $response);
			}   
});

$app->delete('/deleteMenuItem/:id', function($id) { 
    $db = new DbHandler();
    $rows = $db->delete("menu", array('item_id'=>$id));
    if($rows["status"]=="success")
        $rows["message"] = "Item removed successfully.";
	else
		$rows["message"] = "Query error";
    echoResponse(201, $rows);
});

$app->get('/getRestroDetails', function() { 
    $db = new DbHandler();
    $rows = $db->getOneRecord("select * from restaurants where restro_id='1'");;
    echoResponse(200, $rows);
});

$app->post('/signUp', function() use ($app) {
    $response = array();
    $r = json_decode($app->request->getBody());
    verifyRequiredParams(array('email', 'password'),$r->customer);
    require_once 'passwordHash.php';
    $db = new DbHandler();
    //$phone = $r->customer->phone;
    //$name = $r->customer->name;
    $email = $r->customer->email;
    //$address = $r->customer->address;
    $password = $r->customer->password;
    $isUserExists = $db->getOneRecord("select 1 from customers_auth where email='$email'");
    if(!$isUserExists){
        $r->customer->password = passwordHash::hash($password);
        $tabble_name = "customers_auth";
        $column_names = array( 'email', 'password');
        $result = $db->insertIntoTable($r->customer, $column_names, $tabble_name);
        if ($result != NULL) {
            $response["status"] = "success";
            $response["message"] = "User account created successfully";
            $response["uid"] = $result;
            if (!isset($_SESSION)) {
                session_start();
            }
            $_SESSION['uid'] = $response["uid"];
           // $_SESSION['phone'] = $phone;
           // $_SESSION['name'] = $name;
            $_SESSION['email'] = $email;
            echoResponse(200, $response);
        } else {
            $response["status"] = "error";
            $response["message"] = "Failed to create customer. Please try again";
            echoResponse(201, $response);
        }            
    }else{
        $response["status"] = "error";
        $response["message"] = "An user with the provided phone or email exists!";
        echoResponse(201, $response);
    }
});
$app->get('/logout', function() {
    $db = new DbHandler();
    $session = $db->destroySession();
    $response["status"] = "info";
    $response["message"] = "Logged out successfully";
    echoResponse(200, $response);
});
?>