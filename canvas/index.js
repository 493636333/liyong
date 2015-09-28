window.onload = function() {
    var context = document.getElementById("canvas1").getContext("2d");
    var cla = threeD.class;
    var Pointer = cla.Pointer;
    var Triangle = cla.Triangle;
    var GameObject = cla.GameObject;
    var Vector = cla.Vector;
    var position = [100, -100, 1000];

    var arr = [
        [-40, 40, -40],
        [40, 40, -40],
        [40, -40, -40],
        [-40, -40, -40],
        [-40, 40, 40],
        [40, 40, 40],
        [40, -40, 40],
        [-40, -40, 40]
    ]

    var shunxu = [
        [3, 0, 2],
        [0, 1, 2],
        [6, 5, 7],
        [7, 5, 4],
        [2, 1, 6],
        [6, 1, 5],
        [7, 4, 3],
        [3, 4, 0],
        [0, 4, 1],
        [1, 4, 5],
        [7, 3, 6],
        [6, 3, 2]
    ]
    var trianglesArr = [];
    var pointerArr = [];
    shunxu.forEach(function(value, index) {
        var point1 = new Pointer(arr[value[0]][0], arr[value[0]][1], arr[value[0]][2]);
        var point2 = new Pointer(arr[value[1]][0], arr[value[1]][1], arr[value[1]][2]);
        var point3 = new Pointer(arr[value[2]][0], arr[value[2]][1], arr[value[2]][2]);
        var triangle = new Triangle(point1, point2, point3);
        trianglesArr.push(triangle);
    })

    var game = new GameObject(trianglesArr, pointerArr, position);

    setInterval(function() {
        var jiao = 1;
        var h = jiao * 0.017453293;
        var cos = Math.cos(h);
        var sin = Math.sin(h);
        game.move([-100, 100, -1000]);
        var matrix1 = [
            [1, (1 - cos) + sin, (1 - cos) - sin],
            [(1 - cos) - sin, 1, (1 - cos) + sin],
            [(1 - cos) + sin, (1 - cos) - sin, 1]
        ];

        // var v = new Vector(new Pointer(-150, 0, -250).change(matrix1).toArray()).add(new Vector([150, 0, 250]));
        // var matrix = [
        //     [1, (1 - cos) + sin, (1 - cos) - sin, 0],
        //     [(1 - cos) - sin, 1, (1 - cos) + sin, 0],
        //     [(1 - cos) + sin, (1 - cos) - sin, 1, 0],
        //     [v.vector[0], v.vector[1], v.vector[2], 1]
        // ];
        //绕Z轴旋转
        var matrix2 = [
            [cos, sin, 0],
            [-1 * sin, cos, 0],
            [0, 0, 1]
        ];
        //绕x轴旋转
        var matrix3 = [
            [1, 0, 0],
            [0, cos, sin],
            [0, -sin, cos]
        ]
        game.change(matrix3);
        game.move([100, -100, 1000]);
        context.clearRect(0, 0, 1500, 800);
        game.draw(context);
    }, 30);

}