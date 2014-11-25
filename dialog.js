/**
 * @file 弹出对话框组件
 * @author xiongjun
 * @date 2014/5/19
 */



    /**
     * 弹出带有遮照的浮层对话框
     *
     * @constructor
     */

    function Dialog(){
       /**
        * 默认配置  
        * @type {object}
        * @private
        */
        this._config = {
            html: "",
            dialogId: "",
            hook: null,
            zIndex: "999",
            zIndexCover: "888",
            coverColor: "#000",
            coverOpactiy: 0.5
        };
    }

    Dialog.prototype = {

        /**
         * 共享的配置
         * @private
         */
        _shareConfig: {
            position: "fixed",
            docWidth: $(document).width(),
            docHeight: $(document).height(),
            winWidth: $(window).width(),
            winHeight: $(window).height()
        },

        /**
         * 初始化配置
         * @param {object} config 用户自定义配置  
         * @public
         */
        initConfig: function(config){
           $.extend(this.config, config || {}); 
           this._openPopup();
        },

        /**
         * 生成遮罩层
         * @private
         */
        _initPopup: function(){ 
            if($("#popMask").length == 0){
                $("body").append('<div id="popMask"></div>');
            }

            this._setMaskStyle();
        },

        /**
         * 给遮罩层加样式
         * @private
         */
        _setMaskStyle: function(){ 
            this.$popMask = $("#popMask");
            this.$popMask.css({
                position: this._shareConfig.position,
                left: 0,
                top: 0,
                height: "100%",
                width: "100%",
                "z-index": this._config.zIndexCover,
                opacity: this._config.coverOpactiy,
                background: this._config.coverColor 
            });
        },

        /**
         * 生成对话框
         * @private
         */
        _initDialog: function(){
            var dialogId = this._config.dialogId;
            if($("#"+dialogId).length ==0){
                $("body").append(this.config.html);
            }
            
            this.$dialog = $("#"+dialogId);
            var
                dialogWidth = this.$dialog.width(),
                dialogHeight = this.$dialog.height(),
                xDistance = (this.shareConfig.winWidth - dialogWidth)/2,
                yDistance = (this.shareConfig.winHeight - dialogHeight)/2;

            this.$dialog.css({
                position: this.shareConfig.position,
                left: xDistance,
                top: yDistance,
                "z-index": this.config.zIndex
            });
        },

        /**
         * 事件处理
         * @private
         */
        _handleEvent: function(){
            if(this.$popMask.length !=0){
                this.$popMask.on("click", function(){
                    this._destroyPopup(); 
                    this._restoreMove();
                }.bind(this));
            }

            //弹出的对话框可能需要事件处理
            if(this.config.hook !== null){
                this.config.hook.handleEvent();
            }
        },

        /**
         * 打开遮罩和对话框
         * @private
         */
        _openPopup: function(){
            this._initPopup();
            this._initDialog();
            this._stopMove();
            this._handleEvent();
        },

        /**
         * 销毁遮罩层和对话框
         * @private
         */
        _destroyPopup: function(){
            this.$popMask.remove();
            this.$dialog.remove();
        },

        /**
         * 阻止浏览器默认行为
         * @private
         */
        _stopDefAndStop: function(e){
            e.preventDefault();
            e.stopPropagation(); 
        },

        /**
         * 禁用touchmove,touchmove,touchend
         * @private
         */ 
        _stopMove: function(){
            $("document").on({
                touchstart: this.eventObj, 
                touchmove: this.eventObj,
                touchend: this.eventObj 
            }).bind(this); 
        },
        /**
         * 取消对move事件的代理
         * @private
         */ 
        _restoreMove: function(){
            $("document").off({
                touchstart: this.eventObj, 
                touchmove: this.eventObj,
                touchend: this.eventObj 
            }).bind(this); 
        }

    };

    var 
        //这个d对象用于浮层上的事件处理
        d= new DateHandler(),
        //html默认的对话框模板,可以进行自定义
        html = [
            '<div class="time-dialog" id="j-dialog">',
                '<div class="year">',
                    '<div class="arrow-top year-plus"></div>',
                    '<div class="content"><span id="j-year">2014</span>年</div>',
                    '<div class="arrow-bottom year-minus"></div>',
                '</div>',
                '<div class="month">',
                    '<div class="arrow-top month-plus"></div>',
                    '<div class="content"><span id="j-month">5</span>月</div>',
                    '<div class="arrow-bottom month-minus"></div>',
                '</div>',
                '<div class="day">',
                    '<div class="arrow-top day-plus"></div>',
                    '<div class="content"><span id="j-day">5</span>日</div>',
                    '<div class="arrow-bottom day-minus"></div>',
                '</div>', 
            '</div>'
        ].join(''),
        config = {
            html: html,
            dialogId: "j-dialog",
            //hook相当于钩子属性，用于对弹出的对话框上的事件处理,可以不传
            hook: d
        },
        dialog = new Dialog();
    dialog.initConfig(config);
    });
