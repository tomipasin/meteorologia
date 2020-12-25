function global() {
    //se for usar o node tenho que importar o fetch e depois atribuo ele a uma const chamada
    //fetch.
    //const fetch = require("node-fetch");


    const temperaturaAgora = document.querySelector('.temperaturaAgora');
    const data = document.querySelector('.data');

    let insert = document.querySelector('#inputGroupSelect04');
    let estacao = document.querySelector('.custom-select').value;

  

    insert.addEventListener('change', function () {
        estacao = insert.value;
        console.log(estacao)
        atualiza()
    })



    //crio uma função que atualiza a meteorologia:
    function atualiza() {
        //dou um fecth na API de weather.com e peço os dados da estação IPARA21 no formato JSON, unidades métricas e números com casas deciamis. 
        fetch(`https://api.weather.com/v2/pws/observations/current?stationId=${estacao}&format=json&units=m&apiKey=7df6c3652f1a45ddb6c3652f1a45dd6a&numericPrecision=decimal`)
            //o fetch retorna uma promise, então tenho que usar o then.
            //neste caso uso uma arrow com o parâmetro de resolve e informo que o resultado 
            //está em json.
            .then(resolve => resolve.json())
            //mais um then agora pra trabalhar os dados do JSON.
            .then(resolve => {
                //a primeira coisa é capturar os dados que eu quero usar. 
                //o JSON retorna um array com um objeto dentro, então 
                //tenho que buscar dentro desse array a posição zero, que é
                //o meu objeto com os dados da meteorologia.
                const obj = resolve.observations[0];
                //feito isso o 1º dado é a data, que está em padrão americano.
                let obsTimeLocal = (obj.obsTimeLocal);
                //pra converter uso uma regex capturando os grupos de caracteres
                let regex = /([\d][\d][\d][\d])([-])([\d][\d])([-])([\d][\d])\s([\d][\d])([:])([\d][\d])([:])([\d][\d])/g;
                //e depois uso um replace pra colocar eles na ordem que eu quero.
                let horaBR = obsTimeLocal.replace(regex, '$5/$3/$1 - $6:$8h');
                //a cidade
                let local = obj.neighborhood;
                //coordenadas
                let lon = obj.lon;
                let lat = obj.lat;
                //dados de humidade relativa do ar
                let humidity = obj.humidity;
                //e direção do vento em graus.
                let winddir = obj.winddir;
                //daí faço uma condicinoal pra dar a direção.
                let winddirRV = 'indef';
                //aqui como 60 é menor que 300 eu uso || ou
                if (winddir > 300 || winddir < 60) {
                    winddirRV = 'Norte';
                }
                //e aqui como não tenho a particularidade acima uso e &&. 
                if (winddir >= 60 && winddir < 140) {
                    winddirRV = 'Leste';
                }
                if (winddir >= 140 && winddir < 240) {
                    winddirRV = 'Sul';
                }
                if (winddir >= 240 && winddir < 300) {
                    winddirRV = 'Oeste';
                };
                //temperatura
                let temp = obj.metric.temp;
                //velocidade do vento
                let windSpeed = obj.metric.windSpeed;
                //rajada
                let windGust = obj.metric.windGust;
                //pressão atmosférica
                let pressure = obj.metric.pressure;
                //precipitação nas últimas 24h
                let precipTotal = obj.metric.precipTotal;
                let degree = '\&#176';

                console.log(`Atualizado em ${horaBR}`)
                console.log(`Temperatura: ${temp}ºC`);
                console.log(`Humidade: ${humidity}%`);
                console.log(`Pressão Atmosférica: ${pressure} hpa`);
                console.log(`Direção do Vento: ${winddir}º - ${winddirRV}`);
                console.log(`Velocidade do Vento: ${windSpeed} km/h`);
                console.log(`Rajada de Vento: ${windGust} km/h`);
                console.log(`Precipitação 24h: ${precipTotal} mm`);

                temperaturaAgora.innerHTML = `${temp}${degree}`;
                data.innerHTML = `Atualizado em ${horaBR}`


                var opts = {
                    // color configs
                    colorStart: "#37a3ff",
                    colorStop: void 0,
                    gradientType: 0,
                    strokeColor: "#e0e0e0",
                    generateGradient: true,
                    percentColors: [[0.0, "#62b7ff"], [0.5, "#5cb17e"], [1.0, "#ff0000"]],

                    // customize pointer
                    pointer: {
                        length: 0.7,
                        strokeWidth: 0.035,
                        iconScale: 1.0
                    },
                    // static labels
                    staticLabels: {
                        font: "10px sans-serif",
                        labels: [0, 10, 20, 30, 40],
                        fractionDigits: 0
                    },

                    // static zones
                    staticZones: [
                        { strokeStyle: "#62b7ff", min: 0, max: 10 },
                        { strokeStyle: "#FFDD00", min: 10, max: 20 },
                        { strokeStyle: "#30B32D", min: 10, max: 20 },
                        { strokeStyle: "#FFDD00", min: 20, max: 30 },
                        { strokeStyle: "#F03E3E", min: 30, max: 40 }
                    ],
                    // the span of the gauge arc
                    angle: 0.05,
                    // radius scale
                    radiusScale: 0.8,
                    // High resolution support
                    highDpiSupport: true

                };

                var target = document.getElementById('demo');
                var gauge = new Gauge(target).setOptions(opts);

                gauge.maxValue = 40;
                gauge.setMinValue(0);
                gauge.set(temp);

                document.getElementById("preview-textfield").className = "preview-textfield";
                //gauge.setTextField(document.getElementById("preview-textfield"));
                gauge.animationSpeed = 50

                let hum = document.querySelector('.hum');
                let press = document.querySelector('.press');
                let dir = document.querySelector('.dir');
                let vel = document.querySelector('.vel');
                let raj = document.querySelector('.raj');
                let precip = document.querySelector('.precip');

                hum.innerHTML = `Humidade: <strong>${humidity}%</strong> <meter min="0" low="30" optimum="80" high="60" max="100" value="${humidity}"></meter>`;
                press.innerHTML = `Press. Atmosférica: <strong>${pressure} hpa</strong>`;
                dir.innerHTML = `Direção do Vento: <strong>${winddir}º - ${winddirRV}</strong>`;
                vel.innerHTML = `Velocidade do Vento: <strong>${windSpeed} km/h</strong>`;
                raj.innerHTML = `Rajada de Vento: <strong>${windGust} km/h</strong>`;
                precip.innerHTML = `Precipitação 24h: <strong>${precipTotal} mm</strong>`;

            })
            update()
    }


    function update(){
        const atualizar = setInterval(atualiza,300000)
    }
    
    atualiza();

}
/* 
function historico() {
    //dou um fecth na API de weather.com e peço os dados da estação IPARA21 no formato JSON, unidades métricas e números com casas deciamis. 
    fetch(`https://api.weather.com/v2/pws/dailysummary/7day?stationId=IPARA21&format=json&units=m&apiKey=7df6c3652f1a45ddb6c3652f1a45dd6a&numericPrecision=decimal`)
        //o fetch retorna uma promise, então tenho que usar o then.
        //neste caso uso uma arrow com o parâmetro de resolve e informo que o resultado 
        //está em json.
        .then(resolve => resolve.json())
        //mais um then agora pra trabalhar os dados do JSON.
        .then(resolve => {
            //a primeira coisa é capturar os dados que eu quero usar. 
            //o JSON retorna um array com um objeto dentro, então 
            //tenho que buscar dentro desse array a posição zero, que é
            //o meu objeto com os dados da meteorologia.
            const objH = resolve.summaries;
            const d1 = objH[6];
            const d1Tmax = (d1[6].metric.tempHigh)


            console.log(d1)

            const dia1 = document.querySelector('#d1');
            dia1.innerHTML = `Temperatura Máxima: ${d1Tmax}`



        })
    }



historico() */


global();


