var canvas;
var gl;
var vPosition;
var program;
var originalletter1vertices, originalletter2vertices;
var letter1vertices, letter2vertices;
var buffer1, buffer2;

var color = vec4(1.0, 0.0, 0.0, 1.0);
var oppositecolor = vec4(1.0 - color[0], 1.0 - color[1], 1.0 - color[2], color[3]);
var originvertice = vec2(0,0);
window.onload = function init()
{
	canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    letter1vertices = [vec2(-0.8 , 0.5),
                        vec2(-0.6 , 0.5),
                        vec2(-0.6 , -0.5),
                        vec2(-0.8 , -0.5),

                        vec2(-0.2 , 0.5),
                        vec2(-0.2 , 0.3),
                        vec2(-0.6 , 0.3),
                        vec2(-0.6 , 0.5),

                        vec2(-0.6 , 0.1),
                        vec2(-0.2 , 0.1),
                        vec2(-0.2 , -0.1),
                        vec2(-0.6 , -0.1),];

    letter2vertices = [vec2(0.2 , 0.5),
                        vec2(0.3 , 0.5),
                        vec2(0.3 , -0.5),
                        vec2(0.2 , -0.5),

                        vec2(0.8 , 0.5),
                        vec2(0.8 , 0.3),
                        vec2(0.3 , 0.3),
                        vec2(0.3 , 0.5),

                        vec2(0.3 , -0.3),
                        vec2(0.8 , -0.3),
                        vec2(0.8 , -0.5),
                        vec2(0.3 , -0.5)];
    
    function deepCopyArray(arr) {
        let copy = [];
        arr.forEach(element => {
          if (Array.isArray(element)) {
            copy.push(deepCopyArray(element));
          } else if (typeof element === 'object' && element !== null) {
            copy.push(deepCopyObject(element));
          } else {
            copy.push(element);
          }
        });
        return copy;
    }

    originalletter1vertices = deepCopyArray(letter1vertices);
    originalletter2vertices = deepCopyArray(letter2vertices);
	
	buffer1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer1 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(letter1vertices), gl.STATIC_DRAW );  
  
    buffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(letter2vertices), gl.STATIC_DRAW );      

	document.getElementById("posX").oninput = function(event) {
        var value = event.target.value;
        var xOffset;
        var newxOffset = parseFloat(value);

        xOffset = newxOffset - originvertice[0];
        originvertice[0] = newxOffset;
        for (var i = 0; i < letter1vertices.length; i++) {
            letter1vertices[i][0] += xOffset;
        }
        for (var i = 0; i < letter2vertices.length; i++) {
            letter2vertices[i][0] += xOffset;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(letter1vertices));
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(letter2vertices));
        render();
    }

    document.getElementById("posY").oninput = function(event) {
        var value = event.target.value;
        var yOffset;
        var newyOffset = parseFloat(value);

        yOffset = newyOffset - originvertice[1];
        originvertice[1] = newyOffset;

        for (var i = 0; i < letter1vertices.length; i++) {
            letter1vertices[i][1] += yOffset;
        }
        for (var i = 0; i < letter2vertices.length; i++) {
            letter2vertices[i][1] += yOffset;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(letter1vertices));
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(letter2vertices));
        render();
    };
    
    document.getElementById("scaleX").oninput = function(event) {
        var value = event.target.value;
        var xScale = parseFloat(value);
        for (var i = 0; i < letter1vertices.length; i++) {
            letter1vertices[i][0] = originalletter1vertices[i][0]*xScale + originvertice[0];
        }
        for (var i = 0; i < letter2vertices.length; i++) {
            letter2vertices[i][0] = originalletter2vertices[i][0]*xScale + originvertice[0];
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(letter1vertices));
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(letter2vertices));
        render();
    };

    document.getElementById("scaleY").oninput = function(event) {
        var value = event.target.value;
        var yScale = parseFloat(value);
        for (var i = 0; i < letter1vertices.length; i++) {
            letter1vertices[i][1] = originalletter1vertices[i][1]*yScale + originvertice[1];
        }
        for (var i = 0; i < letter2vertices.length; i++) {
            letter2vertices[i][1] = originalletter2vertices[i][1]*yScale + originvertice[1];
        }    

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(letter1vertices));
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(letter2vertices));
        render();
    };

    document.getElementById("redSlider").oninput = function(event) {
        var value = event.target.value;
        color[0] = value;
        oppositecolor[0] = 1.0 - value;
    };
    document.getElementById("greenSlider").oninput = function(event) {
        var value = event.target.value;
        color[1] = value;
        oppositecolor[1] = 1.0 - value;
    };
    document.getElementById("blueSlider").oninput = function(event) {
        var value = event.target.value;
        color[2] = value;
        oppositecolor[2] = 1.0 - value;
    };
    colorLoc = gl.getUniformLocation(program,"color");	
    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer1 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    for (let i = 0; i < letter1vertices.length / 4; i++) {
        const offset = i * 4;
        gl.uniform4fv(colorLoc,color);
        gl.drawArrays(gl.TRIANGLE_FAN, offset, 4);
    }
    
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer2 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.uniform4fv(colorLoc,oppositecolor);
	for (let i = 0; i < letter2vertices.length / 4; i++) {
        const offset = i * 4;
        gl.drawArrays(gl.TRIANGLE_FAN, offset, 4);
    }

    window.requestAnimFrame(render);
}
