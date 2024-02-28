const rutaFetch = 'http://localhost:8080/api/productos/'
const qryFetch = {
    limite: 10,
    pagina: 1,
    orden: false
}
const stringFetch = rutaFetch

prepareFront()

getProducts('')

document.getElementById('applyFilter').addEventListener('click', setFilters)

function getProducts(filtros) {
    fetch(rutaFetch + filtros)
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            const targetDOM = document.getElementById('contenedorProductos')
            targetDOM.addEventListener('click', addProduct)
            targetDOM.innerHTML = ''
            for (el of data.payload) {
                const newElement = document.createElement('tr')
                newElement.innerHTML = `
                <th scope="row">${el.title}</th>
                <td>${el.description}</td>
                <td>${el.category}</td>
                <td style="text-align: right">${el.price}</td>
                <td style="text-align: right">${el.stock}</td>
                <td style="text-align: center">
                <button type="button" class="btn btn-success" id="${el._id}">add</button>
                </td>
                `
                targetDOM.appendChild(newElement)
            }

            let opcionesPaginacion = {
                page: data.page,
                totalPages: data.totalPages,
                hasNextPage: data.hasNextPage,
                hasPrevPage: data.hasPrevPage,
                nextPage: data.nextPage,
                prevPage: data.prevPage,
                prevLink: data.prevLink,
                nextLink: data.nextLink
            }
            console.log(opcionesPaginacion)
            navSetup(opcionesPaginacion)

        })
}

window.addEventListener('load', async () => {
    const response = await fetch('/api/users/current')
    if (response.status !== 200) {
      alert('necesitas loguearte para ver esta info!')
      return (window.location.href = '/login')
    }
  
    const result = await response.json()
    const user = result.payload
  
    Swal.fire({
        title: "Sesion iniciada!",
        icon: "success",
        color: "write",
        text: `Hola, ${user.first_name} ${user.last_name} `
      });
  })




async function navSetup(opcionesPaginacion) {
    const { page, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage, prevLink, nextLink } = await opcionesPaginacion
    const targetDOM = document.getElementById('navBar')
    targetDOM.addEventListener('click', pageMove)
    targetDOM.innerHTML = ''
    let contentDOM
    // PrevPage
    const prevPageDisabled = (hasPrevPage) ? { status: '', goto: 'm' + prevPage } : { status: 'disabled', goto: 'none' }
    const nextPageDisabled = (hasNextPage) ? { status: '', goto: 'm' + nextPage } : { status: 'disabled', goto: 'none' }
    contentDOM = `<li class="page-item ${prevPageDisabled.status}">
                 <a class="page-link" href='#' id=${prevPageDisabled.goto}>Anterior</a>
                 </li>
                 `
    targetDOM.innerHTML += contentDOM
    for (i = 1; i <= totalPages; i++) {
        const actualPage = (page === i) ? 'active' : ''
        const id = 'p' + i
        contentDOM = `
        <li class="page-item"> <a class="page-link ${actualPage}" href="#" id='${id}' name='pageRef'>${i}</a></li>
        `
        targetDOM.innerHTML += contentDOM
    }
    contentDOM = `<li class="page-item ${nextPageDisabled.status}">
    <a class="page-link" href='#' id=${nextPageDisabled.goto}>Siguiente</a>
    </li>
    `
    targetDOM.innerHTML += contentDOM

}

function pageMove(e) {
    const pagina = e.target.id.substring(1)
    if (pagina) {
        setFilters(e, pagina)
    }
}

function prepareFront() {
    fetch('http://localhost:8080/api/productos/cat/')
        .then(resp => resp.json())
        .then(data => {
            const targetCombo = document.getElementById('comboCategorias')
            targetCombo.innerHTML = ''
            const defaultOption = document.createElement('option')
            defaultOption.value = ''; defaultOption.text = ''; defaultOption.selected = true; defaultOption.disable = true; defaultOption.hidden = true
            targetCombo.append(defaultOption)
            for (el of data) {
                const newOption = document.createElement('option')
                newOption.value = el._id
                newOption.text = el._id
                targetCombo.append(newOption)
            }
        })
    const comboPages = document.getElementById('comboPages')
    comboPages.innerHTML = ''
    const optionPages = document.createElement('option')
    optionPages.value = ''; optionPages.text = ''; optionPages.selected = true; optionPages.disable = true; optionPages.hidden = true
    comboPages.append(optionPages)
    const optionPages1 = document.createElement('option'); optionPages1.value = 3; optionPages1.text = 3
    comboPages.append(optionPages1)
    const optionPages2 = document.createElement('option'); optionPages2.value = 5; optionPages2.text = 5
    comboPages.append(optionPages2)
    const optionPages3 = document.createElement('option'); optionPages3.value = 10; optionPages3.text = 10
    comboPages.append(optionPages3)

    const comboSort = document.getElementById('comboOrden')
    comboSort.innerHTML = ''
    const optionSort = document.createElement('option')
    optionSort.value = ''; optionSort.text = ''; optionSort.selected = true; optionSort.disable = true; optionSort.hidden = true
    comboSort.append(optionSort)
    const optionSort1 = document.createElement('option')
    optionSort1.value = 'asc'; optionSort1.text = 'Ascendente'
    comboSort.append(optionSort1)
    const optionSort2 = document.createElement('option')
    optionSort2.value = 'desc'; optionSort2.text = 'Descendente'
    comboSort.append(optionSort2)

}

function setFilters(e, page) {
    if (!page) page = 1
    const pagesPerViewDOM = document.getElementById('comboPages')
    const pagesPerView = pagesPerViewDOM.options[pagesPerViewDOM.selectedIndex].text
    const categoryPerViewDOM = document.getElementById('comboCategorias')
    const categoryPerView = categoryPerViewDOM.options[categoryPerViewDOM.selectedIndex].text
    const orderPerViewDOM = document.getElementById('comboOrden')
    const orderPerView = orderPerViewDOM.options[orderPerViewDOM.selectedIndex].value
    const validaFiltro = (pagesPerView || categoryPerView || orderPerView || page) ? '?' : false
    const optFiltro = []
    if (validaFiltro) {
        if (pagesPerView) { optFiltro.push(`itemsPorPagina=${pagesPerView}`) }
        if (orderPerView) { optFiltro.push(`order=${orderPerView}`) }
        if (categoryPerView) { optFiltro.push(`filtro=${categoryPerView}`) }
        if (page) { optFiltro.push(`pagina=${page}`) }
    }
    const strFiltro = '?' + optFiltro.join('&')
    console.log(strFiltro)
    getProducts(strFiltro)

}

function addProduct(e) {
    const idProducto = e.target.id
    const activeCart = JSON.parse(localStorage.getItem('carrito'))
    if (!idProducto) { return }
    if (!activeCart) { return alert('No hay carrito seleccionado') }
    const rutaFetchPut = `http://localhost:8080/api/carts/${activeCart}/add/${idProducto}` // /:cid/add/:pid
    fetch (rutaFetchPut, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then (resp => resp.json())
    .then (data => {
        console.log(data)
        if (data.message === 'Producto Agregado') {
            Swal.fire({
                title: "Producto agregado!",
                icon: "success",
                color: "write"
              });
        } else if (data.message === 'Producto Actualizado') {
            Swal.fire({
                title: "Producto actualizado!",
                icon: "success",
                color: "write"
              });
        }
    })

}

const buttonLogout = document.getElementById('logout')

buttonLogout?.addEventListener('click', async event => {
  event.preventDefault()

  // @ts-ignore
  //const formDataEncoded = new URLSearchParams(new FormData(formLogin))

  try {
    const res = await fetch(
      'http://localhost:8080/api/sessions/current',
      {
        method: 'DELETE',
      },
    )

    // Verificar si la solicitud fue exitosa (código de respuesta 2xx)
    if (res.ok) {
      // Redirigir a la nueva página
      window.location.href = '/login'
    } else {
      // Manejar otros casos si es necesario
      console.log('La solicitud no fue exitosa. Código de respuesta:', res.status)
    }

  } catch (err) {
    console.log(err.message)
  }
})