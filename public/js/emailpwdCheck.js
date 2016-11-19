var socket = io();
var connection = false;

socket.emit('check', 'tvtalk');
socket.on('config', function(msg) {
    if(msg !='fail'){
      if(connection == false){
        firebase.initializeApp(msg);
        connection = true;

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            user.sendEmailVerification().then(function(){

              var obj = {
                nickname : user.displayName,
                profile : user.photoURL,
                email : user.email,
                facebook : false
              }
              firebase.database().ref('member').child(user.uid).set(obj).then(function(){
                if($('#hidden').val()=='main')
                    location.href="/main";
                else if($('#hidden').val()=='user'){
                  location.href="/user";
                }else if($('#hidden').val()=='nickname_change'){
                  location.href="/nickname_change";
                }else if($('#hidden').val()=='pwd_change'){
                  location.href="/pwd_change";
                }
                else{
                  var back = $('#hidden').val().split('_');
                  location.href="/chatroom?drama="+back[0]+"&order="+back[1];
                }

              });
            });
          }
        });
      }

    }else if(msg =='fail') alert("네트워크 상태가 원활하지 않습니다.");
});



$("#button_join").on("click", function(){
    var email = document.getElementById("input_email").value;
    var password = document.getElementById("input_password").value;
    var nick = document.getElementById("input_nick").value;
    var pwCheck = document.getElementById("input_pwCheck").value;

      if (!email) { // 이메일 입력 여부 파악
          // alert("이메일을 입력해주세요.");
          toastSetPostion();
          Materialize.toast('이메일을 입력해주세요.', 3000, 'rounded');
          return false;
      }
       // 이메일 유효성 검사
          //이메일
         else if (! /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(email)) {
            toastSetPostion();
              Materialize.toast('이메일을 형식에 맞게 입력해주세요.', 3000, 'rounded');
              // alert("이메일을 형식에 맞게 입력해주세요.");
              return false;
          }

      else if (!nick) { // 닉네임 입력 여부 파악
        toastSetPostion();
        Materialize.toast('닉네임을 입력해주세요.', 3000, 'rounded');
        // alert("닉네임을 입력해주세요.");
        return false;
      }


      // 닉네임 유효성 검사
          else if (!/^[a-zA-Z0-9\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]{2,12}$/.test(nick)) {
            toastSetPostion();
            Materialize.toast("닉네임은 한글, 영문, 숫자만 가능하며\n2~12자리를 사용해야 합니다.\n*공백이나 특수문자 불가*", 3000, 'rounded');
            // alert("닉네임은 한글, 영문, 숫자만 가능하며\n2~12자리를 사용해야 합니다.\n*공백이나 특수문자 불가*");
            return false;
          }

       else if (!password) { // 비밀번호 입력 여부 파악
          // alert("비밀번호를 입력해주세요.");
          toastSetPostion();
          Materialize.toast('비밀번호를 입력해주세요.', 3000, 'rounded');
          return false;
      }

       // 비밀번호 유효성 검사
          // 길이
          else if (!/^[a-zA-Z0-9]{6,12}$/.test(password)) {
              // alert("비밀번호는 영문, 숫자 조합으로 6~12자리를 사용해야 합니다.");
              toastSetPostion();
              Materialize.toast('비밀번호는 영문, 숫자 조합으로 6~12자리를 사용해야 합니다.', 3000, 'rounded');
              return false;
          }

          // 영문, 숫자 혼용
          var check = 0;
          if (password.search(/[0-9]/g) != -1) check++;
          if (password.search(/[a-z]/ig) != -1) check++;
          if (password.search(/[!@#$%^&*()?_~]/g) != -1) check--;
          if (check < 2) {
              // alert("비밀번호는 특수문자를 제외한 영문, 숫자를 혼용하여야 합니다.");
              toastSetPostion();
              Materialize.toast('비밀번호는 특수문자를 제외한 영문, 숫자를 혼용하여야 합니다.', 3000, 'rounded');
              return false;
          }


          else if (!pwCheck) { // 비밀번호확인 입력 여부 파악
            toastSetPostion();
            Materialize.toast('비밀번호를 다시 한 번 입력해주세요.', 3000, 'rounded');
              // alert("비밀번호를 다시 한 번 입력해주세요.");
              return false;
      }else if(pwCheck != password){
        toastSetPostion();
        Materialize.toast('비밀번호가 일치하지 않습니다.', 3000, 'rounded');
        // alert("비밀번호가 일치하지 않습니다.");
      }else{
          //preloader지우기
            $('.preloader-wrapper').css('display', 'block');
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(data){
            console.log("가입성공",data);

            firebase.auth().currentUser.updateProfile({
                displayName : nick
            }).then(function(){
              console.log("닉네임 변경 완료"+data.displayName);
            }, function(err){
                console.log("가입(닉네임)에러 : 개발자에게 문의해주세요!");
            });

        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if(errorCode == "auth/email-already-in-use"){
            // alert("이미 사용중인 이메일입니다");
            toastSetPostion();
            Materialize.toast('이미 사용중인 이메일입니다.', 3000, 'rounded');
          }else{
            alert("가입에러 : 개발자에게 꼭 알려주세요!(캡처해두시면 감사감사)"+errorCode+" : "+errorMessage);
          }

        });
      }
});


function checkEndInput() {
    var email = document.getElementById("input_email").value;
    var nick = document.getElementById("input_nick").value;
    var password = document.getElementById("input_password").value;
    var pwCheck = document.getElementById("input_pwCheck").value;
    var btn_login = document.getElementById("button_join");

    if (!email && ! password && ! nick && ! pwCheck) {
        // email과 password 모두 입력 되지 않음
    }
    else {
        // 입력되었을 경우 이메일 입력되어 있고 비밀번호 수가 단순히 4자 이상인 것을 기준으로 변화
        if (password.length >= 6 && pwCheck.length >= 6 && email != "" && nick.length>=2) {
            btn_login.style.backgroundColor = "black";
            btn_login.style.color = "white";
        } else {
            btn_login.style.backgroundColor = "white";
            btn_login.style.color = "#252525";
        }
    }
}

function toastSetPostion(){
  var toast_left = $('#toast-container').width()/2;
  $('#toast-container').css('margin-left', '-' + toast_left + 'px');
}