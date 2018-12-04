$(document).ready(function() {
  $("#divPedido1").html(function() {mostrarPedido1()});
  $("#divPedido2").html(function() {mostrarPedido2()});

});

function mostrarPedido1(){
  document.getElementById("divPedido1").innerHTML = "Contenido del paquete: Iphone 8 plus <br>Número de pedido: 42";
};

function mostrarPedido2(){
  document.getElementById("divPedido2").innerHTML = "Contenido del paquete: Samsung Galaxy S9 <br>Número de pedido: 80";
}
