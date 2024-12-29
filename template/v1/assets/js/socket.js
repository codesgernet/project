(function() {


    const socket = io(socketSettings.host + (socketSettings.nsp ? socketSettings.nsp : ""), {
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 15000,
        reconnectionAttempts: 50,
        auth: socketAuth
    });

    socket.on("connect", () => {
        socketStatus = true;
        console.log("%cSocket Connected", "color:green; font-size: 14px;");
        socket.emit("currentPage", { page: window.location.href, detail: document.title })
    });

    socket.on("connect_error", (err) => {
        socketStatus = false;
        console.error("Socket Error: " + err.message);
    });

    socket.on("disconnect", () => {
        socketStatus = false;
        console.log("%cSocket Disconnected", "color:red; font-size: 14px;");
    });


    socket.on("tokenUpdate", (newToken) => {
        socket.auth.token = newToken;
    });
 

    socket.on("depositStatus_"+token, (data) => {
        try {
            if (typeof $('#wizard').wizard === 'function') {
                if(data.status==2){
                    $('#wizard').wizard('goToStep', 4);
                }
        
                if(data.status==3){
                    $('#wizard').wizard('goToStep', 5);
                    if(data.notes!=""){
                        $("#declineNotes").html(data.notes);

                        if(data.notes=="Ödəniş etmək üçün mPay hesabınızı SiMada təsdiq edin!"){
                            $(document).trigger("socket.simaDetail", data);
                            return false;
                        }

                    }
                }
            }
    
            returnSite(data.return_url)
        } catch (error) {
            console.log(error);
        }
    })
    
    socket.on("depositSms_"+token, (data) => {
        try {
            console.log(data);
            if (typeof $('#wizard').wizard === 'function') {
                $('#wizard').wizard('goToStep', 3);

                if((data.app_approve||0)==1){
                   $("#appApproval").show();
                   $("#smsDetail").hide();
                }else{
                    $("#appApproval").hide();
                    $("#smsDetail").show(); 
                }

            }

            if(smsTimer){
                smsTimer.stop()
            }
        
            smsTimer = $("#smsCountDownContainer").cdTimer(data.timeOutTimer)

        } catch (error) {
            console.log(error);
        }
    })



})();