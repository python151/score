
var svg = document.getElementById("svg"); //Get svg element
svg.setAttribute("preserveAspectRatio","xMinYMin meet"); //Set path's data
 
var arcSpace = 5;

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;       
}

data = [
	{
		'name':'FIXABLE',
		'points':30,
		'getPoints':10,
		'color': '#f67091'
	},
	{
		'name':'FIXABLE2',
		'points':30,
		'getPoints':10,
		'color': '#f67091'
	},
	{
		'name':'NET-WORTH',
		'points':20,
		'getPoints':18,
		'color': '#76b7dd'
	},
	{
		'name':'FIXED',
		'points':50,
		'getPoints':32,
		'color': '#78cbb1'
	},
];

reamingArc = 360 - data.length*arcSpace;

console.log(reamingArc);
var totalPoints = 0;
var totalGetPoints = 0;
for(i=0;i<data.length;i++){
	totalPoints += data[i].points;
	totalGetPoints += data[i].getPoints;
}

var startAngle = 0;

for(i=0;i<data.length;i++){

	endAngle = startAngle + ((100*data[i].points)/(totalPoints*100))*reamingArc;

	var group = document.createElementNS("http://www.w3.org/2000/svg", 'g');

	var defsElement = document.createElementNS("http://www.w3.org/2000/svg", 'defs'); //Create a path in SVG's namespace

	var marker = document.createElementNS("http://www.w3.org/2000/svg", 'marker');
	marker.setAttribute("markerUnits","userSpaceOnUse"); //Set path's data
	marker.setAttribute("id",data[i].name+'Circle'); //Set path's data
	marker.setAttribute("markerWidth",28); //Set path's data
	marker.setAttribute("markerHeight",28); //Set path's data
	marker.setAttribute("refX",0); //Set path's data
	marker.setAttribute("refY",14); //Set path's data
	marker.setAttribute("orient","auto"); //Set path's data

	var pathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	pathElement.setAttribute("d",describeArc(315, 200, 100, startAngle, endAngle)); //Set path's data
	pathElement.setAttribute("marker-mid", "url(#"+data[i].name+"outside)"); //Set path's data
	pathElement.style.stroke = "#f2ecf0"; //Set stroke colour
	pathElement.style.strokeWidth = "4px"; //Set stroke width

	var secondArcEndAngle = startAngle + (endAngle - startAngle)* ((data[i].getPoints*100)/(100*data[i].points));

	console.log(startAngle, endAngle, secondArcEndAngle)

	var SecondPathElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	SecondPathElement.setAttribute("id",data[i].name); //Set path's data
	SecondPathElement.setAttribute("marker-start", "url(#"+data[i].name+"Circle)"); //Set path's data
	SecondPathElement.setAttribute("d",describeArc(315, 200, 100, startAngle, secondArcEndAngle)); //Set path's data
	SecondPathElement.style.stroke = data[i].color; //Set stroke colour
	SecondPathElement.style.strokeWidth = "5px"; //Set stroke width

	var useElement = document.createElementNS("http://www.w3.org/2000/svg", 'use');
	useElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#'+data[i].name);

	var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	circle.setAttribute("r", '14');
	circle.setAttribute("cx", '14');
	circle.setAttribute("cy", '14');
	circle.setAttribute("fill", data[i].color);


	var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); 
	text.setAttribute("fill", '#fff');
	text.setAttribute("text-anchor", 'middle');
	text.setAttribute("font-size", '14');
	text.setAttribute("y", '19');
	text.setAttribute("x", '13');
	text.setAttribute("transform", 'rotate('+ (180 - secondArcEndAngle)+', 14, 14)');

	var textPath = document.createElementNS("http://www.w3.org/2000/svg", 'textPath');
	// textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#'+data[i].name);
	var t = document.createTextNode(data[i].getPoints);
	text.appendChild(t);


	// defsElement.appendChild(pathElement);
	defsElement.appendChild(SecondPathElement);

	//text.appendChild(textPath);
	
	marker.appendChild(circle);
	marker.appendChild(text);
	
	

	defsElement.appendChild(marker);


	group.appendChild(pathElement);
	group.appendChild(useElement);
	group.appendChild(defsElement);
	svg.appendChild(group);

	// group.appendChild(text);

	var space = 70;

	// outside group only for show data
	var x,y;

	function transform(data){
		console.log(data);
		if(data.x < 310){
			x = data.x - space;
			y = data.y + (data.height - 0)/2;
		}else{
			x = data.x + data.width + space;
			y = data.y + (data.height - 0)/2;
		}

		return "translate(" +x+ ", "+y+")";
	}

	function anchor(data){
		if(data.x < 310){
			return 'end';
		}else{
			return 'start';
		}
	}
	

	// var x = 100;
	// var y = 100;

	var groupOutside = document.createElementNS("http://www.w3.org/2000/svg", 'g');
	groupOutside.setAttribute('transform', transform(group.getBBox()));

	// var outsideGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g'); 
	
	var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); 
	text.setAttribute("text-anchor", anchor(group.getBBox()));

	var tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan'); 
	tspan.setAttribute("fill", data[i].color);
	tspan.setAttribute("font-size", '16');

	var t = document.createTextNode(data[i].name);
	tspan.appendChild(t);

	text.appendChild(tspan);
	groupOutside.appendChild(text);

	var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); 
	text.setAttribute("y", "20");
	text.setAttribute("text-anchor", anchor(group.getBBox()));

	var tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan'); 
	tspan.setAttribute("fill", data[i].color);
	
	tspan.setAttribute("font-size", '16');

	var t = document.createTextNode(data[i].getPoints);
	tspan.appendChild(t);
	text.appendChild(tspan);

	var tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan'); 
	tspan.setAttribute("fill", "#dddce2");
	tspan.setAttribute("font-size", '16');

	var t = document.createTextNode('/'+data[i].points+ ' points' );

	tspan.appendChild(t);
	text.appendChild(tspan);
	
	groupOutside.appendChild(text);


	group.appendChild(groupOutside);
	
	startAngle = arcSpace + endAngle;
}


var insideGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');

var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
circle.setAttribute("r", '70');
circle.setAttribute("cx", '315');
circle.setAttribute("cy", '200');
circle.setAttribute("fill", "#6ab8f6");

insideGroup.appendChild(circle);

var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
circle.setAttribute("r", '68');
circle.setAttribute("cx", '315');
circle.setAttribute("cy", '200');
circle.setAttribute("fill", "#fff");

insideGroup.appendChild(circle);

var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
circle.setAttribute("r", '65');
circle.setAttribute("cx", '315');
circle.setAttribute("cy", '200');
circle.setAttribute("fill", "#6ab8f6");

insideGroup.appendChild(circle);

var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); 
text.setAttribute("x", '275');
text.setAttribute("y", '225');
text.setAttribute("fill", "#fff");
text.setAttribute("font-size", '70');
text.setAttribute("text-anchor", "mid");


var t = document.createTextNode(totalGetPoints);
text.appendChild(t);

insideGroup.appendChild(text);

svg.appendChild(insideGroup);






