/**
 * @file   验证器组件，可以用来验证一些平时我们在项目中经常使用的字段和表单验证提交等
 * @example
 *      1. 用法例子如下：
 *          获取一个单例: var single = v.getInstance();
 *          验证邮箱： var data = {email: '这里是你的邮箱值'}；
 *          执行结果: var result = single.validate(data),result为true,数据验证没有问题，false数据不合法;
 *          可以输出错误提示：console.log(single.messages);
 *          表单提交的时候一次性多次验证：
 *          var data = {email: '你的邮箱',phone: '你的手机号码',empty: '要传的值'},如果返回结果为true，才会提交,
 *          可以输出错误提示：console.log(single.messages)进行调示
 *      2. 本验证器易扩展：
 *          1). 比如我难证的某个字段，插件里没有提供，我的代码逻辑要验证某个对象是不是美女,请按下面规则添加
 *
 *              a). 获取单例对象：var single = v.getInstance();
 *              b). single.configs ={girl: 'isBeautifulGirl'}
                c). single.handlers.isBeautifulGirl = {
                        validate: function(value){
                        //.....你的验证逻辑在这里
                        return ....;
                        },
                    errorInfo: '不是美女！'
                }
             2). 还可以覆盖错误提示信息或验证逻辑
                a) 我想覆盖手机号码的错误提示信息
                    single.configs.handlers.phone.errorTip = '你的手机呈码错了'
                b) 也可以重写覆盖手机号码验证逻辑
                    single.configs.handlers.phone.validate = function(){........}
 *      3. 后面还可以添加其他验证逻辑,只需根据例子添加，不用修改太多的代码
 *
 * @author tuanfe
 * @since  2014/03/26
 */


var v = (function () {

    var unique;

    function Singleton() {
        //配置
        this.configs = {
            //邮箱是不是合法
            email: 'emailValidator',
            //手机号码
            phone: 'phoneValidator',
            //值是否非空
            empty: 'emptyValidator',
            //是否是数字
            number: 'numberValidator',
            // 短信验证码 by zhaoran04
            smscode : 'smscodeValidator',
            //邮政编码
            postalcode : 'postalcodeValidator'
            //后续还可以添加其他要校验的....
        };
        //与configs配对的处理函数
        this.handlers = {};
        //错误信息提示数组
        this.messages = [];
    }

    Singleton.prototype.initHandlers = function () {
        //邮箱处理handler
        this.handlers[this.configs.email] = {
            validate: function (data) {
                var regEmail = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                return regEmail.test(data);
            },
            errorTip: '邮箱不合法'
        };

        //处理手机号码handler
        this.handlers[this.configs.phone] = {
            validate: function (data) {
                //在国外打回中国就要先拨+86或0086,现在补充上，但向后端提交手机号时一定要取将86后面的11位
                var regEmail = /^((\+86)|(0086))?1[0-9]{10}$/;
                return regEmail.test(data);
            },
            errorTip: '请输入正确的手机号码'
        };

        //是否为空值的handler
        this.handlers[this.configs.empty] = {
            validate: function (data) {
                return (data !== '' && data !== undefined && data !== null);
            },
            errorTip: '值不能为空'
        };
        //校验值是否是数字
        this.handlers[this.configs.number] = {
            validate: function (data) {
                return !isNaN(data);
            },
            errorTip: '值不是数字'
        };
        //校验值是否是数字
        this.handlers[this.configs.smscode] = {
            validate: function (data) {
                // 6位数字
                var reg = /^\d{6}$/;
                return reg.test(data);
            },
            errorTip: '不是有效的短信验证码'
        };
        //校验邮政编码
        this.handlers[this.configs.postalcode] = {
            validate: function (data) {
                return /^\d{6}$/.test(data);
            },
            errorTip: '不是有效的邮政编码'
        };
        //按照上面的例子后续还可以添加与config中配对的处理函数....

    };
    Singleton.prototype.hasErrors = function () {
        return this.messages.length > 0;
    };
    Singleton.prototype.validate = function (data) {

        var self = this;
        self.initHandlers();
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                var type = self.configs[i];
                var checker = self.handlers[type];
                if (!type) {
                    continue;
                }
                if (!checker) {
                    throw {
                        name: '较验异常',
                        message: '没有与' + type + '相关的较验函数'
                    };
                }

                var result = checker.validate(data[i]);
                if (!result) {
                    var msg = i + '的值:' + checker.errorTip;
                    self.messages.push(msg);
                }else{
                    //清空错误信息
                    self.messages.splice(0,self.messages.length);
                }
            }
        }

        return !self.hasErrors();
    };

    function getInstance() {
        if (unique === undefined) {
            unique = new Singleton();
        }
        return unique;
    }

    return{
        getInstance: getInstance
    };
})();
