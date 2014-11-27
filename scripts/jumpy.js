var scene, camera, renderer;
//KEYBOARD
var keyboard = new THREEx.KeyboardState();
var tla = true;
var tweenUp;
var tweenDown;
var tweenUpUp;
var tweenUpDown;
var tweenDownUp;
var tweenDownDown;
var tweenBullet;
var sphere;
var opponent;
var bullet;

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
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,0,100);
	scene.add(light);	
	//LOAD GEOMETRY//
	//NAS OSEBEK
	var sphereGeometry = new THREE.SphereGeometry(9,32,32);
	var sphereMaterial = new THREE.MeshPhongMaterial();
	sphereMaterial.map = THREE.ImageUtils.loadTexture('./earth.gif');
	sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	scene.add(sphere);
	//NASPROTNIK
	var opponentGeometry = new THREE.SphereGeometry(9,32,32);
	var opponentMaterial = new THREE.MeshPhongMaterial({color: 0xFF0000});
	opponent = new THREE.Mesh(opponentGeometry, opponentMaterial);
	scene.add(opponent);
	//BULLET
	var bulletGeometry = new THREE.CylinderGeometry(1.5,0.5,8,32);
	var bulletMaterial = new THREE.MeshPhongMaterial();
	bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
	scene.add(bullet);
	//ZACETNA POZICIJA METKA
	bullet.position.x = 100;
	bullet.position.y = -50;
	bullet.rotation.z = 4.71;
	//ZACETNA POZICIJA NASPROTNIKA
	opponent.position.x = 100;
	opponent.position.y = -50;

	//ZACETNA POZICIJA KROGLE
	sphere.position.y = -50;
	sphere.position.x = -50;

	//ANIMACIJA GRAVITY - UP
	tweenUp = new TWEEN.Tween(sphere.position);
	tweenUp.to({x: -50, y: 50}, 200);
	tweenUp.easing(TWEEN.Easing.Linear.None);

	//ANIMACIJA GRAVITY - DOWN
	tweenDown = new TWEEN.Tween(sphere.position);
	tweenDown.to({x: -50, y: -50}, 200);
	tweenDown.easing(TWEEN.Easing.Linear.None);

	// ANIMACIJA JUMP - UP UP
	tweenUpUp = new TWEEN.Tween(sphere.position);
	tweenUpUp.to({x: -50, y: 20}, 350);
	tweenUpUp.easing(TWEEN.Easing.Quadratic.Out);
	// ANIMACIJA JUMP - UP DOWN
	tweenUpDown = new TWEEN.Tween(sphere.position);
	tweenUpDown.to({x: -50, y:-50}, 350);
	tweenUpDown.easing(TWEEN.Easing.Quadratic.In);
	// POVEZAVA UP UP IN UP DOWN
	tweenUpUp.chain(tweenUpDown);
	// ANIMACIJA JUMP - DOWN UP
	tweenDownUp = new TWEEN.Tween(sphere.position);
	tweenDownUp.to({x: -50, y: -20}, 350);
	tweenDownUp.easing(TWEEN.Easing.Quadratic.Out);
	// ANIMACIJA JUMP - DOWN DOWN
	tweenDownDown = new TWEEN.Tween(sphere.position);
	tweenDownDown.to({x: -50, y: 50}, 350);
	tweenDownDown.easing(TWEEN.Easing.Quadratic.In);
	// POVEZAVA DOWN UP IN DOWN DOWN
	tweenDownUp.chain(tweenDownDown);
	// ANIMACIJA METKA
	tweenBullet = new TWEEN.Tween(bullet.position);
	tweenBullet.to({x: -1000}, 8000);
	tweenBullet.easing(TWEEN.Easing.Linear.None);
	tweenBullet.repeat(Infinity);
	tweenBullet.start();
	


}


function animate(){

	
	requestAnimationFrame(animate);
	// GRAVITY UP
	if(keyboard.pressed("up")){
		tla = false;
		TWEEN.add(tweenUp);
		tweenDown.stop();
		TWEEN.remove(tweenDown);
		tweenUp.start();
	}
	// GRAVITY DOWN
	if(keyboard.pressed("down")){
		tla = true;
		TWEEN.add(tweenDown);
		tweenUp.stop();
		TWEEN.remove(tweenUp);
		tweenDown.start();
	}
	// JUMP
	if(keyboard.pressed("space")){
		if(tla){
			TWEEN.removeAll;
			TWEEN.add(tweenUpUp);
			tweenUpUp.start();
		}else{
			TWEEN.removeAll;
			TWEEN.add(tweenDownUp);
			tweenDownUp.start();
		}
	}
	if(keyboard.pressed("left")){
		bullet.position.x -=2;
	}
	// IZRIS
	TWEEN.update();
	// SPREMEMBA SMERI ROTACIJE
	if(tla){
		sphere.rotation.z -=0.4;
	}else{
		sphere.rotation.z +=0.4;
	}
	

	renderer.render(scene, camera);
	
}
