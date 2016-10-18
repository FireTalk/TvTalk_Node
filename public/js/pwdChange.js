var socket = io();
var connection = false;

socket.emit('check', 'tvtalk');
socket.on('config', function(msg) {
    if(msg !='fail'){
      if(connection == false){
        connection = true;
        firebase.initializeApp(msg);

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // alert('이미 로그인 되었습니다.');
            // location.href='/main';
            var ref = firebase.database().ref("member/"+user.uid+"/facebook");
            ref.once('value', function(data){
                if(data.val() == true){
                    alert("페이스북 유저는 변경할 수 없습니다.");
                    location.href = '/main';
                }
            });
          }else{
            alert("로그인이 필요합니다.");
            location.href = '/login/pwd_change';
          }
        });

      }
    }else if(msg =='fail') alert("네트워크 상태가 원활하지 않습니다.");
});



function checkEndInput() {
    var password = document.getElementById("input_password").value;
    var pwNew = document.getElementById("input_pwNew").value;
    var pwCheck = document.getElementById("input_pwCheck").value;
    var btn_change = document.getElementById("button_change");

    if (! password && ! pwCheck && ! pwNew) {
        // password 모두 입력 되지 않음
        btn_change.style.backgroundColor = "white";
        btn_change.style.color = "#252525";
        // toastSetPostion()
        // Materialize.toast('비밀번호를 입력하세요.', 3000, 'rounded');
    }
    else {
        if (password.length >= 6 && pwCheck.length >= 6 && pwNew.length >= 6) {
            btn_change.style.backgroundColor = "black";
            btn_change.style.color = "white";
        } else {
            btn_change.style.backgroundColor = "white";
            btn_change.style.color = "#252525";
        }
    }
}

$('#button_change').on("click", function() {
    var password = document.getElementById("input_password").value;
    var pwNew = document.getElementById("input_pwNew").value;
    var pwCheck = document.getElementById("input_pwCheck").value;

    if (!password) { // 비밀번호 입력 여부 파악
      // alert("비밀번호를 입력해주세요.");
      toastSetPostion()
      Materialize.toast('현재 비밀번호를 입력해주세요.', 3000, 'rounded');
      return false;
    }

    // 비밀번호 유효성 검사
    // 길이
    else if (!/^[a-zA-Z0-9]{6,12}$/.test(pwNew)) {
      // alert("비밀번호는 영문, 숫자 조합으로 6~12자리를 사용해야 합니다.");
      toastSetPostion()
      Materialize.toast('비밀번호는 영문, 숫자 조합으로 6~12자리를 사용해야 합니다.', 3000, 'rounded');
      return false;
    }

    // 영문, 숫자 혼용
    var check = 0;
    if (pwNew.search(/[0-9]/g) != -1) check++;
    if (pwNew.search(/[a-z]/ig) != -1) check++;
    if (pwNew.search(/[!@#$%^&*()?_~]/g) != -1) check--;
    if (check < 2) {
      // alert("비밀번호는 특수문자를 제외한 영문, 숫자를 혼용하여야 합니다.");
      toastSetPostion()
      Materialize.toast('비밀번호는 특수문자를 제외한 영문, 숫자를 혼용하여야 합니다.', 3000, 'rounded');
      return false;
    }

    else if (!pwCheck) { // 비밀번호확인 입력 여부 파악
        toastSetPostion()
        Materialize.toast('비밀번호를 다시 한 번 입력해주세요.', 3000, 'rounded');
      // alert("비밀번호를 다시 한 번 입력해주세요.");
      return false;
    }else if(pwCheck != pwNew){
        toastSetPostion()
        Materialize.toast('비밀번호가 일치하지 않습니다.', 3000, 'rounded');
    // alert("비밀번호가 일치하지 않습니다.");
        return false;
    }else{
        firebase.auth().signInWithEmailAndPassword(firebase.auth().currentUser.email, password).then(function(data){
            firebase.auth().currentUser.updatePassword(pwCheck).then(function(){
                alert("비밀번호가 변경되었습니다.");
                location.href = "/main";
            });
        }).catch(function(err){
            // alert("현재 비밀번호가 일치하지 않습니다."+err);
            toastSetPostion()
            Materialize.toast('현재 비밀번호가 일치하지 않습니다.', 3000, 'rounded');
        });
    }
});

function toastSetPostion(){
  var toast_left = $('#toast-container').width()/2;
  $('#toast-container').css('margin-left', '-' + toast_left + 'px');
}