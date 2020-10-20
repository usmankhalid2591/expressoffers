<?php?>
<!DOCTYPE html>
<html lang="en-US">
    <head>
        <meta charset="UTF-8">
        <title>Thank You | Express Estate Agency</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!--Web Fonts-->
        <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,900' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Oswald' rel='stylesheet' type='text/css'>
        <style>
            body {
                /*                position: relative;*/
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
            }
            .thankyou-center h1{
                color: #e02982;
            }
            .thankyou-center{
                position: absolute;
                top: 50%;
                left: 50%;
                margin: 0;
                padding: 0;
                font-family: "Oswald",sans-serif !important;
                font-weight: normal;
                font-size: 30px;
                text-align: center;
                text-transform: uppercase;
                -webkit-transform: translate(-50%, -50%);
                -moz-transform: translate(-50%, -50%);
                -ms-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
            }

            @media (max-width:497px) {
                .thankyou-center{
                    font-size: 25px;
                }

            }
        </style>
    </head>
    <body>

        <div class="heading-panel">

            <div class="container">
                <div class="thankyou-center">
                    <h1>Thank you</h1>
<!--                    <p>-->
<!--                        --><?php
//                        if (isset($_SESSION['ThankYouMessage']) && !empty($_SESSION['ThankYouMessage'])) {
//                            echo $_SESSION['ThankYouMessage'];
//                            unset($_SESSION['ThankYouMessage']);
//                        }
//                        ?>
<!--                    </p>-->
                </div><!--thankyou-->
            </div><!--container-->
        </div><!--heading panel-->
    </body>
</html>
