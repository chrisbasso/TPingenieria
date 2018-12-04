

function traerProductos(){
    $(document).ready(function() {
        nombreProducto = document.getElementById('producto').value;
        $.ajax({url:"https://api.mercadolibre.com/sites/MLA/search?q=" + nombreProducto, dataType:"json"
        }).done(function(data) {
            var results = data.results;
            for (var i = 1; i < 6; i++) {
                var item = results[i];
                imagen= item.thumbnail;
                console.log(item);
                document.getElementById("imagen" + i).innerHTML="<img src='"+imagen+"'>" + item.title + "  $" + item.price;

            }
        }).fail(function(){
            console.log("error")
        });
    });
}





