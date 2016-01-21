## JavaScript 无限柯里化  ##
在
[这篇文章](http://cjting.me/web2.0/2016-01-17-JavaScript%20Infinite%20Currying.html?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)
看到的有关无限柯里化的问题。

### 柯里化 ###
首先，有关柯里化的问题，以下是之前学习柯里化时跟着写代码：

	//这是一个柯里化函数，最开始接收一个处理函数
    var currying = function(fn) {
    	var args = [];
	    return function() {
			//如果出入参数，则缓存起来对应参数
	        if(arguments.length){
	            Array.prototype.push.apply(args, arguments);
				//返回当前函数
	            return arguments.callee;
	        }else {
				//当出入参数为空时，则执行最开始传入的处理函数
	            return fn.apply(this, args);
	        }
	    }
	};
	var sum = function() {
	    var temp = 0;
	            for(var i = 0, len = arguments.length; i < len; i++) {
	                temp += arguments[i];
	            }
	            return temp;
	}
	
	var sum = currying(sum);
	sum(100);
	sum(200);
	sum(300);
	sum(); ==> 600
从上面的代码可以看出，这个有那篇文章类似的效果，但的确缺一点东西。跟着那篇文章的思路，那篇文章中实现的重点在于`valueOf`上，那这个`valueOf`是什么呢？

## valueOf ##
`Boolean`、`Date`、`Number`、`Object`、`String`和`Symbol`这些数据类型都包含`valueOf`，而`valueOf`方法返回当前对象的**primitive**的数值，`valueOf`是可以复写的，在运行以下代码：

    var o = new Object();
	o.x = 'object';
	o.valueOf = function(){return this.x;}
	o == 'object'  //==> true
	o === 'object' //==> false

从上面的代码中可以看出，当`o`和一个具体值进行比较时，会自动调用对象的`valueOf`方法来返回一个`primitive`值，然后进行比较；当然如果进行严格比较时，因为要比较类型，所以也就不可能相等。

## toString ##
通过上面的小技巧就能写出实现文章开始处效果的代码了，接着引申过来，`toString`有着更广的分布。

**toString**这个方法表示的是返回一个字符串来代表当前的对象。

通过复写这个方法同样可以获得`valueOf`一样的效果。

### reduce ###
`reduce`这个方法为归纳的意思，使用时用法如下：

    array.reduce(callback[, initialValue])

`initialValue`表示初始值，可选；

`callback`接受4个参数：`previous`、`current`、`index`和`array`；

	var sum = [1, 2, 3, 4].reduce(function (
		previous, //上一次的值
		current, //当前值
		index, //当前索引值
		array //数组本身
	) {
	  return previous + current;
	});
	
	console.log(sum); // 10

上面需注意的是，当`initialValue`指定了时，则第一次使用的`previous`便是它；当`initialValue`缺省时，`previous`为第一个元素，`current`后推一位，相当于有`initialValue`时，数组长度加一。

循环过程：

	// 初始设置
	previous = initialValue = 1, current = 2
	
	// 第一次
	previous = (1 + 2) =  3, current = 3
	
	// 第二次
	previous = (3 + 3) =  6, current = 4
	
	// 第三次
	previous = (6 + 4) =  10, current = undefined (退出)

二维数组降维：

    [
	  [1, 2],
	  [3, 4],
	  [5, 6]
	].reduce(function (previous, current) {
	  return previous.concat(current);
	});//[1, 2, 3, 4, 5, 6]

啊，这个可爱的`reduce`在`IE8`及以下是无法使用的T——T，所以只好请上`Polyfill`了：

    if (!Array.prototype.reduce) {
	  Array.prototype.reduce = function(callback /*, initialValue*/) {
	    'use strict';
	    if (this == null) {
	      throw new TypeError('Array.prototype.reduce called on null or undefined');
	    }
	    if (typeof callback !== 'function') {
	      throw new TypeError(callback + ' is not a function');
	    }
	    var t = Object(this), len = t.length >>> 0, k = 0, value;
	    if (arguments.length == 2) {
	      value = arguments[1];
	    } else {
	      while (k < len && !(k in t)) {
	        k++; 
	      }
	      if (k >= len) {
	        throw new TypeError('Reduce of empty array with no initial value');
	      }
	      value = t[k++];
	    }
	    for (; k < len; k++) {
	      if (k in t) {
	        value = callback(value, t[k], k, t);
	      }
	    }
	    return value;
	  };
	}

## 总结 ##
以上就是我阅读[这篇文章](http://cjting.me/web2.0/2016-01-17-JavaScript%20Infinite%20Currying.html?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)学到和复习的知识点，在此记录下。
