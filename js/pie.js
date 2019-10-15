(function ($) {

    var obj = {
        /**
         * 初始化函数
         */
        init: function () {
            this.getData();
            // Echarts要用到的配置对象
            this.option = {
                title: {
                    text: '',
                    subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    // data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                    data: []
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        // data: [
                        //     { value: 335, name: '直接访问' },
                        //     { value: 310, name: '邮件营销' },
                        //     { value: 234, name: '联盟广告' },
                        //     { value: 135, name: '视频广告' },
                        //     { value: 1548, name: '搜索引擎' }
                        // ],
                        data: [],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        },

        /**
         * 调取学生总数据
         */
        getData: function () {
            var self = this;
            $.ajax({
                url: "http://api.duyiedu.com/api/student/findAll?appkey=wangshengcai_1553946484946",
                type: "get",
                success: function (data) {
                    var dataList = JSON.parse(data);
                    self.getAreaChart(dataList.data);       // 地区展示
                    self.getSexChart(dataList.data);        // 性别展示
                },
                error: function (e) {
                    console.log(e.status, e.statusText);
                }
            })
        },

        /**
         * 地区展示
         */
        getAreaChart: function (data) {
            var myAreaChart = echarts.init($('.wrapper .right-content .area')[0]);
            var legendArr = [];
            var seriesArr = [];
            // [,,,,] => [{value:10,name:北京},{value:11,name:云南},{value:12,name:杭州}]
            var numObj = {};
            data.forEach(function (item, index) {
                if (legendArr.indexOf(item.address) == -1) {
                    legendArr.push(item.address);
                    numObj[item.address] = 1;
                } else {
                    numObj[item.address]++;
                }
            });
            for (var prop in numObj) {
                var obj = {};
                obj['name'] = prop;
                obj.value = numObj[prop];
                seriesArr.push(obj);
            }
            this.option.title.text = '渡一学生地区分布';
            this.option.series[0].name = '地区分布';
            this.option.legend.data = legendArr;
            this.option.series[0].data = seriesArr;
            myAreaChart.setOption(this.option);
        },

        /**
         * 性别展示 1：女 0：男
         */
        getSexChart: function (data) {
            var mySexChart = echarts.init($('.wrapper .right-content .sex')[0]);
            var obj = {};           // {0: 64, 1: 17}
            data.forEach(function (item,index) {
                if(!obj[item.sex]) {
                    obj[item.sex] = 1;
                } else {
                    obj[item.sex] ++;
                }
            })
            var seriesArr = [ {name : "男",value : obj[0]},{name : '女',value : obj[1]} ];
            this.option.title.text = '渡一学生性别分布';
            this.option.series[0].name = '性别分布';
            this.option.legend.data = ['男','女'];
            this.option.series[0].data = seriesArr;
            mySexChart.setOption(this.option);
        },
    }
    obj.init();

}(jQuery));