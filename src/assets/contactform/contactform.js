/* jQuery(document).ready(function ($) {
  "use strict";

  //Contact
  $('form.contactForm').submit(function () {
     var phoneNumberInput = document.getElementById('phoneNumber').val();
     console.log(phoneNumberInput);

     var action ='https://api.alamaq.com/api/Auth/SendEmailTo';
     
     let request = {
       name: "string",
       email: "string", 
       phoneNumber: "string",
       message: "string"
     }
     $.ajax({
       type: "POST",
       url: action,
       data: request,
       success: function (msg) {
         // alert(msg);
         if (msg == 'OK') {
           $("#sendmessage").addClass("show");
           $("#errormessage").removeClass("show");
           $('.contactForm').find("input, textarea").val("");
         } else {
           $("#sendmessage").removeClass("show");
           $("#errormessage").addClass("show");
           $('#errormessage').html(msg);
         }
 
       }
     });
  });

});
 */