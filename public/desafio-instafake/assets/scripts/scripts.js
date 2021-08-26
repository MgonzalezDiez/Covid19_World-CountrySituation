
let page = 1;

const postData = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/api/login',
      {
        method: 'POST',
        body: JSON.stringify({ email: email, password: password })
      })
    const { token } = await response.json()
    localStorage.setItem('jwt-token', token)
    return token
  } catch (err) {
    console.error(`Error: ${err}`)
  }
}

const getPhotos = async (jwt, page) => {
  try {
    const response = await fetch(`http://localhost:3000/api/photos?page=${page}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
    const { data } = await response.json()
    return data;

    // if (data) {
    //   const container = document.getElementById('js-container')
    //   const div = document.createElement("div");
    //   container.appendChild(div);
    //   const form_photos = document.getElementById('js-form-photos')
    //   if(!form_photos){
    //     div.innerHTML = `
    //     <form id="js-form-photos">
    //       <div class="mt-5 mb-1">
    //         <label class="mb-4">FEED</label>
    //         <button type="button" onclick="sessionClose()" class="btn btn-primary btn-sm float-right">Cerrar</button>
    //       </div>
    //     </form>`
    //   }
    //   const form = document.getElementById("js-form-photos");
    //   const newDiv = document.createElement("div");
    //   form.appendChild(newDiv);
    //   data.forEach(e => {
    //     form.innerHTML += `
    //       <div class="card mb-4">
    //         <img src="${e.download_url}"  /> 
    //         <div class="card-body">
    //           <p class="card-title" style="font-weight:500"> Autor: ${e.author}</p>
    //         </div>
    //       </div>
    //       `
    //   });
    //   form.innerHTML += `
    //   </form>
    //   <button id="showMore" type="button" onclick="viewMorePages()" class="btn btn-primary btn-sm float-left">Mostrar Más</button>
    //   `
    //   toggleFormAndTable(false, true)
    // }
  } catch (err) {
    console.error(`Error: ${err}`)
    sessionClose()
  }
}

const showPhotos = (data) => {
  if (data) {
    const container = document.getElementById('js-container')
    const div = document.createElement("div");
    container.appendChild(div);
    const form_photos = document.getElementById('js-form-photos')
    if(!form_photos){
      div.innerHTML = `
      <form id="js-form-photos">
        <div class="mt-5 mb-1">
          <label class="mb-4">FEED</label>
          <button type="button" onclick="sessionClose()" class="btn btn-primary btn-sm float-right">Cerrar</button>
        </div>
      </form>`
    }
    const form = document.getElementById("js-form-photos");
    const newDiv = document.createElement("div");
    form.appendChild(newDiv);
    data.forEach(e => {
      form.innerHTML += `
        <div class="card mb-4">
          <img src="${e.download_url}"  /> 
          <div class="card-body">
            <p class="card-title" style="font-weight:500"> Autor: ${e.author}</p>
          </div>
        </div>
        `
    });
    form.innerHTML += `
    </form>
    <button id="showMore" type="button" onclick="viewMorePages()" class="btn btn-primary btn-sm float-left mb-5">Mostrar Más</button>
    `
    toggleFormAndTable(false, true)
  }
}

const init = async () => {
  const token = localStorage.getItem('jwt-token')
  if (token) {
    // $('#loadMe').modal('toggle');
    const photos = await getPhotos(token, page);
    showPhotos(photos);
    // $('#loadMe').modal('toggle');
  }
}
init()

$('#js-form').submit(async (event) => {
  event.preventDefault()
  const email = document.getElementById('js-input-email').value
  const password = document.getElementById('js-input-password').value
  const JWT = await postData(email, password)
  $('#loadMe').modal('toggle');
  const photos = await getPhotos(JWT, page);
  showPhotos(photos);
  $('#loadMe').modal('toggle');
})

const toggleFormAndTable = (state1, state2) => {
  $(`#js-form`).toggle(state1)
  $(`#js-photos`).toggle(state2)
}

const sessionClose = () => {
  localStorage.clear();
  const btn = document.getElementById("showMore");
  if(btn){
    const padre = btn.parentNode;
    padre.removeChild(btn);
  }
  window.location.reload();
}

const viewMorePages = async () => {
  page++;
  //$('#loadMe').modal('toggle');

  const token = localStorage.getItem('jwt-token')
  const btn = document.getElementById("showMore");
  const padre = btn.parentNode;
  padre.removeChild(btn);
  toggleFormAndTable(false, false)
  const photos = await getPhotos(token, page);
  showPhotos(photos);
  //$('#loadMe').modal('toggle');
}