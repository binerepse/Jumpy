var scene, camera, renderer, cube;
//KEYBOARD
var keyboard = new THREEx.KeyboardState();

//HOMESCREEN HIDING//
$("#StartButton").click(function () {
$("#homescreen").hide();
$("#canvas").show();
init();
animate();

});


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
	camera.position.set(0,0,200);
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
	var sphereGeometry = new THREE.SphereGeometry(9,32,32);
	var sphereMaterial = new THREE.MeshPhongMaterial({color: 0xeff80});
	sphereMaterial.map = THREE.ImageUtils.loadTexture('./earth.gif');
	sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	scene.add(sphere);
}

function animate(){
	requestAnimationFrame(animate);
	sphere.position.x +=0.1;
	sphere.rotation.z -=0.5;
	
	if( keyboard.pressed("up") ){
		sphere.position.x +=0.5;	
	}
	if(keyboard.pressed("down")){
		cube.position.y -= 0.01;
	}
	if(keyboard.pressed("up")){
		cube.rotation.x -= 0.01;
	}
	if(keyboard.pressed("down")){
		cube.rotation.x += 0.01;
	}
	renderer.render(scene, camera);
	
}
