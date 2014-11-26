var scene, camera, renderer, cube;
//KEYBOARD
var keyboard = new THREEx.KeyboardState();

//HOMESCREEN HIDING//
function start() {
	$("#homescreen").hide();
	$("#canvas").show();
	init();
	animate();
}

function init(){
	
	//SCENE//
	scene = new THREE.Scene();
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	//RENDERER//
	var canvas = document.getElementById("canvas");
	renderer = new THREE.WebGLRenderer({canvas : canvas, antialiasing: true});
	renderer.setSize(WIDTH,HEIGHT);
	document.body.appendChild(renderer.domElement);
	//CAMERA//
	camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.1, 20000);
	camera.position.set(0,0,+7);
	scene.add(camera);
	//RESIZE HANDLING//
	window.addEventListener('resize', function(){
		var WIDTH = window.innerWidth;
		var HEIGHT = window.innerHeight;
		renderer.setSize(WIDTH, HEIGHT);
		camera.aspect = WIDTH/HEIGHT;
		camera.updateProjectionMatrix(); 
	});
	//LIGHTING//
	renderer.setClearColorHex(0x333F47, 1);
	var light = new THREE.SpotLight(0xffffff);
	light.position.set(0,0,100);
	scene.add(light);	
	//LOAD GEOMETRY//
	var geometry = new THREE.BoxGeometry(1,1,1);
	var material = new THREE.MeshPhongMaterial({color: 0x0eff80});
	cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
}

function animate(){
	requestAnimationFrame(animate);
	if( keyboard.pressed("left") ){
		cube.rotation.y -= 0.1;
	}
	if(keyboard.pressed("right")){
		cube.rotation.y += 0.1;
	}
	if(keyboard.pressed("up")){
		cube.rotation.x -= 0.1;
	}
	if(keyboard.pressed("down")){
		cube.rotation.x += 0.1;
	}
	renderer.render(scene, camera);
	
}
