var message_list = [];
var socket = io();
var cnt = 0;
var connection = false;
var login_chk =false;

socket.emit('check', 'tvtalk');
socket.on('config', function(msg) {
    if(msg !='fail'){
        if(connection == false){
            connection = true;
            firebase.initializeApp(msg);

            var db = firebase.database();
            var data_length;

            firebase.auth().onAuthStateChanged(function(user) {

                if(!login_chk){
                    login_chk = true;
                    if (user) {
                      loginForm();
                      getMsg(db, user.uid);

                    } else {
                      logoutForm();
                      getMsg(db, 'not');
                    }
                }

            });

            db.ref('drama').child($("#key").val()).on("value",function(data){
                //채팅방 이름
                $('#chatroom_name').text(data.val().title+' '+$("#order").val()+'화');
            });

        }


    }else if(msg =='fail') alert("네트워크 상태가 원활하지 않습니다.");
});

var scrollBottom;
var phoneBody = $(".phone-body");


var final_chk = false;
var before_uid;
var before_key;

function getMsg(db, uid){
    var cnt = 0;

    db.ref('chat/'+$("#key").val()+'_'+$("#order").val()).on("child_added", function(data){


        if(uid == "not"){

            show_left(db, data);
        }
        else{//로그인O

            if(data.key != 'people' && data.val().uid == uid){//내가 보낸것
                if(data.val().type == "1"){
                    $('.collection').append(
                        $('<div>').attr('class', 'row').append(
                            $('<li>').attr('class', 'collection-item avatar my-msg').append(
                               $('<p>').attr('class', 'msg2').text(data.val().msg)
                            )
                        )
                    );
                }else if(data.val().type == "2"){
                    $('.collection').append(
                        $('<div>').attr('class', 'row right_emoticon').append(
                            $('<li>').attr('class', 'collection-item avatar my-msg').append(
                                $('<img>').attr('class', 'send_emoticon').attr('src', '../images/'+data.val().emo+'.png')
                            )
                        )
                    );
                }else if(data.val().type == "3"){
                    // 채팅방에 텍스트  이모티콘 붙이기
                    $('.collection').append(
                        $('<div>').attr('class', 'row').append(
                            $('<li>').attr('class', 'collection-item avatar my-msg2').append(
                                $('<img>').attr('class', 'send_emoticon').attr('src', '../images/'+data.val().emo+'.png')
                            ),
                            $('<li>').attr('class', 'collection-item avatar my-msg2').append(
                                $('<p>').attr('class', 'msg2').text(data.val().msg)
                            )
                        )
                    );
                }
            }else{//남이 보낸 것
                show_left(db, data);
            }
        }
        cnt++;
        db.ref('chat/'+$("#key").val()+'_'+$("#order").val()).once("value", function(datas){

            if(cnt == datas.numChildren() && final_chk==false){
                final_chk = true;
                setTimeout(function () {
                   goBottom();
               }, 50);
            }
        });
    });

    function show_left(db, data){
        var nick;
        var profile;

        db.ref("member/"+data.val().uid).once("value").then(function(chatinfo){
            if(chatinfo.val().profile != null) profile = chatinfo.val().profile;
            else profile = '../images/user.png';
            nick = chatinfo.val().nickname;

            $('.chat'+data.key).find('.circle').attr('src',profile);
            $('.chat'+data.key).find('.nickname').text(nick);
            if($('.phone-body')[0].scrollHeight - $('.phone-body').scrollTop() > 700){
                $('#bottom_message').remove();
                $('#button_plus').before(
                    $('<div>').attr('id', 'bottom_message').append(
                        $('<img>').attr('id', 'message_profile').attr('class', 'circle').attr('src', profile),
                        $('<div>').attr('id', 'bottom_text').text(data.val().msg),
                        $('<img>').attr('id', 'scroll_bottom').attr('src', 'images/bottom_scroll.png').attr('alt', 'scroll_bottom').attr('onclick','goBottom()')
                    )
                )
            }
        });


        if(before_uid == data.val().uid && parseInt(before_key)+1 == parseInt(data.key)){//동일인물

            if(data.val().type == "1"){
                $('.collection').append(
                    $('<div>').attr('class', 'row chat'+data.key).append(
                        $('<li>').attr('class', 'collection-item avatar').append(

                            $('<p>').attr('class', 'msg1').text(data.val().msg)
                        )
                    )
                );
            }else if(data.val().type == "2"){

                $('.collection').append(
                    $('<div>').attr('class', 'row emoticon_chat chat'+data.key).append(
                        $('<li>').attr('class', 'collection-item avatar other-msg-emoticon').append(

                            $('<img>').attr('class', 'left_emoticon other_send_emoticon').attr('src', '../images/'+data.val().emo+'.png')
                        )
                    )
                );
            }else if(data.val().type == "3"){

                $('.collection').append(
                    $('<div>').attr('class', 'row chat'+data.key).append(
                        $('<li>').attr('class', 'collection-item avatar other-msg-emoticon').append(

                            $('<img>').attr('class', 'left_emoticon other_send_emoticon2').attr('src', '../images/'+data.val().emo+'.png')
                        ),
                        $('<li>').attr('class', 'collection-item avatar second_li').append(
                            $('<p>').attr('class', 'msg1').text(data.val().msg)
                        )
                    )
                )
            }
        }
        else{

            if(data.val().type == "1"){
                $('.collection').append(
                    $('<div>').attr('class', 'row chat'+data.key).append(
                        $('<li>').attr('class', 'collection-item avatar').append(
                            $('<img>').attr('src', profile).attr('class', 'circle'),
                            $('<span>').attr('class', 'nickname').text(nick),
                            $('<p>').attr('class', 'msg1').text(data.val().msg)
                        )
                    )
                );
            }else if(data.val().type == "2"){

                $('.collection').append(
                    $('<div>').attr('class', 'row emoticon_chat chat'+data.key).append(
                        $('<li>').attr('class', 'collection-item avatar other-msg-emoticon').append(
                            $('<img>').attr('src', profile).attr('class', 'circle'),
                            $('<span>').attr('class', 'nickname').text(nick),
                            $('<img>').attr('class', 'left_emoticon other_send_emoticon').attr('src', '../images/'+data.val().emo+'.png')
                        )
                    )
                );
            }else if(data.val().type == "3"){

                $('.collection').append(
                    $('<div>').attr('class', 'row chat'+data.key).append(
                        $('<li>').attr('class', 'collection-item avatar other-msg-emoticon').append(
                            $('<img>').attr('src', profile).attr('class', 'circle'),
                            $('<span>').attr('class', 'nickname').text(nick),
                            $('<img>').attr('class', 'left_emoticon other_send_emoticon2').attr('src', '../images/'+data.val().emo+'.png')
                        ),
                        $('<li>').attr('class', 'collection-item avatar second_li').append(
                            $('<p>').attr('class', 'msg1').text(data.val().msg)
                        )
                    )
                )
            }

        }
        before_uid = data.val().uid;
        before_key = data.key;
    }//show_left()

}

// 최근 온 메시지 위치로 맨 아래로 스크롤 내리기
// $('#scroll_bottom').on("click", function () {
function goBottom(){
    $('.phone-body').scrollTop(10000000);
    // $('.phone-body').scrollTop($('.phone-body')[0].scrollHeight); // 스크롤 맨 아래
    $('#bottom_message').remove();
}

var didScroll;
// 스크롤시에 사용자가 스크롤했다는 것을 알림
$(".phone-body").scroll(function(event){
    didScroll = true;

});

// hasScrolled()를 실행하고 didScroll 상태를 재설정
setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    if(($(".phone-body")[0].scrollHeight-$(".phone-body").scrollTop()) < 700 ){
        // goBottom();
        $('#bottom_message').remove();
    }
}

