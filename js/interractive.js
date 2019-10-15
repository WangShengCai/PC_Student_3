(function ($) {

    var obj = {
        init: function () {
            this.bindEvent();
            this.dataList = [];

            this.allPageSize;
            this.nowPage = 1;
            this.pageSize = 2;
        },

        // 绑定事件
        bindEvent: function () {
            var self = this;
            // window上的hashchange事件改变时候触发
            $(window).on('hashchange', function () {
                var hash = location.hash;
                $('.show-list').removeClass('show-list');   // 移除当前拥有show-list的类名
                $(hash).addClass('show-list');              // 给当前的hash加上show-list类名
            });
            // 学生列表
            $('.student-list').on('click', function () {
                // self.getAllData();
                self.getTableData();
            });
            // 新增学生
            $('.s-add .add').on('click', function () {
                // self.getAllData();
                self.addStudent();
            });
            // 搜索部分
            $('.search-btn').on('click', function () {
                self.getSearchData();
            });
        },

        // 按页渲染页面
        getTableData: function () {
            var self = this;
            var page = this.nowPage;
            var size = this.pageSize;
            $.ajax({
                url: 'http://api.duyiedu.com/api/student/findByPage?appkey=wangshengcai_1553946484946',
                type: 'get',
                data: { page: page, size: size },
                beforeSend: function () {
                    $('#students-table tbody').html('<p>正在加载中...</p>');
                },
                success: function (res) {
                    var list = JSON.parse(res);
                    self.allPageSize = list.data.cont;
                    self.dataList = list.data.findByPage;
                    self.renderDom(self.dataList);
                },
                error: function (e) {
                    console.log(e.status, e.statusText);
                }
            })
        },

        // 搜索部分
        getSearchData: function (value) {
            var self = this;
            var val = value || $('.search-wrap .inp').val();
            if (val == 'null' || val == null || val == 'undefined' || val == ' ' || val == '') {
                alert('请填入搜索内容');
                return;
            } else if(val) {
                var sex = $('.search-wrap input:radio:checked').val();
                sex = sex || 0;
                var page = this.nowPage;
                var size = this.pageSize;
                $.ajax({
                    url: 'http://api.duyiedu.com/api/student/searchStudent?appkey=wangshengcai_1553946484946',
                    type: 'get',
                    data: { sex: sex, search: val, page: page, size: size },
                    success: function (res) {
                        var list = JSON.parse(res).data.searchList;
                        self.allPageSize = JSON.parse(res).data.cont;
                        setTimeout(function () {
                            if(self.allPageSize == 0) {
                                alert('查询不到该学生');
                            }
                        },1200)
                        self.renderDom(list);
                    },
                    error: function (e) {
                        console.log(e.status, e.statusText);
                    }
                });
            }
        },

        // 新增学生
        addStudent: function () {
            var data = this.getFormData($('#student-form'));
            $.ajax({
                url: 'http://api.duyiedu.com/api/student/addStudent?appkey=wangshengcai_1553946484946',
                type: 'get',
                data: data,
                dataType: 'json',
                success: function (res) {
                    if (res.status == 'success') {
                        var isConfirm = confirm(res.msg);
                        if (isConfirm) {
                            $('#student-form').fadeOut();
                            $('.student-list').trigger('click');
                        } else {
                            $('#student-form')[0].reset();
                        }
                    } else {
                        alert(res.msg);
                    }
                },
                error: function (e) {
                    console.log(e.status, e.statusText);
                }
            })
        },

        // 渲染页面
        renderDom: function (data) {
            var self = this;
            var len = data.length;
            var html = '';
            if (len > 0) {
                data.forEach(function (ele, index) {
                    html += '<tr>\
                        <td>'+ ele.name + '</td>\
                        <td>'+ ele.sNo + '</td>\
                        <td>'+ (ele.sex ? '女' : '男') + '</td>\
                        <td>'+ ele.email + '</td>\
                        <td>'+ (new Date().getFullYear() - ele.birth) + '</td>\
                        <td>'+ ele.phone + '</td>\
                        <td>'+ ele.address + '</td>\
                        <td>\
                            <button class="btn edit" data-index="'+ index + '">编辑</button>\
                            <button class="btn del" data-index="'+ index + '">删除</button>\
                        </td>\
                    </tr>'
                });
                $('#students-table tbody').html(html);
                // 分页部分
                $('.right-content .cubs').page({
                    allPageSize: self.allPageSize,
                    nowPage: self.nowPage,
                    pageSize: self.pageSize,
                    changePageCb: function (obj) {
                        self.pageSize = obj.pageSize;
                        self.nowPage = obj.nowPage;
                        var val = $('.search-wrap .inp').val();
                        if (val) {
                            self.getSearchData(val);
                        } else {
                            self.getTableData();
                        }
                    }
                })
                self.pop();
            }
        },

        // 编辑按钮 删除按钮
        pop: function () {
            var self = this;
            // 编辑
            $('#students-table .edit').on('click', function () {
                $('.modal').fadeIn();
                var index = $(this).attr('data-index');
                var data = self.dataList[index];
                // 表单数据回填
                var form = $('#modal-form')[0];
                for (var prop in data) {
                    form[prop] ? form[prop].value = data[prop] : '';
                }
                // 点击提交
                $('#modal-form .submit').on('click', function (e) {
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    var data = self.getFormData($('#modal-form'));
                    $.ajax({
                        url: 'http://api.duyiedu.com/api/student/updateStudent?appkey=wangshengcai_1553946484946',
                        type: 'get',
                        data: data,
                        success: function (res) {
                            alert('修改成功');
                            $('.modal').fadeOut();
                            $('.student-list').trigger('click');
                        },
                        error: function (e) {
                            console.log(e.status, e.statusText);
                        }
                    });
                });
            });
            // 删除
            $('#students-table .del').on('click', function () {
                $('.del-modal').fadeIn();
                var index = $(this).attr('data-index');
                var num = self.dataList[index].sNo;
                // 确认
                $('.sure-btn').on('click', function () {
                    $.ajax({
                        url: 'http://api.duyiedu.com/api/student/delBySno?appkey=wangshengcai_1553946484946',
                        type: 'get',
                        data: { sNo: num },
                        success: function (res) {
                            alert('删除成功');
                            $('.del-modal').fadeOut();
                            $('.student-list').trigger('click');
                        },
                        error: function (e) {
                            console.log(e.status, e.statusText);
                        }
                    })
                });
                // 取消
                $('.reset-btn').on('click', function () {
                    $('.del-modal').fadeOut();
                });
            })
        },

        // 获取表格数据
        getFormData: function (form) {
            var data = form.serializeArray()
            var obj = {};
            data.forEach(function (ele, index) {
                obj[ele.name] = ele.value;
            })
            return obj;
        },
    }
    obj.init();

}(window.jQuery));