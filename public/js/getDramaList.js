var dramalist = [];
var socket = io();
var db;
var connection = false;

socket.emit('check', 'tvtalk');
socket.on('config', function(msg) {
    if(msg !='fail'){
      if(connection == false){
        connection = true;
        firebase.initializeApp(msg);

        db = firebase.database();
        var data_length;


        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            db.ref("bookmark/"+firebase.auth().currentUser.uid).once("value", function(data){
              if(data.child($("#key").val()).exists()){
                $('#bookmark').attr('src','../images/bookmark.png');
              }else{
                $('#bookmark').attr('src','../images/nobookmark.png');
              }
            });
            console.log('로그인중',user);

          } else {
            console.log('로그인안됨');
            $('#bookmark').attr('src','../images/nobookmark.png');
          }
        });

        //드라마 리스트 불러오기
        db.ref('drama/'+$("#key").val()).on("value",function(data){
          $(".brand-logo").text(data.val().title);
          $("#img_source").text(data.val().channel);
          switch(data.val().channel){
            case "MBC" :
              $("#img_source").attr("href", "http://www.imbc.com/").attr("target", "_blank");
              break;
            case "SBS" :
              $("#img_source").attr("href", "http://sbs.co.kr/").attr("target", "_blank");
              break;
            case "KBS2" :
              $("#img_source").attr("href", "http://tv.kbs.co.kr/").attr("target", "_blank");
              break;
            case "tvN" :
              $("#img_source").attr("href", "http://ch.interest.me/tvn").attr("target", "_blank");
              break;
            case "JTBC" :
              $("#img_source").attr("href", "http://jtbc.joins.com/").attr("target", "_blank");
              break;
            default : break;
          }





        });
        var cnt = 0;
        db.ref('drama/'+$("#key").val()+'/list').once("value", function(datas){


          db.ref('drama/'+$("#key").val()+'/list').on("child_added",function(data){
            cnt++;
            var str ='';
              if(data.val().state == "closed"){

                str +='<a href="javascript:closed('+data.key+')" class="collection-item">'
                    +'<div class="box1 order'+data.key+'">'
                        +'<img src='+data.val().img+' class="drama_list grayscale">'
                    +'</div>'
                    +'<div>'
                        +'<div class="drama_num">'+data.key+'</div><div class="hwa">화</div>'
                        +'<div class="drama_date">'+data.val().date.split('(')[0]+'</div><div class="drama_day">('+data.val().date.split('(')[1]+'</div>'
                        +'<div class="state_lock"><img class="lock" src="../images/lock.png" align ="absmiddle">읽고 공감 가능</div>'
                    +'</div>'
                +'</a>';
              }else if(data.val().state == "open"){
                str +='<a href="/chatroom?drama='+$("#key").val()+'&order='+data.key+'" class="collection-item">'
                    +'<div class="box1 order'+data.key+'">'
                        +'<img src='+data.val().img+' class="drama_list">'
                    +'</div>'
                    +'<div>'
                        +'<div class="drama_num">'+data.key+'</div><div class="hwa">화</div>'
                        +'<div class="drama_date">'+data.val().date.split('(')[0]+'</div><div class="drama_day">('+data.val().date.split('(')[1]+'</div>'
                        +'<div class="state_time"><img class="clock_1" src="../images/clock_1.png" align ="absmiddle">방영중</div>'
                    +'</div>'
                +'</a>';
              }else if(data.val().state == "lock"){
                str +='<a href="/chatroom?drama='+$("#key").val()+'&order='+data.key+'" class="collection-item">'
                    +'<div class="box1">'
                        +'<img src='+data.val().img+' class="drama_list">'
                    +'</div>'
                    +'<div>'
                        +'<div class="drama_num">'+data.val().order+'</div><div class="hwa">화</div>'
                        +'<div class="drama_date">'+data.val().date.split('(')[0]+'</div><div class="drama_day">('+data.val().date.split('(')[1]+'</div>'
                        +'<div class="state_time"><img class="clock_1" src="../images/clock_1.png" align ="absmiddle">오늘밤 방영</div>'
                    +'</div>'
                +'</a>';
              }
            var lastHtml = $('.collection').html();
            $('.collection').html(str+lastHtml);

            if(datas.numChildren() == cnt){
              if(window.location.search.indexOf("=")!==-1){
                  var key = window.location.search.split("=")[1];
                  var position = $(".order"+key).position().top;
                  window.scrollTo(0, position);
              }
            }
          });
        });

      }

    }else if(msg =='fail') alert("네트워크 상태가 원활하지 않습니다.");
});

function closed(order){
  firebase.database().ref("chat").child($("#key").val()+"_"+order).on("value", function(data){
      if(data.numChildren()!=0){
          var db = firebase.database();
          location.href= '/closed?drama='+$("#key").val()+'&order='+order;
        }
        else{
          toastSetPostion();
          Materialize.toast('채팅내역이 없습니다...^^;', 3000, 'rounded');

        }

  });

}

function toastSetPostion(){
  var toast_left = $('#toast-container').width()/2;
  $('#toast-container').css('margin-left', '-' + toast_left + 'px');
}



