
var confirmed = [];
var deaths = [];
var recovered = [];

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
		const url = baseUrl+'confirmed';
		return request(url)
	}

	const resDeaths = async () => {
		const url = baseUrl+'deaths';
		return request(url)
	}

	const resRecovered = async () => {
		const url = baseUrl+'recovered';
		return request(url)
	}

	Promise.all([ resRecovered(), resDeaths(), resConfirmed()])
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
//  Llena datos para el gráfico
const fillData = async (resp) => {
	for (let i = 0; i < resp[0].data.length; i++) {
		let day1 = new Date(resp[0].data[i].date).getDate();
		let month1 = new Date(resp[0].data[i].date).getMonth() + 1;
		let year1 = new Date(resp[0].data[i].date).getFullYear();

		confirmed.push({
			label: day1 + '/' + month1 + '/' + year1,
			y: resp[0].data[i].total / 1000
		});
		deaths.push({
			label: day1 + '/' + month1 + '/' + year1,
			y: resp[1].data[i].total/ 1000
		});
		recovered.push({
			label: day1 + '/' + month1 + '/' + year1,
			y: resp[2].data[i].total / 1000
		});
	}
	ChileSituation.render();
};

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
		title: "Confirmados (Miles)",
		lineColor: "#369EAD",
		tickColor: "#369EAD",
		labelFontColor: "#369EAD",
		labelFontSize: 14,
		titleFontColor: "#369EAD",
		titleFontSize: 18,
		includeZero: true,
		suffix: "k"
	},
	{
		title: "Fallecidos (Miles)",
		lineColor: "#C24642",
		tickColor: "#C24642",
		labelFontColor: "#C24642",
		labelFontSize: 14,
		titleFontColor: "#C24642",
		titleFontSize: 18,
		includeZero: true,
		suffix: "k"
	}],
	axisY2: {
		title: "Recuperados (Miles)",
		lineColor: "#7F6084",
		tickColor: "#7F6084",
		labelFontColor: "#7F6084",
		labelFontSize: 14,
		titleFontColor: "#7F6084",
		titleFontSize: 18,
		includeZero: true,
		suffix: "k"
	},
	toolTip: {
		shared: true
	},
	legend: {
		cursor: "pointer",
		// verticalAlign: "top",
		// horizontalAlign: "center",
		// dockInsidePlotArea: true,
		itemclick: toggleDataSeries
	},
	data: [{
		type: "line",
		name: "Fallecidos",
		color: "#C24642",
		showInLegend: true,
		axisYIndex: 1,
		markerType: "square",
		markerSize: 1,
		yValueFormatString: "#,##0k",
		dataPoints: deaths
	},
	{
		type: "line",
		name: "Confirmados",
		color: "#369EAD",
		showInLegend: true,
		axisYIndex: 0,
		markerType: "square",
		markerSize: 1,
		yValueFormatString: "#,##0k",
		dataPoints: confirmed
	},
	{
		type: "line",
		name: "Recuperados",
		color: "#7F6084",
		axisYType: "secondary",
		showInLegend: true,
		markerSize: 1,
		yValueFormatString: "#,##0k",
		dataPoints: recovered
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
	situacionChile.render();
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
		// let a = await getChileanData(token);
		// let b = await fillData();
		let w = await getData(token);
		
		// $('#loader').fadeOut('slow');
	}
	else {
		window.location.href = "./index.html"
	}

};
sitChile();

