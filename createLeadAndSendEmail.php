<?php

if ($_SERVER['HTTP_HOST'] == 'localhost') {

    require_once 'C:/xampp/htdocs/ExpressPG/emailcontainer/masteremailcontainer.php';

} else {
    require_once ("/home/expressgroup/public_html/emailcontainer/masteremailcontainer.php");
    require_once ("/home/expressgroup/public_html/smscontainer/mastersmscontainer.php");
}

if(isset($_REQUEST['typeofaction']) && $_REQUEST['typeofaction'] == 'sell_quick_email')
{
    sendEmailSellQuick();
}
else
{
    prepareData();
}


function sendEmailSellQuick()
{
    $Body = "Dear Admin,<br><br><b>Full Name</b>: {$_REQUEST['fullname']}
        <br><b>Address</b>:   {$_REQUEST['propertyaddress']}
        <br><b>Postcode</b>:           {$_REQUEST['postcode']}
        <br><b>Telephone</b>:          {$_REQUEST['phoneNumber']}
       
        
        
        
        
        <br><br>Regards
        <br>Express Estate Agency";
        $Subject = "Sell Quick – CC Website Form – {$_REQUEST['propertyaddress']}, {$_REQUEST['postcode']}";
        $response = SendEmailUsingMasterMethod($Subject,'info@sell-quick.co.uk','sell-quick','mark.brogan@expressestateagency.co.uk',$Body,'info@expressestateagency.co.uk');
    
}

function prepareData()
{
    $Dataarray = array();
    $Dataarray['fullname'] = $_REQUEST['fullname'];
    $Dataarray['postcode'] = $_REQUEST['postcode'];
    $Dataarray['propertyaddress'] = $_REQUEST['propertyaddress'];
    $Dataarray['email'] = $_REQUEST['email'];
    $Dataarray['phoneNumber'] = $_REQUEST['phonenumber'];
    $Dataarray['ipAddress'] = $_REQUEST['ip_address'];
    $Dataarray['appointdate'] = $_REQUEST['appointmentDate'];
    $Dataarray['appointtime'] = $_REQUEST['appointmentTime'];
    $Dataarray['currentdate'] = $_REQUEST['currentdate'] ;
    $Dataarray['currentday'] = $_REQUEST['currentday'];
    $Dataarray['currenthour'] = $_REQUEST['currenthour'];
    $Dataarray['lead_id'] = $_REQUEST['lead_id'];

    $leadresponse = createLead($Dataarray);
    $leadresponse = json_decode($leadresponse, true);
    // echo "<pre>";print_r($leadresponse);
    
    if($leadresponse['code'] == 1)
    {
        $emailresponse = sendEmail($Dataarray);

        $smsresponse = sendsms($Dataarray);

        echo '<script>window.location.href = "https://expressoffers.today/Thankyou.php";</script>';
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
        'lead_source' => 'EO',
        'name' => '',
        'address' => '',
        'postcode' => '',
        'IP' => '',
        'email' => '',
    
    );

    $parameter = array(
        "lead_source" => 'EO Auto-Appointment',
        "id"  => $data['lead_id'] //dynamic Lead ID
    );

    $displayfields=array();


    $url =  "http://6gvt-nynn.accessdomain.com/spcentralengine/sugarcrm/interface/service.php?action=updaterecord&module=Leads";
    $postfields = array('displayfields' => json_encode($displayfields), 'parameters' => json_encode($parameter));
    // $action = 'addrecord';
    // $module = 'Leads';


    // $actions_arry = array();
    // $url = "http://6gvt-nynn.accessdomain.com/spcentralengine/sugarcrm/interface/service.php";
    // $url .= '?actionsarray=' . $actions_arry . '&' . http_build_query(array('action' => $action, 'module' => $module, 'parameters' => json_encode($moduleData))); //exit;http_build_query($params);

    $response = curlRequest($url, $postfields);

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
    <br><b>Property Address</b>:   {$data['propertyaddress']}
    <br><b>Postcode</b>:           {$data['postcode']}
    <br><b>Telephone</b>:          {$data['phoneNumber']}
    <br><b>Email</b>:              {$data['email']}
    <br><b>Appointment Scheduled Date Time</b>:
    {$data['appointdate']} {$data['appointtime']}
    
    <br><b>The IP Address of the customer was</b>:
    {$data['ipAddress']}
    
    <br><br>Regards
    <br>Express Estate Agency";
    $Subject = "Express Offers – Appointment Scheduled – {$data['propertyaddress']}, {$data['postcode']}";
    $response = SendEmailUsingMasterMethod($Subject,'info@expressofferstoday.co.uk','expressofferstoday','mark.brogan@expressestateagency.co.uk',$Body,'info@expressestateagency.co.uk');

}

function curlRequest($url, $postfields)
{
         $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_VERBOSE, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postfields);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($ch);
        curl_close($ch);
        return $response;
}

function SendEmailUsingMasterMethod($Subject, $From, $fromname, $To, $Body, $ReplyTO) {
    $BccList = array(
    //     'mark.brogan@expressestateagency.co.uk',
    //     'safia.anwar@dynamologic.com',
    'dr.khuram.shahzad@dynamologic.com',
       'sultan.ijaz.chaudhary@dynamologic.com',
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