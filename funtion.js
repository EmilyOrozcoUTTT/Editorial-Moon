function dinero(numero) {
  return "$" + numero;
}
function crearTarjeta(libro, esTienda) {
  let boton = "";
  if (esTienda === true) {
    boton = '<button class="btn boton-oscuro btn-sm comprar">Comprar</button>';
  } else {
    boton = '<a class="btn boton-borde btn-sm" href="tienda.html">Comprar</a>';
  }
  return '<div class="col-6 col-md-4">' +
    '<article class="caja-libro h-100">' +
    '<img src="' + libro.img + '" class="img-fluid" alt="Portada de ' + libro.title + '">' +
    '<div class="p-3">' +
    '<span class="etiqueta-genero">' + libro.genre + '</span>' +
    '<h3 class="h5 mt-2">' + libro.title + '</h3>' +
    '<p class="small mb-2">' + libro.author + '</p>' +
    '<div class="d-flex justify-content-between align-items-center">' +
    '<strong>' + dinero(libro.price) + '</strong>' + boton +
    '</div></div></article></div>';
}
/* CÓDIGO PARA TODAS LAS PÁGINAS */
let paginaActual = document.body.dataset.page;

if (window.AOS) {
  AOS.init({ duration: 700, once: true });
}
/* PÁGINA CATÁLOGO */
if (paginaActual === "catalogo") {
  function mostrarCatalogo(genero) {
    let html = ""; 
    for (let i = 0; i < BOOKS.length; i++) {
      if (genero === "Todos" || BOOKS[i].genre === genero) {
        html = html + crearTarjeta(BOOKS[i], false);
      }
    }
    document.querySelector("#rejillaCatalogo").innerHTML = html;
  }
  mostrarCatalogo("Todos"); 
  let botones = document.querySelectorAll("#filtros button");
  for (let i = 0; i < botones.length; i++) {
    let boton = botones[i];
    boton.addEventListener("click", function () {
      for (let j = 0; j < botones.length; j++) {
        botones[j].classList.remove("active");
      }
      boton.classList.add("active");
      mostrarCatalogo(boton.dataset.filter);
    });
  }
}
/* PÁGINA TIENDA */
if (paginaActual === "tienda") {
  let comprados = [];
  function mostrarLista() {
    let html = "";
    if (comprados.length === 0) {
      html = "<p>Tu carrito está vacío. Presiona Comprar en un libro.</p>";
    }
    for (let i = 0; i < comprados.length; i++) {
      html = html + '<div class="fila-carrito"><span>' + comprados[i] + '</span></div>';
    }
    document.querySelector("#articulosCarrito").innerHTML = html;
  }
  let htmlTienda = "";
  for (let i = 0; i < BOOKS.length; i++) {
    htmlTienda = htmlTienda + crearTarjeta(BOOKS[i], true);
  }
  document.querySelector("#rejillaTienda").innerHTML = htmlTienda;
  mostrarLista();
  let botonesComprar = document.querySelectorAll(".comprar");
  for (let i = 0; i < botonesComprar.length; i++) {
    botonesComprar[i].addEventListener("click", function () {
      comprados.push(BOOKS[i].title);
      mostrarLista();

      Swal.fire({
        icon: "success",
        title: "¡Gracias por tu compra!",
        text: "Compraste: " + BOOKS[i].title,
        confirmButtonColor: "#525871"
      });
    });
  }
  // Botón "Vaciar carrito"
  document.querySelector("#vaciarCarrito").addEventListener("click", function () {
    comprados = []; 
    mostrarLista();
  });
}
/* PÁGINA EVENTOS */
if (paginaActual === "eventos") {
  document.querySelector("#botonConcurso").addEventListener("click", function () {

    // Esta ventana trae un campo para escribir el correo
    Swal.fire({
      title: "Concurso de poesía: Día de Muertos",
      input: "email",
      inputLabel: "Tu correo electrónico",
      confirmButtonText: "Inscribirme",
      confirmButtonColor: "#525871",
      showCancelButton: true
    }).then(function (respuesta) {
      if (respuesta.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "¡Participación registrada!",
          text: "Te escribiremos a " + respuesta.value,
          confirmButtonColor: "#525871"
        });
      }
    });
  });
}
/* FORMULARIO)  */
if (paginaActual === "pub") {
  let formulario = document.querySelector("#formularioManuscrito");
  let mensaje = document.querySelector("#mensajeFormulario");
  let sinopsis = document.querySelector("#sinopsis");
  let obligatorios = formulario.querySelectorAll("[required]");
  function revisarCampo(campo) {
    let esValido = campo.checkValidity();
    if (esValido === true) {
      campo.classList.add("is-valid");  
      campo.classList.remove("is-invalid");
    } else {
      campo.classList.add("is-invalid"); 
      campo.classList.remove("is-valid");
    }
    return esValido;
  }
  sinopsis.addEventListener("input", function () {
    document.querySelector("#contador").textContent = sinopsis.value.length + " / 600";
  });
  for (let i = 0; i < obligatorios.length; i++) {
    obligatorios[i].addEventListener("blur", function () {
      revisarCampo(obligatorios[i]);
    });
  }
  function limpiarColores() {
    for (let i = 0; i < obligatorios.length; i++) {
      obligatorios[i].classList.remove("is-valid", "is-invalid");
    }
  }
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    let todoBien = true;
    for (let i = 0; i < obligatorios.length; i++) {
      if (revisarCampo(obligatorios[i]) === false) {
        todoBien = false; 
      }
    }
    if (todoBien === false) {
      mensaje.className = "alert alert-danger";
      mensaje.textContent = "Revisa los campos marcados en rojo antes de enviar.";
      return; 
    }
    let datos = {
      nombre: document.querySelector("#nombre").value,
      titulo: document.querySelector("#titulo").value,
      genero: document.querySelector("#genero").value
    };
    localStorage.setItem("moonManuscript", JSON.stringify(datos));
    mensaje.className = "alert alert-success";
    mensaje.textContent = "¡Recibimos «" + datos.titulo + "»! Te escribiremos pronto.";

    Swal.fire({
      icon: "success",
      title: "Manuscrito enviado",
      text: "Gracias por confiar en Moon.",
      confirmButtonColor: "#525871"
    });
    formulario.reset(); 
    limpiarColores();
    document.querySelector("#contador").textContent = "0 / 600";
  });
  formulario.addEventListener("reset", function () {
    mensaje.className = "";
    mensaje.textContent = "";
    limpiarColores();
  });
}