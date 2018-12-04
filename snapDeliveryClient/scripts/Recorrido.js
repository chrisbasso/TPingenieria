var Route = function(name, map, driver) {
    this.name = name;
    this.map = map;
    this.repartidor = driver;
    //Creamos el layer en el mapa para ese repartidor
    var driverLayer = L.layerGroup().addTo(this.map);
    // Agregamos el layer al control
    this.map.layersControl.addOverlay(driverLayer, driver.name);
    // Función callback para actualizar la posición del repartidor en el mapa
    var updater = function(newPosition) {
        // Limpio el rastro de layers que deja el repartidor al moverse
        driverLayer.clearLayers();
        // Log de consola
        console.log("Updating view for driver: " + driver.name + "!!");
        console.log(newPosition);

        // Se agrega el repartidor a la capa.
        driverLayer.addLayer(L.marker(newPosition, {icon: Config.getDriverIcon(driver.id)}).bindPopup(driver.name));
    }
    // Función para empezar a mover al repartidor
    this.start = function() {
        this.repartidor.run(updater);
    }
};
