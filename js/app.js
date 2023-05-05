// Inicializamos las variables necesarias
let apiKey;
let maxTokens = 199;
let seleccion = "";
let markers_mapa = [];
// inicializar la "api"
const api = {

    //  recuperar el key para usar api chatGPT
    recuperarAPI: () => {
        fetch('https://www.donde-reparar.com/game/api.php')
            .then(res => res.json())
            .then(json => {
                apiKey = json.key;
                console.log("api 1 " + json.key);
                api.iniciamos();
            });
        api.recuperarJSON('ccaa');
    },

    // recuperar del JSON las Comunidades Autonomas, Provincia y poblaciones para elegir la ruta
    /*
    PRUEBA DE CONSUMO JSON EN DRIVER GOOGLE
    ENLACE carpeta spain: https://drive.google.com/drive/folders/1eJDEW23TLl90_zSGjjKFdWEcOygo8l7b?usp=share_link
    ENLACE archivo ccaa: https://drive.google.com/file/d/18GyLRshzmBEhzOzDeG8jP2UZkjC-XFXZ/view?usp=share_link
    */
    recuperarJSON: (c, id, b) => {
        fetch(`spain/${c}.json`)
            //fetch(`https://drive.google.com/file/d/18GyLRshzmBEhzOzDeG8jP2UZkjC-XFXZ/view?usp=share_link`)
            .then(arbol => arbol.json())
            .then(data => {
                let el = "";
                data.forEach(user => {
                    if (b === "" || user.parent_code === b) {
                        //console.log("la carga es: "+user.label);

                        let ccaa = document.getElementById(id);
                        let opt = user.label;
                        el = document.createElement("option");
                        el.textContent = opt;
                        el.value = user.code;
                        ccaa.appendChild(el);
                    }
                });
            });
    },

    // localizar las coordenadas de cada lugar
    recuperarCoordenadas: (ubicacion) => {
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({ 'address': ubicacion + ", " + seleccion }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK && results.length > 0) {

                //console.log("el lugar es: "+ubicacion + " y las coordenadas" +results[0].geometry.location,);
                var location = results[0].geometry.location,
                    lat = location.lat(),
                    lng = location.lng();

                markers_mapa.push({
                    timestamp: ubicacion,
                    latitude: lat,
                    longitude: lng,
                    description: ubicacion + ", " + seleccion
                });
                //console.log("INSERTADO: "+ markers_mapa[markers_mapa.length]);
            }
        });
    },

    // consultar a chatGPT
    generarGPT: async (prompt) => {
        console.log("Iniciando consulta en chatGPT");
        await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                prompt,
                max_tokens: maxTokens,
            })
        })
            .then(function (data) {
                return data.json();
            })
            .then(function (response) {
                var generatedText = response.choices[0].text;
                console.log("tal cual --->>>>>>" + generatedText + " retorno ");
                var arrayDeCadenas = generatedText.split(/\r\n|\r|\n/);

                arrayDeCadenas.forEach(item => {
                    //var separar = item.split("+");
                    var separarN = item.split(".");
                    if (separarN[1]) {
                        api.recuperarCoordenadas(separarN[1]);
                        console.log("buscar coordenada: separada 1 " + separarN[1]);
                    }
                });
            })
            .catch(function (error) {
                console.info(error);
            })
    },
    // recargar el acordeon para las acciones
    /* AHORA EN DESUSO */
    cargarAcordeon: () => {
        const acordeon = document.getElementsByClassName('contenedor');
        for (i = 0; i < acordeon.length; i++) {
            acordeon[i].addEventListener('click', function () {
                this.classList.toggle('activa');
            });
        }

    },

    // iniciar distintos recursos para la solución
    iniciamos: () => {
        $('#imagenC').fadeOut(0);
        $('#imagenC').click(() => { api.crerarIMG() });

        api.recuperarJSON("ccaa", "comunidad", "");
        /*
        // para pruebas
            let hacerruta = document.getElementById("vamos");
            let hacer = document.getElementById("hacer").value;
            hacerruta.addEventListener("click", () => {
                neighborhoods = [];
                console.log("el texto " + hacer);
                api.generarGPT(document.getElementById("hacer").value);
                setTimeout(() => {
                    console.log("iniciando...");
                    //initMap("Madrid");
                }, "10000");
            });
        //para pruebas
        */
        document.querySelectorAll(".select-css").forEach((e) => {
            e.addEventListener("change", () => {
                let select = document.getElementById(e.id);
                switch (e.id) {
                    case "comunidad":
                        console.log("Hemos hecho click aqui " + select.value + " -- " + select.options[select.selectedIndex].text);
                        api.recuperarJSON("provincias", "provincia", select.value);
                        seleccion += select.options[select.selectedIndex].text + ", ";
                        $("#provincia").focus();
                        break;
                    case "provincia":
                        console.log("Hemos hecho click aqui " + select.value + " -- " + select.options[select.selectedIndex].text);
                        api.recuperarJSON("poblaciones", "poblacion", select.value);
                        seleccion += select.options[select.selectedIndex].text + ", ";
                        $("#poblacion").focus();
                        break;
                    case "poblacion":
                        console.log("Hemos hecho click aqui " + select.value + " -- " + select.options[select.selectedIndex].text);
                        seleccion += select.options[select.selectedIndex].text + ", ";
                        $("#numero").focus();
                        break;
                    case "numero":
                        console.log("Esta es la elección " + select.value + " -- ");
                        document.getElementById("hacer").innerText = `
                            Ruta por ${select.value} lugares más interesante para ver en ${seleccion} España. Muestrame solo nombre.
                            `;
                        api.generarGPT(`
                            Ruta por ${select.value} lugares más interesante para ver en ${seleccion} España. Muestrame solo nombre.
                            `);
                        let resumenA = ""
                        let acordeon = document.getElementById("resumen");
                        resumenA += `<h1>${seleccion}</h1><hr>`;
                        $('.overlay').fadeIn(700, function () {
                            // mostramos el contenido principal
                            $('.main').fadeOut(500);
                        });

                        setTimeout(() => {
                            markers_mapa.forEach(async (value, index, array, n = 0) => {
                                resumenA += `
                                                <hr>
                                                <div class="contenedor">
                                                    <div id="B${n}" class="etiqueta">${value.timestamp}</div>
                                                </div>
                                                `;
                                n++;
                            });
                            $('.overlay').fadeOut(700);
                            acordeon.innerHTML = resumenA;
                            api.showMapa();
                            api.cargarAcordeon();
                            api.crearQR();
                            $(".acordeon-cuerpo").fadeIn(600);
                            $('#imagenC').fadeIn(700);
                        }, "7000");
                        break;
                }
            });
        });
    },

    // Mostramos el mapa con las posiciones y la ruta
    showMapa: () => {
        var mapOptions = {
            center: new google.maps.LatLng(markers_mapa[0].latitude, markers_mapa[0].longitude),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("google-map"), mapOptions);
        var infoWindow = new google.maps.InfoWindow();
        var lat_lng = new Array();
        var latlngbounds = new google.maps.LatLngBounds();
        for (i = 0; i < markers_mapa.length; i++) {
            var data = markers_mapa[i];
            var myLatlng = new google.maps.LatLng(data.latitude, data.longitude);
            lat_lng.push(myLatlng);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: data.timestamp
            });

            latlngbounds.extend(marker.position);
            (function (marker, data) {
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent(data.timestamp);
                    infoWindow.open(map, marker);
                });
            })(marker, data);
        }
        map.setCenter(latlngbounds.getCenter());
        map.fitBounds(latlngbounds);

        //*********** LA RUTA ****************//

        // Inicializamos the Path Array
        var path = new google.maps.MVCArray();

        // Iniciamlizamos the Direction Service
        var service = new google.maps.DirectionsService();

        // cargamos the Path Stroke Color
        var poly = new google.maps.Polyline({
            map: map,
            strokeColor: '#4986E7'
        });

        // Bucle and Draw Path Route between the Points on MAP
        for (var i = 0; i < lat_lng.length; i++) {
            if ((i + 1) < lat_lng.length) {
                var src = lat_lng[i];
                var des = lat_lng[i + 1];
                // path.push(src);
                poly.setPath(path);
                service.route({
                    origin: src,
                    destination: des,
                    travelMode: google.maps.DirectionsTravelMode.WALKING
                }, function (result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                            path.push(result.routes[0].overview_path[i]);
                        }
                    }
                });
            }
        }
    },

    // Crear and show QR
    crearQR: () => {
        var qrcode = new QRCode("qrcode");
        // construir la url así: -> https://www.google.es/maps/dir/40.402336,-3.7055008/40.403823,-3.706579/40.4043305,-3.7048517/40.4026516,-3.7037091/@40.4032521,-3.7073616
        let url = "https://www.google.es/maps/dir";
        let f = markers_mapa.length;
        for (let i = 0; i < f; i++) {
            if (markers_mapa[i].timestamp != undefined) {
                url += `/${markers_mapa[i].latitude},${markers_mapa[i].longitude}`;
            }
        }
        qrcode.makeCode(url);
        $("#qrcode").resizable().draggable();
    },
    // Crear una imagen de los resultados
    crerarIMG: () => {
        var domElement = document.getElementById("imagen");
        html2canvas(domElement, {
            scale: 2,
            useCORS: true,
        }).then(canvas => {
            var dataURL = canvas.toDataURL();
            const link = document.createElement('a')
            link.href = dataURL
            link.download = `jcms${Math.floor(Math.random() * 1000) + 1}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
    }
}

// INICIAMOS LA APP
api.recuperarAPI();
