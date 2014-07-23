'use strict';

$(document).ready(function() {
	var canvas = document.getElementById('canvas'),
			context = canvas.getContext('2d'),
			triangle = [],
			triangleJson = [],
			allTriangles = [],
			triangleColor = '',
			canvasOffset = $('#canvas').offset();

	var tempData = localStorage.getItem('canvas-triangle');
	var data = [];
	if (tempData) {
		data = JSON.parse(tempData);
		data.forEach(function(obj) {
			$('.saved-triangles').append('<option value="' + obj.option +'">' + obj.option +'</option>');
		})
	}

	$('.load-canvas').on('click', function() {
		var selected = $('.saved-triangles').val();
		var tempData = localStorage.getItem('canvas-triangle');
		var loadSelected = {},
				p = {},
				t = {},
				temp = [],
		    data = [];

		resetWorkingArea();

		if (tempData) {
			data = JSON.parse(tempData);
			loadSelected = data.filter(function(element) {
				if (element.option === selected) {
					return element;
				}
			});
		}
		if (loadSelected.length !== 0) {
			loadSelected[0].data.forEach(function(triangle) {
				var color = '';
				triangle.forEach(function(point) {
					point = JSON.parse(point);
					color = point.color;
					p = new Point(point.pointX, point.pointY, color, context);
					temp.push(p);
				});
				t = new Triangle(temp[0], temp[1], temp[2], color, context);
				t.draw();
				temp = [];
			});
		}
	});

	$('.save-canvas').on('click', function() {
		var name = prompt('Save canvas as:');
		if (name) {
			var tempData = localStorage.getItem('canvas-triangle'),
					data = [];
			if (tempData) {
				data = JSON.parse(tempData);
			}
			var isExisting = data.some(function(element) {
				return element.option === name;
			});
			if (!isExisting) {
				data.push({
					option: name,
					data: allTriangles
				});
				localStorage.setItem('canvas-triangle', JSON.stringify(data));
			  $('.saved-triangles').append('<option value="' + name +'">' + name +'</option>');
			}
			else {
				alert('The name already exists!');
			}
		}
	});

	$('.clear-canvas').on('click', function(event) {
		event.preventDefault();
		resetWorkingArea();
	});

	$('#canvas').on('mousedown', function(event) {
		triangleColor = $('.triangle-color').val()
		var point = new Point(event.clientX - canvasOffset.left, event.clientY - canvasOffset.top, triangleColor, context);
		point.print();
		triangle.push(point);
		triangleJson.push(JSON.stringify({pointX: point.x, pointY: point.y, color: triangleColor}));

		if (triangle.length == 3) {
			var trgl = new Triangle(triangle[0], triangle[1], triangle[2], triangleColor, context);
			trgl.draw();
			allTriangles.push(triangleJson);
			triangle = [];
			triangleJson = [];
		}
	});

	var resetWorkingArea = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		triangle = [];
		allTriangles = [];
		triangleColor = '';
	}

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
			this.context.fillStyle = this.color;
			this.context.fill();
		}
	}
});
