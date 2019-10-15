// 点击
(function ($) {

    var obj = {
        init:function () {
            location.hash = 'student-echarts';
            this.bindEvent();
        },

        /**
         * 事件绑定
         */
        bindEvent:function () {
            // 按钮点击
            var list = $('.header .drop-list');
            $('.header .btn').on('click',function () {
                list.slideToggle();
            });

            // 窗口尺寸改变
            $(window).resize(function () {
                if(window.innerWidth > 768) {
                    list.hide();
                }
            });

            // 头部离开
            $('.header').on('mouseleave',function () {
                list.slideUp();
            });

            // 列表点击
            $('.list').on('click',function () {
                $('.active').removeClass('active');
                $(this).addClass('active');
                location.hash = $(this).attr('data-id');
            });

            // 编辑学生遮罩层
            $('.modal').add('.del-modal').on('click',function () {
                $(this).fadeOut();
            });
            $('.modal-content').add('.del-modal .con').on('click',function (e) {
                e.stopPropagation();
            });
        }
    }
    obj.init();

} (jQuery));