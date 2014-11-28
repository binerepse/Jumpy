// Global variables
var scene, camera, renderer, sphere, floor, ceiling, pLight, bg;
var floorPartLen = 0;
var ceilingPartLen = 0;
var xPosG = 0;
var xPosC = 0;
var xPosBG = 0;
var cameraXPos = 0;
var speed = 10;
var gapMax = 70;
var gapMin = 20;
var partMax = 150;
var partMin = 50;
//KEYBOARD
var keyboard = new THREEx.KeyboardState();
var zacetekSkoka = 0;
var konecSkoka = 0 ;
var zacetekSpremembeGravitacijeGor = 0;
var konecSpremembeGravitacijeGor = 0;
var zacetekSpremembeGravitacijeDol = 0;
var konecSpremembeGravitacijeDol = 0;
var tla = true;
var vSkoku = false;
var vSpremembiGravitacijeGor = false;
var vSpremembiGravitacijeDol = false;
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
window.onload = function() {
	$("#canvas").show();
	init();
	generateTerain();
	animate();
}

function init(){
	
	//SCENE//
	scene = new THREE.Scene();
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	//RENDERER//
	var canvas = document.getElementById("canvas");
	renderer = new THREE.WebGLRenderer({canvas : canvas, antialias: true});
	renderer.setSize(WIDTH,HEIGHT);
	document.body.appendChild(renderer.domElement);
	// Background
	var bgTexture = THREE.ImageUtils.loadTexture("./assets/background.jpg");
	var geometry = new THREE.PlaneGeometry( 640, 512);
	var material = new THREE.MeshBasicMaterial( {map: bgTexture} );
	bg = new THREE.Mesh( geometry, material );
	bg.position.set(0, -55, -15);
	scene.add(bg);
	//LIGHTING//
	var hlight = new THREE.HemisphereLight(0x404040, 0x404040, 2); // soft white light
	scene.add(hlight);	
	//LIGHTING//
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
	tweenUp.to({y: "+100"}, 200);
	tweenUp.easing(TWEEN.Easing.Linear.None);

	//ANIMACIJA GRAVITY - DOWN
	tweenDown = new TWEEN.Tween(sphere.position);
	tweenDown.to({y: "-100"}, 200);
	tweenDown.easing(TWEEN.Easing.Linear.None);

	// ANIMACIJA JUMP - UP UP
	tweenUpUp = new TWEEN.Tween(sphere.position);
	tweenUpUp.to({y: "+70"}, 350);
	tweenUpUp.easing(TWEEN.Easing.Quadratic.Out);
	// ANIMACIJA JUMP - UP DOWN
	tweenUpDown = new TWEEN.Tween(sphere.position);
	tweenUpDown.to({y:"-70"}, 350);
	tweenUpDown.easing(TWEEN.Easing.Quadratic.In);
	// POVEZAVA UP UP IN UP DOWN
	tweenUpUp.chain(tweenUpDown);
	// ANIMACIJA JUMP - DOWN UP
	tweenDownUp = new TWEEN.Tween(sphere.position);
	tweenDownUp.to({y: "-70"}, 350);
	tweenDownUp.easing(TWEEN.Easing.Quadratic.Out);
	// ANIMACIJA JUMP - DOWN DOWN
	tweenDownDown = new TWEEN.Tween(sphere.position);
	tweenDownDown.to({y: "+70"}, 350);
	tweenDownDown.easing(TWEEN.Easing.Quadratic.In);
	// POVEZAVA DOWN UP IN DOWN DOWN
	tweenDownUp.chain(tweenDownDown);
	// ANIMACIJA METKA
	tweenBullet = new TWEEN.Tween(bullet.position);
	tweenBullet.to({x: "-1000"}, 8000);
	tweenBullet.easing(TWEEN.Easing.Linear.None);
	tweenBullet.repeat(Infinity);
	tweenBullet.start();
	//CAMERA//
	camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.1, 1000);
	camera.position.set(0,0,200);
	scene.add(camera);
	//RESIZE HANDLING/
	window.addEventListener('resize', function(){
		var WIDTH = window.innerWidth;
		var HEIGHT = window.innerHeight;
		renderer.setSize(WIDTH, HEIGHT);
		camera.aspect = WIDTH/HEIGHT;
		camera.updateProjectionMatrix(); 
	});
}
function generateFloor() {
	var cHeight = $("#canvas").attr("height");
	var gap = Math.random();
	// make gap in ground
	if(gap > 0.5) {
		xPosG += floorPartLen + Math.round(Math.random() * gapMax + gapMin);
	}
	else {
		xPosG += floorPartLen;
	}
	floorPartLen = Math.round(Math.random() * partMax + partMin);
	// Floor part
	// faces textures
	var floorGeometry = new THREE.BoxGeometry(floorPartLen, 10, 30);
	var floorTextureT = THREE.ImageUtils.loadTexture("./assets/groundT.png");
	var floorTextureF = THREE.ImageUtils.loadTexture("./assets/groundF.png");
	var floorTextureS = THREE.ImageUtils.loadTexture("./assets/groundS.png");
	var floorTextureB = THREE.ImageUtils.loadTexture("./assets/groundB.png");
	// faces materials
	var materials = [];
	materials.push(new THREE.MeshLambertMaterial({ map: floorTextureS })); // right face
	materials.push(new THREE.MeshLambertMaterial({ map: floorTextureS })); // left face
	materials.push(new THREE.MeshLambertMaterial({ map: floorTextureT })); // top face
	materials.push(new THREE.MeshLambertMaterial({ map: floorTextureB })); // bottom face
	materials.push(new THREE.MeshLambertMaterial({ map: floorTextureF })); // front face
	materials.push(new THREE.MeshLambertMaterial({ map: floorTextureF })); // back face
	var floorMaterial = new THREE.MeshFaceMaterial(materials);
	floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.set(xPosG, -64 , 1);
	scene.add(floor);
}
function generateCeiling() {
var cHeight = $("#canvas").attr("height");
	var gap = Math.random();
	// make gap in ground
	if(gap > 0.5) {
		xPosC += ceilingPartLen + Math.round(Math.random() * gapMax + gapMin);
	}
	else {
		xPosC += ceilingPartLen;
	}
	ceilingPartLen = Math.round(Math.random() * partMax + partMin);
	// ceiling part
	var ceilingGeometry = new THREE.BoxGeometry(ceilingPartLen, 10, 30);
	var ceilingTexture = THREE.ImageUtils.loadTexture("./assets/groundT.png");
	var materials = [];
	materials.push(new THREE.MeshLambertMaterial({ map: ceilingTexture })); // right face
	materials.push(new THREE.MeshLambertMaterial({ map: ceilingTexture })); // left face
	materials.push(new THREE.MeshLambertMaterial({ map: ceilingTexture })); // top face
	materials.push(new THREE.MeshLambertMaterial({ map: ceilingTexture })); // bottom face
	materials.push(new THREE.MeshLambertMaterial({ map: ceilingTexture })); // front face
	materials.push(new THREE.MeshLambertMaterial({ map: ceilingTexture })); // back face
	var ceilingMaterial = new THREE.MeshFaceMaterial(materials);
	ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
	ceiling.position.set(xPosC, 64, 0);
	scene.add(ceiling);
}
function generateObstacle() {
	var makeObstacle = Math.random();
	if(makeObstacle > 0.64) {
		
		var place = Math.random();
		var obstacleY, obstacleX, radiusB, radiusT;
		// position obstacle for ground part
		if(place > 0.5) {
			obstacleY = floor.position.y + 30;
			obstacleX = Math.round(Math.random() * (xPosG + floorPartLen) + xPosG);
			radiusB = 15;
			radiusT = 0.1;
		} // position obstacle for ceiling part
		else {
			obstacleY = ceiling.position.y - 30;
			obstacleX = Math.round(Math.random() * (xPosC + ceilingPartLen) + xPosC);
			radiusB = 0.1;
			radiusT = 15;
		}
		var obstacleH = Math.round(Math.random() * 50 + 40);
		var obstacleGeometry = new THREE.CylinderGeometry(radiusT, radiusB, obstacleH, 20);
		var obstacleTexture = THREE.ImageUtils.loadTexture("./assets/obstacle.png");
		var obstacleMaterial = new THREE.MeshLambertMaterial({map: obstacleTexture});
		var obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
		obstacle.position.set(obstacleX, obstacleY, 0);
		scene.add(obstacle);
	}
}
function generateTerain() {
	for(var i = 0; i < 60; i++) {
		generateFloor();
		generateCeiling();
		generateObstacle();
	}
}

function animate(){
	requestAnimationFrame(animate);
	// GRAVITY UP
	if(keyboard.pressed("up") && tla != false && !vSkoku && !vSpremembiGravitacijeDol){
		tla = false;
		TWEEN.add(tweenUp);
		tweenDown.stop();
		TWEEN.remove(tweenDown);
		tweenUp.start();
		vSpremembiGravitacijeGor = true;
		zacetekSpremembeGravitacijeGor = parseInt((new Date()).getTime());
	}
	// GRAVITY DOWN
	if(keyboard.pressed("down") && tla != true && !vSkoku && !vSpremembiGravitacijeGor){
		tla = true;
		TWEEN.add(tweenDown);
		tweenUp.stop();
		TWEEN.remove(tweenUp);
		tweenDown.start();
		vSpremembiGravitacijeDol = true;
		zacetekSpremembeGravitacijeDol = parseInt((new Date()).getTime());
	}
	// JUMP
	konecSpremembeGravitacijeDol = parseInt((new Date()).getTime());
	konecSpremembeGravitacijeGor = parseInt((new Date()).getTime());
	deltaGor = konecSpremembeGravitacijeGor - zacetekSpremembeGravitacijeGor;
	deltaDol = konecSpremembeGravitacijeDol - zacetekSpremembeGravitacijeDol;
	if(deltaGor > 220){
		vSpremembiGravitacijeGor = false;
	}
	if(deltaDol > 220){
		vSpremembiGravitacijeDol = false;
	}
	
	if(keyboard.pressed("space") && !vSkoku && !vSpremembiGravitacijeDol && !vSpremembiGravitacijeGor){
		if(tla){
			TWEEN.removeAll;
			TWEEN.add(tweenUpUp);
			tweenUpUp.start();
			vSkoku = true;
			zacetekSkoka = parseInt((new Date()).getTime());

		}else{
			TWEEN.removeAll;
			TWEEN.add(tweenDownUp);
			tweenDownUp.start();
			vSkoku = true;
			zacetekSkoka = parseInt((new Date()).getTime());
		}
	}
	konecSkoka = parseInt((new Date()).getTime());
	razlika = konecSkoka - zacetekSkoka;
	if(razlika > 720){
		vSkoku = false;
	}
	if(keyboard.pressed("right")){
		sphere.position.x += speed;
		if (sphere.position.x > 15 * speed)	camera.position.x += speed;
	}
	if(keyboard.pressed("a")){
		camera.position.y -= 1;
	}
	if(keyboard.pressed("d")){
		camera.position.y += 1;
		camera.position.x += 1;
	}
	
	if(Math.round(sphere.position.x) >=  xPosG - 2000) {
		generateTerain();
	}
	var cLAXPos = (sphere.position.x <= 0) ? 0 : sphere.position.x;
	camera.lookAt(new THREE.Vector3(cLAXPos, 0, 0));
	
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