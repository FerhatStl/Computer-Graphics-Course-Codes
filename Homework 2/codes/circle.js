
var gl;
var verticeslength = 0;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    /*
    o : origin canvas ın orta noktası
    r : iç çemberin yarıçapı
    r2: dış çemberin yarıçapı
    w : r2 - r yüzüğün genişliği(tanımlamaya gerek olmayabilir)
    a : nokta hesabı için örnekleme açısı 15,30,60
    */

    var r = 0.3;
    var r2 = 0.8;
    var a = 1;
    // Points of rings
    var vertices = [];

    // Point calculation
    for (let i = 0; i < 360; i=i+a) {
        vertices.push(vec2(r*Math.cos(i) , r*Math.sin(i)));
        vertices.push(vec2(r2*Math.cos(i) , r2*Math.sin(i)));
    }
    verticeslength = vertices.length;
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 ); //arkaplan
    
    //  Load shaders and initialize attribute buffers    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, verticeslength );
}
