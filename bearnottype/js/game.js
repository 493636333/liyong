;(function (argument) {
    /*页面类*/
    var Page = Event.extend({
        init: function (game, obj) {
            this.game = game;
            this.pageNum = obj.pageNum;
            this.selector = obj.selector;
            this.$element = $(obj.selector);
            this._super();
        }
    });

    /*题页面类*/
    var RequestionPage = Page.extend({
        init: function (game, obj) {
            var that = this;
            this._super(game, obj);

            // 选择的答案
            this.key = null;

            // 本页面的正确答案
            this.rightKey = obj.rightKey;

            // 本页面是否是最后一个题
            this.isLast = obj.isLast;

            // 每当离开本页面都要删除已经选择的选项
            this.addEventListener('leavePage', function () {
                that.key = null;
                that.$element.find('.select').removeClass('active');
            });
            this.bindEvent();
        },
        bindEvent: function () {
            var that = this;

            // 下一题绑定事件
            this.$element.on('click', '.continue-btn', function () {
                if(!that.key) {
                    alert('请选择一个答案!');
                    return;
                }
                if(that.checkAnswer()) {
                    that.game.setScore();
                }
                if(!that.isLast) {
                    that.game.goPage();
                } else {
                    that.game.showResult();
                }
                that.trigger('leavePage');
            });
            // 重新开始事件
            this.$element.on('click', '.retry-btn', function () {
                that.trigger('leavePage');
                that.game.retry();
            });
            // 选项绑定事件
            this.$element.on('click', '.text', function () {
                var className = $(this).parent().addClass('active')[0].className;
                if(that.key != null) {
                    that.$element.find('.select-' + that.key).removeClass('active');
                }
                that.key = +className.match(/select-(\d+)/)[1];
            });
        },
        checkAnswer: function () {
            return this.rightKey === this.key;
        }
    });

    /*整个游戏的主控制器*/
    var Game = Class.extend({
        init: function () {
            this.defaultConfig = {
                voice: true,
                rightKeys: [1, 3, 3, 2, 3]
            };
            this.gameState = {
                currentPage: 0,
                score: 0
            };
            this.pages = [];
            this.initSize();
        },
        creatPage: function () {
            var that = this;
            function creatStartPage() {
                that.pages.push(new Page(that, {
                    pageNum: 1,
                    selector: '.page1'
                }));
            }
            function createQuestionPage() {
                var rightKeys = that.defaultConfig.rightKeys;
                rightKeys.forEach(function (value, index, arr) {
                    var isLast = (index === (arr.length - 1));
                    that.pages.push(new RequestionPage(that, {
                        pageNum: index + 2,
                        selector: '.page' + (index + 2),
                        rightKey: value,
                        isLast: isLast
                    }));
                });
            }
            creatStartPage();
            createQuestionPage();
        },
        start: function () {
            PageTransitions = PageTransitions();
            PageTransitions.init();

            this.$bgmusic = $('#bgmusic');
            this.$clickMusic = $('#click-music');
            this.bindEvent();
            this.creatPage();
        },
        toggleMusic: function () {
            if(this.defaultConfig.voice) {
                this.defaultConfig.voice = false;
                $('.voice-wrap').removeClass('voice-play').addClass('voice-pause');
                this.$bgmusic[0].pause();
            } else {
                this.defaultConfig.voice = true;
                $('.voice-wrap').removeClass('voice-pause').addClass('voice-play');
                this.$bgmusic[0].play();
            }
        },
        events: {
            '.start-btn': function (game) {
                $('.beiye').attr('src', 'images/page1/beiye-2.png');
                setTimeout(function () {
                    game.goPage(1);
                    setTimeout(function () {
                        $('.beiye').attr('src', 'images/page1/beiye-1.png');
                    },200);
                },200);
            },
            '.again-btn': function (game) {
                game.retry();
            },
            '.share-btn': function (game) {
                $('.share-page').show();
                $('.layer').show();
            },
            '.share-page': function () {
                $(this).hide();
                $('.layer').hide();
            },
            '.voice-wrap': function(game) {
               game.toggleMusic();
            }
        },
        goPage: function (page) {
            var page = page != undefined ? page : ++this.gameState.currentPage;
            var animation = Math.ceil(67 * Math.random());
            this.gameState.currentPage = page;
            PageTransitions.nextPage({
                animation:animation,
                showPage:page
            });
        },
        retry: function () {
            this.setScore(0);
            this.goPage(0);
        },
        initSize: function () {
            var bili1 = 579 / 1008;
            var windowHeight = $(window).height();
            var windowWidth = $(window).width();
            var bili2 = windowWidth / windowHeight;
            var size = {};
            // 太高(依照宽度)
            if(bili1 > bili2) {
                size.width = windowWidth * 0.9;
                size.height = size.width / bili1;
                size.marginLeft = size.width / 2 * -1;
            } else { // 太矮(依照高度)
                size.width = windowHeight * bili1;
                size.height = windowHeight;
                size.marginLeft = size.width / 2 * -1;
            }
            $('head').append($('<style>.inner-page{width:'+ size.width +'px;height:' + size.height + 'px;margin-left:' + size.marginLeft + 'px;}</style>'));
        },
        bindEvent: function () {
            var that = this;
            $(window).on('resize', this.initSize);
            $.each(this.events, function (key, value) {
                $(document).on('click', key, function () {
                    value.call(this, that);
                });
            });

            $(document).on('click', function () {
                if(that.defaultConfig.voice) {
                    that.$clickMusic[0].play();
                }
            });
        },
        setScore: function (score) {
            if(score == null) {
                this.gameState.score ++;
            }
            else {
                this.gameState.score = score;
            }
        },
        getScore: function () {
            return this.gameState.score;
        },
        showResult: function () {
            var score = this.getScore();

            if(score <= 2) {
                this.goPage(6);
                return;
            } else if (score <= 4) {
                this.goPage(7);
                return;
            } else {
                this.goPage(8);
            }
        }
    });
    this.Game = Game;
})();