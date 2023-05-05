# consumo_API

Para el bootcamp "Consumo de una API"
<p>El cliente nos está requiriendo crear una página para reflejar la información almacenada en una API</p>
<p>Desarrollador web y web móvil</p>
<a href="https://github.com/public-apis/public-apis">Respositorio de API's</a>

<h3>Contexto del proyecto:</h3>

    - Desarrollar una página web con HTML, CSS, Javascript
    - Consumir una API externa
    - Mostrar los datos en tarjetas, tablas, etc
    - Estar documentada con su respectivo README
    - Utilizar Bootstrap o una librería de diseño

<h3>Extra:</h3>

    - La sección está hecha con paginación<
    - Ver el detalles de un solo elemento
    - Filtrar la información traída por la API
    - Hacer Deploy en Github
    - Consumir N APIs
    - Crear un Json y consumir la información
    - Validar con alguna función de Javascript el funcionamiento de la página (test)
    - Consumir una API securizada (usuario y contraseña y token)

<h3>Entregables</h3>

    - Figma (opcional)
    - Link de github
    - En caso de hacerlo, enviar el Link del Deploy


<div> 
<h3>Solución:</h3>

Desarrollar una solución/herrameienta en la que podamos ser guiados en una ruta de visita por las distintas capitales de provincia y sus comunidades, usaremos:
- Tres archivos JSON:
  - Comunidades autonomas: lista de comunidades
  - Provincias: lista de provincias
  - Poblaciones: lista de poblaciones
- chat GPT: para la selección de los lugares
- Google Maps: para mostrar los resultados
<p style = 'text-align:center;'>
Un UML de actividad básico sería:
</p>


```mermaid
graph TD;
    A(Inicio)-->B(Seleccionar Comunidad Autónoma)-->C(Seleccionar provincia)-->D(Seleccionar localidad);
    D-->E(Número de itinerarios);
    E-->F(Mostrar itinerario);
    F-->A;
    F-->G(Leer QR);
    F-->H(Crear imagen);
```


Tambien como solución para ver detalles, tras mostrar por pantalla la ruta con los lugares elegidos, se generará un ccódigo QR el cual enlazara con la app de Google Maps de nuestro SmartPhone.
Tambien el resultado se podra descargar como imagen independiente con la lista de lugares, código qr y ruta en el mapa de Google.
Para la creación del QR y de la imagen, se usan las librerias de JS
    
- QRCode.js
- html2canvas.js


<a href="https://juancmacias.github.io/consumo_API/">Despliege de la solución</a>


<p style = 'text-align:center;'>
<img src="img/jcms760.png" width="100%">
</p>
</div>

# Desarrollador:

<a href="https://github.com/juancmacias">
    <img src="https://avatars.githubusercontent.com/u/53483587?v=4" title="Juan Carlos Macías" width="80" height="80" style="max-width: 100%;">
</a>

# Tecnología usada:
<p style = 'text-align:left;'>
<img style="height: 70px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png">
<img style="height: 70px;" src="https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg">
<img style="height: 70px;" src="https://upload.wikimedia.org/wikipedia/commons/f/fd/JQuery-Logo.svg">
<img style="height: 70px;" src="https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg">

</p>






