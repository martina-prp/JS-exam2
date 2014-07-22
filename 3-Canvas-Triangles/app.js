'use strict';

$(document).ready(function() {
	var canvas = document.getElementById('canvas'),
			context = canvas.getContext('2d'),
			triangle = [],
			triangleJson = [],
			allTriangles = [],
			triangleColor = '',
			canvasOffset = $('#canvas').offset(),
			data = {};



	$('.save-canvas').on('click', function() {
		var name = prompt('Save canvas as:');
		localStorage.setItem("canvas-triangle",
			JSON.stringify({
				option: name,
				data: allTriangles
			})
		);

		data = JSON.parse(localStorage.getItem("canvas-triangle"));
		console.log(data);
		console.log(data.option);
		var selectTpl = $('#select-tpl').html();
		var template = Handlebars.compile(selectTpl);
	  var html = template({options: data});
	  console.log(html);
	  //var option = ['<option value="', name, '">', name, '</option>'];
	  $('.saved-triangles').append(html);
	});

	$('.clear-canvas').on('click', function(event) {
		event.preventDefault();
		context.clearRect(0, 0, canvas.width, canvas.height);
	});

	$('#canvas').on('mousedown', function(event) {
		triangleColor = $('.triangle-color').val()
		var point = new Point(event.clientX - canvasOffset.left, event.clientY - canvasOffset.top, triangleColor, context);
		point.print();
		triangle.push(point);
		triangleJson.push(JSON.stringify({pointX: point.x, pointY: point.y}));

		if (triangle.length == 3) {
			var trgl = new Triangle(triangle[0], triangle[1], triangle[2], triangleColor, context);
			trgl.draw();
			allTriangles.push(triangleJson);
			triangle = [];
			triangleJson = [];
		}
	});

	function Point(x, y, color, context) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.context = context;

		this.print = function() {
			this.context.fillStyle = this.color;
			this.context.fillRect(this.x*10, this.y*10, 10, 10);
		}
	}

	function Triangle(a, b, c, color, context) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.color = color;
		this.context = context;

		this.draw = function() {
			this.context.beginPath();
			this.context.moveTo(a.x, a.y);
			this.context.lineTo(b.x, b.y);
			this.context.lineTo(c.x, c.y);
			this.context.fill();
			this.context.fillStyle = this.color;
		}
	}
});
