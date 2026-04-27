<?php 
    ini_set('display_errors', 0);
    error_reporting(0);
    
    cors();


    if ($_SERVER['REQUEST_METHOD'] === 'POST') {


        $data = getRequestBodyData();

        try{ 
            if (!isFormComplete($data)) {
                send_response([
                    'status' => 'failed',
                    'message' => 'A complete form must be submitted!',
                ], 400);
            }

            $emailto = 'creativekhiem@gmail.com';
            $toname = 'CreativeKhiem';
            $emailfrom = 'jcvonrosen@jvrenterprises.com';
            $fromname = 'John von Rosen';
            $subject = $data['subject'];
            $messagebody = $data['message'];
            
            $headers = 
                'Return-Path: ' . $emailfrom . "\r\n" . 
                'From: ' . $fromname . ' <' . $emailfrom . '>' . "\r\n" . 
                'X-Priority: 3' . "\r\n" . 
                'X-Mailer: PHP ' . phpversion() .  "\r\n" . 
                'Reply-To: ' . getUserFullName($data) . ' <' . $data['email'] . '>' . "\r\n" .
                'MIME-Version: 1.0' . "\r\n" . 
                'Content-Transfer-Encoding: 8bit' . "\r\n" . 
                'Content-Type: text/plain; charset=UTF-8' . "\r\n";
            $params = '-f ' . $emailfrom;

            $isMailSent = mail($emailto, $subject, $messagebody, $headers, $params);

            if (!$isMailSent) {
                send_response([
                    'status' => 'failed',
                    'message' => 'Mail server unavailable. Try again or contact us directly.',
                ], 503);
            }
            else{
                send_response([
                    'status' => 'success',
                    'message' => 'Form has successfully been sent!',
                ]);
            }
        }
        catch(Exception $e){
            send_response([
                'status' => 'server-error',
                'message' => 'There has bee an internal server error, please try and submit the form, again. The error: ' .$e->getMessage(),
            ], 500);
        }
    }

    function send_response($response, $code = 200){
        http_response_code($code);
        die(json_encode($response));
    }

    function isFormComplete($data){
        return isFormNameComplete($data) && isFormContactInfoComplete($data) && isFormMessageComplete($data);
    }

    function isFormNameComplete($data){
        return !empty($data['firstName']) && !empty($data['lastName']);
    }

    function isFormContactInfoComplete($data){
        return !empty($data['email']);
    }

    function isFormMessageComplete($data){
        return !empty($data['subject']) && !empty($data['message']);
    }

    function getUserFullName($data){
        return $data['firstName'] . " " . $data['lastName'];
    }

    function getRequestBodyData(){
        $json = file_get_contents('php://input');
        return json_decode($json, true);
    }

    function previewHeaders(){
        $headers = getallheaders();

        if(!empty($headers)){
            foreach ($headers as $name => $value) {
                echo "$name: $value\n";
            }
        }

    }

    function previewData(){
        $data = getRequestBodyData();
        if(!empty($data)){
            foreach ($data as $name => $value) {
                echo "$name: $value\n";
            }
        }
    }


    function cors() {
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Max-Age: 86400');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit(0);
        }
    }
?>