function actualitzaDibuix() {

    let brain = population.cars[population.maxFitCar].brain;
    let neurons = [];
    for (let i = 0; i < brain.neurons.length; ++i) {
        let n = brain.neurons[i];
        let myLabel = "in:";
        if (n.type == "output") myLabel = "out:";
        if (n.type == "hidden") myLabel = "h:";
        neurons.push({id: n.innov, label: myLabel + n.innov});
    }
    let conn = [];
    for (let i = 0; i < brain.connections.length; ++i) {
        let e = brain.connections[i];
        if (e.enabled) {
            conn.push({from: e.in, to: e.out, label: e.innov, color:{color:"#0000FF"}});
        }
        else {
            conn.push({from: e.in, to: e.out, label: e.innov, color:{color:"#FF0000"}});
        }
    }

    var nodes = new vis.DataSet(neurons);
    var edges = new vis.DataSet(conn);

    var container = document.getElementById('mynetwork');
    var data = {
    nodes: nodes,
    edges: edges
    };
    var options = {};
    var network = new vis.Network(container, data, options);
}
