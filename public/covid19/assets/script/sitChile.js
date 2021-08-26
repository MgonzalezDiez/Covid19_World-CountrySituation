
var confirmed = [];
var deaths = [];
var recovered = [];

// Obtiene la información desde la API para el llenado de los datos COVID en Chile
const getData = async (jwt) => {
	const baseUrl = 'http://localhost:3000/api/';

	const request = async (url) => {
		const results = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${jwt}`
			}
		});
		const response = await results.json();
		return response;
	}

	const resConfirmed = async () => {
		const url = baseUrl + 'confirmed';
		return request(url)
	}

	const resDeaths = async () => {
		const url = baseUrl + 'deaths';
		return request(url)
	}

	const resRecovered = async () => {
		const url = baseUrl + 'recovered';
		return request(url)
	}

	Promise.all([resRecovered(), resDeaths(), resConfirmed()])
		.then(response => {
			if (response[0].message === 'Not Found') {
				alert('No existen datos a mostrar');
				return
			}
			fillData(response);
			$('#loader').fadeOut('slow');
		})
		.catch(err => console.error(`Error: ${err}`));
	//return { confirmed, deaths, recovered }
};

//  Llena datos para el gráfico
const fillData = async (resp) => {
	for (let i = 0; i < resp[0].data.length; i++) {
		let day1 = new Date(resp[0].data[i].date).getDate();
		let month1 = new Date(resp[0].data[i].date).getMonth() + 1;
		let year1 = new Date(resp[0].data[i].date).getFullYear();

		confirmed.push({
			label: day1 + '/' + month1 + '/' + year1,
			y: resp[2].data[i].total / 1000
		});
		deaths.push({
			label: day1 + '/' + month1 + '/' + year1,
			y: resp[1].data[i].total / 1000
		});
		recovered.push({
			label: day1 + '/' + month1 + '/' + year1,
			y: resp[0].data[i].total / 1000
		});
	}
	ChileSituation.render();
};


// Obtiene la información para llenar el gráfico
// const getChileanData = async (jwt) => {
//   try {

// const resConfirmed = await fetch('http://localhost:3000/api/confirmed',
//   {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${jwt}`
//     }
//   });
// confirmed = await resConfirmed.json();
// const resDeaths = await fetch('http://localhost:3000/api/deaths',
//   {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${jwt}`
//     }
//   });
// deaths = await resDeaths.json();
// const resRecovered = await fetch('http://localhost:3000/api/recovered',
//   {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${jwt}`
//     }
//   });
// recovered = await resRecovered.json();

// Promise.all([resConfirmed(), resDeaths(), resRecovered()])
// 	.then(response => {
// 		if (response[0].message === 'Not Found'){

// 		}
// 	})
//  .catch (err => console.error(`Error: ${err}`))

// 	sessionClose()
// return { confirmed, deaths, recovered }

// } catch (err) {
//   console.error(`Error: ${err}`)
//   sessionClose()
// }
// };



// Gráfico que muestra la situación Covid en Chile
var ChileSituation = new CanvasJS.Chart("chartChile", {
	title: {
		text: "Chile - Situación Covid-19"
	},
	axisX: {
		valueFormatString: "MMM YYYY",
		labelFontSize: 10,
	},

	axisY: [{
			title: "Recuperados (Miles)",
			lineColor: "#006400 ;",
			tickColor: "#006400 ",
			labelFontColor: "#006400 ",
			labelFontSize: 14,
			titleFontColor: "#006400 ",
			titleFontSize: 18,
			includeZero: true,
			suffix: "k"
		},
		{
			title: "Confirmados (Miles)",
			lineColor: "#4F81BC",
			tickColor: "#4F81BC",
			labelFontColor: "#4F81BC",
			labelFontSize: 14,
			titleFontColor: "#4F81BC",
			titleFontSize: 18,
			includeZero: true,
			suffix: "k"
		}],
	axisY2: {
		title: "Fallecidos (Miles)",
		lineColor: "#C0504E",
		tickColor: "#C0504E",
		labelFontColor: "#C0504E",
		labelFontSize: 14,
		titleFontColor: "#C0504E",
		titleFontSize: 18,
		includeZero: true,
		suffix: "k"
	},
	toolTip: {
		shared: true
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "bottom",
		horizontalAlign: "center",
		dockInsidePlotArea: false,
		itemclick: toggleDataSeries
	},
	data: [
		{
			type: "line",
			name: "Confirmados",
			color: "#4F81BC",
			showInLegend: true,
			axisYIndex: 1,
			markerType: "square",
			markerSize: 1,
			yValueFormatString: "#,##0k",
			dataPoints: confirmed
		},
		{
			type: "line",
			name: "Recuperados",
			color: "#006400 ",
			showInLegend: true,
			markerSize: 0,
			yValueFormatString: "#,##0k",
			dataPoints: recovered
		}
		,
		{
			type: "line",
			name: "Fallecidos",
			color: "#C0504E",
			axisYType: "secondary",
			showInLegend: true,
			markerType: "square",
			markerSize: 1,
			yValueFormatString: "#,##0k",
			dataPoints: deaths
		}]
});
ChileSituation.render();

// Función que muestra los datos del gráfico
function toggleDataSeries(e) {
	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else {
		e.dataSeries.visible = true;
	}
	ChileSituation.render();
};

// Llena datos de gráfico
// const fillData = () => {
//   for (let i = 0; i < confirmed.data.length; i++) {
// 		let day1 = new Date(confirmed.data[i].date).getDate();
// 		let month1 = new Date(confirmed.data[i].date).getMonth()+1;
// 		let year1 = new Date(confirmed.data[i].date).getFullYear();

//     confirmed.push({

//       label: day1+'/'+month1+'/'+year1,
//       y: confirmed.data[i].total / 1000
//     });
//     deaths.push({
//       label: day1+'/'+month1+'/'+year1,
//       y: deaths.data[i].total / 1000
//     });
// 		recovered.push({
//       label: day1+'/'+month1+'/'+year1,
//       y: recovered.data[i].total / 1000
//     });
//   }
//   situacionChile.render();
// };

// Función inicial que valida o carga los datos del gráfico de la situación de Chile
var sitChile = async () => {
	const token = localStorage.getItem('jwt-token');
	if (token) {
		$('#loader').html('<div ><img src="./assets/imgs/Spinner2.gif" alt="loading" /><br/>Un momento, por favor...</div>');
		let w = await getData(token);
	}
	else {
		window.location.href = "./index.html"
	}

};
sitChile();

