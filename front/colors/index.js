var randomColor = require('randomcolor'); // import the script
var colors = randomColor({count: 50, brightness: 'dark'}); // a hex code for an attractive color

var x = colors.map(c => {
	return c.substr(1);
}).map(color => {
	console.log(color)
	var cs = color.match(/.{1,2}/g);

	return {
		r: parseInt(cs[0],16),
		g: parseInt(cs[1],16),
		b: parseInt(cs[2],16)
	};
});

console.log(JSON.stringify(colors));
console.log(x);
