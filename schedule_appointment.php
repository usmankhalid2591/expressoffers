<?php

if(isset($_REQUEST['postcodeanywhere']) && $_REQUEST['postcodeanywhere'] == 1)
{
    echo json_encode(getAddresses());exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo '<script>window.location.href = "https://expressoffers.today/";</script>';
}
if ($_SERVER['HTTP_HOST'] == 'localhost') {

    require_once 'C:/xampp/htdocs/ExpressPG/emailcontainer/masteremailcontainer.php';

} else {
    require_once ("/home/expressgroup/public_html/emailcontainer/masteremailcontainer.php");
    require_once ("/home/expressgroup/public_html/smscontainer/mastersmscontainer.php");
}

    
    $leadId = prepareData();
    addDataToDbForLogs();

    

    function getAddresses() {
        $postcode = $_REQUEST['postcode'];
        $PostCodeAnyWhereURL = "http://6gvt-nynn.accessdomain.com/postcodeanywhere/service.php";

        $postData               = [];
        $postData['postcode']   = str_replace(' ', '', $postcode);
        $postData['methodname'] = 'get_records';
         $postData['check_test'] = 'estimation';
        $response               = postViaCurl($PostCodeAnyWhereURL, $postData);

        

        $responseArray           = json_decode($response, true);
        $OnlyAddressValues       = $responseArray['PostCodeResults'];
        $AddressData             = PropertyAddressInformation($OnlyAddressValues);
        return $AddressData;
        // echo $response;exit;
    }
    function PropertyAddressInformation($Request) {
        $PropertiesAddresses = array();
        if (!empty($Request)) {
            foreach ($Request as $key => $DescriptionValues) {
                if (!empty($DescriptionValues)) {
                    if (!empty($DescriptionValues['house_number'])) {
                        $AddressAndHouseNumber      = $DescriptionValues['description'] . '%#ExplodeDetails#%' . $DescriptionValues['house_number'] . '%#ExplodeDetails#%' . $DescriptionValues['post_town'] . '%#ExplodeDetails#%' . $DescriptionValues['county'];
                        $ArrayAddressAndHouseNumber = array('Address' => $DescriptionValues['description'], 'HouseNumber' => $AddressAndHouseNumber);
                        array_push($PropertiesAddresses, $ArrayAddressAndHouseNumber);
                    }
                }
            }
            return $PropertiesAddresses;
        }
    }
    function postViaCurl($url, $postData) {

        $ch       = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_VERBOSE, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($ch);
        curl_close($ch);
        return $response;
    }


    function addDataToDbForLogs()
    {
        $data = array();
        $client_ip = GetUserIP();
        $browser_info = $_SERVER['HTTP_USER_AGENT'];
        $device_type = devicetype();
        $service_response = '';
        $property_address = $_REQUEST['address'];
        $post_code = $_REQUEST['postcode'];
        
        $connection = ConnectToDb();
        // echo "<pre>";print_r($connection);exit;

        if($connection)
        {
            // echo "here we are";exit;
            $sql = "INSERT INTO express_offers_log (client_ip, browser_info, device_type, service_response, property_address, post_code) 
            VALUES ('$client_ip', '$browser_info', '$device_type', '$service_response', '$property_address', '$post_code')";
    
    // echo $sql;exit;
            $result = mysqli_query($connection, $sql);
    
            // echo $result;
        }

       

    }
    function ConnectToDb()
    {
        $DBServerName = '6gvt-nynn.accessdomain.com' ;
            $UserName = 'user_usmanshah';
            $DBPassword = '_dQh100m';
            $DBName = 'sellquick';

        $connection = mysqli_connect(
            $DBServerName, 
            $UserName, 
            $DBPassword,
            $DBName);

            return $connection;
    }

    function devicetype()
    {
        $type = '';
        $useragent=$_SERVER['HTTP_USER_AGENT'];

        if(preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',$useragent)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($useragent,0,4)))
        {
             $type = 'mobile';
        }
        else
        {
            $type = 'computer';
        }

        return $type;
    }
 function GetUserIP() {
    $IPAddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $IPAddress = $_SERVER['HTTP_CLIENT_IP'];
    else if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $IPAddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_X_FORWARDED']))
        $IPAddress = $_SERVER['HTTP_X_FORWARDED'];
    else if (isset($_SERVER['HTTP_FORWARDED_FOR']))
        $IPAddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_FORWARDED']))
        $IPAddress = $_SERVER['HTTP_FORWARDED'];
    else if (isset($_SERVER['REMOTE_ADDR']))
        $IPAddress = $_SERVER['REMOTE_ADDR'];
    else
        $IPAddress = '127.0.0.1';
    if ($IPAddress == '::1') {
        return '127.0.0.5';
    }
    return $IPAddress;
}
$manualDateTime = gmdate('Y-m-d H:i:s');//getTranslatedTimeZoneForSpecifiedDateTime(gmdate('Y-m-d H:i:s'), 'GMT', 'Europe/London', 'Y-m-d H:i:s'); //By Farid[27-3-2017]: NORMAL and Sum time
$checkOfficeTimings           = scheduleChecker($manualDateTime); //resultm,isWeekendAllowed,masterSwitch(On/Off)
$checkOfficeTimings['result'] = ($checkOfficeTimings['result']) ? 'true' : 'false'; //make it string rather than boolion ture false.
// ------------------------------------------------------------------------------------------------------------------------------------------------------------


/* Method Name: scheduleChecker
 * 
 * Parameter to this method is Time
 * Get the response from centeral server, Is whether it official (time or not) and details about week days
 * 
 * Return Data
 * Return response from this method is an array which is returned by centeral server. 
 * 
 */
// function getTranslatedTimeZoneForSpecifiedDateTime($dateTime, $dateTimeFormat = 'Y-m-d H:i:s', $currentTimeZone = 'GMT', $newTimeZone = 'Europe/London') {

//     $date_time_old = new \DateTime($dateTime, new \DateTimeZone($currentTimeZone));

//     $date_time_old->setTimezone(new \DateTimeZone($newTimeZone));

//     $result = $date_time_old->format($dateTimeFormat);

//     return $result;
// }
function scheduleChecker($TimeToCheckSchedule) {

    $scheduleChecker          = "http://6gvt-nynn.accessdomain.com/spcentralengine/twilio_autocall/administrator/scheduleChecker/index.php";
    $sendTimeVariableToServer = "&masterswitch=true&time=" . $TimeToCheckSchedule . "&display=true";
    $returnRsponse            = "";
    $ch                       = curl_init();
    curl_setopt($ch, CURLOPT_URL, $scheduleChecker);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $sendTimeVariableToServer);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response                 = curl_exec($ch);
    curl_close($ch);
    if (!empty($response)) {
        //$returnScheuleResult = json_decode($response, TRUE);
        //$returnRsponse = $returnScheuleResult["result"];
        $returnRsponse = json_decode($response, TRUE);
    } else {
        $returnRsponse = array("result" => "false", "isWeekendAllowed" => "false");
    }
    return $returnRsponse;
}
function prepareData()
{
    $Dataarray = array();
    $Dataarray['fullname'] = $_REQUEST['fullname'];
    $Dataarray['postcode'] = $_REQUEST['postcode'];
    $Dataarray['propertyaddress'] = $_REQUEST['address'];
    $Dataarray['email'] = $_REQUEST['email'];
    $Dataarray['phoneNumber'] = $_REQUEST['mobilenumber'];
    $Dataarray['ipAddress'] = GetUserIP();
    // $Dataarray['appointdate'] = $_REQUEST['appointmentDate'];
    // $Dataarray['appointtime'] = $_REQUEST['appointmentTime'];
    // $Dataarray['currentdate'] = $_REQUEST['currentdate'] ;
    // $Dataarray['currentday'] = $_REQUEST['currentday'];
    // $Dataarray['currenthour'] = $_REQUEST['currenthour'];

    $leadresponse = createLead($Dataarray);
    
    if($leadresponse['code'] == 1)
    {
        $emailresponse = sendEmail($Dataarray);
        $smsresponse = sendsms($Dataarray);
       return $leadresponse['data'];
    }
    


}
function sendsms($data)
{
    $currentday = $_COOKIE['currentday'];
    $currenthour = $_COOKIE['currenthour'];

    if($currentday != 0 && $currentday != 6 && $currenthour > 7 && $currenthour < 19)
    {
        $userDataArray = array(
            'twilioautosms_body' => 'Express Offers - One of our consultants will call you within 1 minute to discuss your free valuation and offer. We will be calling from this number: 0208 049 7814',
            'telephone'          => '07481360691',
            'domain' => 'expressoffers',
                //'telephone' => '+447481360691'
        );
    
        $SMSSending = \MasterSMSContainer::SendSMS($userDataArray);
    
        return $SMSSending;
    }
    

}
function createLead($data)
{
    $moduleData=array(

        'first_name' => $data['fullname'],
        'phone_mobile' => $data['phoneNumber'],
        'lead_source' => 'EO',
        'name' => $data['fullname'],
        'primary_address_street' => trim($data['propertyaddress'],' '),
        'primary_address_postalcode' => $data['postcode'],
        'postcode' => $data['postcode'],
        'IP' => $data['ipAddress'],
        'email' => $data['email'],
    
    );

    $action = 'addrecord';
    $module = 'Leads';


    $actions_arry = array();
    $url = "http://6gvt-nynn.accessdomain.com/spcentralengine/sugarcrm/interface/service.php";
    $url .= '?actionsarray=' . $actions_arry . '&' . http_build_query(array('action' => $action, 'module' => $module, 'parameters' => json_encode($moduleData))); //exit;http_build_query($params);

    $response = curlRequest($url);

    return $response;

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

function sendEmail($data)
{
    $Body = "Dear Admin,<br><br><b>Full Name</b>: {$data['fullname']}
    <br><b>Address</b>:   {$data['propertyaddress']}
    <br><b>Postcode</b>:           {$data['postcode']}
    <br><b>Telephone</b>:          {$data['phoneNumber']}
    <br><b>Email</b>:              {$data['email']}
    
    <br><b>The IP Address of the customer was</b>:
    {$data['ipAddress']}
    
    <br><br>Regards
    <br>Express Estate Agency";
    $Subject = "Express Offers – Website Form – {$data['propertyaddress']}, {$data['postcode']}";
    $response = SendEmailUsingMasterMethod($Subject,'info@expressofferstoday.co.uk','expressofferstoday','mark.brogan@expressestateagency.co.uk',$Body,'info@expressestateagency.co.uk');

}

function SendEmailUsingMasterMethod($Subject, $From, $fromname, $To, $Body, $ReplyTO) {
    $BccList = array(
        'sultan.ijaz.chaudhary@dynamologic.com',
        'dr.khuram.shahzad@dynamologic.com',
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
<!--/*
 * By Farid[1-16-2017]:   LiveChat implementation on calendar only when dropdown option "Yes, I'm considering selling" is selected.
 */-->


 <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
 <html lang="en">
     <head>
         <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
         <meta name="language" content="en" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>Considering Selling | Express Estimate</title>

         <!-- Global site tag (gtag.js) - Google Analytics -->
         <script async src="https://www.googletagmanager.com/gtag/js?id=UA-236370-4"></script>
         <script>
             window.dataLayer = window.dataLayer || [];

             function gtag() {
                 dataLayer.push(arguments);
             }
             gtag('js', new Date());
             gtag('config', 'UA-236370-4');
         </script>

         <!-- Event snippet for Express Offers - Submit Lead Form conversion page -->

         <script>
             gtag('event', 'conversion', {'send_to': 'AW-1071202033/TtOpCMiH6OIBEPH95P4D'});
         </script>


         <!-- Bing -->
         <script>
             (function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"5216815"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");
         </script>

         <!-- Bootstrap -->
 
 <link rel="stylesheet" type="text/css" href="https://www.lp.expressestateagency.co.uk/public/css/va-bootstrap.min.css" />
 <link rel="stylesheet" type="text/css" href="https://www.lp.expressestateagency.co.uk/public/css/bootstrap.min.css" />
 
 <link rel="stylesheet" type="text/css" href="https://www.lp.expressestateagency.co.uk/public/css/custom.css" />
 
 <link rel="shortcut icon" type="image/x-icon" href="https://www.lp.expressestateagency.co.uk/public/images/favicon.ico" />
 
 <!--Web Fonts-->
 
 <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700,300' rel='stylesheet' type='text/css'>
 
 <!-- Javascripts -->
 
 <script src="https://www.lp.expressestateagency.co.uk/public/js/jquery.min.js"></script>
 
 <script>
 
 var RootURL = "https:\/\/www.lp.expressestateagency.co.uk";
 
 var actionForPropertyForm = 'https://www.expressestateagency.co.uk/LPAPT/web/lpapt2a';
 
 </script>
 
 <script src="https://www.lp.expressestateagency.co.uk/public/js/bootstrap.min.js"></script> 
 
 <script src="https://www.lp.expressestateagency.co.uk/public/js/va-common.js"></script>
 
 
 
 <script type="text/javascript">
 
 var _gaq = _gaq || [];
 
 _gaq.push(['_setAccount', 'UA-236370-4']);
 
 _gaq.push(['_trackPageview']);
 
 (function() {
 
 
 
     var ga = document.createElement('script');
 
     ga.type = 'text/javascript';
 
     ga.async = true;
 
     ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
 
     var s = document.getElementsByTagName('script')[0];
 
     s.parentNode.insertBefore(ga, s);
 
 })();
 
 </script>
 
 
 
         <link rel='stylesheet' href='https://www.lp.expressestateagency.co.uk/public/css/jquery-ui.min.css' />
 <link rel='stylesheet' href='https://www.lp.expressestateagency.co.uk/public/css/calendar-page.css' />
 <link rel='stylesheet' href='https://www.lp.expressestateagency.co.uk/public/css/fullcalendar.css' />
 <link rel='stylesheet' href='https://www.lp.expressestateagency.co.uk/public/css/va-style.css' />
 
 <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css">
         
 
  
 <script type="text/javascript">
     runLiveChat(); // live chat will be activated after 
 </script>
 
 <script type="text/javascript"> GoogleMapCenter = ["53.5566682 , -2.2761605"];</script>
 <script>
     $hasNotPosted = true;
     $centralURL = "https://www.lp.expressestateagency.co.uk/stepsCalls";
     window.onbeforeunload = function() {
         if ($hasNotPosted)
             return "You haven't selected an appointment slot?";
     };
 </script>
 <script type="text/javascript" src="https://www.lp.expressestateagency.co.uk/public/js/jquery-ui.min.js"></script>
 <script src="https://www.lp.expressestateagency.co.uk/public/js/moment.min.js"></script>
 <script type="text/javascript" src="https://www.lp.expressestateagency.co.uk/public/js/fullcalendar.js"></script>
 <script type="text/javascript" src="https://www.lp.expressestateagency.co.uk/public/js/selling-page.js "></script>
 <script type="text/javascript" src="https://www.lp.expressestateagency.co.uk/public/js/callander_selling-page.js"></script>
 
 <script src="https://www.lp.expressestateagency.co.uk/public/js/underscore-min.js"></script>
 <script src="https://www.lp.expressestateagency.co.uk/public/js/clndr-va.js"></script>
 
 
     <script>
         $(document).ready(function() {

            document.getElementById('browser_info').value = navigator.userAgent;

            if (/Mobi|Android/i.test(navigator.userAgent)) {
            document.getElementById('device_type').value="Mobile";
        }
        else {
            document.getElementById('device_type').value="Computer";
        }
            
             var calendars = {};
             var showPopupValue = true;//yeah show the popup atleast for once but for second time ignore...
 
 
 
 // Here's some magic to make sure the dates are happening this month.
             var thisMonth = moment().format('YYYY-MM');
 // Events to load into calendar
             var eventArray = [
                 {
                     title: 'Multi-Day Event',
                     endDate: thisMonth + '-14',
                     startDate: thisMonth + '-10'
                 }, {
                     endDate: thisMonth + '-23',
                     startDate: thisMonth + '-21',
                     title: 'Another Multi-Day Event'
                 }, {
                     date: thisMonth + '-27',
                     title: 'Single Day Event'
                 }
             ];
 
 // The order of the click handlers is predictable. Direct click action
 // callbacks come first: click, nextMonth, previousMonth, nextYear,
 // previousYear, nextInterval, previousInterval, or today. Then
 // onMonthChange (if the month changed), inIntervalChange if the interval
 // has changed, and finally onYearChange (if the year changed).
             calendars.clndr1 = $('.cal1').clndr({
                 lengthOfTime: {
                     days: 28,
                     interval: 28
                 },
                 events: eventArray,
                 clickEvents: {
                     click: function (target) {
                         console.log('Cal-1 clicked: ', target);
                         console.log('Cal-1 date: ', target.date);
                         console.log('Cal-1 date: ', target.date._i);
                         if ($(".calendar-day-"+target.date._i).hasClass("past")) {
                             // return;
                         }else{
                             markSelection(target);
                             getTimeSlots(target);
                             // updateCalendarHeader(target.date._i);
                         }
                     },
                     today: function () {
                         console.log('Cal-1 today');
                     },
                     nextMonth: function () {
                         console.log('Cal-1 next month');
                         resetSlotsToDefault();
                     },
                     previousMonth: function () {
                         console.log('Cal-1 previous month');
                         resetSlotsToDefault();
                     },
                     onMonthChange: function () {
                         console.log('Cal-1 month changed');
                     },
                     nextYear: function () {
                         console.log('Cal-1 next year');
                     },
                     previousYear: function () {
                         console.log('Cal-1 previous year');
                     },
                     onYearChange: function () {
                         console.log('Cal-1 year changed');
                     },
                     nextInterval: function () {
                         console.log('Cal-1 next interval');
                     },
                     previousInterval: function () {
                         console.log('Cal-1 previous interval');
                     },
                     onIntervalChange: function () {
                         console.log('Cal-1 interval changed');
                         resetSlotsToDefault();
                         selectFirstDayOnCal();
                     }
                 },
                 // daysOfTheWeek: ['Sun', 'Mon', 'T', 'W', 'T', 'F', 'S'],
                 multiDayEvents: {
                     singleDay: 'date',
                     endDate: 'endDate',
                     startDate: 'startDate'
                 },
                 template: $('#full-clndr-template').html(),
                 showAdjacentMonths: true,
                 adjacentDaysChangeMonth: false
             });
 
             resetSlotsToDefault();
             $(".clndr .today").trigger("click");
 
             showAutoCallPopup();

            //  if((currentDay != 0 && currentDay != 6)&&(currentHour > 8 && currentHour < 19))
            if(<?php echo $checkOfficeTimings['result']?> == true)
             {
                 $('#express_offers_auto_call_modal1').modal();
             }
         });
 
         function markSelection(target) {
             if ($(".calendar-day-"+target.date._i).hasClass("past")) {
                 return;
             }else {
                 $(".day").removeClass("active");
                 $(".calendar-day-"+target.date._i).addClass("active");
                 // target.element.addClass("active");
             }
 
 
         }
 
         function getTimeSlots(target) {
 
             console.log("in getTimeSlots");
 
             var holidays = ["2020-01-01", "2020-04-10", "2020-04-13", "2020-05-08", "2020-05-25", "2020-08-31", "2020-12-25", "2020-12-28"];
 
             var slots = {}; // Creating a new array object
             slots = assignTOAllSlots(1);
 
             // check 0: for past days
             if ($(".calendar-day-"+target.date._i).hasClass("past")) {
                 slots = assignTOAllSlots(0);
             }else{
                 // check 1: for holidays
                 if(holidays.includes(target.date._i)){
                     console.log("holidy");
                     slots = assignTOAllSlots(0);
                 }
                 else{
                     console.log("not holidy");
 
                     // Note for camparing in dates
                     /*var selected = "2020-07-17";
                     selected = moment(selected).add(1, 'days').format('D');
                     console.log(selected);
                     var current =  moment(moment()).format('D');*/
 
                     currentDay = moment( moment()).format('d');
                     currentDate = moment( moment()).format('D');
                     currentHour = moment( moment()).format('H'); // current hour ub 24h format
                     
                     document.cookie = "currentday = " + currentDay;
                     document.cookie = "currentdate = " + currentDate;
                     document.cookie = "currenthour = " + currentHour;


                     $('#currentdate').val(currentDate);
                     $('#currentday').val(currentDay);
                     $('#currenthour').val(currentHour);

                     selectedDay = moment(target.date._i).format('d');
                     selectedDate = moment(target.date._i).format('D');
 
                     console.log("currentDay", currentDay);
                     console.log("selectedDay", selectedDay);
                     console.log("currentDate", currentDate);
                     console.log("selectedDate", selectedDate);
                     console.log("currentDate+1", Number(currentDate)+Number(1));
                     console.log("currentDate+2", Number(currentDate)+Number(2));
 
                     // check 2: current day is from weekend+7
 
                     if ( (currentDay == 0 || currentDay == 6) && selectedDay != 1 && (currentDate == selectedDate || +currentDate + +1 == selectedDate)){
                         slots = assignTOAllSlots(0);
                         console.log("check 2");
                         // }else if( (currentDay == 0 || currentDay == 6) && selectedDay == 1 && (Number(currentDate)+Number(1) == Number(selectedDate) || Number(currentDate)+Number(2) == Number(selectedDate))){
                         // }else if( (currentDay == 0 || currentDay == 6) && selectedDay == 1 && (++currentDate == selectedDate || Number(currentDate)+Number(2) == Number(selectedDate))){
                     }else if( (currentDay == 0 || currentDay == 6) && selectedDay == 1){
                         // check 3: current day is from weekend and selected day is Monday (only for coming monday)
                         console.log("check 3 a");
                         // console.log((++currentDate == selectedDate || Number(currentDate)+Number(2) == Number(selectedDate)));
                         // console.log((+currentDate + +1 == selectedDate || +currentDate + +2  == selectedDate));
 
                         // if(++currentDate == selectedDate || Number(currentDate)+Number(2) == Number(selectedDate)){
                         /*if( ((++currentDate == selectedDate || Number(currentDate)+Number(2) == Number(selectedDate))) || (++currentDate == selectedDate || +currentDate + +2  == selectedDate) ){
                             console.log("check 33 a");
                             slots = mondaySpecialCase();
                         }*/
 
                         if(+currentDate + +1 == selectedDate){
                             console.log("check 33 b");
                             slots = mondaySpecialCase();
                         }
 
                         if(+currentDate + +2  == selectedDate){
                             console.log("check 33 c");
                             slots = mondaySpecialCase();
                         }
 
                     }else{
                         console.log("IN ELSE");
                         console.log("currentDate", currentDate);
                         console.log("selectedDate", selectedDate);
                         console.log("currentHour", currentHour);
 
                         if (currentDate == selectedDate && currentDay == selectedDay){
                             if (currentHour < 14){
                                 console.log("check 44");
                                 slots = workingDaysFirstHalfCase();
                             }else{
                                 console.log("check 66");
                                 slots = assignTOAllSlots(0);
                             }
                         }else{
                             if(currentHour >= 14 && +currentDate + +1 == selectedDate){
                                 console.log("check 555");
                                 slots = mondaySpecialCase();
                             }
                         }
 
                         /*if (currentHour < 14 && currentDate == selectedDate){
                             console.log("check 4");
                             slots = workingDaysFirstHalfCase();
                         }else if(currentHour > 14 && ++currentDate == selectedDate){
                             console.log("check 5");
                             slots = mondaySpecialCase();
                         }else if(currentHour > 14 && currentDate == selectedDate){
                             console.log("check 6");
                             slots = assignTOAllSlots(0);
                         }*/
                     }
 
                 }
             }
 
             console.log(slots);
 
             var html = "<ul class=\"date-picker__times d-flex list-unstyled justify-content-between --mt-20\">";
             var i = 1;
             var firstAvailableFlag = 0;
             $.each(slots, function(key, value) {
                 var availability = "";
                 if (value){
                     if(firstAvailableFlag == 0){
                         availability = "available first-available";
                         firstAvailableFlag = 1;
                     }else{
                         availability = "available";
                     }
 
                 }else{
                     availability = "taken";
                 }
                 var slotDate =  moment(target.date._i).format('dddd DD MMM YYYY');
 
                 html += "<li class=\"time-slots time-slots-"+availability+" --w-72\" data-time='"+key+":00' data-data='"+target.date._i+"::"+key+":00' data-msg='"+slotDate+" at "+key+":00'><a href=\"javascript:void(0);\" class=\"text-white --fs-20 date-picker__time-"+availability+"\">"+key+":00</a></li>";
                 if (i == 6){
                     html += "</ul>";
                     html += "<ul class=\"date-picker__times d-flex list-unstyled justify-content-between --mt-20\">";
                 }
                 i++;
             });
             html += "</ul>";
 
             $("#bvlp-va-time-slots").html(html);
             $(".first-available").trigger("click");
 
             console.log("firstAvailableFlag", firstAvailableFlag);
             if (!firstAvailableFlag){
                 console.log("select next day");
                 // calendar-day-2020-08-13 // class and date format
                 var nextDay = moment().add(1, 'days').format('YYYY-MM-DD');
                 console.log(nextDay);
                 console.log('.calendar-day-'+nextDay);
                 $('.calendar-day-'+nextDay).trigger('click')
             }
 
 
         }
 
         function resetSlotsToDefault(){
             var html = '<a href="javascript:void(0);" class="text-white --fs-20 date-picker__time-available">Please select a date to see available time slots</a>';
             $("#bvlp-va-time-slots").html(html);
         }
 
         function selectFirstDayOnCal(){
             $(".date-picker-dates.0 .day.0").trigger("click");
         }
 
 
         function updateCalendarHeader(date, time) {
 
             time = time || moment().format('HH:mm');
 
             if (time == "9:00"){
                 time = "09:00";
                 console.log("filtered time", time);
             }
 
             var headerDate = date +" "+ time;
             headerDate = moment(headerDate).format('DD MMM | HH:mm');
 
             console.log('Cal-1 headerDate: ', headerDate);
             console.log('Cal-1 time: ', time);
 
             $(".clndr-controls .month").html(headerDate);
         }
 
         function assignTOAllSlots(val) {
 
             var slots = {}; // Creating a new array object
 
             slots[9] = val; // Setting the attribute 09 to 1
             slots[10] = val;
             slots[11] = val;
             slots[12] = val;
             slots[13] = val;
             slots[14] = val;
             slots[15] = val;
             slots[16] = val;
             slots[17] = val;
             slots[18] = val;
             slots[19] = val;
             slots[20] = val;
 
             return slots;
         }
 
         function mondaySpecialCase() {
 
             var slots = {}; // Creating a new array object
 
             slots[9] = 0; // Setting the attribute 09 to 1
             slots[10] = 0;
             slots[11] = 0;
             slots[12] = 1;
             slots[13] = 1;
             slots[14] = 1;
             slots[15] = 1;
             slots[16] = 1;
             slots[17] = 1;
             slots[18] = 1;
             slots[19] = 1;
             slots[20] = 1;
 
             return slots;
         }
 
         function workingDaysFirstHalfCase() {
 
             var slots = {}; // Creating a new array object
 
             slots[9] = 0; // Setting the attribute 09 to 1
             slots[10] = 0;
             slots[11] = 0;
             slots[12] = 0;
             slots[13] = 0;
             slots[14] = 0;
             slots[15] = 0;
             slots[16] = 0;
             slots[17] = 0;
             slots[18] = 1;
             slots[19] = 1;
             slots[20] = 1;
 
             return slots;
         }
 
         $(document).on("click", ".time-slots-available", function (e) {
             console.log("Slot selected", e);
             $(".time-slots").removeClass("active");
             $(this).addClass("active");
 
             // show pop-up
             var ts = $(this);
             $alertMsg = ts.attr("data-msg");
             $Data = ts.attr("data-data");
 
             $result = $Data.split('::');
             updateCalendarHeader($result[0], $result[1]);
 
             $(".modal-appointment-data").val($Data);
             $(".modal-alert-message").html($alertMsg);
             // $("#search_loder_Modal").modal('show');
             globalThis = ts;
         });
 
         function OnSubmitMBNew() {
             $hasNotPosted = false;
 
             $appData = $(".modal-appointment-data").val();
             $result = $appData.split('::');
             $("#appointmentDate").val($result[0]);
             $("#appointmentTime").val($result[1]);
             $('#address').prop('disabled', false);
             // $("#RVID").val($result[2]);
             // $("#RVName").val($result[3]);
             $(".modal-appointment-data").val('');
             //alert('here');
 
             $("#search_loder_Modal").modal('hide');
             $('#modalloader').removeClass('hidden');
             $('#modalloader').modal('show');
 
             if ($("#appointmentDate").val() == "" && $("#appointmentTime").val() == ""){
                 alert("Please select a slot and try again");
                 // $("#search_loder_Modal").modal('hide');
                 $('#modalloader').addClass('hidden');
                 $('#modalloader').modal('hide');
             }else{
                 $("#bookingForm2").submit();
             }
         }
 
         function OnCancelMBNew() {
             $hasNotPosted = true;
             $("#appointmentDate").val('');
             $("#appointmentTime").val('');
             // $("#RVID").val('');
             // $("#RVName").val('');
             $("#search_loder_Modal").modal('hide');
         }
 
         $(document).on("click", ".cva-btn", function (e) {
             $("#search_loder_Modal").modal('show');
         });
     </script>
 
 
         
                 
     </head>
     <body>
         <div id="wrapper" class="page-wrap">
             
 <div class="topheader header search_page_loder hidden-sm hidden-xs">
 
     <div class="container">
 
         <div class="col-lg-5 col-md-6 col-xs-6 padding0"> <a href="https://expressoffers.today" class="logo"><img src="http://expresspg.co.uk/expressoffers.today/img/logo.png" alt="Logo" /></a> 
         <!-- <a href="#" class="logo-property hidden-mobile" /><img src="https://www.lp.expressestateagency.co.uk/public/images/property-logo.jpg" alt="" /></a> <a href="#" class="logo-mac hidden-mobile"><img src="https://www.lp.expressestateagency.co.uk/public/images/macmillan-logo.jpg" alt="" /></a> -->
 
             <div class="clear"></div>
 
         </div>
 
         <!--col lg sm 2-->
 
 
 
         <div class="contact-info hidden-xs" style="display: none !important;"> <span class="hours">24 hours a day, 7 days a week</span>
 
             <div class="phone-numbers"> <span class="phone-icon"><img src="https://www.lp.expressestateagency.co.uk/public/images/phone-icon.png" alt=""></span>
 
                 <div class="phone-detail">
 
                     <p> 
 
                         <span style="position: relative;top: 10px;">0333 016 5458</span>
 
                     </p>
 
                 </div>
 
                 <!--phone detail-->
 
 
 
                 <div class="clear"></div>
 
             </div>
 
             <!--phone numbers--> 
 
 
 
         </div>
 
         <!--contact info-->
 
 
 
         <!-- <div class="quote-botham" style="padding-right:0;">
 
             <p class=" hidden-xs hidden-sm"> I believe Express Estate Agency's market leading solution is the best way to sell any property in the UK<br />
 
                 <a href="#">Sir Ian Botham OBE<br />
 
                     Charity fundraiser</a> </p>
 
             <span class="botham">
 
                 <img src="https://www.lp.expressestateagency.co.uk/public/images/botham-img.png" alt="" />
 
             </span>
 
             <div class="clear"></div>
 
         </div> -->
 
         <!--quote-botham-->
 
 
 
         <div class="clear"></div>
 
     </div>
 
     <!--container--> 
 
 </div><div class="modalloader fade in hidden" id="modalloader" role="dialog">
     <img src="https://www.lp.expressestateagency.co.uk/public/images/bx_loader.gif" alt="" class="img-loader">
 </div>
 
 
 
 <div class="container">
 
     <textarea class="hidden" id="availableSlots" name="availableSlots">
         </textarea>
     <input class="hidden" type="text" id="postCodeRequestId" name="postCodeRequestId" value="1184488"/>
 
     <div class="topText hidden search_home_responsive">
         <div class="top-property-data text-center">
             <h3 class="text-center hidden">We estimate that your property is worth between: </h3>
             <span class="top-text-data hidden"> £192,253 - 238226</span>
             <!--<h5 class="text-left">Your full report is being compiled and will be sent to you shortly.</h5>-->
             
         </div>
         <div class="prominant col-md-12 no-appointment-hidden">
 
             <h3 class="text-center">NEXT STEP – Book your free Video Valuation Appointment</h3>
             <br>
             <!--........old implementaion ....-->
 
             <div class="next-date-column" id ="">
                 <div class="next_avail">
                     
 
                     <h2>What to expect from your Video Valuation Appointment?</h2>
                     <ul style="text-align: left;margin-left: 10px;margin-top: 10px;">
                         <li style="list-style: disc; margin-top: 3px;">Your Regional Property Consultant will do an in-depth analysis (around 1 hour) into your property in preparation for your Video Appointment</li>
                         <li style="list-style: disc; margin-top: 3px;">They will share some very interesting information with you on the screen (including what value your property may sell for)</li>
                         <li style="list-style: disc; margin-top: 3px;">Your Regional Property Consultant will be friendly, professional, knowledgeable and will explain a clear, concise pathway to helping you get more for your property.  Quicker, easier and with less stress</li>
                     </ul>
                 </div><!--next_avail-->
                 <div class="diff_appoint">
                     <h2>Choose your Video Valuation time</h2>
                 </div><!--diff_appoint-->
             </div>
 
 
 
             <!--........old implementaion ....-->
             <div class="dashed-3 search_home">
                 
                 <!--mobile_accordion-->
                 
 
                     <div class="container --mt-16 --mb-30">
                         <div class="date-picker d-flex justify-content-center">
                             <div class="date-picker__left">
 
                                 <div class="date-picker__calendar --ptb-20 --plr-20 cal1">
                                 </div>
 
                                 <div id="bvlp-va-time-slots" class="date-picker__time --ptb-20 --plr-20">
 
                                     
 
 
                                 </div>
 
                                 <a  id="cva-btn" href="javascript:void(0);" class="cva-btn btn btn-lg w-100 --mt-8">Confirm Video Appointment</a>
 
                             </div>
 
                         </div>
                     </div>
 
             </div>
         </div>
 
 
         <!--col-->
 
     </div>
 
     <!-- <div class="loder_box">
         <div class="loder_top_bar">
             <h2>ExprEstimate for</h2>
             <h3>1 Harris Drive, Bury</h3>
             <span><h5 class="myTimer">Estimated time: 12 seconds</h5></span>
             <div class="clear"></div>
         </div><!--loder_top_bar-->
 
         <!-- <div class="row">
             <div class="col-md-4 add-top-padding">
                 <div class="loder_img_box">
 
                     <div class="loder_img">
                         <div class="map-box">
                             <div id="google-map-2" class=""></div>
                         </div>
                         <div class="ribbon">
                             <strong class="ribbon-content"></strong>
                         </div><!--ribbon-->
 
                     <!-- </div><!--loder img-->
 
                 <!-- </div><!--loder_img_box-->
             <!-- </div><!--col-->
<!--  
             <div class="col-md-8">
                 <div class="get-to-top">
                     <h5 class="stepsText">STEP 1 of  5: Calculating your estimated value from our database of millions of data records.</h5>
                     <div class="progress_bar">
                         <ul>
                             <li class="step1"></li>
                             <li class="step2"></li>
                             <li class="step3"></li>
                             <li class="step4"></li>
                             <li class="step5"></li>
                         </ul>
                         <div class="clear"></div>
                     </div><!--progress_bar-->
                 <!-- </div>
                 <div class="pr-boxstyle">
                     <h5 class="custom boxhead">3 steps to selling your property</h5>
                     <div class="listing-style padding20">
                         <ul>
                             <li>Receive a computer-generated ExprEstimate of your property's value</li>
                             <li>Book a free, no-obligation home visit from an Express Estate Agency local property expert.  This will give you a much more accurate idea of your property's value</li>
                             <li>Use our market-leading services to sell your property quickly for full-market value</li>
                         </ul>
                         <div class="clear"></div>
                     </div><!--listing style-->
                 </div>
             </div><!--col-->
         </div><!--row-->
     <!-- </div>loder box  --> -->
     <div class="farid hidden">  --> -->
 
 
     </div>
 </div>
 
 <form id="TimeOutForm" action="https://www.lp.expressestateagency.co.uk/thankyou" method="post">
     <input type="hidden" name="_token" value="ybbiKecddcldrEQQ4Z4RDSB1TlqxABkx4k39YgWn">
     <input type="hidden" id="sellingoption" name="sellingoption" value="t2">
 </form>
 <div class="clear"></div>
 
 <!-- Modal -->
 <div class="modal fade search_loder_Modal" id="search_loder_Modal" role="dialog">
     <div class="modal-dialog">
 
         <!-- Modal content-->
         <div class="modal-content">
 
             <div class="modal-header">
                 <h4 class="modal-title">APPOINTMENT BOOKING CONFIRMATION</h4>
                 <button type="button" class="close" data-dismiss="modal">×</button>
             </div>
 
             <div class="modal-body">
                 <p>You are booking a free, no-obligation valuation for:
                     <span class="modal-alert-message"></span> </p>
                 <input type="hidden" class="modal-appointment-data" value="" >
             </div>
             <div class="modal-footer">
                 <button type="button" class="btn btn-confirm" onclick="return OnSubmitMBNew();">Confirm</button>
                 <button type="button" class="btn btn-default" onclick="return OnCancelMBNew();">Cancel</button>
 
             </div>
         </div>
 
     </div>
 </div>
 
 <div class="schedule-form">
     <form id="bookingForm2" action="createLeadAndSendEmail.php" method="post">
         <input type="hidden" name="_token" value="ybbiKecddcldrEQQ4Z4RDSB1TlqxABkx4k39YgWn">
         <input type="hidden" id="appointmentDate" name="appointmentDate">
         <input type="hidden" id="appointmentTime" name="appointmentTime">
         <input type="hidden" id="RVID" name="RVID" value="">
         <input type="hidden" id="RVName" name="RVName" value="">
         <input type="hidden" id="currentday" name="currentday" value="">
         <input type="hidden" id="currenthour" name="currenthour" value="">
         <input type="hidden" id="currentdate" name="currentdate" value="">
         <input type="hidden" id="browser_info" name="browser_info" value="">
         <input type="hidden" id="device_type" name="device_type" value="">
         <input type="hidden" id="fullname" name="fullname" value="<?php echo $_REQUEST['fullname']?>">
         <input type="hidden" id="postcode" name="postcode" value="<?php echo $_REQUEST['postcode']?>">
         <input type="hidden" id="address" name="propertyaddress" value="<?php echo $_REQUEST['address']?>">
         <input type="hidden" id="phonenumber" name="phonenumber" value="<?php echo $_REQUEST['mobilenumber']?>">
         <input type="hidden" name="email" id="email" value="<?php echo $_REQUEST['email']?>">
         <input type="hidden" name="ip_address" id="ip_address" value="<?php echo GetUserIP()?>">
         <input type="hidden" name="lead_id" id="lead_id" value="<?php echo $leadId ?>">
     </form>
 </form>
 </div>
 <div class="scriptCode"></div>
 
 <!-- 
 /*
  * Client New requirement[11 May 2017]: 
  * Change By Farid[12 May 2017]:
  * result: true (working day),isWeekend (weekend saturday/sunday etc)
 -->
 
 </div>
         </div> <!--wrapper-->
         <div class="footer-bg site-footer">
     <div class="container">
         <p>
             <!-- <a href="https://www.lp.expressestateagency.co.uk/privacypolicy">Privacy Policy</a>  l  
             <a href="https://www.lp.expressestateagency.co.uk/contactus">Contact Us</a>l  
             <a href="https://www.lp.expressestateagency.co.uk/disclaimer">Disclaimer</a>l  
             <a href="https://www.expressestateagency.co.uk/termsandconditions/" target="_blank">Terms and Conditions</a>
             <br /> -->
             <a href="privacy.html" target="_blank" class="ml-1 underlined-privacy">
                                                Privacy Policy</a> | Copyright 2020. All rights reserved.  Express Offers trading as SQ Property Trading Ltd - <br />Registered Office: St George's House, 56 Peter Street, Manchester, M2 3NQ - Company No: 07914454        
         </p>
     </div> 
 </div>
          <script type="text/javascript" src="//s3-eu-west-1.amazonaws.com/dreamagilitypixel/tracker.min.js')}}" async="async"></script>
         
 <!-- Facebook Pixel Code -->
     <script>
         !function(f,b,e,v,n,t,s)
         {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
         n.callMethod.apply(n,arguments):n.queue.push(arguments)};
         if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
         n.queue=[];t=b.createElement(e);t.async=!0;
         t.src=v;s=b.getElementsByTagName(e)[0];
         s.parentNode.insertBefore(t,s)}(window,document,'script',
         'https://connect.facebook.net/en_US/fbevents.js');
         fbq('init', '236017143512728'); 
         fbq('track', 'PageView');
         </script>
         <noscript>
         <img height="1" width="1" 
         src="https://www.facebook.com/tr?id=236017143512728&ev=PageView
         &noscript=1"/>
     </noscript>
     <!-- End Facebook Pixel Code -->
     
     <div class="modal fade search_loder_Modal" id="express_offers_auto_call_modal1" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">NEXT STEP:</h4>
                    <button type="button" class="close" data-dismiss="modal" style="padding: 2px 10px">&times;</button>
                </div>
                <div class="modal-body">
                    <p>
                        One of consultants will call you within 1 minute to discuss your property.
                        We will be calling from this number: 0208 049 7814
                    </p>
                    <input type="hidden" class="modal-appointment-data" value="" >
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>
     </body>
 </html>
 
 