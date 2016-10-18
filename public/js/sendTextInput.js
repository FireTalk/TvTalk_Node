
var input = $('#form_input');

var text_input = 0; // 입력창에 텍스트 입력 여부 체크, 입력 시: 1 없을 시:0

var emoticon_mode = 0; // 이모티콘 모드 여부 체크, 이모티콘 모드: 1 아닐 경우: 0
var select_emoticon = 0; // 이모티콘 선택 여부 체크, 선택: 1 아닐 경우: 0
var emoticon_src_gobal;


var body_height = $('.phone-wrapper').height() - 46;

// 로그인 여부 체크


function loginForm(){
// -------------------------------------------------------- 로그인일 경우
    // phone-body 높이 맞춰주기
    body_height = $('.phone-wrapper').height() - 46;
    $('.phone-body').css('height', body_height + 'px').css('min-height', body_height + 'px');

    // 이모티콘 아이콘, 텍스트 입력, 전송 버튼
    input.append(
        $('<div>').attr('id', 'button_plus').attr('class', 'btn waves-effect waves-light').append(
            $('<img>').attr('src', '../images/on.png').attr('alt', 'emoticon_icon')
        ),
        $('<div>').attr('id', 'wrap').append(
            $('<input>').attr('id', 'm').attr('autocomplete', 'off').attr('onkeyup', 'writing()')

        ),
        $('<button>').attr('id', 'button_submit').attr('class', 'btn waves-effect waves-light').attr('type', 'button').text('전송')
    )



    // 이모티콘 아이콘 눌렀을 경우
    $('#button_plus').on("click", function () {
    // function clickEmoticon(){

        if (emoticon_mode === 0) {
            emoticon_mode = 1; // 이모티콘 모드

            // phone-body 높이 변경
            // $('.phone-body').css('height', '60%').css('min-height', '60%');
            body_height = $('.phone-wrapper').height() - 255; // 이모티콘 영역의 크기 258px로 고정
            $('.phone-body').css('height', body_height + 'px').css('min-height', body_height + 'px');
            $('.phone-body').scrollTop($('.phone-body')[0].scrollHeight); // 스크롤 맨 아래

            // emoticon_area 나타내주기
            showEmoticionArea();

            // 초기화
            $('.carousel.carousel-slider').carousel({ full_width: true, no_wrap: true });

        }else{

            $('#input_area').children().last().remove();
             emoticon_mode = 0; // 이모티콘 모드 변수 초기화

             body_height = $('.phone-wrapper').height() - 46;
             $('.phone-body').css('height', body_height + 'px').css('min-height', body_height + 'px'); // phone-body 높이 맞춰주기
             $('.phone-body').scrollTop($('.phone-body')[0].scrollHeight); //스크롤 맨 아래로
             select_emoticon = 0; //이모티콘 선택 여부 초기화
        }
    });

    // 엔터 버튼에 대한 이벤트 등록
    $('#m').keydown(function (key) {

        if (key.keyCode == 13) {
            sendMsgEvent();
            $('.phone-body').scrollTop($('.phone-body')[0].scrollHeight);
            return false;
        }

    });


    // 전송 버튼에 대한 이벤트 등록
    $('#button_submit').on("click", function () {
        sendMsgEvent();
        $('.phone-body').scrollTop($('.phone-body')[0].scrollHeight);
    });

    function sendMsgEvent() {
        var message = $('#m').val();

        if (emoticon_mode === 0) { // 이모티콘 모드가 아닐 경우

            if (text_input === 1) { // 텍스트만 보낼 경우

                sendMsg(message, null , 1);
                $('#m').val(''); // 메시지 입력창 초기화
                text_input = 0; // 텍스트 입력 여부 초기화

                $('.phone-body').scrollTop($('.phone-body')[0].scrollHeight); //스크롤 맨 아래로
            }
        } else if (emoticon_mode === 1) { // 이모티콘 모드일 경우
            if (text_input === 0 && select_emoticon === 0) { // 아무것도 보내지 않음
                console.log("입력을 안함");

            } else if (text_input === 1 && select_emoticon === 0) { // 텍스트만 보내기

                // 이모티콘 영역 삭제
                $('#input_area').children().last().remove();
                emoticon_mode = 0; // 이모티콘 모드 변수 초기화

                body_height = $('.phone-wrapper').height() - 46;
                $('.phone-body').css('height', body_height + 'px').css('min-height', body_height + 'px'); // phone-body 높이 맞춰주기

                // 채팅창에 메시지 붙이기
                sendMsg(message, null, 1);
                $('#m').val(''); // 메시지 입력창 초기화
                text_input = 0; // 텍스트 입력 여부 초기화

                $('.phone-body').scrollTop($('.phone-body')[0].scrollHeight); //스크롤 맨 아래로

            } else if (text_input === 0 && select_emoticon === 1) { // 이모티콘만 보내기

                sendMsg(null, emoticon_src_gobal, 2);

               // 이모티콘 영역 삭제
                $('#input_area').children().last().remove();
                emoticon_mode = 0; // 이모티콘 모드 변수 초기화

                body_height = $('.phone-wrapper').height() - 46;
                $('.phone-body').css('height', body_height + 'px').css('min-height', body_height + 'px'); // phone-body 높이 맞춰주기
                $('.phone-body').scrollTop($('.phone-body')[0].scrollHeight); //스크롤 맨 아래로

                select_emoticon = 0; //이모티콘 선택 여부 초기화

            } else if (text_input === 1 && select_emoticon === 1) { // 텍스트랑 이모티콘 함께 보내기

                sendMsg(message, emoticon_src_gobal, 3);


                // 이모티콘 영역 삭제
                $('#input_area').children().last().remove();
                emoticon_mode = 0; // 이모티콘 모드 변수 초기화

                // 메시지 입력창 초기화
                $('#m').val('');
                text_input = 0;

                body_height = $('.phone-wrapper').height() - 46;
                $('.phone-body').css('height', body_height + 'px').css('min-height', body_height + 'px'); // phone-body 높이 맞춰주기
                $('.phone-body').scrollTop($('.phone-body')[0].scrollHeight); //스크롤 맨 아래로

                select_emoticon = 0; //이모티콘 선택 여부 초기화

            }
        }
    }
}


function writing(){
    var input = $("#m").val();

    if (input === '') { //opacity 40%
        $('#button_submit').css('opacity', '0.4');
        text_input = 0;
    } else { //opacity 100%
        $('#button_submit').css('opacity', '1.0');
        text_input = 1;
    }
}


// --------------------------------------------------------로그인이 아닐 경우
function logoutForm(){
    // phone-body 높이 맞춰주기
    body_height = $('.phone-wrapper').height() - 46;
    $('.phone-body').css('height', body_height + 'px').css('min-height', body_height + 'px');

    // 로그인 연결 아이콘으로 만들기, 텍스트 입력 불가 및 placeholder
    input.append(
        $('<div>').attr('id', 'button_plus').attr('class', 'btn waves-effect waves-light').append(
            $('<img>').attr('src', '../images/log_on.png').attr('alt', 'login_icon')
        ),
        $('<div>').attr('id', 'wrap').attr('onclick','login()').append(
            $('<input>').attr('id', 'm').attr('autocomplete', 'off').attr("disabled", true).attr('placeholder', '로그인이 필요합니다.').css('cursor','pointer')
        )
    )

    // 로그인 아이콘 눌렀을 경우
    $('#button_plus').on("click", function () {
        // 로그인 페이지로 이동
        login();
    });

}
function login(){
    window.location.href = "/login/"+$("#key").val()+"_"+$("#order").val();
}

function showEmoticionArea() {
    $('#input_area').append(
        $('<div>').attr('id', 'emoticon_area').append(
            $('<div>').attr('class', 'carousel carousel-slider center').attr('data-indicators', 'true').append(
                $('<div>').attr('class', 'carousel-item').attr('href', '#one!').append(
                    $('<div>').attr('id', 'emoticon_collection').append(
                        $('<div>').attr('class', 'row emoticon_row').append(
                            $('<img>').attr('class', 'col s3 emoticon').attr('src', '../images/1.png').attr('onclick','float_emoticon("1")').attr('ondblclick','send_emoticon("1")'),
                                $('<img>').attr('class', 'col s3 emoticon').attr('src', '../images/2.png').attr('onclick','float_emoticon("2")').attr('ondblclick','send_emoticon("2")'),
                                $('<img>').attr('class', 'col s3 emoticon').attr('src', '../images/3.png').attr('onclick','float_emoticon("3")').attr('ondblclick','send_emoticon("3")'),
                                $('<img>').attr('class', 'col s3 emoticon').attr('src', '../images/4.png').attr('onclick','float_emoticon("4")').attr('ondblclick','send_emoticon("4")')
                            ),
                        $('<div>').attr('class', 'row emoticon_row').append(
                            $('<img>').attr('class', 'col s3 emoticon').attr('src', '../images/5.png').attr('onclick','float_emoticon("5")').attr('ondblclick','send_emoticon("5")'),
                            $('<img>').attr('class', 'col s3 emoticon').attr('src', '../images/6.png').attr('onclick','float_emoticon("6")').attr('ondblclick','send_emoticon("6")'),
                            $('<img>').attr('class', 'col s3 emoticon').attr('src', '../images/7.png').attr('onclick','float_emoticon("7")').attr('ondblclick','send_emoticon("7")'),
                            $('<img>').attr('class', 'col s3 emoticon').attr('src', '../images/8.png').attr('onclick','float_emoticon("8")').attr('ondblclick','send_emoticon("8")')
                        )
                    )
                )
                // ,
                // $('<div>').attr('class', 'carousel-item').attr('href', '#two!').append(
                //     $('<h2>').text('Second Panel')

                // ),
                // $('<div>').attr('class', 'carousel-item').attr('href', '#three!').append(
                //     $('<h2>').text('Third Panel')
                // )
            )
        )
    )
}

function float_emoticon(emoticon_src){
    emoticon_src_gobal = emoticon_src;
    if (select_emoticon === 0) { // 처음 선택한 경우
        $('.carousel').before(
            $('<div>').attr('id', 'select_emoticon_area').append(
                $('<img>').attr('id', 'select_emoticon').attr('class', 'emoticon').attr('src', '../images/'+emoticon_src+'.png'),
                $('<img>').attr('id', 'cancel').attr('src', '../images/x.png').attr('alt', 'cancel')
            )
        );

        select_emoticon = 1;
    } else if (select_emoticon === 1) { // 연속해서 다시 선택한 경우
        $('#select_emoticon').attr('src', '../images/'+emoticon_src+'.png');
        select_emoticon = 1;
    }

    // select_emoticon_area 위치 조정
    //var select_area = $('#select_emoticon_area').height() + 40;
	var select_area = 112;
    $('#select_emoticon_area').css('top', '-' + select_area + 'px');

    // 이모티콘 입력창 위쪽 x누르면 없어지게 하기
    $('#cancel').on("click", function () {
        $('#select_emoticon_area').remove();
        select_emoticon = 0;
    });
};

function send_emoticon(src){
    select_emoticon = 1;
    sendMsg(null, src, 2);

   $('#input_area').children().last().remove();
    emoticon_mode = 0; // 이모티콘 모드 변수 초기화

    body_height = $('.phone-wrapper').height() - 46;
    $('.phone-body').css('height', body_height + 'px').css('min-height', body_height + 'px'); // phone-body 높이 맞춰주기
    $('.phone-body').scrollTop($('.phone-body')[0].scrollHeight); //스크롤 맨 아래로

    select_emoticon = 0; //이모티콘 선택 여부 초기화
}


function sendMsg(message, src, chk){

    var cnt;
    if(firebase.auth().currentUser != null){
        firebase.database().ref('chat').child($("#key").val()+"_"+$("#order").val()).on("value", function(data){
            if(data.numChildren() !== 0){
                cnt = parseInt(data.numChildren())+1;
            }else{
                cnt = 1;
            }

        });
        // for(var i =25; i<=200; i++){

        //     var obj = {};
        //     obj[cnt] = {msg : i, emo : src, uid : ''+firebase.auth().currentUser.uid,  type : chk};
        //     firebase.database().ref("chat").child($("#key").val()+"_"+$("#order").val()).update(obj);

        // }
        var obj = {};
        obj[cnt] = {msg : message, emo : src, uid : ''+firebase.auth().currentUser.uid,  type : chk};
        firebase.database().ref("chat").child($("#key").val()+"_"+$("#order").val()).update(obj);

    }
    $('.phone-body').scrollTop($('.phone-body')[0].scrollHeight);
}

// $('#m').on('focusout', function(){

// });

// $('.phone-body').on('click',function(){
//     alert($(this).height());
// });

// $('#input_area').on('click', function(){
//     alert($(this).height());
// });