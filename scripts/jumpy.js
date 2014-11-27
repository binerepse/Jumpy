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
	// sphere
	var sphereGeometry = new THREE.SphereGeometry(9, 32, 32);
	var sphereTexture = THREE.ImageUtils.loadTexture("./assets/sphere1.png");
	var sphereMaterial = new THREE.MeshLambertMaterial({map: sphereTexture});
	sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.overdraw = true;
	sphere.position.x = -50;
	sphere.position.y = 20;
	scene.add(sphere);
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
	if( keyboard.pressed("left") ){
		sphere.position.x -= 1;
		camera.position.x -= 1;
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
	renderer.render(scene, camera);
	
}
