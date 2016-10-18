// 윈도우 창 크기 변경시에도 스크롤 맨 아래로
window.addEventListener('resize', function () {
    // $('.phone-wrapper').css('height','100%');

    if ($('#emoticon_area')[0] === undefined) { // 이모티콘 영역이 없을 경우
        // 창 크기 변경시 body 높이 변경
        var body_height = $('.phone-wrapper').height() - 46;
        $('.phone-body').css('height', body_height + 'px').css('min-height', body_height + 'px');
    } else { // 이모티콘 영역이 있을 경우
        // select_emoticon_area 위치 조정
        var body_height = $('.phone-wrapper').height() - 255; // 이모티콘 영역의 크기 258px로 고정
        $('.phone-body').css('height', body_height + 'px').css('min-height', body_height + 'px');

    }

    // 스크롤 맨 아래로
    $('.phone-body').scrollTop($('.phone-body')[0].scrollHeight);
});

