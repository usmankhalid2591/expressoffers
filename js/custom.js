

function formatPostcode(postcodeString) {
    return postcodeString.toUpperCase();
}
 function showloader()
 {
     console.log('here we are');
     $('.rotatingloader').show();//removeAttr('hidden');
 }
 function hideloader()
 {
     console.log('here we are');
     $('.rotatingloader').hide();//removeAttr('hidden');
 }
 function ResetAddress()
{
    $("#SelectedAddress").empty();
    $("#SelectedAddress").hide();
    $("#loading-postcode").show();
    $("#ShowSearchResults").show();
}
    function SelectThisAddressComplete(number, Postcode)
    {
    //     $('#LastStepModal').modal({
    //  });
    
    

    // var e = document.getElementById(id);
    console.log(jsonData[number]['Address']);
    var Address = jsonData[number]['Address'];
    
         $("#postcodeonclick").val(Postcode);
         $("#addressonclick").val(Address);

         $("#addressonclick").removeAttr('hidden');
         $("#SelectedAddress").removeAttr('hidden');
     

          $('#LastStepModal').modal({
     });
        //console.log("abc");
        // var address1 = $("#" + AddressID).attr("address");
        $("#ShowSearchResults").hide();
        // $("#loading-postcode").hide();
        // $("#address").val(Address);
    
        // Address += (PostTown != '')?', ' +PostTown:''; 
        // Address += (County != '')?', ' +County:''; 
    
        // address = Address;
        // county = County;
        // post_town = PostTown;
        // line1 = Address;
        // line2 = Address;
        // line3 = Address;
        // line4 = Address;
        // is_residential = Is_Residential;
        $("#SelectedAddress").html('<p style="color: rgb(255, 255, 255); font-weight: bold; font-size: 14px; padding: 8px; margin-bottom: 6px ! important;">Your Address is: ' + Address + '</p><span style="float: right; padding-right: 12px; margin-top: -25px; font-size:11px;"> <a style="color: #FFFFFF !important;float: right;cursor: pointer;" onclick="ResetAddress();">Reset</a></span>');
        $("#SelectedAddress").show();
        // //console.log("before address");
        // $("#Address").val(Address);
        // //console.log("after address");
        // $("#county").val(County);
        // $("#post_town").val(PostTown);
        // $("#line1").val(Address);
        // $("#line2").val(Address);
        // $("#line3").val(Address);
        // $("#line4").val(Address);
        // $("#is_residential").val(Is_Residential);
        // $("#postcode_id").val(PostcodeId);
        // $('#loading-postcode').removeClass('loading_class1');
        // $('#loading-postcode').addClass('loading_class2');
        // BtnGetReport=1;
        // $(".BtnGetReport").click();
        // $("#getReportForm").modal("hide");
    }
// $(document).ready(function () {

    setTimeout(function() {
        $('#modaleveryfiveseconds').modal();
    }, 5000);



    var ROOTURL = "https://sell-quick.co.uk/";

    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });

    if ($(":button").hasClass("collapsed")) {
        $('.card-header :button').addClass('faq-chevron-up');
    }
    function isValidPostcode(p) {
        var postcodeRegEx = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i;
         return postcodeRegEx.test(p);
     }

    
    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }
   
    
    $('#getacashoffermainpagebutton2,#getacashoffermainpagebutton1,#getacashoffermainpagebutton0').on('click', function()
    {
        $('#LastStepModal').modal({
        });
    });

   var jsonData = '';

    var  webServiceURL = "https://expressoffers.today/schedule_appointment.php";
    $('#_Postcode, #postcode').on('input', function() {
        $("#SelectedAddress").hide();
         console.log('here we are');
        var $postcode = $("#_Postcode");
        var count = $postcode.val().length;
        var postcode = $postcode.val();
        $postcode.val(formatPostcode(postcode));
        if (count >= 5 && isValidPostcode(postcode))
        {
            showloader();
            postcode = postcode.replace(/ /g, "");
           postcode = formatPostcode(postcode);
            // postcode = postcode.replace(/[^a-zA-Z0-9]/g, '');      
            IsLoaderForInput = true;
            // $("#loading-postcode").show();
            $("#SelectedAddress").hide();
            // $("#loading-postcode").html('<img src="' + ROOTURL + '/wp-content/themes/sellquick/images/loader.gif" width="20px" height="20px" />');


            $.ajax({
                type: 'get',
                url: webServiceURL,
                data: {'method': 'search', 'postcode': postcode, 'postcodeanywhere' : 1 },
                dataType: 'json',
                success: function(data) {
                    
                    if ( data.length > 0) {
                        console.log("here we are111111111111");
                         jsonData =  data;
                        if (jsonData != null) {

                            console.log(jsonData);
                            // if ($('input[name=PageType]').val() != 'Rem') {
                            //     findGaps(postcode);
                            // }
    //                        $('#address').show();
                            // $('#address').empty();
    //                        $('#loader').hide();
                            // $('#address').removeAttr('disabled');
                            for (var i = 0; i < jsonData.length; i++)
                            {
                                var address = jsonData[i]['Address'];
                                $('#ShowSearchResults').append('<div id="option_'+i+'" class="SearchResults" onclick=SelectThisAddressComplete('+i+',"'+postcode+'") value="' + jsonData[i]['Address'] + '">' + jsonData[i]['Address'] + '</div>');
                            }

                            $("#ShowSearchResults").show();
                            hideloader();
                            // $('#postcode').css('border', '1px solid #cccccc');
                        }
                        if (jsonData == null || jsonData == '')
                        {
                            $("#ShowSearchResults").hide();
                                $("#ShowSearchResults").html("");
                        }
    
                    } else {
                        $("#ShowSearchResults").hide();
                        $("#SelectedAddress").hide();
                        $("#ShowSearchResults").html("");
                    }
    
                }
    
            });

            //GapFinderId
            // $.ajax({
            //     type: 'post',
            //     async: true,
            //     url: ROOTURL + '/wp-content/services/webservice.php?method=postCodeId',
            //     data: {postcode:postcode},
            //     dataType: 'json',
            //     success:function(data){
            //         //console.log(data);
            //         PostcodeId = data['id'];
            //         $.ajax({
            //             type: 'post',
            //             async: true,
            //             url: ROOTURL + '/wp-content/services/webservice.php?method=search&test=',
            //             data: 'postcode=' + encodeURIComponent(postcode),
            //             dataType: 'html',
            //             success: function(data) {
            //                 //console.log(data);
            //                 if (!isBlank(data) && data != "Wrong Input")
            //                 {
            //                     hideloader();
            //                     // $("#loading-postcode1").hide();
            //                     $postcode.removeAttr("style");
            //                    // $(".BtnGetReport").prop('disabled', false);
            //                     if (data.length > 0) {
            //                         $("#ShowSearchResults").html(data);
            //                         //findGaps(post_code)

            //                         $("#ShowSearchResults").show();
            //                         $("#loading-postcode").show();
            //                         $("#loading-postcode").html('<img src="' + ROOTURL + '/wp-content/themes/sellquick/images/remove.png" width="20px" height="20px" />');
            //                     }
            //                 }
            //                 else
            //                 {
            //                     console.log("else case");
            //                     $("#ShowSearchResults").hide();
            //                     $("#ShowSearchResults").html("");
            //                     $("#loading-postcode").hide();
            //                     $postcode.css("border", "2px solid #AC0000");
            //                     //$(".BtnGetReport").prop('disabled', true);
            //                     return false;
            //                 }
            //             }
            //         });
            //     }
            // });

        } else if (count < 5) {
            $("#ShowSearchResults").hide();
            $("#ShowSearchResults").html("");
            $("#loading-postcode").hide();
        } else if (count >= 5 && !isValidPostcode(postcode)) {
            $("#ShowSearchResults").hide();
            $("#ShowSearchResults").html("");
            $("#loading-postcode").hide();
        } else {
            $("#ShowSearchResults").hide();
            $("#ShowSearchResults").html("");
            $("#loading-postcode").hide();
        }
    });


// }); 

function ValidateUserInformation()
{
    var ValidationResult = true;
    
    $('#email').val($('#email').val().trim());
    var EmailAddress = $('#email').val();
    var PhoneNumber = $('#mobilenumber').val();
    
    if (EmailAddress == "" || EmailAddress.trim() == "")
    {
        $('#emailaddress').css('border', '2px solid red');
        ValidationResult = false;
    }
    else if (echeck(EmailAddress) == false)
    {
        $('#emailaddress').css('border', '2px solid red');
        ValidationResult = false;
    }
    else {
        $('#emailaddress').css('border', '1px solid #cccccc');
    }
    if (PhoneNumber == "" || PhoneNumber.trim() == "")
    {
        $('#phonenumber').css('border', '2px solid red');
        ValidationResult = false;
    }
    else if (IsTelephoneNumberValid(PhoneNumber) == false)
    {
        $('#phonenumber').css('border', '2px solid red');
        ValidationResult = false;
    }
    else
    {
        $('#phonenumber').css('border', '1px solid #cccccc');
    }
    if (ValidationResult != true)
    {
        return false;
    }
    else {
        // $('input[type="submit"]').hide();
        // $('#submit-loader-text').show();
        // //added by jafer balti on 25-7-16
        // trackConversion();
        return true;
    }
}
function IsTelephoneNumberValid(Number)
{
    Number = Number.replace(/ /g, "");
    var result = true;
    if (!is_numeric(Number) || Number.length < 11
            || Number.length > 11 || !NumberStart(Number)
            || is_numberRepetitionFiveTimes(Number) || IsNumberHaveFiveConsectiveIncrementalDigits(Number)
            || IsNumberHaveFiveConsectiveDecrementalDigits(Number)
            || IsThreeOrMorePairsExistConsectivily(Number))
    {
        result = false;
    }
    return result;
}
function NumberStart(Number)
{
    return /^01[\d+]*|^02[0-9]*|^07[0-9]*/.test(Number);
}
function is_numberRepetitionFiveTimes(Number)
{
    return /1{5}|2{5}|3{5}|4{5}|5{5}|6{5}|7{5}|8{5}|9{5}/.test(Number);
}
function IsNumberHaveFiveConsectiveIncrementalDigits(Number)
{
    var result = 0;
    for (var i = 0; i < Number.length; i++)
    {
        if (result == 1)
        {
            break;
        }
        for (var j = i; j < (i + 5); j++)
        {
            var First = Number.substr(j, 1);
            var Next = Number.substr((j + 1), 1);
            if (Next != ++First)
            {
                result = 0;
                i = j;
                if (i >= 7)
                {
                    break;
                }
            }
            else
            {
                result = 1;
            }
        }

    }
    return result;
}
function IsNumberHaveFiveConsectiveDecrementalDigits(Number)
{
    var result = 0;
    for (var i = 0; i < Number.length; i++)
    {
        if (result == 1)
        {
            break;
        }
        for (var j = i; j < (i + 5); j++)
        {
            var First = Number.substr(j, 1);
            var Next = Number.substr((j + 1), 1);
            if (Next != --First)
            {
                result = 0;
                i = j;
                if (i >= 7)
                {
                    break;
                }
            }
            else
            {
                result = 1;
            }
        }

    }
    return result;
}

function IsThreeOrMorePairsExistConsectivily(Number)
{
    var result = 0;
    var Rep = 0;
    for (var j = 0; j < Number.length; j++)
    {
        var FirstTwoDigits = Number.substr(j, 2);
        var NextTwoDigits = Number.substr((j + 2), 2);
        if (FirstTwoDigits != NextTwoDigits)
        {
            Rep = 0;
            result = 0;
        }
        else
        {
            Rep++;
            if (Rep == 2)
            {
                break;
            }
            result = 1;
            j++;
        }
    }
    return result;
}

// javascript for dynamic dropdown binding

$('#postcode1').on('input', function() {
    console.log('here we are');
   var $postcode = $("#postcode1");
   var count = $postcode.val().length;
   var postcode = $postcode.val();
   var postcodeupper = formatPostcode(postcode);
   postcodeupper = postcodeupper.replace(/ /g, "");
   $postcode.val(formatPostcode(postcode));
   if (count >= 5 && isValidPostcode(postcode))
   {
       $('#webformloader').show();
    
       postcode = postcode.replace(/ /g, "");    
    //    postcode = postcode.replace(/[^a-zA-Z0-9]/g, '');   
    //    var postcodeupper = postcode;
       $("#ShowSearchResults").html('');   
       IsLoaderForInput = true;
       // $("#loading-postcode").show();
    //    $("#SelectedAddress").hide();
       // $("#loading-postcode").html('<img src="' + ROOTURL + '/wp-content/themes/sellquick/images/loader.gif" width="20px" height="20px" />');

       $.ajax({
        type: 'get',
        url: webServiceURL,
        data: {'method': 'search', 'postcode': postcode, 'postcodeanywhere' : 1 },
        dataType: 'json',
        success: function(data) {
            
            if ( data.length > 0) {
                console.log("here we are111111111111");
                 jsonData =  data;
                if (jsonData != null) {

                    console.log(jsonData);
                    // if ($('input[name=PageType]').val() != 'Rem') {
                    //     findGaps(postcode);
                    // }
//                        $('#address').show();
                    // $('#address').empty();
//                        $('#loader').hide();
                    // $('#address').removeAttr('disabled');
                    document.getElementById("address1").options.length = 0;
     
                    for (var i = 0; i < jsonData.length; i++)
                    {
                        var address = jsonData[i]['Address'];
                        $('#address1').append('<option  value="' + jsonData[i]['Address'] + '">' + jsonData[i]['Address'] + '</option>');
                    }

                    $("#address1").removeAttr('hidden');
                    $('#webformloader').hide();
                    
                    // $('#postcode').css('border', '1px solid #cccccc');
                }
                if (jsonData == null || jsonData == '')
                {
                    $("#address1").hide();
                        // $("#ShowSearchResults").html("");
                }

            } else {
                $("#address1").hide();
                // $("#SelectedAddress").hide();
                // $("#ShowSearchResults").html("");
            }

        }

    });

       //GapFinderId
    //    $.ajax({
    //        type: 'post',
    //        async: true,
    //        url: ROOTURL + '/wp-content/services/webservice.php?method=postCodeId',
    //        data: {postcode:postcode},
    //        dataType: 'json',
    //        beforeSend: function(){
    //         // document.getElementById("webformloader").removeAttribute('hidden');
    //     },
    //        success:function(data){
    //            //console.log(data);
    //            PostcodeId = data['id'];
    //            $.ajax({
    //                type: 'post',
    //                async: true,
    //                url: ROOTURL + '/wp-content/services/webservice.php?method=search&test=',
    //                data: 'postcode=' + encodeURIComponent(postcode),
    //                dataType: 'html',
    //                success: function(data) {
    //                    //console.log(data);
    //                    if (!isBlank(data) && data != "Wrong Input")
    //                    {
    //                        hideloader();
    //                        // $("#loading-postcode1").hide();
    //                        $postcode.removeAttr("style");
    //                       // $(".BtnGetReport").prop('disabled', false);
    //                        if (data.length > 0) {

    //                            $("#ShowSearchResults").html(data);
    //                            console.log(data);
    //                            GetAllAddressesAndAssignToDropDown(postcodeupper);
    //                         //    //findGaps(post_code)

    //                         //    $("#ShowSearchResults").show();
    //                         //    $("#loading-postcode").show();
    //                         //    $("#loading-postcode").html('<img src="' + ROOTURL + '/wp-content/themes/sellquick/images/remove.png" width="20px" height="20px" />');
    //                        }
    //                    }
    //                    else
    //                    {
    //                        console.log("else case");
    //                        $("#ShowSearchResults").hide();
    //                        $("#ShowSearchResults").html("");
    //                        $("#loading-postcode").hide();
    //                        $postcode.css("border", "2px solid #AC0000");
    //                        //$(".BtnGetReport").prop('disabled', true);
    //                        return false;
    //                    }
    //                }
    //            });
    //        }
    //    });

   } else if (count < 5) {
    document.getElementById("address1").setAttribute("hidden","hidden");
   } else if (count >= 5 && !isValidPostcode(postcode)) {
    document.getElementById("address1").setAttribute("hidden","hidden");
   } else {
    document.getElementById("address1").setAttribute("hidden","hidden");
   }
});

function GetAllAddressesAndAssignToDropDown(postcodeupper)
{
    var loopcount = 0;
    $("#ShowSearchResults").each(function(){
        loopcount = loopcount+1;
        var text = $(this).text();
        var array = text.split(', '+postcodeupper);
        document.getElementById("address1").options.length = 0;
        array.forEach(function (arrayItem) {
            var x = arrayItem;
            // x = x.replace(/\s+/g, '');
           x = x.trim();
            if(x != '')
            {
                $('#address1').append($('<option>', { 
                    value: x,
                    text : x
                }));
            }
          
            console.log(x);
        });
        
    });
    
    console.log(loopcount);
     $("#address1").removeAttr('hidden');
     document.getElementById("address1").options.length = 0;
     $('#webformloader').hide();
    //  document.getElementById("webformloader").setAttribute("hidden","hidden");
}

// javascript for five seconds modal dynamic dropdown binding

$('#postcode').on('input', function() {
    console.log('here we are');
   var $postcode = $("#postcode");
   var count = $postcode.val().length;
   var postcode = $postcode.val();
   var postcodeupper = formatPostcode(postcode);
   postcodeupper = postcodeupper.replace(/ /g, "");
   $postcode.val(formatPostcode(postcode));
   if (count >= 5 && isValidPostcode(postcode))
   {
    //    showloader();
       postcode = postcode.replace(/ /g, ""); 
    //    postcode = postcode.replace(/[^a-zA-Z0-9]/g, '');         
       IsLoaderForInput = true;
       $("#webformloaderfiveseconds").show();
    //    $("#SelectedAddress").hide();
       // $("#loading-postcode").html('<img src="' + ROOTURL + '/wp-content/themes/sellquick/images/loader.gif" width="20px" height="20px" />');

       //GapFinderId
       $.ajax({
        type: 'get',
        url: webServiceURL,
        data: {'method': 'search', 'postcode': postcode, 'postcodeanywhere' : 1 },
        dataType: 'json',
        success: function(data) {
            
            if ( data.length > 0) {
                console.log("here we are111111111111");
                 jsonData =  data;
                if (jsonData != null) {

                    console.log(jsonData);
                    // if ($('input[name=PageType]').val() != 'Rem') {
                    //     findGaps(postcode);
                    // }
//                        $('#address').show();
                    // $('#address').empty();
//                        $('#loader').hide();
                    // $('#address').removeAttr('disabled');
                    document.getElementById("addressfiveseconds").options.length = 0;
     
                    for (var i = 0; i < jsonData.length; i++)
                    {
                        var address = jsonData[i]['Address'];
                        $('#addressfiveseconds').append('<option  value="' + jsonData[i]['Address'] + '">' + jsonData[i]['Address'] + '</option>');
                    }

                    $("#addressfiveseconds").removeAttr('hidden');
                    $("#webformloaderfiveseconds").hide();
                    
                    // $('#postcode').css('border', '1px solid #cccccc');
                }
                if (jsonData == null || jsonData == '')
                {
                    $("#addressfiveseconds").hide();
                        // $("#ShowSearchResults").html("");
                }

            } else {
                $("#addressfiveseconds").hide();
                // $("#SelectedAddress").hide();
                // $("#ShowSearchResults").html("");
            }

        }

    });

   } else if (count < 5) {
    document.getElementById("addressfiveseconds").setAttribute("hidden","hidden");
   } else if (count >= 5 && !isValidPostcode(postcode)) {
    document.getElementById("addressfiveseconds").setAttribute("hidden","hidden");
   } else {
    document.getElementById("addressfiveseconds").setAttribute("hidden","hidden");
   }
});

function GetAllAddressesAndAssignToDropDownFiveSeconds(postcodeupper)
{
    var loopcount = 0;
    $("#ShowSearchResults").each(function(){
        loopcount = loopcount+1;
        var text = $(this).text();
        var array = text.split(', '+postcodeupper);
        document.getElementById("addressfiveseconds").options.length = 0;
        array.forEach(function (arrayItem) {
            var x = arrayItem;
            x = x.trim();
            if(x != '')
            {
            $('#addressfiveseconds').append($('<option>', { 
                value: x,
                text : x
            }));
        }
            console.log(x);
        });
        
    });

    console.log(loopcount);
     $("#addressfiveseconds").removeAttr('hidden');
     $("#webformloaderfiveseconds").hide();
}

// javascript for on click modal dynamic dropdown binding

$('#postcodeonclick').on('input', function() {
    console.log('here we are');
    document.getElementById("addressonclick").setAttribute("hidden","hidden");
    
   var $postcode = $("#postcodeonclick");
   var count = $postcode.val().length;
   var postcode = $postcode.val();
   var postcodeupper = formatPostcode(postcode);
   postcodeupper = postcodeupper.replace(/ /g, "");
   $postcode.val(formatPostcode(postcode));
   if (count >= 5 && isValidPostcode(postcode))
   {
    //    showloader();
    $("#webformloaderonclick").show();
       postcode = postcode.replace(/ /g, ""); 
       postcode = formatPostcode(postcode);
    //    postcode = postcode.replace(/[^a-zA-Z0-9]/g, '');         
       IsLoaderForInput = true;
       // $("#loading-postcode").show();
    //    $("#SelectedAddress").hide();
       // $("#loading-postcode").html('<img src="' + ROOTURL + '/wp-content/themes/sellquick/images/loader.gif" width="20px" height="20px" />');

       //GapFinderId
       $.ajax({
        type: 'get',
        url: webServiceURL,
        data: {'method': 'search', 'postcode': postcode, 'postcodeanywhere' : 1 },
        dataType: 'json',
        success: function(data) {
            
            if ( data.length > 0) {
                console.log("here we are111111111111");
                 jsonData =  data;
                if (jsonData != null) {

                    console.log(jsonData);
                    // if ($('input[name=PageType]').val() != 'Rem') {
                    //     findGaps(postcode);
                    // }
//                        $('#address').show();
                    // $('#address').empty();
//                        $('#loader').hide();
                    // $('#address').removeAttr('disabled');
                    document.getElementById("addressonclickselect").options.length = 0;
     
                    for (var i = 0; i < jsonData.length; i++)
                    {
                        var address = jsonData[i]['Address'];
                        $('#addressonclickselect').append('<option  value="' + jsonData[i]['Address'] + '">' + jsonData[i]['Address'] + '</option>');
                    }

                    $("#addressonclickselect").removeAttr('hidden');
                    $("#webformloaderonclick").hide();
                    
                    // $('#postcode').css('border', '1px solid #cccccc');
                }
                if (jsonData == null || jsonData == '')
                {
                    $("#addressonclickselect").hide();
                        // $("#ShowSearchResults").html("");
                }

            } else {
                $("#addressonclickselect").hide();
                // $("#SelectedAddress").hide();
                // $("#ShowSearchResults").html("");
            }

        }

    });

   } else if (count < 5) {
    document.getElementById("addressonclickselect").setAttribute("hidden","hidden");
   } else if (count >= 5 && !isValidPostcode(postcode)) {
    document.getElementById("addressonclickselect").setAttribute("hidden","hidden");
   } else {
    document.getElementById("addressonclickselect").setAttribute("hidden","hidden");
   }
});

function GetAllAddressesAndAssignToDropDownOnClick(postcodeupper)
{
    var loopcount = 0;
    $("#ShowSearchResults").each(function(){
        loopcount = loopcount+1;
        var text = $(this).text();
        var array = text.split(', '+postcodeupper);
        document.getElementById("addressonclickselect").options.length = 0;
        array.forEach(function (arrayItem) {
            var x = arrayItem;
            x = x.trim();
            if(x != '')
            {
            $('#addressonclickselect').append($('<option>', { 
                value: x,
                text : x
            }));
        }
            console.log(x);
        });
        
    });

    console.log(loopcount);
    $("#webformloaderonclick").hide();
     $("#addressonclickselect").removeAttr('hidden');
}

//javascript for ics page

// javascript for on click modal dynamic dropdown binding

$('#icspostcode').on('input', function() {
    console.log('here we are');
   
    
   var $postcode = $("#icspostcode");
   var count = $postcode.val().length;
   var postcode = $postcode.val();
   var postcodeupper = formatPostcode(postcode);
   postcodeupper = postcodeupper.replace(/ /g, "");
   $postcode.val(formatPostcode(postcode));
   if (count >= 5 && isValidPostcode(postcode))
   {
    //    showloader();
    $("#webformloaderics").show();
       postcode = postcode.replace(/ /g, ""); 
    //    postcode = postcode.replace(/[^a-zA-Z0-9]/g, '');         
       IsLoaderForInput = true;
       // $("#loading-postcode").show();
    //    $("#SelectedAddress").hide();
       // $("#loading-postcode").html('<img src="' + ROOTURL + '/wp-content/themes/sellquick/images/loader.gif" width="20px" height="20px" />');

       //GapFinderId
       //GapFinderId
       $.ajax({
        type: 'get',
        url: webServiceURL,
        data: {'method': 'search', 'postcode': postcode, 'postcodeanywhere' : 1 },
        dataType: 'json',
        success: function(data) {
            
            if ( data.length > 0) {
                console.log("here we are111111111111");
                 jsonData =  data;
                if (jsonData != null) {

                    console.log(jsonData);
                    // if ($('input[name=PageType]').val() != 'Rem') {
                    //     findGaps(postcode);
                    // }
//                        $('#address').show();
                    // $('#address').empty();
//                        $('#loader').hide();
                    // $('#address').removeAttr('disabled');
                    document.getElementById("icsaddressinput").options.length = 0;
     
                    for (var i = 0; i < jsonData.length; i++)
                    {
                        var address = jsonData[i]['Address'];
                        $('#icsaddressinput').append('<option  value="' + jsonData[i]['Address'] + '">' + jsonData[i]['Address'] + '</option>');
                    }

                    $("#icsaddress").show();
                    $("#icsaddressinput").removeAttr('hidden');
                   
                    $("#webformloaderics").hide();
                    
                    // $('#postcode').css('border', '1px solid #cccccc');
                }
                if (jsonData == null || jsonData == '')
                {
                    $("#icsaddress").hide();
                        // $("#ShowSearchResults").html("");
                }

            } else {
                $("#icsaddress").hide();
                // $("#SelectedAddress").hide();
                // $("#ShowSearchResults").html("");
            }

        }

    });
    
   } else if (count < 5) {
    document.getElementById("icsaddressinput").setAttribute("hidden","hidden");
    $("#icsaddress").hide();
   } else if (count >= 5 && !isValidPostcode(postcode)) {
    document.getElementById("icsaddressinput").setAttribute("hidden","hidden");
    $("#icsaddress").hide();
   } else {
    document.getElementById("icsaddressinput").setAttribute("hidden","hidden");
    $("#icsaddress").hide();
   }
});

function GetAllAddressesAndAssignToDropDownics(postcodeupper)
{
    var loopcount = 0;
    $("#ShowSearchResults").each(function(){
        loopcount = loopcount+1;
        var text = $(this).text();
        var array = text.split(', '+postcodeupper);
        document.getElementById("icsaddressinput").options.length = 0;
        array.forEach(function (arrayItem) {
            var x = arrayItem;
            x = x.trim();
            if(x != '')
            {
            $('#icsaddressinput').append($('<option>', { 
                value: x,
                text : x
            }));
        }
            console.log(x);
        });
        
    });

    $("#ShowSearchResults").html('');

    console.log(loopcount);
    $("#webformloaderics").hide();
     $("#icsaddress").show();
}



