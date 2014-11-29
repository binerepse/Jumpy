// Global variables
var scene, camera, renderer, platformMesh, ceilingPlatform, pLight, bg;
var gapFExists = false;
var gapCExists = false;
var gapFStartX = 0;
var gapFEndX = 0;
var gapCStartX = 0;
var gapCEndX = 0;
var xPosG = 0;
var xPosC = 0;
var cameraXPos = 0;
var speed = 10;
var objectRot = 0.2;
var gapLength = speed * 50;
var partLength = 250;
var firstGenerat = true;
var runGame = false;
var obstacleXposPrev = 0;
var worldGroup = new THREE.Group();
var xPosArray = [];
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
//ANIMACIJE
var tweenUp;
var tweenDown;
var tweenUpUp;
var tweenUpDown;
var tweenDownUp;
var tweenDownDown;
var tweenBullet;
//OBJEKTI//
var sphere;
var opponent;
var bullet;
var strel;
//ZVOKOVI //
var whiteNoise;
var gravity;
var alienSound;


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
	generateObstacle();
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
	//LIGHTING//
	var hlight = new THREE.HemisphereLight(0x404040, 0x404040, 2); // soft white light
	scene.add(hlight);	
	//LIGHTING//
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,0,100);
	scene.add(light);
	//SOUNDS//
	strel = new Audio("./sounds/strel.wav");
	whiteNoise = new Audio("./sounds/whitenoise.wav");
	gravity = new Audio("./sounds/gravity.wav");
	alienSound = new Audio("./sounds/space.wav");
	//LOAD GEOMETRY//
	//NAS OSEBEK
	var sphereGeometry = new THREE.SphereGeometry(9,32,32);
	var sphereMaterial = new THREE.MeshPhongMaterial();
	sphereMaterial.map = THREE.ImageUtils.loadTexture('./assets/earth.gif');
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
	camera.position.set(-150,0,200);
	var cLAXPos = sphere.position.x;
	camera.lookAt(new THREE.Vector3(cLAXPos, 0, 0));
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

function generateTerain() {	
	for(var j = 0; j < 60; j++) { 
		// Platform part
		// Platform geometry
		var platformGeometry = new THREE.BoxGeometry(partLength, 10, 30);
		// Faces textures
		var platformTextureT = THREE.ImageUtils.loadTexture("./assets/groundT.png");
		var platformTextureF = THREE.ImageUtils.loadTexture("./assets/groundF.png");
		var platformTextureS = THREE.ImageUtils.loadTexture("./assets/groundS.png");
		var platformTextureB = THREE.ImageUtils.loadTexture("./assets/groundB.png");
		// Faces materials
		var materialsG = [];
		materialsG.push(new THREE.MeshLambertMaterial({ map: platformTextureS })); // right face
		materialsG.push(new THREE.MeshLambertMaterial({ map: platformTextureS })); // left face
		materialsG.push(new THREE.MeshLambertMaterial({ map: platformTextureT })); // top face
		materialsG.push(new THREE.MeshLambertMaterial({ map: platformTextureB })); // bottom face
		materialsG.push(new THREE.MeshLambertMaterial({ map: platformTextureF })); // front face
		materialsG.push(new THREE.MeshLambertMaterial({ map: platformTextureF })); // back face
		var platformMaterial = new THREE.MeshFaceMaterial(materialsG);
		// platform mesh
		platformMesh = new THREE.Mesh(platformGeometry, platformMaterial);
		// get positions 		
		if(firstGenerat) { 
			for(var i = -550 + partLength; i <= 200; i += partLength) {
				var temp = platformMesh.clone();
				temp.position.x = i;
				temp.position.y = -64;
				temp.matrixAutoUpdate = false;
				temp.updateMatrix();
				worldGroup.add(temp);
				temp = platformMesh.clone();
				temp.position.x = i;
				temp.position.y = 64;
				temp.matrixAutoUpdate = false;
				temp.updateMatrix();
				worldGroup.add(temp);
			}
			firstGenerat = false;
			xPosC = 200;
			xPosG = 200;
		}
		else {
			var gapF = Math.random();
			// make gap in ground
			if(gapF > 0.5 && !gapFExists) {
				gapFExists = true;
				gapFstartX = xPosG + partLength / 2;
				xPosG += partLength + gapLength;
				xPosArray.push({xPos: xPosG, yPos: -44});
				gapFEndX = xPosG - partLength / 2;
				for(var gapI = xPosC; gapI < gapFEndX; gapI += partLength) {
					xPosC = gapI;
					// CeilingPlatform mesh
					var temp = platformMesh.clone();
					// CeilingPlatform position
					temp.position.x = xPosC;
					temp.position.y = 64;
					// Add ceilingPlatform to scene
					temp.matrixAutoUpdate = false;
					temp.updateMatrix();
					worldGroup.add(temp);
					xPosArray.push({xPos: xPosC, yPos: 44});
				}
			}
			else {
				gapFExists = false;
				xPosG += partLength;
				xPosArray.push({xPos: xPosG, yPos: -44});
				// FloorPlatform mesh
				var temp = platformMesh.clone();
				// FloorPlatform position
				temp.position.x = xPosG;
				temp.position.y = -64;
				temp.matrixAutoUpdate = false;
				temp.updateMatrix();
				worldGroup.add(temp);
			}
			var gapC = Math.random();
			// make gap in ceiling
			if(gapC > 0.5 && !gapCExists) {
				gapCExists = true;
				gapCstartX = xPosC + partLength / 2;
				xPosC += partLength + gapLength;
				xPosArray.push({xPos: xPosC, yPos: 44});
				gapCEndX = xPosC - partLength / 2;
				for(var gapI = xPosG; gapI < gapCEndX; gapI += partLength) {
					xPosG = gapI;
					// FloorPlatform mesh
					var temp = platformMesh.clone();
					// FloorPlatform position
					temp.position.x = xPosG;
					temp.position.y = -64;
					temp.matrixAutoUpdate = false;
					temp.updateMatrix();
					worldGroup.add(temp);
					xPosArray.push({xPos: xPosG, yPos: -44});
				}
			}
			else {
				gapCExists = false;
				xPosC += partLength;
				xPosArray.push({xPos: xPosC, yPos: 44});
				// CeilingPlatform mesh
				var temp = platformMesh.clone();
				// CeilingPlatform position
				temp.position.x = xPosC;
				temp.position.y = 64;
				temp.matrixAutoUpdate = false;
				temp.updateMatrix();
				worldGroup.add(temp);
			}
		}
	}
	generateObstacle();
	scene.add(worldGroup);
}

function generateObstacle() {
	var makeObstacle = Math.random();
	if(makeObstacle > 0.64) {
		if(xPosArray.length > 0) {
			var obstacleGeometry = new THREE.BoxGeometry(30, 30, 30);
			var obstacleTexture = THREE.ImageUtils.loadTexture("./assets/obstacle.png");
			var obstacleMaterial = new THREE.MeshLambertMaterial({map: obstacleTexture});
			var obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
			for(var i = 0; i < 30; i++) {
				console.log("obstacle");
				var index = Math.floor(Math.random() * xPosArray.length);
				var el = xPosArray.splice(index, 1);
				console.log(el[0]);
				var temp = obstacle.clone();
				temp.position.set(el[0].xPos, el[0].yPos, 0);
				worldGroup.add(obstacle);
			}
		}
	}
}
function animate(){
	requestAnimationFrame(animate);
	whiteNoise.play();
	alienSound.play();
	alienSound.volume = 0.5;
	// GRAVITY UP
	if(keyboard.pressed("up") && tla != false && !vSkoku && !vSpremembiGravitacijeDol){
		tla = false;
		TWEEN.add(tweenUp);
		tweenDown.stop();
		TWEEN.remove(tweenDown);
		tweenUp.start();
		gravity.play();
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
		gravity.play();
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
		console.log("sphere jump x: "+worldGroup.position.x);
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
	if(keyboard.pressed("left")){
		worldGroup.position.x -= speed;
	}
	if(keyboard.pressed("right")){
		worldGroup.position.x += speed;
	}
	if(keyboard.pressed("a")){
		camera.position.z -= 1;
		camera.position.x -= 1;
		camera.lookAt(new THREE.Vector3(sphere.position.x, 0, 0));
	}
	if(keyboard.pressed("d")){
		camera.position.z += 1;
		camera.position.x += 1;
		camera.lookAt(new THREE.Vector3(sphere.position.x, 0, 0));
	}
	
	if(Math.round(sphere.position.x) >=  xPosG - 2000) {
		//generateTerain();
	}
	// IZRIS
	TWEEN.update();
	// start game animation
	if(runGame) {
		sphere.position.x += speed;
		camera.position.x += speed;
		// SPREMEMBA SMERI ROTACIJE
		if(tla){
			sphere.rotation.z -= objectRot;
		}else{
			sphere.rotation.z += objectRot;
		}
	}
	renderer.render(scene, camera);
}