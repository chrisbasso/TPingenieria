var map;
var drawer;

$(document).ready(function() {
  $(bootstrap);
});

var bootstrap = function() {

  console.log("Creando mapa");
  map = createMap("divMapa", Config.ungsLocation);

  map.whenReady(function() {
    // Creo el drawer para el mapa
    drawer = new Drawer(map);
    // Dibujar incidentes
    var incidentes = Config.incidents();
    incidentes.forEach(function(incident_id) {
      incident(incident_id);
    });
    // Requests a la API de SnapDelibery
    var requests = Config.requests();
    requests.forEach(function(request_id) {
      request(request_id);
    })
  });
}

var request = function(id_peticion) {
  var url = Config.urlSnapDelivery;
  var urlRequests = "/requests/";
  var urlDrivers = "/drivers/";

  var requestPeticion = function(peticion_id) {
    return $.ajax(url + urlRequests + peticion_id);
  }

  var requestDriver = function(driver_id) {
    return $.ajax(url + urlDrivers + driver_id);
  }

  var responseExtract = function(atrib, response) {
    return response[atrib];
  }

  var extractRequest = function(response) {
    return responseExtract("request", response);
  }

  var resolveDrivers = function(request) {
    var newAvailableDrivers = [];
    request.availableDrivers.forEach(function(driver) {
      requestDriver(driver.driver_id)
        .then(function(response) {
          var newDriver = responseExtract("driver", response);
          newDriver["position"] = driver.position;
          newAvailableDrivers.push(newDriver);
        });
    });
    request["availableDrivers"] = newAvailableDrivers;
    return request;
  }

  var drawRequest = function(request) {
    drawer.drawRequestOnMap(request, iniciarRecorrido);
  }

  requestPeticion(id_peticion)
    .then(extractRequest)
    .then(resolveDrivers)
    .done(function(response) {
      setTimeout(function() {
        drawRequest(response);
      }, 2000);
    });
}

var incident = function(id_incidente) {
  var url = Config.urlSnapDelivery;
  var urlIncidents = '/incidents/';
  var urlTypes = '/incidenttypes/';

  var requestIncident = function(incident_id) {
      return $.ajax(url + urlIncidents+ incident_id);
  }
  var requestType = function(type_id) {
      return $.ajax(url + urlTypes + type_id);
  }
  var responseExtract = function(attr, response) {
      return response[attr];
  }
  var extractIncident = function(response) {
      return responseExtract('incident', response);
  }
  var extractType = function(response) {
      return responseExtract('incidenttype', response);
  }
  var drawIncident = function(incident) {
      drawer.drawIncidentInMap(incident);
  }

  var resType = function(incident) {
      // pedimos el tipo con el type_id, y retornamos el incidente completo
      return requestType(incident.type_id)
             .then(function(response){
                  incident.type = extractType(response);
                  delete incident.type_id;
                  return incident;
              });
  }

  requestIncident(id_incidente)			// pedimos el incidente al servidor
      .then(extractIncident)	// extraemos el incidente de la respuesta del servidor 	.then(resp =>{extractIncident(resp)})
      .then(resType)			// resolvemos el tipo de incidente		.then(incident => resType(incident))
      .then(drawIncident)		// dibujamos el incidente con su tipo 	.then(incident =>{console.log(incident);drawIncident})
      .done(function() {
          console.log("Fin.");
      });
}

var iniciarRecorrido = function(id_driver) {
  console.log("Iniciar recorrido. ID = " + id_driver);
  var url = Config.urlSnapDelivery;
  var urlDrivers = "/drivers/";
  var urlPositions = "/positions";
  var name;
  var color;
  var positions;

  var requestDriver = function() {
    return $.ajax(url + urlDrivers + id_driver);
  }

  var requestPositions = function(driver_id) {
    return $.ajax(url + urlDrivers + driver_id + urlPositions);
  }

  var responseExtract = function(atrib, response) {
    return response[atrib];
  }

  var extractDriver = function(response) {
      return responseExtract("driver", response);
  }

  var extractProperties = function(driver) {
    name = driver.name + " " + driver.surname;
    color = driver.car.color;
    return driver.id;
  }

  var extractPositions = function(driver_id) {
    return requestPositions(driver_id)
            .then(function(response) {
              positions = responseExtract("positions", response);
              return response;
            });
  }

  requestDriver(id_driver)
    .then(extractDriver)
    .then(extractProperties)
    .then(extractPositions)
    .done(function() {
      var driver = new Driver(name, color, positions, id_driver);
      var recorrido = new Route("Recorrido", map, driver);
      // Borro los markers de los demás repartidores para que solo se pueda elegir uno por cada pedido
      drawer.deleteDriverMarkers(drawer.getNumeroPedido(id_driver));
      recorrido.start();
    });
}
