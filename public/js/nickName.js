var socket = io();
var connection = false;

socket.emit('check', 'tvtalk');
socket.on('config', function(msg) {
    if(msg !='fail'){
        if(connection == false){
            firebase.initializeApp(msg);
            connection = true;
            var db = firebase.database();

            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                $("#input_nick_org").val(firebase.auth().currentUser.displayName);

              } else {//로그인X
                alert("로그인이 필요합니다.");
                location.href="/login/nickname_change";
              }
            });
        }

    }else if(msg =='fail') alert("네트워크 상태가 원활하지 않습니다.");
})


function checkEndNick() {
    var new_nick = document.getElementById("input_nick_new").value;
    var btn_change = document.getElementById("button_change");

    if (! new_nick) {
        // 닉네임 입력이안됨
        btn_change.style.backgroundColor = "white";
        btn_change.style.color = "#252525";

    }else {
        // 입력되었을 경우 이메일 입력되어 있고 비밀번호 수가 단순히 4자 이상인 것을 기준으로 변화
        if (new_nick.length>=2) {
            btn_change.style.backgroundColor = "black";
            btn_change.style.color = "white";
        } else {
            btn_change.style.backgroundColor = "white";
            btn_change.style.color = "#252525";
        }
    }
}

$("#button_change").on("click",function(){
    var new_nick = document.getElementById("input_nick_new").value;
    if (! new_nick) {
        //닉네임 입력이안됨
        toastSetPostion()
        Materialize.toast('닉네임을 입력해 주세요.', 3000, 'rounded');
        return false;
    }else if (!/^[a-zA-Z0-9\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]{2,12}$/.test(new_nick)) {
        toastSetPostion()
        Materialize.toast('닉네임은 한글, 영문, 숫자만 가능하며\n2~12자리를 사용해야 합니다.\n공백, 특수문자 불가', 3000, 'rounded');
        // alert('닉네임은 한글, 영문, 숫자만 가능하며\n2~12자리를 사용해야 합니다.\n*공백, 특수문자 불가*');
      return false;
    }else{
        firebase.auth().currentUser.updateProfile({
            displayName : new_nick
        }).then(function(){
            var obj = {
              nickname : new_nick
            };
            firebase.database().ref('member').child(firebase.auth().currentUser.uid).update(obj).then(function(){
                alert("닉네임이 변경되었습니다.");
                location.href = "/main";
            });
        });
    }
});

function toastSetPostion(){
  var toast_left = $('#toast-container').width()/2;
  $('#toast-container').css('margin-left', '-' + toast_left + 'px');
}

