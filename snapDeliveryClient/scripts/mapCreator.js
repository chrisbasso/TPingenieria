/* Función que devuelve un mapa de leaflet */
var
    createMap = function(mapaId, centro) {

    // Agregamos los Layers de OpenStreetMap.
    var baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    // Creación del componente mapa de Leaflet.
    var map = L.map(mapaId, {
      center: centro,
      zoom: 15
    });

    baseLayer.addTo(map);
    // Nombre para el layer base del mapa
    var baseMaps = {
      "Base": baseLayer
    };

    // Agrego control de layers. Permite decidir que markers ver en el mapa.
    var layersControl = L.control.layers(baseMaps).addTo(map);

    // hack: Permite agregar layers al mapa de forma dinámica.
    map.layersControl = layersControl;

    return map;
}
