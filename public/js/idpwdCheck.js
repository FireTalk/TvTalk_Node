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
          }else{

          }
        });

      }
    }else if(msg =='fail') alert("네트워크 상태가 원활하지 않습니다.");
});

$("#button_login").on("click",function(){
  var id = document.getElementById("input_id").value;
  var password = document.getElementById("input_password").value;

  if (!id) { // 아이디, 비밀번호 입력 여부 파악
      if (!password) {
        toastSetPostion()
        Materialize.toast('아이디와 비밀번호를 입력해주세요.', 3000, 'rounded');
          // alert("아이디와 비밀번호를 입력해주세요.");
          return false;
      }
      toastSetPostion()
      Materialize.toast('아이디를 입력해주세요.', 3000, 'rounded');
      // alert("아이디를 입력해주세요.");
      return false;
  } else { // 아이디 유효성 검사
      //이메일
      if (! /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(id)) {
          toastSetPostion()
          Materialize.toast("아이디를 이메일 형식에 맞게 입력해주세요.", 3000, 'rounded');
          // alert("아이디를 이메일 형식에 맞게 입력해주세요.");
          return false;
      }
  }

  if (!password) { // 비밀번호 입력 여부 파악
      toastSetPostion()
      Materialize.toast("비밀번호를 입력해주세요.", 3000, 'rounded');
      // alert("비밀번호를 입력해주세요.");
      return false;
  } else { // 비밀번호 유효성 검사
      // 길이
      if (!/^[a-zA-Z0-9]{6,12}$/.test(password)) {
        toastSetPostion()
        Materialize.toast("비밀번호는 영문, 숫자 조합으로 6~12자리를 사용해야 합니다.", 3000, 'rounded');
          // alert("비밀번호는 영문, 숫자 조합으로 6~12자리를 사용해야 합니다.");
          return false;
      }

      // 영문, 숫자 혼용
      var check = 0;
      if (password.search(/[0-9]/g) != -1) check++;
      if (password.search(/[a-z]/ig) != -1) check++;
      if (password.search(/[!@#$%^&*()?_~]/g) != -1) check--;
      if (check < 2) {
          toastSetPostion()
          Materialize.toast("비밀번호는 특수문자를 제외한 영문, 숫자를 혼용하여야 합니다.", 3000, 'rounded');
          // alert("비밀번호는 특수문자를 제외한 영문, 숫자를 혼용하여야 합니다.");
          return false;
      }
  }

   firebase.auth().signInWithEmailAndPassword(id, password).then(function(data){
      if($('#back').val()=='main')
        location.href="/main";
      else if($('#back').val()=='user'){
        location.href="/user";
      }else if($('#back').val()=='nickname_change'){
        location.href="/nickname_change";
      }else if($('#back').val()=='pwd_change'){
        location.href="/pwd_change";
      }
      else{
        var back = $('#back').val().split('_');
        location.href="/chatroom?drama="+back[0]+"&order="+back[1];
      }
   }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("로그인에러", errorMessage);
    // alert("로그인에러 : 개발자에게 꼭 알려주세요!(캡처햐두시면 감사감사)"+errorCode+" : "+errorMessage);
    alert("잘못된 로그인 정보입니다.");
    alert("에러 : "+errorCode);
  });

});

// function idPwdCheck() {
//     var id = document.getElementById("input_id").value;
//     var password = document.getElementById("input_password").value;
//     var chk = 0;
//     if (!id) { // 아이디, 비밀번호 입력 여부 파악
//         if (!password) {
//             alert("아이디와 비밀번호를 입력해주세요.");
//             chk++;
//         }
//         alert("아이디를 입력해주세요.");
//         chk++;
//     } else { // 아이디 유효성 검사
//         //이메일
//         if (! /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(id)) {
//             alert("아이디를 이메일 형식에 맞게 입력해주세요.");
//             chk++;
//         }
//     }

//     if (!password) { // 비밀번호 입력 여부 파악
//         alert("비밀번호를 입력해주세요.");
//         chk++;
//     } else { // 비밀번호 유효성 검사
//         // 길이
//         if (!/^[a-zA-Z0-9]{6,12}$/.test(password)) {
//             alert("비밀번호는 영문, 숫자 조합으로 6~12자리를 사용해야 합니다.");
//             chk++;
//         }

//         // 영문, 숫자 혼용
//         var check = 0;
//         if (password.search(/[0-9]/g) != -1) check++;
//         if (password.search(/[a-z]/ig) != -1) check++;
//         if (password.search(/[!@#$%^&*()?_~]/g) != -1) check--;
//         if (check < 2) {
//             alert("비밀번호는 특수문자를 제외한 영문, 숫자를 혼용하여야 합니다.");
//             return false;
//         }
//     }
//     if(chk == 0 ){
//        firebase.auth().signInWithEmailAndPassword(id, password).then(function(data){
//                   location.herf="/main";
//        }).catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         console.log("로그인에러", errorMessage);
//         // alert("로그인에러 : 개발자에게 꼭 알려주세요!(캡처햐두시면 감사감사)"+errorCode+" : "+errorMessage);
//         alert("잘못된 로그인 정보입니다.");
//         alert("테스트중 : "+errorCode);
//       });
//      }
// }


function checkEndInput() {
    var id = document.getElementById("input_id").value;
    var password = document.getElementById("input_password").value;
    var btn_login = document.getElementById("button_login");

    if (!id && ! password) {
        // id와 password 모두 입력 되지 않음
    }
    else {
        // 입력되었을 경우 아이디 입력되어 있고 비밀번호 수가 단순히 6자 이상인 것을 기준으로 변화
        if (password.length >= 6 && id != "") {
            btn_login.style.backgroundColor = "black";
            btn_login.style.color = "white";
        } else {
            btn_login.style.backgroundColor = "white";
            btn_login.style.color = "#252525";
        }
    }

}

function fb(){
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      var obj = {
        nickname : user.displayName,
        profile : user.photoURL,
        email : user.email,
        facebook : true

      }
      firebase.database().ref('member').child(user.uid).set(obj).then(function(){
        if($('#back').val()=='main')
            location.href="/main";
          else if($('#back').val()=='user'){
            location.href="/user";
          }else if($('#back').val()=='nickname_change'){
            location.href="/nickname_change";
          }else if($('#back').val()=='pwd_change'){
            location.href="/pwd_change";
          }
          else{
            var back = $('#back').val().split('_');
            location.href="/chatroom?drama="+back[0]+"&order="+back[1];
          }
      });


    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // console.log("에러낫대", errorMessage);
      // console.log("에러메일", email);
    });
}

function toastSetPostion(){
  var toast_left = $('#toast-container').width()/2;
  $('#toast-container').css('margin-left', '-' + toast_left + 'px');
}
