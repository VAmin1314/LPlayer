    var LPlayer = {
        property: {
            playlist: {},
            isShowNotification: false,
            isInitMarquee: true,
            shuffleArray: [],
            shuffleIndex: '',
            isFirstPlay: localStorage.qplayer == undefined ? true : false,
            isShuffle: false,
            currentTrack: 0,
            autoplay: false,
            isRotate: true
        },
        start: function (data = {}) {
            if (!data.playlist) {
                // alert('没有播放列表');
                return false;
            }

            _this = this;
            _this.property.playlist = data.playlist;
            _this.property.autoplay = data.autoPlay;

            for (var i = 0; i < _this.property.playlist.length; i++) {
                var item = _this.property.playlist[i];
                $('#playlist').append('<li class="lib" style="overflow:hidden;"><strong style="margin-left: 5px;">' + item.title + '</strong><span style="float: right;" class="artist">' + item.artist + '</span></li>');
                if (item.mp3 == "") {
                    $('#playlist li').eq(i).css('color', '#ddd');
                }
            }

            // var audio, timeout;
            // var shuffle_array = localStorage.qplayer_shuffle_array;

            // if (_this.property.isShuffle && shuffle_array != undefined && _this.property.playlist.length === (_this.property.shuffleArray = JSON.parse(shuffle_array)).length) {
            //     _this.property.currentTrack = _this.property.shuffleArray[0];
            //     _this.property.shuffleIndex = 0;
            //     $('#QPlayer .cover').attr('title', '点击关闭随机播放');
            // } else {
            //     _this.property.isShuffle = false;
            //     $('#QPlayer .cover').attr('title', '点击开启随机播放');
            // }

            var totalHeight = 0;
            for (var i = 0; i < _this.property.playlist.length; i++) {
                totalHeight += ($('#playlist li').eq(i).height() + 6);
            }
            if (totalHeight > 360) {
                $('#playlist').css("overflow", "auto");
                if (_this.property.isShuffle) {
                    var temp = 0;
                    for (var j = 0; j < _this.property.currentTrack; j++) {
                        temp += ($('#playlist li').eq(j).height() + 6);
                    }
                    $('#playlist').scrollTop(temp);
                }
            }

            _this.loadMusic(_this.property.currentTrack);
        },
        play: function () {
            audio.play();

            if (_this.property.isRotate) {
                $("#player .cover img").css("animation", "9.8s linear 0s normal none infinite rotate");
                $("#player .cover img").css("animation-play-state", "running");
            }
            $('.playback').addClass('playing');

            timeout = setInterval(_this.updateProgress, 500);
            if (_this.isExceedTag()) {
                if (_this.property.isInitMarquee) {
                    _this.initMarquee();
                    _this.property.isInitMarquee = false;
                } else {
                    $('.marquee').marquee('resume');
                }
            }
        },
        pause: function () {
            audio.pause();
            $("#player .cover img").css("animation-play-state", "paused");
            $('.playback').removeClass('playing');
            clearInterval(timeout);
            if (_this.isExceedTag()) {
                $('.marquee').marquee('pause');
            }
        },
        setProgress: function(value) {
            var currentSec = parseInt(value % 60) < 10 ? '0' + parseInt(value % 60) : parseInt(value % 60),
            ratio = value / audio.duration * 100;

            $('.timer').html(parseInt(value / 60) + ':' + currentSec);
        },
        updateProgress: function () {
            _this.setProgress(audio.currentTime);
        },
        switchTrack: function (i) {
            if (i < 0) {
                track = _this.property.currentTrack = _this.property.playlist.length - 1;
            } else if (i >= _this.property.playlist.length) {
                track = _this.property.currentTrack = 0;
            } else {
                track = i;
            }

            _this.property.isInitMarquee = true;
            $('audio').remove();
            _this.loadMusic(track);
            _this.play();
        },
        shufflePlay: function (i) {
            if (i === 1) {
                if (++_this.property.shuffleIndex === _this.property.shuffleArray.length) {
                    _this.property.shuffleIndex = 0;
                }
                _this.property.currentTrack = _this.property.shuffleArray[_this.property.shuffleIndex];

            } else if (i === 0) {
                if (--_this.property.shuffleIndex < 0) {
                    _this.property.shuffleIndex = _this.property.shuffleArray.length - 1;
                }
                _this.property.currentTrack = _this.property.shuffleArray[_this.property.shuffleIndex];
            }

            _this.switchTrack(_this.property.currentTrack);
        },
        ended: function () {
            _this.pause();
            audio.currentTime = 0;
            if (_this.property.isShuffle) {
                _this.shufflePlay(1);
            } else {
                if (_this.property.currentTrack < _this.property.playlist.length) {
                    _this.switchTrack(++_this.property.currentTrack);
                }
            }
        },
        beforeLoad: function () {
            // console.log('beforeLoad');
        },
        afterLoad: function () {
            if (_this.property.autoplay == true) {
                _this.play();
            }
        },
        loadMusic: function (i) {
            // 载入音乐
            var item = _this.property.playlist[i];
            while (item.mp3 == "") {
                if (_this.property.isShuffle) {
                    if (++(_this.property.shuffleIndex) === _this.property.shuffleArray.length) {
                        _this.property.shuffleIndex = 0;
                    }
                    i = _this.property.currentTrack = _this.property.shuffleArray[_this.property.shuffleIndex];
                } else {
                    _this.property.currentTrack = ++i;
                }
                // item = _this.property.playlist[i];
            }

            var newaudio = $('<audio>').html('<source src="' + item.mp3 + '"><source src="' + item.ogg + '">').appendTo('#player');
            $('.cover').html('<img src="' + item.cover + '" alt="' + item.album + '">');
            $('.musicTag').html('<strong>' + item.title + '</strong><span> - </span><span class="artist">' + item.artist + '</span>');
            $('#playlist li').removeClass('playing').eq(i).addClass('playing');

            audio = newaudio[0];
            audio.addEventListener('progress', _this.beforeLoad, false);
            audio.addEventListener('durationchange', _this.beforeLoad, false);
            audio.addEventListener('canplay', _this.afterLoad, false);
            audio.addEventListener('ended', _this.ended, false);
        },
        shuffle: function(array) {
            // 随机
            var m = array.length, t, i;

            while (m) {
                i = Math.floor(Math.random() * m--);
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }

            return array;
        },
        isExceedTag: function() {
            // 判断是否超过标签
            var isExceedTag = false;
            if ($('.musicTag strong').width() + $('.musicTag span').width() + $('.musicTag .artist').width() > $('.musicTag').width()) {
                isExceedTag = true;
            }

            return isExceedTag;
        },
        initMarquee: function () {
            $('.marquee').marquee({
                duration: 15000,
                gap: 50,
                delayBeforeStart: 0,
                direction: 'left',
                duplicated: true
            });
        }
    };

    $(function () {
        $('#player .ctrl .musicTag').bind('touchstart', function (event) {
            startX = event.originalEvent.targetTouches[0].screenX;
        }).bind('touchmove', function (event) {
            endX = event.originalEvent.targetTouches[0].screenX;
            var seekRange = Math.round((endX - startX) / 678 * 100);
            audio.currentTime += seekRange;
            LPlayer.setProgress(audio.currentTime);
        });

        var startX, endX;
        $('#player .ctrl .musicTag').mousedown(function (event) {
            startX = event.screenX;
        }).mousemove(function (event) {
            if (event.which === 1) {
                endX = event.screenX;
                var seekRange = Math.round((endX - startX) / 678 * 100);
                audio.currentTime += seekRange;
                LPlayer.setProgress(audio.currentTime);
            }
        });

        // 随机播放
        // $("#player .cover").on('click', function () {
        //     isShuffle = LPlayer.property.isShuffle;
        //     if (isShuffle) {
        //         $("#player .cover").attr("title", "点击关闭随机播放");

        //         var temp = [];
        //         for (var i = 0; i < LPlayer.playlist.length; i++) {
        //             temp[i] = i;
        //         }

        //         shuffleArray = LPlayer.shuffle(temp);
        //         for (var j = 0; j < shuffleArray.length; j++) {
        //             if (shuffleArray[j] === LPlayer.property.currentTrack) {
        //                 shuffleIndex = j;
        //                 break;
        //             }
        //         }

        //         localStorage.qplayer_shuffle_array = JSON.stringify(LPlayer.shuffleArray);
        //     } else {
        //         $("#player .cover").attr("title", "点击开启随机播放");
        //         localStorage.removeItem('qplayer_shuffle_array');
        //     }

        //     localStorage.qplayer = LPlayer.isShuffle;
        // });

        $("#QPlayer .ssBtn").on('click', function () {
            var mA = $("#QPlayer");
            if ($('.ssBtn .adf').hasClass('on') === false) {
                mA.css("transform", "translateX(250px)");
                $('.ssBtn .adf').addClass('on');
            } else {
                mA.css("transform", "translateX(0px)");
                $('.ssBtn .adf').removeClass('on')
            }
        });

        $('#QPlayer .liebiao,#QPlayer .liebiao').on('click', function () {
            var pl = $('#playlist');
            if (pl.hasClass('go') === false) {
                pl.addClass('go').css({
                    "max-height": "360px",
                    "transition": "max-height .5s ease",
                    // "border-top": "1px solid #dedede"
                });
            } else {
                pl.removeClass('go').css({
                    "max-height": "0px",
                    "transition": "max-height .5s ease",
                // "border": "0"
            });
            }
        });

        $('.playback').on('click', function () {
            if ($(this).hasClass('playing')) {
                LPlayer.pause();
            } else {
                LPlayer.play();
            }
        });

        $('.rewind').on('click', function () {
            if (LPlayer.isShuffle) {
                LPlayer.shufflePlay(0);
            } else {
                LPlayer.switchTrack(--(LPlayer.property.currentTrack));
            }
        });

        $('.fastforward').on('click', function () {
            if (LPlayer.isShuffle) {
                LPlayer.shufflePlay(1);
            } else {
                LPlayer.switchTrack(++(LPlayer.property.currentTrack));
            }
        });

        $('#playlist').on('click', 'li.lib', function () {
            var num = $(this).index();
            LPlayer.switchTrack(num);
        });
    })