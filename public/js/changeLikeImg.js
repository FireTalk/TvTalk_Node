//즐겨찾기 이미지 변경
function changeLikeImage(drama_key) {

    if(firebase.auth().currentUser == null) {
        toastSetPostion();
        Materialize.toast('로그인이 필요합니다.', 3000, 'rounded');
    }

    else if (firebase.auth().currentUser != null){
        if($(".like_function_"+drama_key).attr('src') == "images/dislike.png"){
            $(".like_function_"+drama_key).attr('src', 'images/like.png');
                var obj = {};
                obj[drama_key] = 'bookmark';
                firebase.database().ref('bookmark/'+firebase.auth().currentUser.uid).update(obj);
        }else{
            $(".like_function_"+drama_key).attr('src', 'images/dislike.png');
            firebase.database().ref('bookmark/'+firebase.auth().currentUser.uid+"/"+drama_key).set(null);
        }
    }
}

function changeBookMark(drama_key) {
    if(firebase.auth().currentUser == null) {
        toastSetPostion();
        Materialize.toast('로그인이 필요합니다.', 3000, 'rounded');
    }

    else if (firebase.auth().currentUser != null){
        if($("#bookmark").attr('src') == "../images/nobookmark.png"){
            $("#bookmark").attr('src', '../images/bookmark.png');
                var obj = {};
                obj[drama_key] = 'bookmark';
                firebase.database().ref('bookmark/'+firebase.auth().currentUser.uid).update(obj);
        }else{
            $("#bookmark").attr('src', '../images/nobookmark.png');
            firebase.database().ref('bookmark/'+firebase.auth().currentUser.uid+"/"+drama_key).set(null);
        }
    }
}



/*function changeTextOnOff(image) {
    var on_off = $("#on img");


    if (on_off.attr('src') == "./images/fill_8.png") { // off 버전
        on_off.attr('src',"./images/fill_7.png");
        $('.send_emoticon').hide();
        $('.emoticon_chat').hide();
        // $('.left_emoticon').hide();
        $('.other_send_emoticon2').hide();
        $('.right_emoticon').hide();
        $('.second_li').attr('class','collection-item avatar second_li second_li_emoticon');
        // $('li.collection-item.avatar.other-msg-emoticon').css('height','0px').css('min-height','0px');
        // $('.collection .collection-item.avatar').css('padding-top', '0px').css('margin-top', '10px');

		// css 변경
		$('.right_emoticon').css('height', '83px');
		$('li.collection-item.avatar.other-msg-emoticon').css('height', '38px').css('top', '-15px');

		/*$('.second_li_emoticon').css('display', 'table').css('top', '-53px').css('position', 'relative').css('left','0px');
		*/
//		$('.second_li_emoticon').css('position', 'relative').css('left','-92px').css('top','-26px');
//		$('.row').css('height', '70px');

/*   } else if (on_off.attr('src') == "./images/fill_7.png") { // on버전
        on_off.attr('src', "./images/fill_8.png");
        $('.send_emoticon').show();
        $('.emoticon_chat').show();
        $('.other_send_emoticon2').show();
        // $('.left_emoticon').show();
        $('.right_emoticon').show();
        $('.second_li').attr('class','collection-item avatar second_li').css('position', 'relative').css('left','0px').css('top','-15px');
        // $('li.collection-item.avatar.other-msg-emoticon').css('height','120px');
        // $('.collection .collection-item.avatar').css('padding-top', '10px').css('margin-top', '0px');

		// css 변경
		$('.row').css('height', 'inherit');
		$('li.collection-item.avatar.other-msg-emoticon').css('height', '120px');
		/*$('.second_li').css('top', '0px').css('right', '124px');jueun*/
//		$('.second_li').css('right', '124px');
//    }
//}
function changeTextOnOff(image) {
    var on_off = $("#on img");

    if (on_off.attr('src') == "./images/fill_8.png") { // off 버전
        on_off.attr('src',"./images/fill_7.png");
        $('.send_emoticon').hide();
        $('.emoticon_chat').hide();
        $('.other_send_emoticon2').hide();
        $('.right_emoticon').hide();
        $('li').removeClass('second_li');
        $('li.collection-item.avatar.other-msg-emoticon').css('height','10px').css('min-height','10px');
        //$('.collection .collection-item.avatar').css('padding-top', '0px').css('margin-top', '10px').css('left', '0px').css('top', '11px');
        $('.collection-item.avatar').css('padding-right', '10px');
        $('.collection-item.avatar.my-msg').css('padding', '0px');
        $('.collection-item.avatar.my-msg2').css('padding-right', '0px').css('margin-bottom', '27px').css('left', '20px');
       

    } else if (on_off.attr('src') == "./images/fill_7.png") { // on버전
        on_off.attr('src', "./images/fill_8.png");
        $('.send_emoticon').show();
        $('.emoticon_chat').show();
        $('.other_send_emoticon2').show();
        $('.right_emoticon').show();
        $('li.collection-item.avatar.other-msg-emoticon').css('height','120px');
        //$('.collection .collection-item.avatar').css('padding-top', '10px').css('margin-top', '0px');
        $('.collection-item.avatar').css('padding-right', '10px');
        $('.collection-item.avatar.my-msg').css('padding', '0px');
        $('.collection-item.avatar.my-msg2').css('padding-right', '0px').css('margin-bottom', '20px').css('left', '0px');

    }
}



function changeHeart(key){
    if(firebase.auth().currentUser == null) {
        toastSetPostion();
        Materialize.toast('로그인이 필요합니다.', 3000, 'rounded');
    }
    else if (firebase.auth().currentUser != null){
        if($(".chat"+key).find('.like').attr('src') == "../images/dislike.png"){
            $(".chat"+key).find('.like').attr('src', '../images/like2.png');
            var like_num = parseInt($(".chat"+key).find('.likeNum').text())+1;
            $(".chat"+key).find('.likeNum').text(like_num);
            var obj = {};
            obj[firebase.auth().currentUser.uid] = 'like';
            firebase.database().ref('chat').child($("#key").val()+'_'+$("#order").val()+'/'+key).child('like').update(obj);
        }else{
           $(".chat"+key).find('.like').attr('src', '../images/dislike.png');
           var like_num = parseInt($(".chat"+key).find('.likeNum').text())-1;
           $(".chat"+key).find('.likeNum').text(""+like_num);
           firebase.database().ref('chat').child($("#key").val()+'_'+$("#order").val()+'/'+key).child('like/'+firebase.auth().currentUser.uid).set(null);
        }
    }
}

function toastSetPostion(){
  var toast_left = $('#toast-container').width()/2;
  $('#toast-container').css('margin-left', '-' + toast_left + 'px');
}



