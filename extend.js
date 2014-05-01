/**
 * @file 对继承的封装
 * @author tuanfe
 *
 */

var e = (function(){
    
    /**
     * 创建一个中间对象来实现父类和子类解耦
     *
     * @param {object} proto 父类
     * @return {object} 返回新生成的对象
     */
    function inherit(proto){
        function F(){};
        F.prototype = proto;
        return new F;
    }
    
    /**
     * 实现父类和子类的继承
     *
     * @param {object} child 子类
     * @param {object} parent 父类
     */
    function extend(child, parent){
        child.prototype = inherit(parent.prototype);
        child.prototype.constructor = child;
        child.parent = parent.prototype;
    }

    return {
        extend: extend
    }

})();


/**
 * 下面是一个实现的小例子
 */

function Animal(name){
    this.name = 'animal';
}

Animal.prototype.run = function(){}

function Man(name){
    // 调用父类的构造函数
    Man.parent.constructor.apply(this, arguments);
}

Man.prototype.run = function(){
    // 调用父类的方法
    Man.parent.run.apply(this, arguments);
    // 自己的实现
}

// 实现继承
e.extend(Man, Animal);

var man = new Man('tuanfe');
man.run();



