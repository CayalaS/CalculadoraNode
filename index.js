console.log("Aplicacion Inicia");

const express = require('express');
const app = express();

var allId = new Map();
var resultados = new Map();
var data = [];

app.use(express.urlencoded({ extended: true }));
app.use( express.json());

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index', {
        id: req.query.id || "",
        mensaje: ""
    });
});

app.listen(3000, () => console.log("Server Funcionando"));

app.post('/resultado', function (req, res) {

    const id = req.body.id;
    const accion = req.body.accion;
    const num = parseFloat(req.body.num);

    data.push({id, accion, num});
    allId.set(id, new Date());

    if (resultados.get(id) === undefined) {
        resultados.set(id, 0);
    } 

    let resultadoCalculadora = resultados.get(id);

    switch (accion) {
        case "+":
            resultadoCalculadora = resultadoCalculadora + num;
            break;

        case "-":
            resultadoCalculadora = resultadoCalculadora - num;
            break;
            
        case "*":
            resultadoCalculadora = resultadoCalculadora * num;
            break;
            
        case "/":
            if (num === 0) {
                res.render('index', {
                    id,
                    mensaje: "No se puede dividir entre 0"
                });
            }
            else resultadoCalculadora = resultadoCalculadora / num;
            break;
            
        case "R":
            borrar(id);
            res.render('index', {
                id,
                mensaje: "Se ha borrado el id: " + id
            });
            return;    
    
    }
    resultados.set(id, resultadoCalculadora);

    let historial = "0";

    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            historial = historial + data[i].accion + data[i].num;
        }
        
    }

    res.render('resultado' , { 

        id: id,
        accion: accion,
        num: num,
        historial: historial,
        resultado: resultadoCalculadora
    });
});

setInterval(checkTiempo, 60000);

function checkTiempo() {

    let time = new Date().getTime();
    const idKeys = allId.keys();

    while (id = idKeys.next().value) {
       let fechaId = allId.get(id);

       if (time - fechaId.getTime() >= 60000) {
            borrar(id);
       }
    }
}

function borrar(id) {
    console.log("Borrando " + id);

    allId.delete(id);
    resultados.delete(id);
    data = data.filter(data => data.id != id);

    console.log(allId);
    console.log(resultados);
    console.log(data);
}