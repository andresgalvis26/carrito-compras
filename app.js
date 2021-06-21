// Guardando los id o elementos
const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
// Con el content se accederá al contenido del template
const templateCard = document.getElementById('template-card').content
// Fragment es como una memoria volatil, se disuelve
const fragment = document.createDocumentFragment()
// Creando el objeto carrito
let carrito = {}
// Creando el templateFooter
const templateFooter = document.getElementById("template-footer").content
// Creando el templateCarrito
const templateCarrito = document.getElementById("template-carrito").content

// Tenemos un addEventListener que va a esperar que se lea todo el HTML
// Y luego ejecute una función
// Esto generalmente recibe la e (evento) - En este caso no se utilizará
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    // Retomando el contenido alojado en el LocalStorage
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"))   // El contenido en el LocalStorage es plano, por lo que, es necesario parsearlo a JSON.
        pintarCarrito()
    }
})

// Todos nuestros objetos están en el div id: cards
// Por lo tanto, tomammos este objeto y le añadimos el addEventListener y detecte el click
// El e sirve para capturar el elemento a modificar
cards.addEventListener("click", e => {
    addCarrito(e)
})

// addEventListener del objeto items
items.addEventListener("click", e => {
    btnAccion(e)
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

    // Pasando el fragment al div de 'cards'
    cards.appendChild(fragment)
}

// Ahora se estarán capturando los elementos u objetos que se visualizan en pantalla
const addCarrito = e => {
    //console.log(e.target)
    /*
    Esto devuelve un true o false -> Si dentro de los elementos que tenemos hay uno que contenga la clase 'btn-dark'
    console.log(e.target.classList.contains("btn-dark"))
    */
    if(e.target.classList.contains("btn-dark")){
        //e.target.parentElement -> Traer todo el div con la información - Acceder a toda la información del objeto
        setCarrito(e.target.parentElement)
    }

    // Se utiliza para evitar la herencia del objeto padre al oprimir sobre un objeto
    // Cuando se oprime un objeto hijo, este llama a todos los nodos u objetos por encima suyo
    // Con el stopPropagation es algo que se evita
    e.stopPropagation()
}

// Recibiendo y construyendo el objeto
const setCarrito = objeto => {
    //console.log(objeto)
    const producto = {
        id: objeto.querySelector(".btn-dark").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        // Al incrementar la cantidad, no se quiere pintar el objeto de nuevo, solo incrementar ++ su cantidad.
        cantidad: 1
    }

    // Si en el carrito existe YA un producto con tal id, aumentar la cantidad de este
    if(carrito.hasOwnProperty(producto.id)){
        // Carrito son todos los elementos, se accede al producto que se está repitiendo por 'producto.id'
        // Y su cantidad se incrementa en +1
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    // Con los ... se está haciendo una COPIA de producto
    carrito[producto.id] = {...producto}
    pintarCarrito()

    //console.log(carrito)
}

// Pintando los elementos que se añaden al carrito en el documento HTML
const pintarCarrito = () => {
    console.log(carrito)
    items.innerHTML = "" // Para limpiar el HTML y no repetir los objetos
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector("th").textContent = producto.id
        templateCarrito.querySelectorAll("td")[0].textContent = producto.title
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    pintarFooter()

    // Primero va el key o item, luego JSON.stringify para guardar el contenido en texto plano
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ""
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return  // Con este return hacemos que se salga de toda la función y no la sigue leyendo hacia abajo
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad ,0) // Acc = Acumulador.                 acc + cantidad
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)                    // acc + cantidad * precio

    templateFooter.querySelectorAll("td")[0].textContent = nCantidad
    templateFooter.querySelectorAll("td")[2].textContent = nPrecio
    //templateFooter.querySelector

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById("vaciar-carrito")
    btnVaciar.addEventListener("click", () => {
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = e => {
    //console.log(e.target)
    if(e.target.classList.contains("btn-info")){
        //carrito[e.target.dataset.id]
        //console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]   // Almacenar en la variable producto el objeto que tenga ese id
        //producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}    // Copia del producto
        pintarCarrito()                                 // Visualizar actualizado nuestro carrito
    }

    if(e.target.classList.contains("btn-danger")){
        const producto = carrito[e.target.dataset.id]   // Almacenar en la variable producto el objeto que tenga ese id
        //producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()      
    }

    e.stopPropagation()
}





