
Number.prototype.format = function (n, x) {
	var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\,' : '$') + ')';
	return this.toFixed(Math.max(0, ~~n)).replace(".", ",").replace(new RegExp(re, 'g'), '$&.');
};

Number.prototype.ticketZeroPad = function (ne) {
    return String(this).padStart(ne, '0')
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    target.replace(/${search}/g, "");
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.toNumber = function() {
    var num = this;
    if(num=="" || num==null){ return 0;}
    if(num.indexOf(".")!=-1){ num = num.replace(/\./g, '');}
    num = parseFloat(num.replace(",","."));
    return num;
};

function returnSite(url) {
    if (url !== "" && url !== undefined && url) {
        $(".returnMsg").show();

        setTimeout(function() {
            window.location = url;
        }, 6000);
    }
}


function ValidateCreditCardNumber(ccNum) {

    ccNum = ccNum.replaceAll(" ","");
    var visaRegEx = /^(?:4[0-9]{1}(?:[0-9]{2})?)$/;
    var mastercardRegEx = /^(?:5[1-5][0-9]{2})$/;
    var maestroRegEx = /^(?:5[0][6-8]{2})$/;
    var amexpRegEx = /^(?:3[47][0-9]{13})$/;
    var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
    var status = false;
    var type;
    if (visaRegEx.test(ccNum)) {
        status = true;
      type = "visa";
    } else if(mastercardRegEx.test(ccNum)) {
        status = true;
      type = "mastercard";
    }else if(maestroRegEx.test(ccNum)) {
        status = true;
      type = "maestro";
    } else if(amexpRegEx.test(ccNum)) {
        status = true;
      type = "amex";
    } else if(discovRegEx.test(ccNum)) {
        status = true;
      type = "discover ";
    }
  
    return {status, type};
  }


(function($){

   

    $.fn.clickCopy = function(){
        return this.each(function(){
            $(this).addClass("cursor-pointer").tooltip({
                title:"Kopyala",
            }).click(function(){
                var text = $(this).data("copy-text")||$(this).text();
                handleCopyText(text);
            })
        });
    }

    function handleCopyText(text) {
        if (navigator.clipboard == undefined) {
            toast("error","Bu özellik sadece panel https ile açıldığında çalışır!");
            return false;
        }
        navigator.clipboard.writeText(text).then(function() {
            toast("success","Kopyalandı.","","top-center", "700")
        }, function(e) {
            console.log("Kopyalama Hatası:",e);
        });
    }
      


    $.fn.cdTimer = function(duration){

        var ths = this;
        var intervalId;

        ths.stop = ()=>{
            clearInterval(intervalId);
        }

        this.start = (duration,$elm)=> {
            let timer = duration, minutes, seconds;

            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            var timeText = minutes + ":" + seconds;
            if($elm.length){
              $elm.text(timeText);
            }


            intervalId = setInterval(() => {
              minutes = parseInt(timer / 60, 10);
              seconds = parseInt(timer % 60, 10);
          
              minutes = minutes < 10 ? "0" + minutes : minutes;
              seconds = seconds < 10 ? "0" + seconds : seconds;
          

              $elm.trigger("timer.tick", {duration,timer});
              var timeText = minutes + ":" + seconds;
              if($elm.length){
                $elm.text(timeText);
              }

              if (--timer < 0) {
                $elm.trigger("timer.expired");
                clearInterval(intervalId);
                return;
              }

             

            }, 1000);
        }

        return this.each(function() {

            var $elm = $(this);
            if(duration==0 || duration==null){
                return;
            }

            ths.start(duration, $elm);       

        })
    }

 

  

    $.fn.serializeObject=function(){
        "use strict";
        var a={},
        b=function(b,c){
            var d=a[c.name];
            "undefined"!=typeof d&&d!==null?$.isArray(d)?d.push(c.value):a[c.name]=[d,c.value]:a[c.name]=c.value
        };
        return $.each(this.serializeArray(),b),a
    };


    $.fn.serializeObject2 = function(){
        var _ = {},_t=this;
        this.c = function(k,v){ eval("c = typeof "+k+";"); if(c == 'undefined') _t.b(k,v);}
        this.b = function(k,v,a = 0){ if(a) eval(k+".push("+v+");"); else eval(k+"="+v+";"); };
        $.map(this.serializeArray(),function(n){
            if(n.name.indexOf('[') > -1 ){
                var keys = n.name.match(/[a-zA-Z0-9_]+|(?=\[\])/g),le = Object.keys(keys).length,tmp = '_';
                $.map(keys,function(key,i){
                    if(key == ''){
                        eval("ale = Object.keys("+tmp+").length;");
                        if(!ale) _t.b(tmp,'[]');
                        if(le == (i+1)) _t.b(tmp,"'"+n['value']+"'",1);
                        else _t.b(tmp += "["+ale+"]",'{}');
                    }else{
                        _t.c(tmp += "['"+key+"']",'{}');
                        if(le == (i+1)) _t.b(tmp,"'"+n['value']+"'");
                    }
                });
            }else _t.b("_['"+n['name']+"']","'"+n['value']+"'");
        });
        return _;
    }

    $.fn.formControl = function() {
        var toReturn = true;
        var $forms = this;
        $forms.each(function() {
            var $rArea = $(this).find("[require]");
            var $ths;
            $rArea.each(function(elm) {
                $ths = $(this);
                if ($ths.prop("tagName") == "SELECT" && ($('option:selected', this).length == 0 || $('option:selected', this).val() == "") && toReturn == true) {
                    toReturn = false;
                }

                if ($ths.attr("type") == "tel" && $ths.val().replace(/[^\d]/g, "").length < 11 && toReturn == true) {
                    toReturn = false;
                }

                if ($ths.hasClass("tcno") && !tcNoControl($ths.val()) && toReturn == true) {
                    toReturn = false;
                }

                if ($ths.hasClass("notZero") && $ths.val() == 0 && toReturn == true) {
                    toReturn = false;
                }

                if ($ths.val() == '' && toReturn == true) {
                    toReturn = false;
                }

                if ($ths.hasClass("notRequired")) {
                    toReturn = true;
                }

                if (!toReturn) {
                    modalAlert("error", ($ths.attr('require') == '' ? 'Boş alan bırakmayınız!' : $ths.attr('require')), {
                        onClose: function() {
                            $ths.focus();
                        }
                    });
                }
                return toReturn;
            });

        });


        return toReturn;
    }



    String.prototype.trConvert = function () {

        var tr = new Array("ş","Ş","ç","Ç","ğ","Ğ","ü","Ü","ı","İ"); 
        var lt  = new Array("s","S","c","C","g","G","u","U","i","I"); 
        
        
        var str = this;
        for (var i=0; i<tr.length; i++) { 
            str = str.replace(tr[i], lt[i]); 
        } 
        return str; 
    
    }


    Fancybox.bind("[data-fancybox]");


})(jQuery);
(function() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        origOpen.apply(this, arguments)
        this.setRequestHeader("Rc", rc);
    };
})();
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
  
function mergeDeep(target, source) {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target))
            Object.assign(output, { [key]: source[key] });
          else
            output[key] = mergeDeep(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
}


function tcNoControl(TCNO) {
    var tek = 0, cift = 0, sonuc = 0, TCToplam = 0, i = 0,
    hatali = [11111111110, 22222222220, 33333333330, 44444444440, 55555555550, 66666666660, 7777777770, 88888888880, 99999999990];
    if (TCNO.length != 11) return false;
    if (isNaN(TCNO)) return false;
    if (TCNO[0] == 0) return false;
    tek = parseInt(TCNO[0]) + parseInt(TCNO[2]) + parseInt(TCNO[4]) + parseInt(TCNO[6]) + parseInt(TCNO[8]);
    cift = parseInt(TCNO[1]) + parseInt(TCNO[3]) + parseInt(TCNO[5]) + parseInt(TCNO[7]);
    tek = tek * 7;
    sonuc = Math.abs(tek - cift);
    if (sonuc % 10 != TCNO[9]) return false;
    for (var i = 0; i < 10; i++) {
        TCToplam += parseInt(TCNO[i]);
    }
    if (TCToplam % 10 != TCNO[10]) return false;
    if (hatali.toString().indexOf(TCNO) != -1) return false;
    return true;
}

function uniqid(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}


function modalAlert(customType, text, customSettings) {


    if (typeof text === 'object') {
        customSettings = text;
        text = null;
    }

    var type = customType || "info";
    var buttonsVisible = false;
    var title = "Bilgi";
    var bgClass = "bg-info";

    var icon = 'ti ti-info-circle';
    
    if (type == "warning") {
        bgClass = "bg-yellow";
        title = "Uyarı";
        icon = 'ti ti-alert-triangle';
    }

    if (type == "info") {
        bgClass = "bg-info";
        title = "Bilgi";
        icon = 'ti ti-info-circle';
    }

    if (type == "error") {
        bgClass = "bg-danger";
        title = "Hata";
        icon = 'ti ti-alert-triangle';
    }

    if (type == "success") {
        bgClass = "bg-success";
        title = "Başarılı";
        icon = 'ti ti-circle-check';
    }

    var settings = {
        type: type,
        icon: icon,
        size: "modal-sm",
        title: title,
        text: text || "",
        bgClass: bgClass,
        form: null,
        backdrop: true,
        keyboard: true,
        closeBtn:true,
        yes: {
            text: "Tamam",
            icon: "",
            class: "btn btn-success",
            visible: false,
            close: false,
            onClick: null
        },
        no: {
            text: "Kapat",
            icon: "",
            class: "btn",
            visible: false,
            close: true,
            onClick: null
        },
        onClose: null,
        onOpen: null,
        onShow: null
    };

    if (isObject(customSettings)) {
        settings = mergeDeep(settings, customSettings);
    }


    if (settings.no.visible || settings.yes.visible) {
        settings.buttonsVisible = true;
    }

    //console.log(settings);

    var $btnClose = $("<button>", { type: "button", class: "btn-close", "data-bs-dismiss": "modal", "aria-label": "Close" });
    var $btnNo = $("<button>", { "class": "w-100 " + settings.no.class, "data-bs-dismiss": (settings.no.close ? "modal" : "") }).append(settings.no.text);
    var $btnYes = $("<button>", { "class": "w-100 " + settings.yes.class, "data-bs-dismiss": (settings.yes.close ? "modal" : "") }).append(settings.yes.text);

    if (settings.no.icon) {
        $("<i>", { "class": settings.no.icon }).prependTo($btnNo);
    }

    if (settings.yes.icon) {
        $("<i>", { "class": settings.yes.icon }).prependTo($btnYes);
    }

    var $formArea = $("<form>", { "action": "javascript:;", "class": "modalForm" });

    var $modal = $("<div id='" + uniqid() + "' tabindex='-1' role='dialog' aria-hidden='false'  >");
    $modal.addClass("modal modal-blur fade");
    var modalHtml = `<div class="modal-dialog ${settings.size} ${settings.type} modal-dialog-centered modalAlert" role="document">
                        <div class="modal-content">
                            
                            <div class="modal-status ${settings.bgClass}"></div>
                            <div class="modal-body text-center py-4">
                                <i class="icon ${settings.icon}"></i>
                                ${(settings.title!=""?'<h3>'+settings.title+'</h3>':"")}
                                ${(settings.text!=""?'<div class="text-muted">'+settings.text+'</div>':"")}

                            </div>`;

    if (settings.buttonsVisible) {
        modalHtml += `<div class="modal-footer">
                                <div class="w-100">
                                    <div class="row">`;

        if (settings.no.visible) {
            modalHtml += `<div class="col noArea"></div>`;
        }

        if (settings.yes.visible) {
            modalHtml += ` <div class="col yesArea"></div>`;
        }

        modalHtml += `</div>
                                </div>
                            </div>`;
    }
    modalHtml += `</div>
                    </div>`;

    $modal.html(modalHtml).appendTo("body");

    if(settings.closeBtn){
        $modal.find(".modal-content").prepend($btnClose);
    }

    $modal.modal({
        backdrop: settings.backdrop,
        keyboard: settings.keyboard
    });

    $modal.modal("show")


    $btnNo.appendTo($(".noArea", $modal));
    $btnYes.appendTo($(".yesArea", $modal));

    $formArea.appendTo($(".modal-body", $modal));


    var callbackOptions = {
        modal: $modal,
        formContainer: $formArea,
        buttons: { yes: $btnYes, no: $btnNo, close: $btnClose }
    }


    if (typeof settings.no.onClick === 'function') {
        $btnNo.click(function() { settings.no.onClick(callbackOptions) })
    }


    if (settings.form !== null) {
        $formArea.append(settings.form);
    }

    if (typeof settings.yes.onClick === 'function') {
        $btnYes.click(function() {
            settings.yes.onClick(callbackOptions)
        })
    }




    $modal.on('show.bs.modal', function() {
        if (typeof settings.onShow === 'function') {
            settings.onShow(callbackOptions);
        }
    });

    $modal.on('shown.bs.modal', function() {
        $btnYes.focus();
        if (typeof settings.onOpen === 'function') {
            settings.onOpen(callbackOptions);
        }
    });

    $modal.on('hidden.bs.modal', function() {
        $modal.remove();
        if (typeof settings.onClose === 'function') {
            settings.onClose(callbackOptions);
        }
    });

    return $modal;

}


function toast(tip,baslik,mesaj,position){
		
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "positionClass": "toast-"+(position==null?"bottom-right":position),
      "onclick": null,
      "showDuration": "500",
      "hideDuration": "500",
      "timeOut": "3000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };
    
    toastr[tip](mesaj||"", baslik);

}

function CountDownTimer(duration, granularity) {
    this.duration = duration;
    this.granularity = granularity || 1000;
    this.tickFtns = [];
    this.running = false;
  }
    
    CountDownTimer.prototype.start = function() {
        if (this.running) {
            return;
        }
        this.running = true;
        var start = Date.now(),
            that = this,
            diff, obj;
    
        (function timer() {
            diff = that.duration - (((Date.now() - start) / 1000) | 0);
        
            if (diff > 0) {
                setTimeout(timer, that.granularity);
            } else {
                diff = 0;
                that.running = false;
            }
        
            obj = CountDownTimer.parse(diff);
            that.tickFtns.forEach(function(ftn) {
                ftn.call(this, obj.minutes, obj.seconds);
            }, that);
        }());
    };

    CountDownTimer.prototype.stop = function() {
        if (!this.running) {
            return;
        }

        this.tickFtns = [];
        this.running = false;

    }
  
  CountDownTimer.prototype.onTick = function(ftn) {
    if (typeof ftn === 'function') {
      this.tickFtns.push(ftn);
    }
    return this;
  };
  
  CountDownTimer.prototype.expired = function() {
    return !this.running;
  };
  
  CountDownTimer.parse = function(seconds) {
    return {
      'minutes': (seconds / 60) | 0,
      'seconds': (seconds % 60) | 0
    };
  };


$(document).ready(function(){

    $(".showPass").click(function(){
        var $input = $(this).prev("input").first();
        var stt =  $input.attr("type");
        if(stt=="password"){
            $input.attr("type","text");
            $("i",this).removeClass("ti-eye").addClass("ti-eye-off");
        }else{
            $input.attr("type","password");
            $("i",this).removeClass("ti-eye-off").addClass("ti-eye");
        }
    })


    $(".themeSwitch").click(function(){
        var dtTheme = $(this).data("theme");
        window.localStorage.setItem("theme", dtTheme);
        window.location=window.location.href;
    });

    $(".clickCopy").clickCopy();


    
    $(".imDecimal").inputmask("decimal", {
        alias           : "decimal",
        negative        : false,
        allowMinus      : false, 
        groupSeparator  : ".",
        radixPoint      : ",",
        autoGroup       : true, 
        digits          : 2,
        digitsOptional  : false,
        placeholder     : "0,00",
        removeMaskOnSubmit: true
    });  


    $(".imInt").inputmask({
        alias           : "numeric",
        negative        : false,
        allowMinus      : false,  
        digits          : 0, 
        groupSeparator  : ".",
        radixPoint      : ",",
        autoGroup       : true, 
        digitsOptional  : false,
        placeholder     : "0",
        removeMaskOnSubmit: true
    });

     


})
   