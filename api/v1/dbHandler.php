<?php
require_once "dbConnect.php";
class DbHandler {

    private $db;
    private $err;
    function __construct() {
        $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8';
        try {
            $this->db = new PDO($dsn, DB_USERNAME, DB_PASSWORD, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        } catch (PDOException $e) {
            $response["status"] = "error";
            $response["message"] = 'Connection failed: ' . $e->getMessage();
            $response["data"] = null;
            //echoResponse(200, $response);
            exit;
        }
    }
    /**
     * Fetching single record
     */
    public function getOneRecord($query) {
        $r = $this->db->query($query.' LIMIT 1') or die($this->db->error.__LINE__);
		$result = $r->fetch(PDO::FETCH_ASSOC);
        return $result;    
    }
	
	public function select($table, $columns, $where){
        try{
            $a = array();
            $w = "";
           // $stmt = $this->db->prepare("select ".$columns." from ".$table." where 1=1 ". $w);
		   $stmt = $this->db->prepare("select ".$columns." from ".$table." ".$where);
            $stmt->execute($a);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if(count($rows)<=0){
                $response["status"] = "warning";
                $response["message"] = "No data found.";
            }else{
                $response["status"] = "success";
                $response["message"] = "Data selected from database";
            }
                $response["data"] = $rows;
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ';
            $response["data"] = null;
        }
        return $response;
    }
	public function selectQuery($query){
        try{
            $a = array();
            $w = "";
           // $stmt = $this->db->prepare("select ".$columns." from ".$table." where 1=1 ". $w);
		   $stmt = $this->db->prepare($query);
            $stmt->execute($a);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if(count($rows)<=0){
                $response["status"] = "warning";
                $response["message"] = "No data found.";
            }else{
                $response["status"] = "success";
                $response["message"] = "Data selected from database";
            }
                $response["data"] = $rows;
        }catch(PDOException $e){
            $response["status"] = "error";
            $response["message"] = 'Select Failed: ';
            $response["data"] = null;
        }
        return $response;
    }
    /**
     * Creating new record
     */
    public function insertIntoTable($obj, $column_names, $table_name) { 
        $c = (array) $obj;
        $keys = array_keys($c);
        $columns = '';
        $values = '';
        foreach($column_names as $desired_key){ // Check the obj received. If blank insert blank into the array.
           if(!in_array($desired_key, $keys)) {
                $$desired_key = '';
            }else{
                $$desired_key = $c[$desired_key];
            }
            $columns = $columns.$desired_key.',';
            $values = $values."'".$$desired_key."',";
        }
        $query = "INSERT INTO ".$table_name."(".trim($columns,',').") VALUES(".trim($values,',').")";
        $r = $this->db->query($query);
    }
	public function updateTable($obj, $column_names, $table_name) {
        
        $c = (array) $obj;
        $keys = array_keys($c);
        $columns = '';
        $values = '';
		$updateval = '';
        foreach($column_names as $desired_key){ // Check the obj received. If blank insert blank into the array.
           if(!in_array($desired_key, $keys)) {
                $$desired_key = '';
            }else{
                $$desired_key = $c[$desired_key];
            }
            //$columns = $columns.$desired_key.',';
            //$values = $values."'".$$desired_key."',";
			$updateval = $updateval.$desired_key. "= '" . $$desired_key . "',";
        }
        $query = "UPDATE ".$table_name." SET ".trim($updateval,','). " WHERE restro_id=1";
        $r = $this->db->query($query) or die($this->db->error.__LINE__);
    }
	function delete($table, $where){
        if(count($where)<=0){
            $response["status"] = "warning";
            $response["message"] = "Delete Failed: At least one condition is required";
        }else{
            try{
                $a = array();
                $w = "";
                foreach ($where as $key => $value) {
                    $w .= " and " .$key. " = :".$key;
                    $a[":".$key] = $value;
                }
                $stmt =  $this->db->prepare("DELETE FROM $table WHERE 1=1 ".$w);
                $stmt->execute($a);
                $affected_rows = $stmt->rowCount();
                if($affected_rows<=0){
                    $response["status"] = "warning";
                    $response["message"] = "No row deleted";
                }else{
                    $response["status"] = "success";
                    $response["message"] = $affected_rows." row(s) deleted from database";
                }
            }catch(PDOException $e){
                $response["status"] = "error";
                $response["message"] = 'Delete Failed: ' .$e->getMessage();
            }
        }
        return $response;
    }
}

?>
