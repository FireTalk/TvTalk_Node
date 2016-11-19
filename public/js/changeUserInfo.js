var socket = io();
var file = null;
var connection = false;

socket.emit('check', 'tvtalk');
socket.on('config', function(msg) {
    if(msg !='fail'){
        if(connection == false){
            firebase.initializeApp(msg);
            connection = true;

            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {

                if(firebase.auth().currentUser.photoURL !=null){
                    $('#profile_img').attr('src',firebase.auth().currentUser.photoURL);
                }else{
                    $('#profile_img').attr('src', "images/user.png");
                }

                if(firebase.auth().currentUser.email != null){
                    $('#nickname').text(firebase.auth().currentUser.displayName);
                    $('#input_id').val(firebase.auth().currentUser.email);
                }
                else{
                    $('#input_id').val("FaceBook User");
                }

              }else{
                alert("로그인이 필요합니다.");
                location.href = '/login/user';
              }
            });
        }


    }else if(msg =='fail') alert("네트워크 상태가 원활하지 않습니다.");
});


$('#select_img').on('change', function (e) {
    file = e.target.files[0];

    var select_img = this.value;


    var select_img_chk = select_img.slice(select_img.indexOf(".") + 1).toLowerCase(); //파일 확장자를 잘라내고, 비교를 위해 소문자로 만듭니다.

    if (select_img_chk != "jpg" && select_img_chk != "png" && select_img_chk != "gif" && select_img_chk != "bmp") { //확장자를 확인합니다.
        // alert('프로필은 이미지 파일(jpg, png, gif, bmp)만 등록 가능합니다.');
        toastSetPostion();
        Materialize.toast('프로필은 이미지 파일(jpg, png, gif, bmp)만 등록 가능합니다.', 3000, 'rounded');
        return;
    } else { // 이미지 파일일 경우
        // 프로필 이미지 변경
        // console.log('this.files = '+this.files);
        // console.log('this.files = '+this.files[0]);

        if(file != null){
            var storageRef = firebase.storage().ref('profile/'+firebase.auth().currentUser.uid+'.png');
            var task = storageRef.put(file);
            task.on('state_changed',
                function progress(snapshot){
                    // 진행률
                },
                function error(err){
                    console.log('업로드 에러');
                },
                function complete(){

                    storageRef.getDownloadURL().then(function(url) {

                            firebase.auth().currentUser.updateProfile({
                                photoURL : url
                            }).then(function(){
                                var obj = {
                                  nickname : firebase.auth().currentUser.displayName,
                                  profile : url
                                }
                                firebase.database().ref('member').child(firebase.auth().currentUser.uid).update(obj).then(function(){
                                    toastSetPostion();
                                    Materialize.toast("사진변경완료", 3000, 'rounded');

                                    // alert("사진변경완료");
                                });

                            }, function(err){
                                console.log("가입(닉네임)에러 : 개발자에게 문의해주세요!");
                            });

                        }, function(err){
                            alert("사진 업로드 에러"+err);
                        });
                }
            );
        }
        readURL(this);
    }
});

function readURL(input) {
    if (input.files && input.files[0]) {

        var reader = new FileReader(); //파일을 읽기 위한 FileReader객체 생성
        reader.onload = function (e) {
            //파일 읽어들이기를 성공했을때 호출되는 이벤트 핸들러

            //이미지 잘라서 넣기
            var img = new Image();
            img.src = e.target.result;

            //alert(img.width);
            //alert(img.height);
            var width = img.width;
            var height = img.height;
            var center_w = width / 2;
            var center_h = height / 2;

            var min_legth;

            if (width <= height) {
                min_legth = img.width;
            } else {
                min_legth = img.height;
            }

            var crop_canvas,
                crop_left = center_w - min_legth / 2,
                crop_top = center_h - min_legth / 2,
                crop_width = min_legth,
                crop_heigth = min_legth;

            crop_canvas = document.createElement('canvas');
            crop_canvas.width = crop_width;
            crop_canvas.height = crop_heigth;

            $('#profile_img').attr('src', e.target.result);

            // var image_target = $('#profile_img').get(0);

            // crop_canvas.getContext('2d').drawImage(image_target, crop_left, crop_top, crop_width, crop_heigth, 0, 0, crop_width, crop_heigth);


            // $('#profile_img').attr('src', crop_canvas.toDataURL("image/png")); // 자른 이미지로 설정하기


        }
        reader.readAsDataURL(input.files[0]);

    }
}//--readURL()


$('#button_change').on("click", function() {
    var password = document.getElementById("input_password").value;
    var pwCheck = document.getElementById("input_num").value;
    var nick = $('#nickname').val();
    if (!/^[a-zA-Z0-9\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]{2,12}$/.test(nick)) {
        toastSetPostion();
        Materialize.toast("닉네임은 한글, 영문, 숫자만 가능하며\n2~12자리를 사용해야 합니다.\n*공백이나 특수문자 불가*", 3000, 'rounded');

        // alert("닉네임은 한글, 영문, 숫자만 가능하며\n2~12자리를 사용해야 합니다.\n*공백이나 특수문자 불가*");
        return false;
    }

    else if (!password) { // 비밀번호 입력 여부 파악
        toastSetPostion();
        Materialize.toast("비밀번호를 입력해주세요.", 3000, 'rounded');
        // alert("비밀번호를 입력해주세요.");
        return false;
    }

    // 비밀번호 유효성 검사
    // 길이
    else if (!/^[a-zA-Z0-9]{6,12}$/.test(password)) {
        toastSetPostion();
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
        toastSetPostion();
        Materialize.toast("비밀번호는 특수문자를 제외한 영문, 숫자를 혼용하여야 합니다.", 3000, 'rounded');
      // alert("비밀번호는 특수문자를 제외한 영문, 숫자를 혼용하여야 합니다.");
      return false;
    }


    else if (!pwCheck) { // 비밀번호확인 입력 여부 파악
        toastSetPostion();
        Materialize.toast("비밀번호를 다시 한 번 입력해주세요.", 3000, 'rounded');
        // alert("비밀번호를 다시 한 번 입력해주세요.");
        return false;
    }else if(pwCheck != password){
        toastSetPostion();
        Materialize.toast("비밀번호가 일치하지 않습니다.", 3000, 'rounded');
    // alert("비밀번호가 일치하지 않습니다.");
    }else{

        if(file != null){
            var storageRef = firebase.storage().ref('profile/'+firebase.auth().currentUser.uid+'.png');
            var task = storageRef.put(file);
            task.on('state_changed',
                function progress(snapshot){
                    // 진행률
                },
                function error(err){
                    console.log('업로드 에러');
                },
                function complete(){
                    firebase.auth().currentUser.updatePassword(pwCheck).then(function(){

                        storageRef.getDownloadURL().then(function(url) {

                                firebase.auth().currentUser.updateProfile({
                                    displayName : nick,
                                    photoURL : url
                                }).then(function(){

                                    var obj = {
                                      nickname : nick,
                                      profile : url
                                    }
                                    firebase.database().ref('member').child(firebase.auth().currentUser.uid).update(obj).then(function(){
                                        toastSetPostion();
                                        Materialize.toast("변경완료", 3000, 'rounded');
                                        // alert("변경완료");
                                        location.href = "/main";
                                    });



                                }, function(err){
                                    console.log("가입(닉네임)에러 : 개발자에게 문의해주세요!");
                                });

                            }, function(err){
                                alert("에러"+err);
                            });


                        }).catch(function(error) {
                          // Handle any errors
                          alert("네트워크 상태가 불안정합니다. 잠시 후 시도 해주세요.");
                          // console.log("프로필 에러"+error);
                        });
                }
            );
        }else{//사진 안바꿧을 경우
            firebase.auth().currentUser.updatePassword(pwCheck).then(function(){

                firebase.auth().currentUser.updateProfile({
                    displayName : nick
                    // photoURL : url
                }).then(function(){

                    var obj = {
                      nickname : nick
                      // profile : url
                    }
                    firebase.database().ref('member').child(firebase.auth().currentUser.uid).update(obj).then(function(){
                        toastSetPostion();
                        Materialize.toast("변경완료", 3000, 'rounded');
                        // alert("변경완료!");
                        location.href = "/main";
                    });

                }, function(err){
                    console.log("가입(닉네임)에러 : 개발자에게 문의해주세요!");
                });


            }).catch(function(error) {
              // Handle any errors
              console.log("프로필 에러"+error);
            });
        }


    }
});

function checkEndInput() {
    var nick = $('#nickname').val();
    var password = document.getElementById("input_password").value;
    var pwCheck = document.getElementById("input_num").value;
    var btn_change = document.getElementById("button_change");

    if (! password && ! nick && ! pwCheck) {
        // email과 password 모두 입력 되지 않음
    }
    else {
        // 입력되었을 경우 이메일 입력되어 있고 비밀번호 수가 단순히 4자 이상인 것을 기준으로 변화
        if (password.length >= 6 && pwCheck.length >= 6 && nick.length>=2) {
            btn_change.style.backgroundColor = "black";
            btn_change.style.color = "white";
        } else {
            btn_change.style.backgroundColor = "white";
            btn_change.style.color = "#252525";
        }
    }
}

function checkUser(){
    var uid = firebase.auth().currentUser.uid;
    var ref = firebase.database().ref("/member/"+uid+"/facebook");
    ref.once("value", function(data){
        if(data.val() == true){
            toastSetPostion();
            Materialize.toast('페이스북 이용자는 변경할 수 없습니다.', 3000, 'rounded');
        }else{
            location.href="/pwd_change";
        }
    });
}

function toastSetPostion(){
  var toast_left = $('#toast-container').width()/2;
  $('#toast-container').css('margin-left', '-' + toast_left + 'px');
}
