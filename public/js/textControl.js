
var phone_width = $('#drama_list').width();

var time_text1 = $('.time_text1');
var time_text2 = $('.time_text2');

if (phone_width < 475) {
    $('.time_text1').text('');
    $('.time_text2').text('');
} else {
    $('.time_text1').text('10분 후 오픈');
    $('.time_text2').text('열람만 가능');
}


window.addEventListener('resize', function () {
    phone_width = $('#drama_list').width();
    //console.log(phone_width);

    time_text1 = $('.time_text1');
    time_text2 = $('.time_text2');

    if (phone_width < 475) {
        $('.time_text1').text('');
        $('.time_text2').text('');
    } else {
        $('.time_text1').text('10분 후 오픈');
        $('.time_text2').text('열람만 가능');
    }
});