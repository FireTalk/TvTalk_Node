var drama_list = [];
var socket = io();
var like_heart = 'images/dislike.png';
var cnt = 0;
var connection = false;

socket.emit('check', 'tvtalk');
socket.on('config', function(msg) {
    if(msg !='fail'){
        if(connection == false){
            firebase.initializeApp(msg);
            connection = true;
            var db = firebase.database();
            var data_length;
            var login_chk = false;

            firebase.auth().onAuthStateChanged(function(user) {
                if(!login_chk){
                    if (user) {
                      load_poster_upgrage(db);
                      db.ref('bookmark/'+firebase.auth().currentUser.uid).once('value').then(function(data) {
                         data.forEach(function(child){
                          changeLikeImage(child.key);
                         });
                        if(window.location.search.indexOf("=")!==-1){
                            var key = window.location.search.split("=")[1];
                            var position = $(".drama"+key).position().top;
                            window.scrollTo(0, position);
                        }
                      });
                      $('.tooltip1').attr('data-tooltip','나의 정보');
                      $('.login').attr('href','/user');
                      $('.tooltip1').tooltip();

                      console.log('로그인중',user);

                    } else {//로그인X
                      $('.tooltip1').attr('data-tooltip','로그인');
                      $('.login').attr('href','/login/main');
                      $('.tooltip1').tooltip();
                      load_poster_upgrage(db);
                      console.log('로그인안됨');
                    }
                    login_chk = true;
                }
            });
        }

    }else if(msg =='fail') alert("네트워크 상태가 원활하지 않습니다.");
});


function load_poster_upgrage(db){
    db.ref('drama').on("child_added",function(data){
        drama_key_1 = data.key;
        drama_postimg_1 = data.val().img;
        drama_title_1 = data.val().title;
        drama_like_1 = like_heart;
        broadcaster_1 = data.val().channel;
        air_time_1 = data.val().time;

        var key = parseInt(data.key);

        if (key % 2 == 1){
            var tmp = addDrama1(drama_key_1, drama_postimg_1, drama_title_1, drama_like_1, broadcaster_1, air_time_1);
            var before = $('.collection').html();
            $('.collection').html(before+tmp);

        }else if(key%2==0){
            var tmp = addDrama2(drama_key_1, drama_postimg_1, drama_title_1, drama_like_1, broadcaster_1, air_time_1);
            key-=1;
            var before = $('.collection .row'+key).html();
            $('.collection .row'+key).html(before+tmp);
        }
    });
}


function addDrama1(drama_key1, drama_postimg1, drama_title1, drama_like1, broadcaster1, air_time1){

    var src=""+
    "<div class='row row"+drama_key1+"'>"+
        "<div class ='col s6 drama"+drama_key1+"'>"+
            "<a href ='javascript:checkList("+drama_key1+")' class ='collection-item theothers_drama_first'>"+
                "<div class='theothers_first'>"+
                    "<img class ='drama_postimg' src='"+drama_postimg1+"'>"+
                    "<div class='drama_title'>"+drama_title1+"</div>"+

                    "<div>"+
                        "<span class='broadcaster'>"+broadcaster1+"</span>"+
                        "<span class='air_time'>"+air_time1+"</span>"+
                    "</div>"+
                "</div>"+
            "</a>"+
            "<span class ='like_position'>"+
                "<img class='like_function like_function_"+drama_key1+"' src='"+ drama_like1+"' width ='14px' onclick='changeLikeImage("+drama_key1+")'>"+
            "</span>"+
        "</div>"+
    "</div>";
    return src;
}

function addDrama2(drama_key2, drama_postimg2, drama_title2, drama_like2, broadcaster2, air_time2){
    var src=""+
    "<div class='col s6 drama"+drama_key2+"'>"+
        "<a href='javascript:checkList("+drama_key2+")' class='collection-item theothers_drama_second'>"+
            "<div class='theothers_second'>"+
                "<img class='drama_postimg' src='"+drama_postimg2+"'>"+
                "<div class='drama_title' >"+drama_title2+"</div>"+

                "<div>"+
                    "<span class='broadcaster'>"+broadcaster2+"</span>"+
                    "<span class='air_time'>"+air_time2+"</span>"+
                "</div>"+
            "</div>"+
        "</a>"+
        "<span class='like_position2'>"+
            "<img class='like_function like_function_"+drama_key2+"' src='"+drama_like2+"' width='14px' onclick='changeLikeImage("+drama_key2+")'>"+
        "</span>"+
    "</div>";
    return src;
}

function checkList(key){
    var ref = firebase.database().ref("drama/"+key+"/list");

    ref.once("value", function(data){
        var cnt = 0;

        data.forEach(function(child){
            if(child.child("state").val()==="open" || child.child("state").val()==="closed"){
             cnt++;
            }
        });
        if(cnt!==0){
            location.href="list/"+key;
        }
        else if(cnt===0){
            toastSetPostion();
            Materialize.toast('방영전 프로그램입니다.', 3000, 'rounded');
        }
    });
}

function toastSetPostion(){
  var toast_left = $('#toast-container').width()/2;
  $('#toast-container').css('margin-left', '-' + toast_left + 'px');
}

// function titleView(key){
//     var title = $(".drama"+key+" .drama_title").text();
//     $(".drama"+key).attr('data-tooltip',title);

//     $(".drama"+key).tooltip({delay: 5});
//     setTimeout(function () {
//         $(".drama"+key).attr('class',"col s6 .drama"+key);
//     }, 2800);

// }