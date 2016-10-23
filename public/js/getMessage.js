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

    db.ref('chat/'+$("#key").val()+'_'+$("#order").val()).limitToLast(100).on("child_added", function(data){


        if(uid == "not"){

            show_left(db, data);
        }
        else{//로그인O

            if(data.key != 'people' && data.val().uid == uid){//내가 보낸것
                if(data.val().type == "1"){
                    $('.collection').append(
                        $('<div>').attr('class', 'row chat'+data.key).append(
                            $('<li>').attr('class', 'collection-item avatar my-msg').append(
                               $('<p>').attr('class', 'msg2').text(data.val().msg)
                            )
                        )
                    );
                }else if(data.val().type == "2"){
                    $('.collection').append(
                        $('<div>').attr('class', 'row right_emoticon chat'+data.key).append(
                            $('<li>').attr('class', 'collection-item avatar my-msg').append(
                                $('<img>').attr('class', 'send_emoticon').attr('src', '../images/'+data.val().emo+'.png')
                            )
                        )
                    );
                }else if(data.val().type == "3"){
                    // 채팅방에 텍스트  이모티콘 붙이기
                    $('.collection').append(
                        $('<div>').attr('class', 'row chat'+data.key).append(
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
            var standard;
            if(datas.numChildren()<100){
                standard = datas.numChildren();
            }else{
                standard = 100;
            }
            if(cnt == standard && final_chk==false){
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
    if($(".phone-body").scrollTop() == 0){
        var end = parseInt($(".row").eq(0).attr("class").split(" chat")[1])-1;
        var start ;

        if(end > 1){
            start = parseInt(end)-100;
            if(start < 1) start = 1;
                var before_uid;
                var before_key;
                var uid_set = [];
                firebase.database().ref('chat/'+$("#key").val()+'_'+$("#order").val()).orderByKey().startAt(""+start).endAt(""+end).once("value", function(data){
                    var str = "";
                    var cnt = 0;

                    data.forEach(function(child) {
                        cnt++;

                         var key = child.key;
                         var childData = child.val();
                         var uid = null;
                         if(firebase.auth().currentUser !=null) uid = firebase.auth().currentUser.uid;


                         if(uid !=null && child.key != 'people' && child.val().uid == uid){//내가 보낸것
                            if(child.val().type == "1"){

                                str +=''+
                                    '<div class="row chat'+child.key+'">'+
                                        '<li class="collection-item avatar my-msg">'+
                                           '<p class="msg2">'+child.val().msg+'</p>'+
                                        '</li>'+
                                    '</div>';

                            }else if(child.val().type == "2"){
                                str +=''+
                                    '<div class="row right_emoticon chat'+child.key+'">'+
                                        '<li class="collection-item avatar my-msg">'+
                                            '<img class="send_emoticon" src="../images/'+child.val().emo+'.png">'+
                                        '</li>'+
                                    '</div>';

                            }else if(child.val().type == "3"){
                                // 채팅방에 텍스트  이모티콘 붙이기
                                str +=''+
                                    '<div class="row chat'+child.key+'">'+
                                        '<li class="collection-item avatar my-msg2">'+
                                            '<img class="send_emoticon" src="../images/'+child.val().emo+'.png">'+
                                        '</li>'+
                                        '<li class="collection-item avatar my-msg2">'+
                                            '<p class ="msg2">'+child.val().msg+'</p>'+
                                        '</li>'+
                                    '</div>';

                            }
                         }else{
                            //왼쪽 메세지



                            if(before_uid == child.val().uid && parseInt(before_key)+1 == parseInt(child.key)){//동일인물

                                if(child.val().type == "1"){
                                    str +=''+
                                        '<div class="row chat'+child.key+'">'+
                                            '<li class="collection-item avatar">'+

                                                '<p class="msg1">'+child.val().msg+'</p>'+
                                            '</li>'+
                                        '</div>';

                                }else if(child.val().type == "2"){
                                    str +=''+
                                        '<div class="row emoticon_chat chat'+child.key+'">'+
                                            '<li class="collection-item avatar other-msg-emoticon">'+

                                                '<img class= "left_emoticon other_send_emoticon" src="../images/'+child.val().emo+'.png">'+
                                            '</li>'+
                                        '</div>';

                                }else if(child.val().type == "3"){
                                    str +=''+

                                        '<div class="row chat'+child.key+'">'+
                                            '<li class="collection-item avatar other-msg-emoticon">'+

                                                '<img class="left_emoticon other_send_emoticon2" src ="../images/'+child.val().emo+'.png">'+
                                            '</li>'+
                                            '<li class="collection-item avatar second_li">'+
                                                '<p class="msg1">'+child.val().msg+'</p>'+
                                            '</li>'+
                                        '</div>';

                                }
                            }
                            else{
                                uid_set.push({uid : child.val().uid, key : child.key});
                                if(child.val().type == "1"){
                                    str +=''+
                                        '<div class="row chat'+child.key+'">'+
                                            '<li class="collection-item avatar">'+
                                                '<img src="" class="circle">'+
                                                '<span class="nickname"></span>'+
                                                '<p class = "msg1">'+child.val().msg+'</p>'+
                                            '</li>'+
                                        '</div>';

                                }else if(child.val().type == "2"){

                                    str +=''+
                                        '<div class ="row emoticon_chat chat'+child.key+'">'+
                                            '<li class="collection-item avatar other-msg-emoticon">'+
                                                '<img src="" class="circle">'+
                                                '<span class="nickname"></span>'+
                                                '<img class="left_emoticon other_send_emoticon" src="../images/'+child.val().emo+'.png">'+
                                            '</li>'+
                                        '</div>';

                                }else if(child.val().type == "3"){

                                    str +=''+
                                        '<div class="row chat'+child.key+'">'+
                                            '<li class="collection-item avatar other-msg-emoticon">'+
                                                '<img src="" class="circle">'+
                                                '<span class="nickname"></span>'+
                                                '<img class ="left_emoticon other_send_emoticon2" src="../images/'+child.val().emo+'.png">'+

                                            '<li class ="collection-item avatar second_li">'+
                                                '<p class ="msg1">'+child.val().msg+'</p>'+
                                            '</li>'+
                                        '</div>';

                                }

                            }
                            before_uid = child.val().uid;
                            before_key = child.key;

                        }

                        if(cnt==data.numChildren()){
                            var lastHtml = $('.collection').html();
                            var before_scrollHeight = $('.phone-body')[0].scrollHeight;
                            $('.collection').html(str+lastHtml);
                            var after_scrollHeight = $('.phone-body')[0].scrollHeight;
                            $('.phone-body').scrollTop(after_scrollHeight - before_scrollHeight - 100);
                            for(var i = 0; i <uid_set.length; i++ ){
                                update_chat(uid_set[i]);
                            }
                        }
                     });//forEach
                });
            }
        }
        function update_chat(info){
            var nick;
            var profile;
            firebase.database().ref("member/"+info.uid).once("value", function(chatinfo){
                if(chatinfo.val().profile != null) profile = chatinfo.val().profile;
                else profile = '../images/user.png';
                nick = chatinfo.val().nickname;
                $('.chat'+info.key).find('.circle').attr('src',profile);
                $('.chat'+info.key).find('.nickname').text(nick);
            });
        }

}
