function global() {
    //se for usar o node tenho que importar o fetch e depois atribuo ele a uma const chamada
    //fetch.
    //const fetch = require("node-fetch");


    const temperaturaAgora = document.querySelector('.temperaturaAgora');
    const data = document.querySelector('.data');

    let insert = document.querySelector('#inputGroupSelect04');
    let estacao = document.querySelector('.custom-select').value;

    function limpa(){
        let dados = document.getElementById("tempTable");
        dados.innerHTML = ''
    }
    


    insert.addEventListener('change', function () {
        estacao = insert.value;
        console.log(estacao)
        limpa()
        atualiza()

            
    })

    const tempBotao = document.querySelector('#temp');
    tempBotao.addEventListener('click', function(){
        historicoTemperatura()
    })

    const humBotao = document.querySelector('#humidade');
    humBotao.addEventListener('click', function(){
        historicoHumidade()
    })

    const ventoBotao = document.querySelector('#vento');
    ventoBotao.addEventListener('click', function(){
        historicoVento()
    })

    const chuvaBotao = document.querySelector('#chuva');
    chuvaBotao.addEventListener('click', function(){
        historicoChuva()
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

                /* console.log(`Atualizado em ${horaBR}`)
                console.log(`Temperatura: ${temp}ºC`);
                console.log(`Humidade: ${humidity}%`);
                console.log(`Pressão Atmosférica: ${pressure} hpa`);
                console.log(`Direção do Vento: ${winddir}º - ${winddirRV}`);
                console.log(`Velocidade do Vento: ${windSpeed} km/h`);
                console.log(`Rajada de Vento: ${windGust} km/h`);
                console.log(`Precipitação 24h: ${precipTotal} mm`); */

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

                var target = document.getElementById('gauge');
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
                precip.innerHTML = `Precipitação: <strong>${precipTotal} mm</strong>`;

            })
        update()
    }


    function update() {
        const atualizar = setInterval(atualiza, 300000)
    }

    atualiza();
    





    function historicoTemperatura() {
        //dou um fecth na API de weather.com e peço os dados da estação IPARA21 no formato JSON, unidades métricas e números com casas deciamis. 
        fetch(`https://api.weather.com/v2/pws/dailysummary/7day?stationId=${estacao}&format=json&units=m&apiKey=7df6c3652f1a45ddb6c3652f1a45dd6a&numericPrecision=decimal`)
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
                console.log(estacao)
                const objH = resolve.summaries;
                let degreeH = '\&#176';
                const d1 = objH[6];//ontem
                let regexH = /([\d][\d][\d][\d])([-])([\d][\d])([-])([\d][\d])\s([\d][\d])([:])([\d][\d])([:])([\d][\d])/g;
                //ontem
                //const d1 = objH[6];
                let horaBRH1 = d1.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d1Tmax = (d1.metric.tempHigh);
                const d1Tmin = (d1.metric.tempLow)

                const d2 = objH[5];
                let horaBRH2 = d2.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d2Tmax = (d2.metric.tempHigh);
                const d2Tmin = (d2.metric.tempLow)

                const d3 = objH[4];//ontem
                let horaBRH3 = d1.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d3Tmax = (d3.metric.tempHigh);
                const d3Tmin = (d3.metric.tempLow)

                const d4 = objH[3];//ontem
                let horaBRH4 = d4.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d4Tmax = (d4.metric.tempHigh);
                const d4Tmin = (d4.metric.tempLow)

                const d5 = objH[2];//ontem
                let horaBRH5 = d5.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d5Tmax = (d5.metric.tempHigh);
                const d5Tmin = (d5.metric.tempLow)

                const d6 = objH[1];//ontem
                let horaBRH6 = d6.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d6Tmax = (d6.metric.tempHigh);
                const d6Tmin = (d6.metric.tempLow)

                const d7 = objH[0];//ontem
                let horaBRH7 = d7.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d7Tmax = (d7.metric.tempHigh);
                const d7Tmin = (d7.metric.tempLow)
            
                //criação de tabela para os dados
                //crio o elemento de tabela.
                let tabela = document.createElement("table");
                //insiro a table na div de classe tempTable
                document.getElementById("tempTable").appendChild(tabela);

                //crio duas var para cabeçalho e para o corpo
                //e atribuo a elas um create element de thead e tbody.
                let cabecalho = document.createElement("thead");
                let corpo = document.createElement("tbody");

                //daí dou um appendchild nessas var na tabela que criei.
                tabela.appendChild(cabecalho);
                tabela.appendChild(corpo);
                
                //agora os dados, que vão 
                let dados = document.getElementById("tempTable");
                dados.innerHTML = [
                    `<table>`,
                    `<thead>`,
                    `<tr>`,
                    `<th>Data</th>`,
                    
                    `<th>Min.</th>`,
                    `<th>Max.</th>`,
                    `</tr>`,
                    `</thead>`,
                    `<tbody>`,
                    `<tr>`,
                    `<td>${horaBRH1}</td>`,
                    `<td>${d1Tmin}${degreeH}</td>`,
                    `<td>${d1Tmax}${degreeH}</td>`,
                    `</tr>`,
                    `<tr>`,
                    `<td>${horaBRH2}</td>`,
                    `<td>${d2Tmin}${degreeH}</td>`,
                    `<td>${d2Tmax}${degreeH}</td>`,
                    `</tr>`,
                    `<td>${horaBRH3}</td>`,
                    `<td>${d3Tmin}${degreeH}</td>`,
                    `<td>${d3Tmax}${degreeH}</td>`,
                    `</tr>`,
                    `<td>${horaBRH4}</td>`,
                    `<td>${d4Tmin}${degreeH}</td>`,
                    `<td>${d4Tmax}${degreeH}</td>`,
                    `</tr>`,
                    `<td>${horaBRH5}</td>`,
                    `<td>${d5Tmin}${degreeH}</td>`,
                    `<td>${d5Tmax}${degreeH}</td>`,
                    `</tr>`,
                    `<td>${horaBRH6}</td>`,
                    `<td>${d6Tmin}${degreeH}</td>`,
                    `<td>${d6Tmax}${degreeH}</td>`,
                    `</tr>`,
                    `<td>${horaBRH7}</td>`,
                    `<td>${d7Tmin}${degreeH}</td>`,
                    `<td>${d7Tmax}${degreeH}</td>`,
                    `</tr>`,
                    `</tbody>`,
                    `</table>`
                  ].join("\n");
                
                //fim tabela dinâmica

            })
    }


    function historicoHumidade() {
        //dou um fecth na API de weather.com e peço os dados da estação IPARA21 no formato JSON, unidades métricas e números com casas deciamis. 
        fetch(`https://api.weather.com/v2/pws/dailysummary/7day?stationId=${estacao}&format=json&units=m&apiKey=7df6c3652f1a45ddb6c3652f1a45dd6a&numericPrecision=decimal`)
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
                let degreeH = '\&#176';
                const d1 = objH[6];//ontem
                let regexH = /([\d][\d][\d][\d])([-])([\d][\d])([-])([\d][\d])\s([\d][\d])([:])([\d][\d])([:])([\d][\d])/g;
                //ontem
                //const d1 = objH[6];
                let horaBRH1 = d1.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d1Tmax = (d1.humidityHigh);
                const d1Tmin = (d1.humidityLow)

                const d2 = objH[5];
                let horaBRH2 = d2.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d2Tmax = (d2.humidityHigh);
                const d2Tmin = (d2.humidityLow)

                const d3 = objH[4];//ontem
                let horaBRH3 = d1.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d3Tmax = (d3.humidityHigh);
                const d3Tmin = (d3.humidityLow)

                const d4 = objH[3];//ontem
                let horaBRH4 = d4.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d4Tmax = (d4.humidityHigh);
                const d4Tmin = (d4.humidityLow)

                const d5 = objH[2];//ontem
                let horaBRH5 = d5.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d5Tmax = (d5.humidityHigh);
                const d5Tmin = (d5.humidityLow)

                const d6 = objH[1];//ontem
                let horaBRH6 = d6.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d6Tmax = (d6.humidityHigh);
                const d6Tmin = (d6.humidityLow)

                const d7 = objH[0];//ontem
                let horaBRH7 = d7.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d7Tmax = (d7.humidityHigh);
                const d7Tmin = (d7.humidityLow)
            
                //criação de tabela para os dados
                //crio o elemento de tabela.
                let tabela = document.createElement("table");
                //insiro a table na div de classe tempTable
                document.getElementById("tempTable").appendChild(tabela);

                //crio duas var para cabeçalho e para o corpo
                //e atribuo a elas um create element de thead e tbody.
                let cabecalho = document.createElement("thead");
                let corpo = document.createElement("tbody");

                //daí dou um appendchild nessas var na tabela que criei.
                tabela.appendChild(cabecalho);
                tabela.appendChild(corpo);
                
                //agora os dados, que vão 
                let dados = document.getElementById("tempTable");
                dados.innerHTML = [
                    `<table>`,
                    `<thead>`,
                    `<tr>`,
                    `<th>Data</th>`,
                    
                    `<th>Min.</th>`,
                    `<th>Max.</th>`,
                    `</tr>`,
                    `</thead>`,
                    `<tbody>`,
                    `<tr>`,
                    `<td>${horaBRH1}</td>`,
                    `<td>${d1Tmin}%</td>`,
                    `<td>${d1Tmax}%</td>`,
                    `</tr>`,
                    `<tr>`,
                    `<td>${horaBRH2}</td>`,
                    `<td>${d2Tmin}%</td>`,
                    `<td>${d2Tmax}%</td>`,
                    `</tr>`,
                    `<td>${horaBRH3}</td>`,
                    `<td>${d3Tmin}%</td>`,
                    `<td>${d3Tmax}%</td>`,
                    `</tr>`,
                    `<td>${horaBRH4}</td>`,
                    `<td>${d4Tmin}%</td>`,
                    `<td>${d4Tmax}%</td>`,
                    `</tr>`,
                    `<td>${horaBRH5}</td>`,
                    `<td>${d5Tmin}%</td>`,
                    `<td>${d5Tmax}%</td>`,
                    `</tr>`,
                    `<td>${horaBRH6}</td>`,
                    `<td>${d6Tmin}%</td>`,
                    `<td>${d6Tmax}%</td>`,
                    `</tr>`,
                    `<td>${horaBRH7}</td>`,
                    `<td>${d7Tmin}%</td>`,
                    `<td>${d7Tmax}%</td>`,
                    `</tr>`,
                    `</tbody>`,
                    `</table>`
                  ].join("\n");
                
                //fim tabela dinâmica

            })
    }


    function historicoVento() {
        //dou um fecth na API de weather.com e peço os dados da estação IPARA21 no formato JSON, unidades métricas e números com casas deciamis. 
        fetch(`https://api.weather.com/v2/pws/dailysummary/7day?stationId=${estacao}&format=json&units=m&apiKey=7df6c3652f1a45ddb6c3652f1a45dd6a&numericPrecision=decimal`)
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
                let degreeH = '\&#176';
                const d1 = objH[6];//ontem
                let regexH = /([\d][\d][\d][\d])([-])([\d][\d])([-])([\d][\d])\s([\d][\d])([:])([\d][\d])([:])([\d][\d])/g;
                //ontem
                //const d1 = objH[6];
                let horaBRH1 = d1.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d1Tmax = (d1.metric.windgustHigh);
                const d1Tmin = (d1.metric.windgustAvg)

                const d2 = objH[5];
                let horaBRH2 = d2.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d2Tmax = (d2.metric.windgustHigh);
                const d2Tmin = (d2.metric.windgustAvg)

                const d3 = objH[4];//ontem
                let horaBRH3 = d1.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d3Tmax = (d3.metric.windgustHigh);
                const d3Tmin = (d3.metric.windgustAvg)

                const d4 = objH[3];//ontem
                let horaBRH4 = d4.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d4Tmax = (d4.metric.windgustHigh);
                const d4Tmin = (d4.metric.windgustAvg)

                const d5 = objH[2];//ontem
                let horaBRH5 = d5.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d5Tmax = (d5.metric.windgustHigh);
                const d5Tmin = (d5.metric.windgustAvg)

                const d6 = objH[1];//ontem
                let horaBRH6 = d6.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d6Tmax = (d6.metric.windgustHigh);
                const d6Tmin = (d6.metric.windgustAvg)

                const d7 = objH[0];//ontem
                let horaBRH7 = d7.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d7Tmax = (d7.metric.windgustHigh);
                const d7Tmin = (d7.metric.windgustAvg)
            
                //criação de tabela para os dados
                //crio o elemento de tabela.
                let tabela = document.createElement("table");
                //insiro a table na div de classe tempTable
                document.getElementById("tempTable").appendChild(tabela);

                //crio duas var para cabeçalho e para o corpo
                //e atribuo a elas um create element de thead e tbody.
                let cabecalho = document.createElement("thead");
                let corpo = document.createElement("tbody");

                //daí dou um appendchild nessas var na tabela que criei.
                tabela.appendChild(cabecalho);
                tabela.appendChild(corpo);
                
                //agora os dados, que vão 
                let dados = document.getElementById("tempTable");
                dados.innerHTML = [
                    `<table>`,
                    `<thead>`,
                    `<tr>`,
                    `<th>Data</th>`,
                    
                    `<th>Média Vento</th>`,
                    `<th>Rajada Máxima</th>`,
                    `</tr>`,
                    `</thead>`,
                    `<tbody>`,
                    `<tr>`,
                    `<td>${horaBRH1}</td>`,
                    `<td>${d1Tmin} km/h</td>`,
                    `<td>${d1Tmax} km/h</td>`,
                    `</tr>`,
                    `<tr>`,
                    `<td>${horaBRH2}</td>`,
                    `<td>${d2Tmin} km/h</td>`,
                    `<td>${d2Tmax} km/h</td>`,
                    `</tr>`,
                    `<td>${horaBRH3}</td>`,
                    `<td>${d3Tmin} km/h</td>`,
                    `<td>${d3Tmax} km/h</td>`,
                    `</tr>`,
                    `<td>${horaBRH4}</td>`,
                    `<td>${d4Tmin} km/h</td>`,
                    `<td>${d4Tmax} km/h</td>`,
                    `</tr>`,
                    `<td>${horaBRH5}</td>`,
                    `<td>${d5Tmin} km/h</td>`,
                    `<td>${d5Tmax} km/h</td>`,
                    `</tr>`,
                    `<td>${horaBRH6}</td>`,
                    `<td>${d6Tmin} km/h</td>`,
                    `<td>${d6Tmax} km/h</td>`,
                    `</tr>`,
                    `<td>${horaBRH7}</td>`,
                    `<td>${d7Tmin} km/h</td>`,
                    `<td>${d7Tmax} km/h</td>`,
                    `</tr>`,
                    `</tbody>`,
                    `</table>`
                  ].join("\n");
                
                //fim tabela dinâmica

            })
    }

    function historicoChuva() {
        //dou um fecth na API de weather.com e peço os dados da estação IPARA21 no formato JSON, unidades métricas e números com casas deciamis. 
        fetch(`https://api.weather.com/v2/pws/dailysummary/7day?stationId=${estacao}&format=json&units=m&apiKey=7df6c3652f1a45ddb6c3652f1a45dd6a&numericPrecision=decimal`)
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
                let degreeH = '\&#176';
                const d1 = objH[6];//ontem
                let regexH = /([\d][\d][\d][\d])([-])([\d][\d])([-])([\d][\d])\s([\d][\d])([:])([\d][\d])([:])([\d][\d])/g;
                //ontem
                //const d1 = objH[6];
                let horaBRH1 = d1.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d1Tmax = (d1.metric.precipTotal);
                const d1Tmin = (d1.metric.precipRate)

                const d2 = objH[5];
                let horaBRH2 = d2.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d2Tmax = (d2.metric.precipTotal);
                const d2Tmin = (d2.metric.precipRate)

                const d3 = objH[4];//ontem
                let horaBRH3 = d1.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d3Tmax = (d3.metric.precipTotal);
                const d3Tmin = (d3.metric.precipRate)

                const d4 = objH[3];//ontem
                let horaBRH4 = d4.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d4Tmax = (d4.metric.precipTotal);
                const d4Tmin = (d4.metric.precipRate)

                const d5 = objH[2];//ontem
                let horaBRH5 = d5.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d5Tmax = (d5.metric.precipTotal);
                const d5Tmin = (d5.metric.precipRate)

                const d6 = objH[1];//ontem
                let horaBRH6 = d6.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d6Tmax = (d6.metric.precipTotal);
                const d6Tmin = (d6.metric.precipRate)

                const d7 = objH[0];//ontem
                let horaBRH7 = d7.obsTimeLocal.replace(regexH, '$5/$3/$1');
                const d7Tmax = (d7.metric.precipTotal);
                const d7Tmin = (d7.metric.precipRate)
            
                //criação de tabela para os dados
                //crio o elemento de tabela.
                let tabela = document.createElement("table");
                //insiro a table na div de classe tempTable
                document.getElementById("tempTable").appendChild(tabela);

                //crio duas var para cabeçalho e para o corpo
                //e atribuo a elas um create element de thead e tbody.
                let cabecalho = document.createElement("thead");
                let corpo = document.createElement("tbody");

                //daí dou um appendchild nessas var na tabela que criei.
                tabela.appendChild(cabecalho);
                tabela.appendChild(corpo);
                
                //agora os dados, que vão 
                let dados = document.getElementById("tempTable");
                dados.innerHTML = [
                    `<table>`,
                    `<thead>`,
                    `<tr>`,
                    `<th>Data</th>`,
                    
                    `<th>Taxa Precipitação</th>`,
                    `<th>Precipitação Total</th>`,
                    `</tr>`,
                    `</thead>`,
                    `<tbody>`,
                    `<tr>`,
                    `<td>${horaBRH1}</td>`,
                    `<td>${d1Tmin} mm/h</td>`,
                    `<td>${d1Tmax} mm</td>`,
                    `</tr>`,
                    `<tr>`,
                    `<td>${horaBRH2}</td>`,
                    `<td>${d2Tmin} mm/h</td>`,
                    `<td>${d2Tmax} mm</td>`,
                    `</tr>`,
                    `<td>${horaBRH3}</td>`,
                    `<td>${d3Tmin} mm/h</td>`,
                    `<td>${d3Tmax} mm</td>`,
                    `</tr>`,
                    `<td>${horaBRH4}</td>`,
                    `<td>${d4Tmin} mm/h</td>`,
                    `<td>${d4Tmax} mm</td>`,
                    `</tr>`,
                    `<td>${horaBRH5}</td>`,
                    `<td>${d5Tmin} mm/h</td>`,
                    `<td>${d5Tmax} mm</td>`,
                    `</tr>`,
                    `<td>${horaBRH6}</td>`,
                    `<td>${d6Tmin} mm/h</td>`,
                    `<td>${d6Tmax} mm</td>`,
                    `</tr>`,
                    `<td>${horaBRH7}</td>`,
                    `<td>${d7Tmin} mm/h</td>`,
                    `<td>${d7Tmax} mm</td>`,
                    `</tr>`,
                    `</tbody>`,
                    `</table>`
                  ].join("\n");
                
                //fim tabela dinâmica

            })
    }

}

global();


