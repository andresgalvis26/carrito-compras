const items = document.getElementById("items")
// Con el content se accederá al contenido del template
const templateCard = document.getElementById('template-card').content
// Fragment es como una memoria volatil, se disuelve
const fragment = document.createDocumentFragment()

// Tenemos un addEventListener que va a esperar que se lea todo el HTML
// Y luego ejecute una función
// Esto generalmente recibe la e (evento) - En este caso no se utilizará
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
})

// Consumiendo información del archivo api.json
// Se hará uso del fetch, el cual requiere async - await
const fetchData = async () => {         
    try {
        const respuesta = await fetch("api.json")   // En caso de necesitar consumir de una URL, se coloca allí el enlace.
        const data = await respuesta.json()         // Guardar en data la información - Await o esperate que la variable 'respuesta está en formato JSON
        //console.log(data)                           // Mostrando información en consola (En principio no pasa nada ya que se debe ejecutar el fetchData, se requiere del addEventListener)
        pintarCards(data)
    } catch (error){
        console.log(error)                          // Mostrando el error (si hay) en consola
    }
}

const pintarCards = data => {
    //console.log(templateCard)
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.title
        templateCard.querySelector("p").textContent = producto.precio
        templateCard.querySelector("img").setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector(".btn-dark").dataset.id = producto.id
        //console.log(templateCard)

        // Realizando la clonación del templateCard
        const clone = templateCard.cloneNode(true)
        // Una vez que se tiene el clone fuera del forEach lo pasamos al fragment
        fragment.appendChild(clone)
    })

    // Pasando el fragment al div de 'items'
    items.appendChild(fragment)
}

