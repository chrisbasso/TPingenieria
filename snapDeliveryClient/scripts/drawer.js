/* Clase para dibujar en un mapa */
var Drawer = function(mapa) {

    pedidos = {};

    return {
        drawIncidentInMap: drawIncidentInMap,
        drawRequestOnMap: drawRequestOnMap,
        deleteDriverMarkers: deleteDriverMarkers,
        getNumeroPedido: getNumeroPedido
    }

    /* Función para dibujar un incidente en un mapa */
    function drawIncidentInMap(incident) {
      console.log("Dibujando el incidente: " + incident.id);

      var info = incident.type.description + " - Delay: " + incident.type.delay + "min.";

      // Creamos un marker.
		  var incidentMarker = L.marker(L.latLng(incident.coordinate.lat, incident.coordinate.lon), {icon: Config.getIncidentIcon(incident)})
                  .bindPopup(info);

  	  incidentMarker.addTo(map);
	  }

    /* Funcion para dibujar sender, receiver y available drivers de una peticion */
    function drawRequestOnMap(resObj, callbackRecorrido) {
      // Arreglo de markers que se va a agregar al mapa
      var markers = [];
      // Funciones para manejar eventos sobre los markers
      function onMouseOver(e) {
        this.openPopup();
      };
      function onMouseOut(e) {
        this.closePopup();
      };

      // Marcador del sender
      var sender = L.marker(L.latLng(resObj.sender.lat, resObj.sender.lon), {icon: Config.getSenderIcon()});
      sender.bindPopup("Sender");
      sender.on("mouseover", onMouseOver);
      sender.on("mouseout", onMouseOut);
      markers.push(sender);

      // Marcador del receiver;
      var receiver = L.marker(L.latLng(resObj.receiver.lat, resObj.receiver.lon), {icon: Config.getReceiverIcon()});
      receiver.bindPopup("Receiver");
      receiver.on("mouseover", onMouseOver);
      receiver.on("mouseout", onMouseOut);
      markers.push(receiver);

      // Marcadores de los drivers cercanos
      var availableDrivers = resObj.availableDrivers;
      // Recorro availableDrivers y dibujo los markers
      availableDrivers.forEach(function(driver) {
          var infoDriver = "<p>Repartidor: " + driver.name + " " + driver.surname
                            + "<br>Score: " + driver.score
                            + "<br>Auto: " + driver.car.description + " " + driver.car.color
                            + "<br>Patente: " + driver.car.plateNumber
                            + "</p>";
          /* El parametro e es un evento, tiene información del evento
          que ocurrió. e.target es el objeto que se clickeó en el evento */
          function onClick(e) {
            callbackRecorrido(e.target.driverId);
          };

          var driverMarker = L.marker(L.latLng(driver.position.lat,driver.position.lon), {icon: Config.getDriverIcon(driver.id)});

          driverMarker.driverId = driver.id;
          driverMarker.name = driver.name + " " + driver.surname;
          driverMarker.score = driver.score;
          driverMarker.bindPopup(infoDriver);
          driverMarker.on("click", onClick);
          driverMarker.on("mouseover", onMouseOver);
          driverMarker.on("mouseout", onMouseOut);
          markers.push(driverMarker);
      });

      var grupo = L.layerGroup(markers);
      pedidos["Pedido " + resObj.id] = {
        senderMarker: sender,
        receiverMarker: receiver,
        markers: grupo
      };
      map.layersControl.addOverlay(grupo, "Pedido " + resObj.id);

    }

    /* Función para eliminar los markers de repartidores pertenecientes a un pedido del mapa */
    function deleteDriverMarkers(pedido){
      // Borro todos los markers del pedido
      pedidos[pedido].markers.clearLayers();
      // Vuevlo a dibujar los markers del sender y receiver
      pedidos[pedido].markers.addLayer(pedidos[pedido].senderMarker);
      pedidos[pedido].markers.addLayer(pedidos[pedido].receiverMarker);
    }

    /* Función que recive un driver id y devuelve el número de pedido que puede atender */
    function getNumeroPedido(driver_id) {
      var ret;
      // Recorro el objeto pedidos que tiene la información de los pedidos dibujados
      for (var key in pedidos) {
        if (pedidos.hasOwnProperty(key)) {
          // Recorro los markers del pedido
          pedidos[key].markers.eachLayer(function(layer) {
            // Si el id asociado al marker es el mismo que recibí como parámetro guardo el pedido
            if ( layer.driverId === driver_id ) {
              ret = key;
            }
          });
        }
      }
      return ret;
    }
}
