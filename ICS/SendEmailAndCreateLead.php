<?php

if ($_SERVER['HTTP_HOST'] == 'localhost') {

    require_once 'C:/xampp/htdocs/ExpressPG/emailcontainer/masteremailcontainer.php';

} else {
    require_once ("/home/expressgroup/public_html/emailcontainer/masteremailcontainer.php");
    require_once ("/home/expressgroup/public_html/smscontainer/mastersmscontainer.php");
}


prepareData();

function prepareData()
{
    $Dataarray = array();
    $Dataarray['fullname'] = $_REQUEST['fullname'];
    $Dataarray['postcode'] = $_REQUEST['postcode'];
    $Dataarray['propertyaddress'] = $_REQUEST['address'];
    // $Dataarray['email'] = $_REQUEST['email'];
    $Dataarray['phoneNumber'] = $_REQUEST['mobilenumber'];
    // $Dataarray['ipAddress'] = '';//$_REQUEST['ip_address'];
    // $Dataarray['appointdate'] = $_REQUEST['appointmentDate'];
    // $Dataarray['appointtime'] = $_REQUEST['appointmentTime'];
    // $Dataarray['currentdate'] = $_REQUEST['currentdate'] ;
    // $Dataarray['currentday'] = $_REQUEST['currentday'];
    // $Dataarray['currenthour'] = $_REQUEST['currenthour'];
    // $Dataarray['lead_id'] = $_REQUEST['lead_id'];

    $leadresponse = createLead($Dataarray);
    // $leadresponse = json_decode($leadresponse, true);
    // echo "<pre>";print_r($leadresponse);
    
    if($leadresponse['code'] == 1)
    {
        $emailresponse = sendEmail($Dataarray);

        // $smsresponse = sendsms($Dataarray);

        echo '<script>window.location.href = "http://expresspg.co.uk/expressoffers.today/Thankyou.php";</script>';
        // header("Location: http://expresspg.co.uk/expressoffers.today/Thankyou.php"); 
        // exit();
        // $sendsms = sendsms();
    }
    


}

function createLead($data)
{
    $moduleData=array(

        'first_name' => $data['fullname'],
        'phone_mobile' => $data['phoneNumber'],
        'lead_source' => 'EO_CC',
        'name' => $data['fullname'],
        'primary_address_street' => trim($data['propertyaddress'],' '),
        'primary_address_postalcode' => $data['postcode'],
        'postcode' => $data['postcode'],
        
    
    );

    $action = 'addrecord';
    $module = 'Leads';


    $actions_arry = array();
    $url = "http://6gvt-nynn.accessdomain.com/spcentralengine/sugarcrm/interface/service.php";
    $url .= '?actionsarray=' . $actions_arry . '&' . http_build_query(array('action' => $action, 'module' => $module, 'parameters' => json_encode($moduleData))); //exit;http_build_query($params);

    $response = curlRequest($url);

    return $response;

}

function sendsms($data)
{
    $userDataArray = array(
        'twilioautosms_body' => 'Express Offers - One of our consultants will call you within 1 minute to discuss your free valuation and offer. We will be calling from this number: 0208 049 7814',
        'telephone'          => '07481360691',
            //'telephone' => '+447481360691'
    );

    $SMSSending = \MasterSMSContainer::SendSMS($userDataArray);

    return $SMSSending;

}

function sendEmail($data)
{
    $Body = "Dear Admin,<br><br><b>Full Name</b>: {$data['fullname']}
    <br><b>Address</b>:   {$data['propertyaddress']}
    <br><b>Postcode</b>:           {$data['postcode']}
    <br><b>Telephone</b>:          {$data['phoneNumber']}
   
    
    
    
    
    <br><br>Regards
    <br>Express Estate Agency";
    $Subject = "Express Offers – CC Website Form – {$data['propertyaddress']}, {$data['postcode']}";
    $response = SendEmailUsingMasterMethod($Subject,'info@ExpressOffers.Today','expressofferstoday','mark.brogan@expressestateagency.co.uk',$Body,'info@expressestateagency.co.uk');

}
function curlRequest($url)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    curl_close($ch);
    $response = json_decode($response, true);

    return $response;
}

function SendEmailUsingMasterMethod($Subject, $From, $fromname, $To, $Body, $ReplyTO) {
    $BccList = array(
    //     'mark.brogan@expressestateagency.co.uk',
    //     'safia.anwar@dynamologic.com',
    //    'sultan.ijaz.chaudhary@dynamologic.com',
       'hajra.khan@dynamologic.com',
    );
    // $Body    = \unsubscribe::replaceWithUnsubLink(['email' => $To, 'project' => "RPC feedback", 'subject' => $Subject, 'server_info' => $_SERVER], $Body);

    $objEmailInfo                    = new \EmailInfo();
    $objEmailInfo->_EmailBody        = $Body;
    $objEmailInfo->_EmailSubject     = $Subject;
    $objEmailInfo->_FromEmailAddress = $From;
    $objEmailInfo->_FromName         = $fromname;
    $objEmailInfo->_ToEmailAddress   = $To;
    $objEmailInfo->_ReplyTo          = $ReplyTO;

    $objEmailInfo->AddTester($BccList);

    $EmailSending = \MasterEmailContainer::SendEmail($objEmailInfo);

    return $EmailSending;

}

?>