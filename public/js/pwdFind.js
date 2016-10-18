var socket = io();
var connection = false;

$("#button_change").on("click",function(){
    var id = document.getElementById("input_id").value;
    var btn_change = document.getElementById("button_change");

    if (!id) { // 이메일 입력 여부 파악
        toastSetPostion()
        Materialize.toast('이메일을 입력해주세요.', 3000, 'rounded');
        // alert("이메일을 입력해주세요.");
        return false;
    }
    // 이메일 유효성 검사
    //이메일
   else if (! /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(id)) {
        toastSetPostion()
        // alert("이메일을 형식에 맞게 입력해주세요.");
        Materialize.toast('이메일을 형식에 맞게 입력해주세요.', 3000, 'rounded');
        return false;
    }
    else{
        socket.emit('check', 'tvtalk');
        socket.on('config', function(msg) {
            if(msg !='fail'){
                if(connection == false){
                    connection = true;
                    firebase.initializeApp(msg);

                    var auth = firebase.auth();
                    var emailAddress = id;

                    auth.sendPasswordResetEmail(emailAddress).then(function() {

                      alert("변경메일이 전송되었습니다.");
                      location.href ="login";
                    }, function(error) {
                        toastSetPostion()
                        Materialize.toast('존재하지 않는 메일입니다', 3000, 'rounded');
                      // alert("존재하지 않는 메일입니다");
                    });
                }
            }else if(msg =='fail') alert("네트워크 상태가 원활하지 않습니다.");
        });
    }
});


function checkEndInput() {
    var id = document.getElementById("input_id").value;
    var btn_change = document.getElementById("button_change");

    if (! /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(id)) {
        btn_change.style.backgroundColor = "white";
            btn_change.style.color = "#252525";
    }
    else {
            btn_change.style.backgroundColor = "black";
            btn_change.style.color = "white";
    }
}

function back(){
    history.back();
}

function toastSetPostion(){
  var toast_left = $('#toast-container').width()/2;
  $('#toast-container').css('margin-left', '-' + toast_left + 'px');
}
