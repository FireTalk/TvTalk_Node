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

    db.ref('chat/'+$("#key").val()+'_'+$("#order").val()).on("child_added",function(data){

        if(uid == "not"){
            heart_img = '../images/dislike.png';
            db.ref('chat/'+$("#key").val()+'_'+$("#order").val()+"/"+data.key+"/like").on("value", function(data1){
                   likeNum = data1.numChildren();
                   show_left(db, data);
            });
        }else{//로그인O
            db.ref('chat/'+$("#key").val()+'_'+$("#order").val()+"/"+data.key+"/like").on("value", function(data1){
                if(data1.child(uid).exists())
                    heart_img = '../images/like2.png';
                else heart_img = '../images/dislike.png';

                likeNum = data1.numChildren();

            });

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

            if(cnt == datas.numChildren() && final_chk==false){
                final_chk = true;
                setTimeout(function () {
                   $('.phone-body').scrollTop(10000000);
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

var maxNum = 0;
function changeMsgColor(key, likeNum, who){

    if(maxNum < likeNum){
        maxNum = likeNum;
    }
    var sender = 2;
    if(who == 'other'){
        sender = 1;
    }
    if(maxNum>=8 && likeNum>=8){
        var cnt = parseInt(key);
        var rest = maxNum%8;
        var cut_line = (maxNum - rest)/8;

        for(var i = cnt; i > 0; i--){
            var chk = parseInt($(".chat"+i).find('.likeNum').text());
            for(var j = 1; j <= 8; j++){
                if(j == 1){
                    if(chk >= 0 && chk <= cut_line*j + rest){
                        $(".chat"+i).find("p").attr('class',"chat"+i+" msg"+sender+"-"+j);
                        break;
                    }
                }else{
                    if(chk >= j*cut_line + rest && chk < (j+1)*cut_line + rest){
                        $(".chat"+i).find("p").attr('class',"chat"+i+" msg"+sender+"-"+j);
                        break;
                    }
                }
            }
        }
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