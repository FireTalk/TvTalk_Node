var socket = io();
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
                      // loginForm();
                      getMsg(db, user.uid);

                    } else {
                      // logoutForm();
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

var heart_img;
var likeNum;

var final_chk = false;
var before_uid;
var before_key;

function getMsg(db, uid){
    var cnt = 0;

    db.ref('chat/'+$("#key").val()+'_'+$("#order").val()).limitToLast(100).on("child_added",function(data){

        //preloader지우기
            $('.preloader-wrapper').css('display', 'none');
            
        if(uid == "not"){
            heart_img = '../images/dislike.png';
            likeNum = data.child("like").numChildren();
            show_left(db, data);

        }else{//로그인O
            if(data.child("like").child(uid).exists())
                heart_img = '../images/like2.png';
            else heart_img = '../images/dislike.png';

            likeNum = data.child("like").numChildren();

            if(data.key != 'people' && data.val().uid == uid){//내가 보낸것
                if(data.val().type == "1"){
                    $('.collection').append(
                        $('<div>').attr('class', 'row chat'+data.key).append(
                            $('<li>').attr('class', 'collection-item avatar my-msg').append(
                               $('<p>').attr('class', 'msg2').text(data.val().msg),
                               $('<div>').attr('class', 'secondary-content badge likefunction_my').append($('<img>').attr('class', 'like').attr('src', heart_img).attr('alt', 'msg_like').attr("onclick", "changeHeart("+data.key+")"),
                                $('<span>').attr('class', 'likeNum').text(likeNum)
                                )
                            )
                        )
                    );
                    changeMsgColor(data.key, likeNum , 'me'); // 메시지 색상 변경
                }else if(data.val().type == "2"){
                    $('.collection').append(
                        $('<div>').attr('class', 'row right_emoticon').append(
                            $('<li>').attr('class', 'collection-item avatar my-msg2').append(
                                $('<img>').attr('class', 'send_emoticon').attr('src', '../images/'+data.val().emo+'.png')
                            )
                        )
                    );
                }else if(data.val().type == "3"){
                    // 채팅방에 텍스트  이모티콘 붙이기
                    $('.collection').append(
                        $('<div>').attr('class', 'row chat'+data.key).append(
                            $('<li>').attr('class', 'collection-item avatar my-msg2').append(
                                $('<img>').attr('class', 'send_emoticon2').attr('src', '../images/'+data.val().emo+'.png')
                            ),
                            $('<li>').attr('class', 'collection-item avatar my-msg').append(
                                $('<p>').attr('class', 'msg2').text(data.val().msg),
                                $('<div>').attr('class', 'secondary-content badge likefunction_my').append(
                                    $('<img>').attr('class', 'like').attr('src', heart_img).attr('alt', 'msg_like').attr("onclick", "changeHeart("+data.key+")"),
                                    $('<span>').attr('class', 'likeNum').text(likeNum)
                                )
                            )
                        )
                    );
                    changeMsgColor(data.key, likeNum, 'me');
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
                   $('.phone-body').scrollTop(100000000000);
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

            $('.chat'+data.key).find('.circle').attr('src', profile);
            $('.chat'+data.key).find('.nickname').text(nick);

        });

        if(before_uid == data.val().uid && parseInt(before_key)+1 == parseInt(data.key)){//동일인물

            if(data.val().type == "1"){
                $('.collection').append(
                    $('<div>').attr('class', 'row chat'+data.key).append(
                        $('<li>').attr('class', 'collection-item avatar').append(

                            $('<p>').attr('class', 'msg1').attr('data-attr', '#ff0453').text(data.val().msg),
                            $('<div>').attr('class', 'secondary-content badge likefunction_other').append(
                                $('<img>').attr('class', 'like').attr('src', heart_img).attr('alt', 'msg_like').attr("onclick", "changeHeart("+data.key+")"),
                                $('<span>').attr('class', 'likeNum').text(likeNum)
                            )
                        )
                    )
                );
                changeMsgColor(data.key, likeNum, 'other');
            }else if(data.val().type == "2"){

                $('.collection').append(
                    $('<div>').attr('class', 'row emoticon_chat chat'+data.key).append(
                        $('<li>').attr('class', 'collection-item avatar other-msg-emoticon').append(

                            $('<img>').attr('class', 'other_send_emoticon').attr('src', '../images/'+data.val().emo+'.png')
                        )
                    )
                );
            }else if(data.val().type == "3"){

                $('.collection').append(
                    $('<div>').attr('class', 'row chat'+data.key).append(
                        $('<li>').attr('class', 'collection-item avatar other-msg-emoticon').append(

                            $('<img>').attr('class', 'other_send_emoticon2').attr('src', '../images/'+data.val().emo+'.png')
                        ),
                        $('<li>').attr('class', 'collection-item avatar avatar second_li').append(
                            $('<p>').attr('class', 'msg1').text(data.val().msg),
                            $('<div>').attr('class', 'secondary-content badge likefunction_other').append(
                                $('<img>').attr('class', 'like').attr('src', heart_img).attr('alt', 'msg_like').attr("onclick", "changeHeart("+data.key+")"),
                                $('<span>').attr('class', 'likeNum').text(likeNum)
                            )
                        )
                    )
                );
                changeMsgColor(data.key, likeNum, 'other');
            }

        }else{

            if(data.val().type == "1"){
                $('.collection').append(
                    $('<div>').attr('class', 'row chat'+data.key).append(
                        $('<li>').attr('class', 'collection-item avatar').append(
                            $('<img>').attr('src', profile).attr('class', 'circle'),
                            $('<span>').attr('class', 'nickname').text(nick),
                            $('<p>').attr('class', 'msg1').attr('data-attr', '#ff0453').text(data.val().msg),
                            $('<div>').attr('class', 'secondary-content badge likefunction_other').append(
                                $('<img>').attr('class', 'like').attr('src', heart_img).attr('alt', 'msg_like').attr("onclick", "changeHeart("+data.key+")"),
                                $('<span>').attr('class', 'likeNum').text(likeNum)
                            )
                        )
                    )
                );
                changeMsgColor(data.key, likeNum, 'other');
            }else if(data.val().type == "2"){

                $('.collection').append(
                    $('<div>').attr('class', 'row emoticon_chat chat'+data.key).append(
                        $('<li>').attr('class', 'collection-item avatar other-msg-emoticon').append(
                            $('<img>').attr('src', profile).attr('class', 'circle'),
                            $('<span>').attr('class', 'nickname').text(nick),
                            $('<img>').attr('class', 'other_send_emoticon').attr('src', '../images/'+data.val().emo+'.png')
                        )
                    )
                );
            }else if(data.val().type == "3"){

                $('.collection').append(
                    $('<div>').attr('class', 'row chat'+data.key).append(
                        $('<li>').attr('class', 'collection-item avatar other-msg-emoticon').append(
                            $('<img>').attr('src', profile).attr('class', 'circle'),
                            $('<span>').attr('class', 'nickname').text(nick),
                            $('<img>').attr('class', 'other_send_emoticon2').attr('src', '../images/'+data.val().emo+'.png')
                        ),
                        $('<li>').attr('class', 'collection-item avatar avatar second_li').append(
                            $('<p>').attr('class', 'msg1').text(data.val().msg),
                            $('<div>').attr('class', 'secondary-content badge likefunction_other').append(
                                $('<img>').attr('class', 'like').attr('src', heart_img).attr('alt', 'msg_like').attr("onclick", "changeHeart("+data.key+")"),
                                $('<span>').attr('class', 'likeNum').text(likeNum)
                            )
                        )
                    )
                );
                changeMsgColor(data.key, likeNum, 'other');
            }
        }
        before_uid = data.val().uid;
        before_key = data.key;
    }
}

var maxNum = $("#max").val();

function changeMsgColor(key, likeNum, who){

    var sender = 2;
    if(who == 'other'){
        sender = 1;
    }
    if(maxNum>=8){
        var rest = maxNum%8;
        var cut_line = (maxNum - rest)/8;


        for(var j = 1; j <= 8; j++){
            if(j == 1){
                if(likeNum >= 0 && likeNum <= cut_line*j + rest){
                    $(".chat"+key).find("p").attr('class',"chat"+key+" msg"+sender+"-"+j);
                    break;
                }
            }else{
                if(likeNum >= j*cut_line + rest && likeNum < (j+1)*cut_line + rest){
                    $(".chat"+key).find("p").attr('class',"chat"+key+" msg"+sender+"-"+j);
                    break;
                }
            }
        }

    }
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
        $('#bottom_message').remove();
    }
    if($(".phone-body").scrollTop() == 0){
        var end = parseInt($(".row").eq(0).attr("class").split(" chat")[1])-1;
        var start ;

        if(end > 1){
            start = parseInt(end)-100;
            if(start < 1) start = 1;
                var heart_img;
                var likeNum;

                var before_uid;
                var before_key;
                var uid_set = [];
                var color_set = [];
                firebase.database().ref('chat/'+$("#key").val()+'_'+$("#order").val()).orderByKey().startAt(""+start).endAt(""+end).once("value", function(data){
                    var str = "";
                    var cnt = 0;

                    data.forEach(function(child) {
                        cnt++;

                         var key = child.key;
                         var childData = child.val();
                         var uid = null;
                         if(firebase.auth().currentUser !=null){
                            uid = firebase.auth().currentUser.uid;

                            if(child.child("like").child(uid).exists())
                                heart_img = '../images/like2.png';
                            else heart_img = '../images/dislike.png';
                            likeNum = child.child("like").numChildren();


                         }else{
                            heart_img = '../images/dislike.png';
                            likeNum = child.child("like").numChildren();

                         }


                         if(uid !=null && child.key != 'people' && child.val().uid == uid){//내가 보낸것
                            if(child.val().type == "1"){
                                color_set.push({key : child.key, likeNum : likeNum, who : 'me'});
                                str +=''+
                                    '<div class="row chat'+child.key+'">'+
                                        '<li class="collection-item avatar my-msg">'+
                                           '<p class="msg2">'+child.val().msg+'</p>'+
                                           '<div class="secondary-content badge likefunction_my">'+
                                                '<img class="like" src="'+heart_img+'" onclick="changeHeart('+child.key+')">'+
                                                '<span class="likeNum">'+likeNum+'</span>'+
                                            '</div>'+
                                        '</li>'+
                                    '</div>';

                            }else if(child.val().type == "2"){
                                str +=''+
                                    '<div class="row right_emoticon">'+
                                        '<li class="collection-item avatar my-msg2">'+
                                            '<img class="send_emoticon" src="../images/'+child.val().emo+'.png">'+
                                        '</li>'+
                                    '</div>';

                            }else if(child.val().type == "3"){
                                color_set.push({key : child.key, likeNum : likeNum, who : 'me'});
                                // 채팅방에 텍스트  이모티콘 붙이기
                                str +=''+
                                    '<div class="row chat'+child.key+'">'+
                                        '<li class="collection-item avatar my-msg2">'+
                                            '<img class="send_emoticon2" src="../images/'+child.val().emo+'.png">'+
                                        '</li>'+
                                        '<li class="collection-item avatar my-msg">'+
                                            '<p class ="msg2">'+child.val().msg+'</p>'+
                                            '<div class="secondary-content badge likefunction_my">'+
                                                '<img class="like" src="'+heart_img+'" onclick = "changeHeart('+child.key+')">'+
                                                '<span class="likeNum">'+likeNum+'</span>'+
                                            '</div>'+
                                        '</li>'+
                                    '</div>';
                            }
                         }else{
                            //왼쪽 메세지

                            color_set.push({key : child.key, likeNum : likeNum, who : 'other'});
                            if(before_uid == child.val().uid && parseInt(before_key)+1 == parseInt(child.key)){//동일인물

                                if(child.val().type == "1"){
                                    str +=''+
                                        '<div class="row chat'+child.key+'">'+
                                            '<li class="collection-item avatar">'+
                                                '<p class="msg1" data-attr="#ff0453">'+child.val().msg+'</p>'+
                                                '<div class="secondary-content badge likefunction_other">'+
                                                    '<img class="like" src="'+heart_img+'" onclick ="changeHeart('+child.key+')" >'+
                                                    '<span class="likeNum">'+likeNum+'</span>'+
                                                '</div>'+
                                            '</li>'+
                                        '</div>';

                                }else if(child.val().type == "2"){
                                    str +=''+
                                        '<div class="row emoticon_chat chat'+child.key+'">'+
                                            '<li class="collection-item avatar other-msg-emoticon">'+

                                                '<img class= "other_send_emoticon" src="../images/'+child.val().emo+'.png">'+
                                            '</li>'+
                                        '</div>';

                                }else if(child.val().type == "3"){
                                    color_set.push({key : child.key, likeNum : likeNum, who : 'other'});
                                    str +=''+
                                        '<div class="row chat'+child.key+'">'+
                                            '<li class="collection-item avatar other-msg-emoticon">'+

                                                '<img class="other_send_emoticon2" src ="../images/'+child.val().emo+'.png">'+
                                            '</li>'+
                                            '<li class="collection-item avatar second_li">'+
                                                '<p class="msg1">'+child.val().msg+'</p>'+
                                                '<div class="secondary-content badge likefunction_other">'+
                                                    '<img class="like" src="'+heart_img+'" onclick ="changeHeart('+child.key+')" >'+
                                                    '<span class="likeNum">'+likeNum+'</span>'+
                                                '</div>'+
                                            '</li>'+
                                        '</div>';

                                }
                            }
                            else{

                                uid_set.push({uid : child.val().uid, key : child.key});

                                if(child.val().type == "1"){
                                    color_set.push({key : child.key, likeNum : likeNum, who : 'other'});
                                    str +=''+
                                        '<div class="row chat'+child.key+'">'+
                                            '<li class="collection-item avatar">'+
                                                '<img src="" class="circle">'+
                                                '<span class="nickname"></span>'+
                                                '<p class = "msg1">'+child.val().msg+'</p>'+
                                                '<div class="secondary-content badge likefunction_other">'+
                                                    '<img class="like" src="'+heart_img+'" onclick ="changeHeart('+child.key+')" >'+
                                                    '<span class="likeNum">'+likeNum+'</span>'+
                                                '</div>'+
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
                                    color_set.push({key : child.key, likeNum : likeNum, who : 'other'});
                                    str +=''+
                                        '<div class="row chat'+child.key+'">'+
                                            '<li class="collection-item avatar other-msg-emoticon">'+
                                                '<img src="" class="circle">'+
                                                '<span class="nickname"></span>'+
                                                '<img class ="left_emoticon other_send_emoticon2" src="../images/'+child.val().emo+'.png">'+

                                            '<li class ="collection-item avatar second_li">'+
                                                '<p class ="msg1">'+child.val().msg+'</p>'+
                                                '<div class="secondary-content badge likefunction_other">'+
                                                    '<img class="like" src="'+heart_img+'" onclick ="changeHeart('+child.key+')" >'+
                                                    '<span class="likeNum">'+likeNum+'</span>'+
                                                '</div>'+
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
                            for(var j = 0; j <color_set.length; j++ ){
                                changeMsgColor(color_set[j].key, color_set[j].likeNum, color_set[j].who);
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


 // 좋아요 갯수에 따른 색상 변경
// function changeMyMsgColor(key, likeNum) {

//     if(likeNum == null) likeNum = 0 ;

//     if (0 <= likeNum && likeNum < 10) {
//         $(".chat"+key).find("p").attr('class','msg2-1');
//     } else if (10 <= likeNum && likeNum < 20) {
//         $(".chat"+key).find("p").attr('class','msg2-2');
//     } else if (20 <= likeNum && likeNum < 30) {
//         $(".chat"+key).find("p").attr('class','msg2-3');
//     } else if (30 <= likeNum && likeNum < 40) {
//         $(".chat"+key).find("p").attr('class','msg2-4');
//     } else if (40 <= likeNum && likeNum < 50) {
//         $(".chat"+key).find("p").attr('class','msg2-5');
//     } else if (50 <= likeNum && likeNum < 60) {
//         $(".chat"+key).find("p").attr('class','msg2-6');
//     } else if (60 <= likeNum && likeNum < 70) {
//         $(".chat"+key).find("p").attr('class','msg2-7');
//     } else {
//         $(".chat"+key).find("p").attr('class','msg2-8');
//     }
// }

// function changeOtherMsgColor (key, likeNum) {
//     if(likeNum == null) likeNum = 0 ;

//     if (0 <= likeNum && likeNum < 10) {
//         $(".chat"+key).find("p").attr('class','msg1-1');
//     } else if (10 <= likeNum && likeNum < 20) {
//         $(".chat"+key).find("p").attr('class','msg1-2');
//     } else if (20 <= likeNum && likeNum < 30) {
//         $(".chat"+key).find("p").attr('class','msg1-3');
//     } else if (30 <= likeNum && likeNum < 40) {
//         $(".chat"+key).find("p").attr('class','msg1-4');
//     } else if (40 <= likeNum && likeNum < 50) {
//         $(".chat"+key).find("p").attr('class','msg1-5');
//     } else if (50 <= likeNum && likeNum < 60) {
//         $(".chat"+key).find("p").attr('class','msg1-6');
//     } else if (60 <= likeNum && likeNum < 70) {
//         $(".chat"+key).find("p").attr('class','msg1-7');
//     } else {
//         $(".chat"+key).find("p").attr('class','msg1-8');
//     }
// }