/**
 * @file 年月日组件
 * @author xiongjun(xiongjun@baidu.com)
 * @date 2014/5/19
 */

    /**
     * 处理日期变化
     * @constructor
     */
    function DateHandler(){
        /**
         * 默认是平年，每个月的天数
         * @type {array}
         * @private
         */
        this._days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }

    DateHandler.prototype = {

        /**
         * 判断是否是闰年
         * @param {number} 年份
         * @return {boolean} 是否是闰年
         * @private
         */
        _isLeapYear: function(year){
            var isLeapYear = false;
            if((year % 4 ==0 && year % 100 !==0) || (year % 400 ==0)){
               isLeapYear = true;
            }

            return isLeapYear;
        },

        /**
         * 初始化年月日,默认是当前
         * @private
         */
        _initDate: function(){
            var date = new Date().getTime();
            this.year = date.getFullYear();
            this.month = date.getMonth()+1;
            this.day = date.getDate();
        },

        /**
         * 根据闰年和平年进行2月份的天数进行调整
         * @private
         */
        _updateDays: function(){
            if(this._isLeapYear(this.year)){
                this.days[1] = 29;
            }else{
                this.days[1] = 28;
            } 
        },

        /**
         * 当年分和月分有变化时，默认变为1号
         * @private
         */
        _resetDay: function(dayObj){
            dayObj.text("1");
        },

        /**
         * 对年月日进行联动事件处理
         * @public
         */
        handleEvent: function(){
            this._initDate();
            var $dialog = $('#j-dialog');
            $dialog.on('click',function(e){
                var
                    $target = $(e.target),
                    $year = $('#j-year'),
                    $month = $('#j-month'),
                    $day = $('#j-day');

                if($target.hasClass("year-plus")){
                    ++this.year;
                    $year.text(this.year);
                    this.updateDays();
                    this.resetDay($day);
                }

                if($target.hasClass("year-minus")){
                    --this.year;
                    $year.text(this.year);
                    this.updateDays();
                    this.resetDay($day);
                }

                if($target.hasClass("month-plus")){
                    if(this.month >=12){
                        return;
                    }
                    $month.text(++this.month);
                    this.resetDay($day);
                }

                if($target.hasClass("month-minus")){
                    if(this.month <= 1){
                        return;
                    }
                    $month.text(--this.month); 
                    this.resetDay($day);
                }

                if($target.hasClass("day-plus")){
                    var 
                        index = this.month-1,
                        day = $day.text();
                    if(day >= this.days[index]){
                        return;
                    }
                    $day.text(++day);
                }

                if($target.hasClass("day-minus")){
                    var day = $day.text();
                    if(day <= 1){
                        return;
                    }
                    $day.text(--day);
                }
            }.bind(this));
        }
    };

    //年月日的测试html模板
    /*'<div class="time-dialog" id="j-dialog">'
        '<div class="year">',
            '<div class="arrow-top year-plus"></div>'
            '<div class="content"><span id="j-year">2014</span>年</div>'
            '<div class="arrow-bottom year-minus"></div>'
        '</div>'
        '<div class="month">'
            '<div class="arrow-top month-plus"></div>'
            '<div class="content"><span id="j-month">5</span>月</div>'
            '<div class="arrow-bottom month-minus"></div>'
        '</div>'
        '<div class="day">'
            '<div class="arrow-top day-plus"></div>'
            '<div class="content"><span id="j-day">5</span>日</div>'
            '<div class="arrow-bottom day-minus"></div>'
        '</div>', 
    '</div>'*/

    var date = new DateHandler();
    date.handleEvent();
