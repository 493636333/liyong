$(function () {
	var game = new Game();
	loader.addEventListener('finish', game.start.bind(game));
    loader.start();
});