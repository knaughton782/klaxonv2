var audio;

//original state = hide pause button
$('#pause').hide();

initAudio($('#playlist li:first-child'));

function initAudio(element) {
    var song = element.attr('song');
    var title = element.text();
    // var cover = element.attr('cover'); // if img needs dynamically delivered
    var artist = element.attr('artist');

    //create audio object
    audio = new Audio('media/' + song); //audio source files

    //insert audio info
    $('.artist').text(artist);
    $('.title').text(title);
    //cover info here if needed
    $('#playlist li').removeClass('active');
    element.addClass('active');

    //volume control
    $('#volume').change(function () {
        audio.volume = parseFloat(this.value / 10);
    });

    showDuration();
}

//play button
$('#play').click(function () {
    audio.play();
    $('#play').hide();
    $('#pause').show();
    showDuration();
});

//stop button
$('#stop').click(function () {
    audio.pause();
    audio.currentTime = 0;
    $('#pause').hide();
    $('#play').show();
});

//next button
$('#next').click(function () {
    audio.pause();
    audio.currentTime = 0;
    $('#pause').show();
    $('#play').hide();

    var next = $('#playlist li.active').next();
    if (next.length == 0) {
        next = $('#playlist li:first-child');
    }

    initAudio(next);
    audio.play();
    showDuration();

});

//previous button
$('#previous').click(function () {
    audio.pause();
    audio.currentTime = 0;
    $('#play').hide();
    $('#pause').show();

    var previous = $('#playlist li.active').prev();
    if (previous.length == 0) {
        previous = $('#playlist li:last-child');

    }
    initAudio(previous);
    audio.play();
    showDuration();

});

//click on song to play
$('#playlist li').click(function () {
    audio.pause();
    initAudio($(this));
    $('#play').hide();
    $('#pause').show();
    audio.play();
    showDuration();
})


//pause button
$('#pause').click(function () {
    audio.pause();
    $('#pause').hide();
    $('#play').show();
});



//duration timer and progress indicator
function showDuration() {
    //show indicator
    $(audio).bind("timeupdate", function () {
        var timePercent = (this.currentTime / this.duration) * 100;
        $("#playProgress").css({ width: timePercent + "%" });
    });

    //timer for current audio file
    $(audio).bind("timeupdate", function () {
        $("#currentTimer").html(formatTime(this.currentTime))
    });

    //duration change for audio length
    $(audio).bind("durationchange", function () {
        $("#duration").html(formatTime(this.duration))
    });

    function formatTime(seconds) {
        var seconds = Math.round(seconds);
        var minutes = Math.floor(seconds / 60);
        //remaining seconds
        seconds = Math.floor(seconds % 60);
        //add leading zeroes
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    }
}


//load progress indicator only
$(audio).bind("loadeddata progress canplaythrough playing", function () {
    updateLoadProgress();
});

function updateLoadProgress() {
    if (audio.buffered.length > 0) {
        var percent = (audio.buffered.end(0) / audio.duration) * 100;
        $("#loadProgress").css({ width: percent + "%" });
    }
}

