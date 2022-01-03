
class Game{

	constructor(width, height){

		// Modificamos el ancho/alto del CANVAS con los argumentos
			this.width = width;
			this.height = height;
			document.getElementById("juego").width =this.width;
			document.getElementById("juego").height = this.height;

			document.getElementById("juegooculto").width =this.width;
			document.getElementById("juegooculto").height = this.height;

		// Iniciamos el cavas
			this.canvas = document.getElementById("juego");
			this.context = this.canvas.getContext("2d");
			this.canvasoculto = document.getElementById("juegooculto");
			this.contextoculto = this.canvasoculto.getContext("2d");

		// cargamos los recursos, en este caso 2 imágenes
			this.imagenFondo = new Image();
			this.imagenFondo.src = "src/image/circuitotornillos.png";
			this.imagenCoche_azul = new Image();
			this.imagenCoche_azul.src = "src/image/coche_azul.png";
			this.imagenCoche_verde = new Image();
			this.imagenCoche_verde.src = "src/image/coche_verde.png";
			this.imagenFondooculto = new Image();
			this.imagenFondooculto.src = "src/image/map_circuitotornillos.png";

		// colores del mapa oculto, para detectar obstáculos, aceite, pegamento...
		this.colors = {
			camino: { r:237, g:28, b:36},
			obstaculo: { r:63, g:72, b:204},
			meta: { r:63, g:210, b:0, a:255},
			aceite: { r:0, g:0, b:0},
			pegamento: { r:255, g:255, b:255}
		}

		// variables
			this.config = {
				status: "pause",
				position_car: { x: 455, y: 275 },
				position_map: { x: -1400, y: -1620 },
				direction: "Up",
				dificultad:0,
				color_coche :1,
				speed: 1,
				lap: 0,
				//music: true,
				i:null,
				iniciar: false,
				tmp:0, 
				pixel_actual: null,
				accion: null
			};
		//var	pixel_actual = [];

		// carga el sprite del coche con sus coordenadas según la posición
			this.coche = {
				Up : 			{x:0, y:0, width:60, height:75},
				Up_right :  	{x:60, y:0, width:70, height:75},
				Right : 		{x:132, y:0, width:68, height:75},
				Down_right : 	{x:198, y:0, width:70, height:75},
				Down : 			{x:270, y:0, width:70, height:75},
				Down_left : 	{x:340, y:0, width:70, height:75},
				Left : 			{x:410, y:0, width:60, height:75},
				Up_left : 		{x:472, y:0, width:76, height:75} 	
			};	

		// carga la pista de mp3 para poner música al juego
		this.music = new Audio("src/media/f1.mp3");

		// CARGAMOS FUNCIONES
		// carga la función cuando termine de cargar la imagen
		this.imagenFondo.addEventListener("load", function(){
			juego.muestra_mapa();
		});
		this.imagenFondooculto.addEventListener("load", function(){
			juego.muestra_mapa();
		});
	}

	init(){
	// se crea una repetión cada "x" ms en función de la dificultad que se seleccione
		setInterval(() => {
			if ( this.config.status == "continue" ){
				this.start_game();
			}	
		}, this.config.fps);
	}		

	start_game(){
		
	//console.log("pos. Actual:" + this.config.pixel_actual);
	//console.log("Velocidad :"+this.config.speed);
	//console.log("Dificultad: "+this.config.dificultad);
	//console.log("posición: " + this.detecta_siguiente_paso());
	//Hasta que no se pulsa el botón start (recoge el dato de la dificultad) no se inicia el juego
		if ( this.config.dificultad !== 0){
	// detecta el tipo de acción según el color del mapa y aumenta, mantiene, reduce o para la velocidad
			if ( this.detecta_siguiente_paso() == "aceite" ){
				this.config.speed = 3;
				this.mueve_coche();
			} else if ( this.detecta_siguiente_paso() == "pegamento" ){
				this.config.speed = 0.3;
				this.mueve_coche();
			} else if ( this.detecta_siguiente_paso() == "limite" ){				
	// si pasa la línea de meta va aumentando en 1 el número de vueltas, solo si la cruza en dirección hacía arriba y reinicia el cronometro			
			} else if ( this.detecta_siguiente_paso() =="meta" && (this.config.direction == "Up" || this.config.direction == "Up_right" || this.config.direction == "Up_left") ){
				//this.config.lap += 1;
				this.mueve_coche();				
	// para el crono y el juego si se completa 1 vuelta
				if ( this.config.lap > 1){
					this.pararCrono();
					//this.config.dificultad = 0;
				}				
			} else {
	// por defecto, la acción sera "normal"	
				this.config.speed = 1;
				this.velocidad_juego();
				this.mueve_coche();
			}
			this.muestra_mapa();			
		}			
	}

	detecta_siguiente_paso(){

	/*	if ( this.config.music ){
			this.music.play();
		} */
		
		//https://www.w3schools.com/tags/canvas_getimagedata.asp
			var imgData = this.contextoculto.getImageData(this.config.position_car.x, this.config.position_car.y, 1, 1);
			//document.getElementById("testing").style.background="rgba("+imgData.data.join(",")+")";
			var direccion = this.config.direction;

			if ( direccion == "Up" ) 	     {var imgData = this.contextoculto.getImageData((this.config.position_car.x + 20), this.config.position_car.y, 1, 1 );}
			if ( direccion == "Down" ) 		 {var imgData = this.contextoculto.getImageData((this.config.position_car.x + 20), (this.config.position_car.y + 50), 1, 1);}
			if ( direccion == "Left" )  	 {var imgData = this.contextoculto.getImageData((this.config.position_car.x), (this.config.position_car.y + 20), 1, 1);}
			if ( direccion == "Right" ) 	 {var imgData = this.contextoculto.getImageData((this.config.position_car.x), (this.config.position_car.y + 20), 1, 1);}
			if ( direccion == "Up_right" )   {var imgData = this.contextoculto.getImageData((this.config.position_car.x + 30), (this.config.position_car.y + 75), 1, 1);}
			if ( direccion == "Up_left" ) 	 {var imgData = this.contextoculto.getImageData((this.config.position_car.x + 30), (this.config.position_car.y + 75), 1, 1);}
			if ( direccion == "Down_right" ) {var imgData = this.contextoculto.getImageData((this.config.position_car.x + 30), (this.config.position_car.y + 75), 1, 1);}
			if ( direccion == "Down_left" )  {var imgData = this.contextoculto.getImageData((this.config.position_car.x + 30), (this.config.position_car.y + 75), 1, 1);}

		//console.log( imgData.data.join(",") );
		// detecta el color del siguiente pixel y en función de este, devuelve una variable
			for ( let i = 0; i < imgData.data.length; i = i+4) {
				var accion = "normal";
				if ( (imgData.data[i] == this.colors.camino.r && imgData.data[i+1] == this.colors.camino.g && imgData.data[i+2] == this.colors.camino.b) ){
					accion = "normal";
					this.config.pixel_actual = imgData.data;
				} else if ( (imgData.data[i] == this.colors.obstaculo.r && imgData.data[i+1] == this.colors.obstaculo.g && imgData.data[i+2] == this.colors.obstaculo.b) ){
					accion = "limite";
					this.config.pixel_actual = imgData.data;
				} else if ( (imgData.data[i] == this.colors.aceite.r && imgData.data[i+1] == this.colors.aceite.g && imgData.data[i+2] == this.colors.aceite.b) ){
					accion = "aceite";
					this.config.pixel_actual = imgData.data;
					//console.log(imgData.data);
				} else if ( (imgData.data[i] == this.colors.pegamento.r && imgData.data[i+1] == this.colors.pegamento.g && imgData.data[i+2] == this.colors.pegamento.b) ){
					accion = "pegamento";
					this.config.pixel_actual = imgData.data;
		// paso por meta del coche
				} else if ( (imgData.data[i] == this.colors.meta.r && imgData.data[i+1] == this.colors.meta.g && imgData.data[i+2] == this.colors.meta.b) ){
		// si el color del pixel anterior es distinto al actual, cuenta la vuelta y pone la variable del pixel actual con el color verde. Con esto se evita que cuente más de una vuelta por el ancho que 
		// tiene la línea de meta. Al tener 5px e ir contando de 1 en 1, evita que cuente 5 vueltas cada vez que pasa. Solo cuenta la vuelta la primera vez que detecta el color verde.
					if ( this.config.pixel_actual[0] == this.colors.meta.r && this.config.pixel_actual[1] == this.colors.meta.g && this.config.pixel_actual[2] == this.colors.meta.b){
						accion = "meta";
						this.encenderCrono();
					} else {
						this.config.lap++;
						this.config.pixel_actual = imgData.data;
						accion = "meta";
						this.pararCrono();
					}
				} 
				return accion;
			}
	}
	
	// detecta la dificultad seleccionada en el select y asigna el valor a la variable dificultad
	dificultad(){
	// obtiene de los 2 select del html las opciones elegidas (dificultad y color del coche)
		let select = document.getElementById("dificultad").value;
		this.config.dificultad = select;
		let select2 = document.getElementById("color_coche").value;
		this.config.color_coche = select2;
		this.velocidad_juego();
		this.config.status = "continue";
		this.music.play();
		this.init();
	// pone el juego a pantalla completa
		this.canvas.requestFullscreen();
	// una vez pulsado el botón, añadimos una nueva clase de css, que oculta el div donde se muestra el selector de dificultad y el botón de empezar
		document.getElementById("prueba").classList.add("oculta_select_dificultad");
	}
	// en función de la variable "dificultad" seleccionada, asigna una velocidad de movimiento a la varibale speed
	velocidad_juego(){
		if ( this.config.dificultad == 1 ){
			this.config.fps = 10;
		} else if ( this.config.dificultad == 2 ){
			this.config.fps = 5;
		} else if ( this.config.dificultad == 3 ){
			this.config.fps = 3;
		}
	}

	mueve_coche(){
		// DETECTA la posición del coche y cambiar los valores de this.config.position_map X/Y
		// Le suma o le resta la variable speed a los ejes x-y
		if ( this.config.music ){
			this.music.play();
		}
		if ( this.config.direction == "Up"){
			this.config.position_map.y += this.config.speed;
		}
		if ( this.config.direction == "Down" ){
			this.config.position_map.y -= this.config.speed;
		}
		if ( this.config.direction == "Left" ){
			this.config.position_map.x += this.config.speed;
		}
		if ( this.config.direction == "Right" ){
			this.config.position_map.x -= this.config.speed;
		}
		if ( this.config.direction == "Up_right" ){
			this.config.position_map.y += this.config.speed;
			this.config.position_map.x -= this.config.speed;
		}
		if ( this.config.direction == "Up_left" ){
			this.config.position_map.y += this.config.speed;
			this.config.position_map.x += this.config.speed;			
		}
		if ( this.config.direction == "Down_right" ){
			this.config.position_map.y -= this.config.speed;
			this.config.position_map.x -= this.config.speed;			
		}
		if ( this.config.direction == "Down_left" ){
			this.config.position_map.y -= this.config.speed;
			this.config.position_map.x += this.config.speed;			
		}		
	}

	// muestra la imagen desplazada con unas coordenadas croncretas para tener la salida en el centro
	muestra_mapa(){
		this.context.drawImage(this.imagenFondo, this.config.position_map.x, this.config.position_map.y);
		this.contextoculto.drawImage(this.imagenFondooculto, this.config.position_map.x, this.config.position_map.y);
	// Carga la primera posición que sería la imagen inicial del coche al empezar el juego
	// la imagen irá cambiando en función de en qué dirección se mueva el coche
	// se puede seleccionar entre el coche verde y el coche azul, cargará uno u otro en función de la selección en la página principal antes de comenzar el juego
		if ( this.config.color_coche == 1) {
			this.context.drawImage(
				this.imagenCoche_azul,
				this.coche[this.config.direction].x,
				this.coche[this.config.direction].y,
				this.coche[this.config.direction].width,
				this.coche[this.config.direction].height,
				this.config.position_car.x,
				this.config.position_car.y,
				35,
				50
			);
		} else if ( this.config.color_coche == 2 ){
			this.context.drawImage(
				this.imagenCoche_verde,
				this.coche[this.config.direction].x,
				this.coche[this.config.direction].y,
				this.coche[this.config.direction].width,
				this.coche[this.config.direction].height,
				this.config.position_car.x,
				this.config.position_car.y,
				35,
				50
			);
		}
		
	// pinta el contador de vueltas en el mapa
		this.context.fillStyle = "rgb(0, 0, 0)";
		this.context.fillRect(15,15,140,50)
		this.context.fillStyle = "rgb(252, 5, 236)"
		this.context.font = "bold 27px Roboto"
		this.context.fillText("Vuelta: " + this.config.lap, 20, 50);
	// pinta el cronómetro en el mapa
		this.context.fillStyle = "rgb(0, 0, 0)";
		this.context.fillRect(15,80,220,50)
		this.context.fillStyle = "rgb(252, 5, 236)"
		this.context.font = "bold 27px Roboto"
		this.context.fillText("Tiempo: " + this.cronometro(), 20, 115);
	}
		

	game_over(){

	}

	cronometro(){
		this.config.i++;
		var tmp = 0;
		var Cen = this.config.i;

		var iCen = Cen % 100;
		var iSeg = Math.round((Cen - 50) / 100);
		var iMin = Math.round((iSeg - 30) / 60);
		iSeg = iSeg % 60;

		var sCen = "" + ((iCen > 9) ? iCen : "0" + iCen);
		var sSeg = "" + ((iSeg > 9) ? iSeg : "0" + iSeg);
		var sMin = "" + ((iMin > 9) ? iMin : "0" + iMin);

		return (sMin + ":" + sSeg + ":" + sCen);
	}

	encenderCrono(){
		this.cronometro.tmp;
		//if (this.config.i !== 0) { return; }
    	this.config.iniciar = setInterval(this.cronometro, 10);
	}
	pararCrono(){		
		clearInterval(this.config.iniciar);
		this.config.i = 0;
	}
}

class Input{
	constructor(){
		// ponemos las teclas del juego a false, por defecto no están pulsadas antes de empezar el juego
		this.keys = {
			"ArrowLeft" :   false,
			"ArrowUp" :     false,
			"ArrowRight" :  false,
			"ArrowDown" :   false,
			"s" : 			false, //pausa el juego
			"c" : 			false, // continua el juego después de una pausa
			"m" : 			false, // silencia la música
			"d" : 			false  // quita el silencia a la música
		};

		const body = document.getElementsByTagName("body")[0];
		// detecta cuando se pulsa alguna tecla y la pone a true
		body.addEventListener("keydown", (e)=>{
			this.keys[e.key] = true;
			this.position();
			//console.log("Dirección: "+juego.config["direction"]);
			//console.log(e.key);

		});
		// detecta cuando se deja de pulsar alguna tecla y la pone a false
		body.addEventListener("keyup", (e)=>{
			this.keys[e.key] = false;
			this.position();

		});

    }    

	position(){
		// detecta qué teclas se están pulsando para saber en qué dirección se mueve y lo guarda en la variable direction del config
		if(this.keys.ArrowUp && !this.keys.ArrowDown && this.keys.ArrowRight && !this.keys.ArrowLeft){
			juego.config.direction = "Up_right";
		}else if(this.keys.ArrowUp && !this.keys.ArrowDown && !this.keys.ArrowRight && this.keys.ArrowLeft){
			juego.config.direction = "Up_left";
		}else if(!this.keys.ArrowUp && this.keys.ArrowDown && this.keys.ArrowRight && !this.keys.ArrowLeft){
			juego.config.direction = "Down_right";
		}else if(!this.keys.ArrowUp && this.keys.ArrowDown && !this.keys.ArrowRight && this.keys.ArrowLeft){
			juego.config.direction = "Down_left";
		}else if(this.keys.ArrowUp){
			juego.config.direction = "Up";
		}else if(this.keys.ArrowDown){
			juego.config.direction = "Down";
        }else if(this.keys.ArrowLeft){
            juego.config.direction = "Left";
		}else if(this.keys.ArrowRight){
            juego.config.direction = "Right";
        }else if(this.keys.s){
			juego.config.status = "pause";
			juego.music.pause();
		}else if(this.keys.c){
			juego.config.status = "continue";
			juego.music.play();
		}else if(this.keys.m){
			juego.music.muted = true;
		}else if(this.keys.d){	
			juego.music.muted = false;					
		}
	}
}

window.onload = function(){
	juego = new Game(800, 500);
	input = new Input;
}


