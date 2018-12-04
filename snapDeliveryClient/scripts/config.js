var heroku = "https://snapdelivery.herokuapp.com/api";
var ungsLocation = [-34.5221554, -58.7000067];


var Config = {
    urlSnapDelivery: heroku,
    ungsLocation: ungsLocation,


    incidents: function() {
      return [18,19,81];
    },
    requests: function() {
      return [42, 80];
    },
    getDriverIcon: function(driver_id) {
      if( driver_id == 600 ) {
        return L.icon({iconUrl: 'img/tuero.png', iconSize: [55,45]});
      }
      else if( driver_id == 107 ) {
        return L.icon({iconUrl: 'img/toretto.png', iconSize: [50,30]});
      }
      else if( driver_id == 121 ) {
        return L.icon({iconUrl: 'img/batimovil.png', iconSize: [50,30]});
      }
      else if( driver_id == 105 ) {
          return L.icon({iconUrl: 'img/Emmet_Brown.png', iconSize: [55,40]});
      }
      else if( driver_id == 222 )  {
        return L.icon({iconUrl: 'img/renault-12.png', iconSize: [45,40]});
      }
      else if( driver_id == 201 ) {
          return L.icon({iconUrl: 'img/jonsnow.png', iconSize: [55,45]});
      }
    },
    getSenderIcon: function() {
        return L.icon({iconUrl: 'img/marker_verde.png', iconSize: [50,50]});
    },
    getReceiverIcon: function() {
        return L.icon({iconUrl: 'img/marker_rojo.png', iconSize: [50,50]});
    },
    getIncidentIcon: function(incident){
        if( incident.type.description == "accident" ) {
            return L.icon({iconUrl: 'img/accidente.png', iconSize: [35, 35]});
        }
        else if ( incident.type.description == "congestion" ) {
            return L.icon({iconUrl: 'img/congestion.png', iconSize: [35, 35]});
        }
        else if( incident.type.description == "massive protest" ) {
            return L.icon({iconUrl: 'img/manifestacion.png', iconSize: [35, 35]});
        }
    }
}
