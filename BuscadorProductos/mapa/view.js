

function bootstrap() {

  var ungsLocation = [-34.5221554, -58.7000067];
  map = L.map('divMapa').setView(ungsLocation, 15);
  //var idCategoria = getParameterByName('idCategoria');
    cluster = L.markerClusterGroup();

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.polygon([
    L.latLng(-34.5089771,-58.7044776),
    L.latLng(-34.530014,-58.7092498),
    L.latLng(-34.5121185,-58.6628301),
    L.latLng(-34.4920347,-58.6596728)
]).addTo(map);

    $('#search').keydown(function(){
        $.getJSON("productos.json", function(data){
            var search = $('#search').val();
            var regex = new RegExp(search, 'i');
            var output;
            $.each(data, function(key, val){
                if ((val.name.search(regex) != -1)){
                    output += "<tr>";
                    output += "<td class=\"align-middle text-center font-weight-bold\" id='"+key+"'>"+ val.name + "</td>";
                    output += "<td class=\"align-middle text-center font-weight-bold\" id='"+key+"'>"+val.price+"</td>";
                    output += "<td class=\"align-middle text-center font-weight-bold\" id='"+key+"'>"+ "<img src=" + val.image + " height=\"200\" class=\"rounded mx-auto d-block\" />" + "</td>";
                    output += "<td class=\"align-middle text-center font-weight-bold\">"+ "<button onclick=marcar(" + val.idCategoria + ")" + " class=\" btn btn-primary\">Ver Comercios</button>" + "</td>";
                    output += "</tr>";
                }
            });
            $('tbody').html(output);

        });
    });

}

function marcar(idCategoria) {

    cluster.clearLayers();


    $.getJSON("mapa/comercios.json", function(data){
        $.each(data, function(key, val){

            if(idCategoria == val.idCategoria){
                cluster.addLayer(L.marker([val.location[0], val.location[1]]).bindPopup("<b>" + val.name + "</b>" + "<br>" + val.horario + "<br>" + val.direccion));
                map.panTo(new L.LatLng(val.location[0], val.location[1]));

            }
        });

    });

    cluster.addTo(map);

}


