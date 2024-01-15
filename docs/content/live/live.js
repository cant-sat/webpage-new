var tables = null
var colors = null

var data = { labels: [0], datasets: [] }
var options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
}
var config = {
    type: "line",
    data: data,
    options: options
}

var graph = new Chart(document.getElementById("graph"), config)
var currentGraphs = []

function showTable(tableName) {
    const visualize = tables.get(tableName)
    if (visualize != undefined && visualize != null && typeof visualize == typeof []) {

        // if they try to show the same table values twice throws error
        if (currentGraphs.includes(tableName)) {
            throw "error: cant visualize same graph twice"
        }

        // adds the new table to visualize to the current graphs
        colors.set(tableName, "rgb(" + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ")")
        currentGraphs.push(tableName)

        //updates the graphs
        updateGraph()
    }
    else {
        throw "error: table is empty or not array"
    }
}

function updateGraph() {
    // if there are no current graphs just return

    var longest = 0

    newData = []

    // loops through all the graph names it wants to visualize
    currentGraphs.forEach(element => {
        console.log(element)
        // adds the datas from the table that has the name with element to the new data
        newData.push({ label: element, data: tables.get(element), tension: 0, borderColor: colors.get(element), fill: true })

        // finds the longest values
        if (tables.get(element).length > longest) {
            longest = tables.get(element).length
        }
    });

    data.datasets = newData

    res = makeLabels(longest)
    console.log(res)

    data.labels = res

    //updates the graph with no animation
    graph.update("none")
}

//makes the labels for a size of "size"
function makeLabels(size) {
    ret = []
    for (let index = 0; index < size; index++) {
        ret.push(index);
    }
    return ret
}