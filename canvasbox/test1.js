var canvas = 0;
var context = 0;
var touched = Array();

$(document).ready(function() {
	canvas = $("#the_canvas")[0];
	context = canvas.getContext("2d");
	
//	console.debug(canvas);
	clear_and_black();
	paint_test();
    //mouse_mover();
    
});

$(window).load( function() {
	setup_mouse();
});

function setup_mouse()
{
    $("#the_canvas").mousemove(function(e){
      //var pageCoords = "( " + e.pageX + ", " + e.pageY + " )";
      //var clientCoords = "( " + e.clientX + ", " + e.clientY + " )";
      var w = context.measureText("CENTER ME").width;
      w = w*.5;
      var x = e.pageX - $("#the_canvas").offset().left;
      var y = e.pageY - $("#the_canvas").offset().top;
      //paint_tester(x,y);
      //console.debug("Paint results:"+paint_text("CENTER ME", x - w, y - 15));
      console.debug("Paint results:"+paint_text("CENTER ME", x, y));
 //     console.log("X"+x+"   "+y+"   offx:"+$("#the_canvas").offset().left+"    offY:"+$("#the_canvas").offset().top);
    });
}


function clear_and_black()
{
	var width = context.canvas.width;
	var height = context.canvas.height;
	context.fillRect(0, 0, width, height);
}

function paint_test()
{
	paint_text("Good news everyone!!!",100,100);
}

function line(x1,y1,x2,y2)
{
	context.strokeStyle = '#f00'; // red
	context.lineWidth   = 1;
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.stroke();
}

function boxes_touch(a_x, a_y, a_w, a_h, b_x, b_y, b_w, b_h) {
  return (Math.abs(a_x - b_x) * 2 < (a_w + b_w)) &&
         (Math.abs(a_y - b_y) * 2 < (a_h + b_h));
}

function box(x,y,w,h)
{
	console.debug("33");
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	line(x,y,x+w,y);
	line(x,y,x,y+h);
	line(x+w,y,x+w,y+h);
	line(x,y+h,x+w,y+h);
	
	this.hit = function(tx,ty) {
	//console.debug("BLAH!!!");
		//console.debug("x is:"+x+"  y is:"+y+"   tx is:"+tx+"   ty:"+ty);
	if(
			(tx >= x && tx <= (x+w))//xhit
			&&
			(ty >= y && ty <= (y+h))//yhit
		)
		{
			//console.debug("hit: 1");
			return 1;
		}
	//console.debug("hit: 0");
	return 0;
	};
}

function touches_existing_box(x,y)
{
	//console.debug("d 1");
	for(var i=0; i<touched.length; i+=1)
	{
		//console.debug("d 1.1");
  		var t = touched[i];
  		//console.debug("Blink");
  		if(t.hit(x,y) == 1)//do not let draw on 
  		{
  			//console.debug("d 1.2");
  			return 1;
  		}
  		//console.debug("d 1.1.2");
  		//console.debug(i);
	}
		//console.debug("d 2");

	return 0;
}

function paint_tester(x,y)
{
	//console.debug("BIP");
	//console.debug
	console.debug("TOUCHES???:"+touches_existing_box(x,y));
}


function paint_ceneterd_text_if_not_in_box()
{
	
}


function paint_text(text, x, y)
{
	/*
	if(touches_existing_box(x,y) == 1)
	{
		ptlock = 0;
		return 0;
	}*/
	//go through the rest	
	context.fillStyle    = '#fff';
//	context.font         = 'italic 30px sans-serif';
	context.font         = '30px sans-serif';
	context.textBaseline = 'top';
	context.fillText  (text, x, y);
	var w = context.measureText(text).width;
	touched.push(new box(x,y,w,30));
}
