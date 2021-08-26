
let page = 1;

$('#IniciarSesion').click(function () {
  localStorage.removeItem('jwt-token');
  $('#myModal').modal('toggle');
});

$('#login').click(function () {
  $('#myModal').modal('toggle');
});

$('#cerrarSesion').click(function () {
  $('#situacionChile').hide();
  $('#iniciarSesion').show();
  $('#cerrarSesion').hide();
  localStorage.clear();
});

// Login de usuario
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

// Obtiene información COVID
const getData = async (url) => {
  try {
    const response = await fetch(url)
    const { data } = await response.json()
    return data

  } catch (err) {
    console.error(`Error: ${err}`)
    sessionClose()
  }
};

var confirmadosM = [];
var fallecidosM = [];
var confirmadosP = [];
var fallecidosP = [];

// Chart Situación Mundial //
let chart = new CanvasJS.Chart("chartContainer", {
  animationEnabled: true,
  theme: "light1",
  title: {
    text: "Situación Mundial Covid-19"
  },
  axisY: {
    title: "Casos Confirmados por miles",
    titleFontColor: "#4F81BC",
    lineColor: "#4F81BC",
    labelFontColor: "#4F81BC",
    tickColor: "#4F81BC",
    labelMaxWidth: 50
  },
  axisY2: {
    title: "Casos Fallecidos por miles",
    titleFontColor: "#C0504E",
    lineColor: "#C0504E",
    labelFontColor: "#C0504E",
    tickColor: "#C0504E"
  },
  toolTip: {
    shared: true
  },
  legend: {
    cursor: "pointer",
    itemclick: toggleDataSeries
  },
  data: [{
    type: "column",
    name: "Casos Confirmados",
    legendText: "Confirmados",
    showInLegend: true,
    yValueFormatString: "#,##0k",
    dataPoints: confirmadosM
  },
  {
    type: "column",
    name: "Casos Fallecidos",
    legendText: "Fallecidos",
    axisYType: "secondary",
    showInLegend: true,
    yValueFormatString: "#,##0k",
    dataPoints: fallecidosM

  }]
});

// Chart Situación por País //
let chart1 = new CanvasJS.Chart("newChartContainer", {
  animationEnabled: true,
  theme: "light1",
  title: {
    text: 'Situación Covid-19 por país'
  },
  axisY: {
    title: "Casos Confirmados por miles",
    titleFontColor: "#4F81BC",
    titleFontSize: 18,
    lineColor: "#4F81BC",
    labelFontColor: "#4F81BC",
    labelFontSize: 12,
    tickColor: "#4F81BC",
    // suffix: "k",
    labelMaxWidth: 50,
  },
  axisY2: {
    title: "Casos Fallecidos por miles",
    titleFontColor: "#C0504E",
    titleFontSize: 18,
    lineColor: "#C0504E",
    labelFontColor: "#C0504E",
    labelFontSize: 12,
    // suffix: "k",
    tickColor: "#C0504E"
  },
  toolTip: {
    shared: true
  },
  legend: {
    cursor: "pointer",
    itemclick: toggleDataSeries
  },
  data: [{
    type: "column",
    name: "Casos Confirmados",
    legendText: "Confirmados",
    showInLegend: true,
    yValueFormatString: "#,##0k",
    dataPoints: confirmadosP
  },
  {
    type: "column",
    name: "Casos Fallecidos",
    legendText: "Fallecidos",
    showInLegend: true,
    yValueFormatString: "#,##0k",
    axisYType: "secondary",
    dataPoints: fallecidosP

  }]
});


// Información de la serie de gráficos
function toggleDataSeries(e) {
  if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
    e.dataSeries.visible = false;
  }
  else {
    e.dataSeries.visible = true;
  }
  chart.render();
};

//  Llenado de los datos para el gráfico mundial
const fillData = (data) => {
  let covidData = data.filter(p => p.confirmed > 5000000);
  for (let i = 0; i < covidData.length; i++) {
    confirmadosM.push({
      label: covidData[i].location,
      y: covidData[i].confirmed / 1000
    });
    fallecidosM.push({
      label: covidData[i].location,
      y: covidData[i].deaths / 1000
    });
  }
  chart.render();
};


// Muestra tabla con información COVID de todos los paises 
const showTable = (covidData) => {
  if (covidData) {
    let tabla = document.getElementById("tableData");
    tabla.innerHTML = `
    <thead class="thead-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">País</th>
          <th scope="col">Confirmados</th>
          <th scope="col">Fallecidos</th>
          <th scope="col">Recuperados</th>
          <th scope="col">Activos</th>
          <th scope="col">Detalle</th>
        </tr>
      </thead>
      <tbody>
        <tr>
    `
    for (var i = 0; i < covidData.length; i++) {
      tabla.innerHTML += `
        <tr>
          <th scope='row'>${i + 1}</th>
          <td>${covidData[i].location}</td>
          <td >${covidData[i].confirmed}</td>
          <td >${covidData[i].deaths}</td>
          <td >${covidData[i].recovered}</td>
          <td >${covidData[i].active}</td>
          <td><button type="button" onclick="mostrarDetalle('${covidData[i].location}')" class="btn btn-warning btn-sm">Ver detalle</button></td>
      `
    }
  }
};

const init = async () => {
  let token = localStorage.getItem('jwt-token');
  if (token) {
    $('#situacionChile').show();
    $('#iniciarSesion').hide();
    $('#cerrarSesion').show();
  }
  let url = 'http://localhost:3000/api/total'
  const data = await getData(url);
  fillData(data);
  showTable(data);
  toggleFormAndTable(false, true)
}
init();

//login de usuario
$('#js-form').submit(async (event) => {
  event.preventDefault()
  const email = document.getElementById('js-input-email').value
  const password = document.getElementById('js-input-password').value
  const JWT = await postData(email, password);
  if (JWT) {
    $('#situacionChile').show();
    $('#iniciarSesion').hide();
    $('#cerrarSesion').show();
  }
  else {
    let msg = document.querySelector('#message');
    msg.innerHTML =
      `<div class="mt-5 alert alert-danger alert-dismissible text-center fade show" role="alert" id="alertInfo" >
                        <strong>Usuario o contraseña erróneos</strong>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Cerrar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
    window.setTimeout(function () {
      $("#alertInfo").alert('close');
    }, 3000);
  }

})

// Cierre de sesión
const sessionClose = () => {
  localStorage.clear();
  const btn = document.getElementById("showMore");
  if (btn) {
    const padre = btn.parentNode;
    padre.removeChild(btn);
  }
  window.location.reload();
}

// Muestra u oculta Gráfico y Tabla
const toggleFormAndTable = (state1, state2) => {
  $(`#js-container`).toggle(state1)
  $(`#chartContainer`).toggle(state2)
}

// Muestra gráfico por país
const mostrarDetalle = (async (country) => {
  let countryData = "";
  for (let i = confirmadosP.length; i > 0; i--) {
    confirmadosP.pop();
  }
  for (let i = fallecidosP.length; i > 0; i--) {
    fallecidosP.pop();
  }
  let url = `http://localhost:3000/api/countries/${country}`;
  countryData = await getData(url);

  if (Object.keys(countryData).length > 0) {
    confirmadosP.push({
      label: countryData.location,
      y: countryData.confirmed / 1000
    });
    fallecidosP.push({
      label: countryData.location,
      y: countryData.deaths / 1000
    });
    chart1.render();
    $('#loadMe').modal('toggle');
  }
  else {
    let msg = document.querySelector('#showInfo');
    msg.innerHTML =
      `
      <div class="modal fade" id="showMe" tabindex="-1" aria-labelledby="loadMeLabel">
        <div class="modal-dialog modal-sm" role="document">
          <div class="modal-content" style="height: 100px; width: 400px;">
            <div class="modal-body text-center">
            <strong>No existe información para mostrar</strong>
            </div>
          </div>
        </div>
      </div>`;

    $('#showMe').modal('toggle');

    window.setTimeout(function () {
      $("#showMe").modal('toggle');
    }, 3000);
  }

});