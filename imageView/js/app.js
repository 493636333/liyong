var dispose, i = 0;

function a() {
	dispose = imageView.init({
		id: "#div1",
		src: "img/1.jpg",
		maxScale: 4,
		scaleFn: "both"
	});
}

function b() {
	dispose = imageView.init({
		id: "#div1",
		src: "img/2.jpg",
		maxScale: 4,
		scaleFn: "noboth"
	});
}
a();
document.getElementById("button1").onclick = function() {
	i++;
	dispose && dispose.dispose();
	if (i % 2 == 0) {
		a();
	} else {
		b();
	}
}