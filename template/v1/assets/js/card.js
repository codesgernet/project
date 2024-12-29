


$("input[name='number']").inputmask('9999 9999 9999 9999',{placeholder:""});
$("input[name='exp_date']").inputmask(
        {
            alias: 'datetime', 
            inputFormat: 'mm/yy', 
            placeholder:"  /  ",
            max: moment().add(30, 'Y').format('MM/YY')
        }
).focusout(function(){
    
    var $ths = $(this);
    var val = $ths.val();
    if(val.length==5){
        var s = val.split("/"),
        cex = parseInt(s[1]+""+s[0]),
        m = moment().month()+1,
        m = (m < 10? ("0"+m): m);
        y = moment().format('YY'),
        cdt = parseInt(y+""+m);

        if(cex<cdt){
            modalAlert("error",{title:"Yanlış son istifadə tarixi!",text:"Zəhmət olmasa Bitmə Tarixini doğru daxil edin!",onClose:function(){$ths.val("").focus()}})
        };
    }
})



$("input[name='cvv']").inputmask("(999)|(9999)", {placeholder:""});

$("input[name='sms_code']").inputmask("(9999)|(99999999)", {placeholder:""});



let smsTimer;

$(document).ready(function() {


    var timer;
 
    let timeOut;

    var tempInp = $("<input>",{style:"display:none"});



    function cardControl(){
        let inp =  $("input[name='number']");
        var val = inp.val().replaceAll(" ","");
        tempInp = $("<input>",{style:"display:none"}).val(val);

        tempInp.validateCreditCard((res)=>{
            if(res.card_type!==null){
                $(".cardTypes").show();
                $(".cardTypes").find("img").hide();
                $(".cardTypes").find("."+res.card_type.name).show();
            }else{
                $(".cardTypes").hide(); 
            }
        })
    }


    $("input[name='number']").keyup(function (e) {
        cardControl();
    }).focusout(function(){
        cardControl();
    });


    $("input[name='exp_date']").keydown(function (e) { 
        var lng  = $(this).val().trim().length;
        if(lng==5){
            $("input[name='cvv']").focus();
        } 
    });

  

    //$("body").addClass("transfer");
    if (wStep == 4) { returnSite(rUrl); }

    if(timeOutTimer>0 && wStep==1){
        timeOut= $("#countDownContainer").cdTimer(timeOutTimer).on("timer.expired",function(){
            window.location = window.location.href
        });
    }
   
    if(wStep == 2){
        timer = $("#timerContainer").cdTimer(timer_count);
    }
    
    

    if(smsTimeOutTimer>0){
        smsTimer = $("#smsCountDownContainer").cdTimer(smsTimeOutTimer);
    }

    $("#smsCountDownContainer").on("timer.expired",function(){
        window.location = window.location.href
    });

    $(".smsSendBtn").click(function(){
        
        var sms_code = $("input[name='sms_code']").val();
        if(sms_code==null||sms_code==""||sms_code.trim().length<4){
            modalAlert("error",{   
                title:"SMS kodunu daxil edin",
                onClose:function(){
                     $("input[name='sms_code']").focus();
                }
            });
           
            return false;
        }

        $("body").meBlock(true);
        $.post(dizin + "/api/payment/deposit/card/sms/", { sms_code, token }, function(result) {
            if (result.status) {
                if(timer){
                    timer.stop();
                }
                
                $("input[name='sms_code']").val("");
                wStep=2;
                $('#wizard').wizard('goToStep', 2);
                smsTimer.stop();

                $("#timerContainer, .timerMsg").hide();

            }else{
                modalAlert("error",result.error);
            }
            $("body").meBlock(false);
        });
    })



    $('#wizard').wizard({
        showSteps: false,
        showButtons: false,
        submitButton: false,
        after: function(wizardObj, prevStepObj, currentStepObj) {
            var curStp = $(currentStepObj).data("step");
        },
    });

    if (wStep > 1) {
        $('#wizard').wizard('goToStep', wStep);
    }

    $(".container-tight").css("opacity", "1");

    $(".startBtn").click(async function() {
        var name = $("input[name='name_surname']").val();
        var number = $("input[name='number']").val();
        var exp_date = $("input[name='exp_date']").val();
        var cvv = $("input[name='cvv']").val();
        var amount = $("input[name='amount']").val().toNumber();

        if (name.trim() == "" || name.trim().length < 4) {
            modalAlert("error", {
                title: "Yanlış ad və soyad!",
                text: "Zəhmət olmasa doğru ad və soyad daxil edin!",
                onClose: function() {
                    $("input[name='name_surname']").focus();
                }
            })
            return false;
        }
        var cardValid = false;
        await tempInp.validateCreditCard((res)=>{

            if(res.card_type!==null){
                cardValid = true;
            }
        });


 
        if (number.trim() == '' || number.length != 19 || !cardValid) {
            modalAlert("error", {
                title: "Yanlış kart nömrəsi!",
                text: "Zəhmət olmasa doğru kart nömrəsi daxil edin!",
                onClose: function() {
                    $("input[name='number']").focus();
                }
            });
            return false;
        }

        //console.log("cardValid",cardValid.type);

        if (exp_date.trim() == '' || exp_date.length != 5) {
            modalAlert("error", {
                title: "Yanlış son istifadə tarixi!",
                text: "Zəhmət olmasa Bitmə Tarixini doğru daxil edin!",
                onClose: function() {
                    $("input[name='exp_date']").focus();
                }
            });
            return false;
        }

        
        if (cvv.trim() == '' || cvv.length < 3) {
            modalAlert("error", {
                title: "Yanlış CVV Kodu!",
                text: "Zəhmət olmasa CVV Kodunu doğru daxil edin!",
                onClose: function() {
                    $("input[name='cvv']").focus();
                }
            });
            return false;
        }

        if (amount <= 0) {
            modalAlert("error", {
                title: "Məbləğ girin!",
                text: "Ödəniş edəcəyiniz miqdarı girin!",
                onClose: function() {
                    $("input[name='amount']").focus();
                }
            })
            return false;
        }


        $("body").meBlock(true);
        $.post(dizin + "/api/payment/deposit/card/control/", { name, number, exp_date, cvv, amount, token }, function(result) {
            if (result.status) {

                if(timeOut){
                    timeOut.stop();
                }
                
                /*
                $("#accountDetail .name_surname").text(result.data.name);
                $("#accountDetail .amount").text(result.data.amount.format(2));
                $("#accountDetail .account_number").text(result.data.number);
                $("#accountDetail .code").text(result.data.code);
                */

                $('#wizard').wizard('goToStep', 2);
                wStep=2;
                timer = $("#timerContainer").cdTimer(timer_count);

            } else {
                modalAlert("error", result.error);
            }
            $("body").meBlock(false);
        })
    })


    $(".depositOk").click(function() {
        $("body").meBlock(true);
        $.post(dizin + "/api/payment/deposit/card/confirm/", { token }, function(result) {
            if (result.status) {
                wStep = 4;
                $('#wizard').wizard('goToStep', 4);
                returnSite(result.return_url)

            } else {
                modalAlert("error", { title: result.error.title, text: result.error.text });
            }
            $("body").meBlock(false);
        })
    })


    $(".depositCancel").click(function(){

        modalAlert("error",{
            title:"Ödəniş tələbiniz ləğv ediləcəkdir!<br> Davam etmək istədiyinizə əminsiniz?",
            yes:{
                visible:true,
                close:true,
                text:"Bəli, ləğv edin!",
                icon:"ti ti-check",
                class:"btn bg-red",
                onClick:function(){

                    $("body").meBlock(true);
                    $.post(dizin+"/api/payment/deposit/card/cancel/",{token},function(result){
                        if(result.status){
                            wStep = 6;
                            $('#wizard').wizard('goToStep', 6);
                            returnSite(result.return_url)
                        }else{
                            modalAlert("error",{title:result.error.title,text:result.error.text});
                        }
                        $("body").meBlock(false);
                    })
                }
            },
            no:{
                visible:true,
                text:"Yox",

            }
        })
    })

    function processControl(){

        $.post(dizin+"/api/payment/deposit/card/processControl/",{token},function(result){
            if(result.status){
                //sms bekleniyorsa 
                if(result.sms_status==1){

                    if (typeof $('#wizard').wizard === 'function') {
                        wStep=3;
                        $('#wizard').wizard('goToStep', 3);
                    }
        
                    if(smsTimer){
                        smsTimer.stop()
                    }
                
                    smsTimer = $("#smsCountDownContainer").cdTimer(result.timeOutTimer)
                    //smsTimer.start();
                }

                if(result.sms_status==2){
                   
                    if (typeof $('#wizard').wizard === 'function') {
                        if(result.deposit_status==2){
                            wStep=4;
                            $('#wizard').wizard('goToStep', 4);
                            returnSite(result.return_url)
                        }
                
                        if(result.deposit_status==3){
                            wStep=5;
                            $('#wizard').wizard('goToStep', 5);
                            if(result.notes!=""){
                                $("#declineNotes").html(result.notes);       
                            }
                            returnSite(result.return_url)
                        }
                    }
            
                    
                }
                
            }
            
        })
    }

    setInterval(function() {
        if (!socketStatus && (wStep==2)) {
            processControl();
        }
    }, 5000);

});