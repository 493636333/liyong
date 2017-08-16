(function(window, undefined) {
    var threeD = function() {
        var threeD = {};
        var slice = Array.prototype.slice;

        threeD.config = {

            // 原点位置
            origin: {
                x: 500,
                y: 300
            },

            // 焦距
            d: 1800
        };


        // 一些工具方法
        var tool = {
            /**
             * 计算两个点的差，也就是算出向量 2-1
             * @param  {Pointer} pointer1 [description]
             * @param  {Pointer} pointer2 [description]
             * @return {Array}返回一个向量
             */
            diffMatrix: function(pointer1, pointer2) {
                var point2 = pointer2.point;
                var arr = pointer1.point.map(function(value, index, point1) {
                    return point2[index] - value;
                });
                return new Vector(arr);
            }
        };

        // 点类
        var Pointer = function() {

            // 3D坐标
            this.point = slice.call(arguments, 0);

            // 映射后的2D坐标
            this.mapPoint = null;
        }
        Pointer.prototype = {
            constructor: Pointer,

            // 算出2D坐标
            excuteMapPointer: function() {

                // 原点位置
                var x = threeD.config.origin.x;
                var y = threeD.config.origin.y;

                // 计算w的值   w=z/d

                var w = this.point[2] / threeD.config.d;;
                this.mapPoint = this.point.map(function(value, index, arr) {
                    if (index === 0) {
                        return value / w + x;
                    } else if (index === 1) {
                        return value / w * -1 + y;
                    }
                })
                return this;
            },

            // 矩阵变化
            change: function(matrix) {
                var len = matrix.length;
                var sum = 0;
                var point = this.point;

                // 防止传入4D矩阵
                if (point.length < len) {
                    point[len - 1] = 1;
                }

                // 矩阵乘法
                for (var i = 0; i < len; i++) {
                    sum = 0;
                    for (var j = 0; j < len; j++) {
                        sum += (point[j] * matrix[j][i]);
                    }
                    point[i] = sum;
                }
                return this;
            },

            // 将3D点变成数组的形式返回
            toArray: function() {
                return slice.call(this.point, 0);
            },
            move: function(postionArr) {
                this.point = this.point.map(function(value, index) {
                    return value += postionArr[index];
                });
            }
        }

        // 向量类
        var Vector = function(arr) {
            this.vector = arr;
        };
        Vector.prototype = {
            constructor: Vector,
            /**
             * 两个向量点乘
             * @param  {Vector}  vector  向量2，为投影向量
             * @return {int}    返回整数类型
             */
            dianMultiply: function(vector) {
                var arr1 = this.vector;
                var arr2 = vector.vector;
                var sum = 0;
                arr1.forEach(function(value, index, arr1) {
                    sum += (value * arr2[index]);
                });
                return sum;
            },

            // 两个向量×乘
            chaMultiply: function(vector) {
                var arr = [];
                var arr1 = this.vector;
                var arr2 = vector.vector;
                arr[0] = arr1[1] * arr2[2] - arr1[2] * arr2[1];
                arr[1] = arr1[2] * arr2[0] - arr1[0] * arr2[2];
                arr[2] = arr1[0] * arr2[1] - arr1[1] * arr2[0];
                return new Vector(arr);
            },

            // 算一个向量的模
            mod: function() {
                var arr = this.vector;
                return Math.sqrt(arr[0] * arr[0] + arr[1] * arr[1] + arr[2] * arr[2]);
            },

            // 向量除法
            division: function(c) {
                var arr = this.vector;
                var newArr = arr.map(function(value) {
                    return value / c;
                });
                return new Vector(newArr);
            },

            // 向量乘法
            multiply: function(c) {
                var arr = this.vector;
                var newArr = arr.map(function(value) {
                    return value * c;
                });
                return new Vector(newArr);
            },

            //向量加法
            add: function(vector) {
                var arr1 = this.vector;
                var arr2 = vector.vector;
                var arr = arr1.map(function(value, index) {
                    return value + arr2[index];
                });
                return new Vector(arr);
            },

            // 求在一个向量上的投影长
            shadow: function(vector) {
                return this.dianMultiply(vector) / vector.mod();
            },

            // 求一个向量的单位向量
            unitVector: function() {
                var arr = this.vector;
                var mod = this.mod();
                var newArr = arr.map(function(value) {
                    return value / mod;
                });
                return new Vector(newArr);
            }

        };


        // 三角形类
        var Triangle = function() {
            // 三个点
            this.pointers = slice.call(arguments, 0);

            // 法向量
            this.normVector = null;

            // 亮度值
            this.light = 0;

            //是否显示
            this.isShow = undefined;
        };
        Triangle.prototype.move = function(postionArr) {
            this.pointers.forEach(function(value) {
                value.move(postionArr);
            });
        };
        // 计算三角形的法向量
        // 如果法向量z<0就能看到，若z>0则不能看到
        Triangle.prototype.excuteNormVector = function() {
            var pointers = this.pointers;
            var e3 = tool.diffMatrix(pointers[0], pointers[1]);
            var e1 = tool.diffMatrix(pointers[1], pointers[2]);
            var multiply = e3.chaMultiply(e1);
            return this.normVector = multiply.division(multiply.mod());
        };

        // 计算亮度值
        Triangle.prototype.excuteLight = function(vector) {

            // 如果可见,才计算光照值
            if (this.isShow === true) {

                // 光向量在法向量上面的投影
                var oVector = this.normVector.multiply(2 * vector.shadow(this.normVector.multiply(-1)));

                // 反射向量
                var revertVector = vector.add(oVector);

                this.light = revertVector.shadow(new Vector([0, 0, -1])) / vector.mod();
                if (this.light < 0) {
                    this.light = 0;
                }
            }

        };

        // 计算是否可见
        Triangle.prototype.excuteIsShow = function() {

            // 如果没有计算法向量，就先计算法向量
            this.excuteNormVector();

            // 先计算人眼到物体的向量
            var eyeVector = new Vector(this.pointers[0].point);
            return this.isShow = eyeVector.dianMultiply(this.normVector) < 0 ? true : false;
        };

        //乘矩阵
        Triangle.prototype.change = function(matrix) {
            this.pointers.forEach(function(value) {
                value.change(matrix);
            });
        };

        // 一个一个三角形的画
        Triangle.prototype.draw = function(context) {
            // 先计算是否可见
            this.excuteIsShow();
            if (this.isShow) {
                //如果可见再计算亮度值
                var a = Math.sqrt(3) / 3;
                this.excuteLight(new Vector([a, -1 * a, -1 * a]));
                var color = Math.ceil(this.light * 255);
                context.fillStyle = context.strokeStyle = "rgb(" + color + "," + color + "," + color + ")";
                context.beginPath();
                //然后计算2d坐标
                this.pointers.forEach(function(value, index) {

                    // 先计算映射到2D坐标上的点
                    value.excuteMapPointer();
                    if (index === 0) {
                        context.moveTo(value.mapPoint[0], value.mapPoint[1]);
                    } else {
                        context.lineTo(value.mapPoint[0], value.mapPoint[1]);
                    }
                });
                context.closePath();
                context.fill();
                context.stroke();
            }
        };

        GameObject = function(trianglesArr, pointers, position) {
            this.triangles = trianglesArr;
            this.pointers = pointers;
            this.move(position);
        }

        GameObject.prototype.move = function(position) {
            this.triangles.forEach(function(value) {
                value.move(position);
            });
        }
        GameObject.prototype.draw = function(context) {
            this.triangles.forEach(function(value) {
                value.draw(context);
            });
        };
        GameObject.prototype.change = function(matrix) {
            this.triangles.forEach(function(value) {
                value.change(matrix);
            });
        }


        // 抛出接口
        threeD.class = {
            Pointer: Pointer,
                Triangle: Triangle,
                GameObject: GameObject,
                Vector: Vector
        };
        return threeD;
    }();

    window.threeD = threeD;
})(window);