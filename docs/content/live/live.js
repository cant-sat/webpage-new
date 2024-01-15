var tables = null
var colors = null

var socket = null

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

function connect() {
    const protocol = location.protocol == 'https:' ? 'wss' : 'ws';
    const server = "localhost"
    const port = 443

    // graph.destroy()
    // graph = new Chart(document.getElementById("graph"), config)
    // currentGraphs = []
    // updateGraph()
    // colors = new Map()
    // tables = new Map()
    // disables the connect buttons
    // document.getElementById("url").disabled = true

    document.getElementById("connect").disabled = true

    // Connect to Server (protocol://server:port)
    socket = new WebSocket(protocol + "://" + server + ":" + port)

    // onError
    socket.addEventListener("error", function (event) {
        console.log(event.data)
    })

    // onClose
    socket.addEventListener("close", function (event) {
        console.log("closed")

        // enables the connect buttons
        //document.getElementById("url").disabled = false
        document.getElementById("connect").disabled = false


        //document.getElementById("url").hidden = false
        document.getElementById("connect").hidden = false

        // document.getElementById("table").disabled = true
        // document.getElementById("show").disabled = true
    })

    // onMessage
    socket.addEventListener("message", function (event) {
        console.log(event.data)

        var newEntrie = JSON.parse(event.data)

        // if the thing being sent is real life data
        if (newEntrie.entries != undefined && newEntrie.entries != null && newEntrie.values == undefined) {

            newEntrie.entries.forEach((entrie) => {
                if (typeof entrie.values[0] != typeof 1) {
                    throw "error: only numbers are accepted"
                    return
                }

                if (tables.has(entrie.table)) {
                    // adds the new entrie to the table if it exists
                    console.log("added entrie to table: " + entrie.table)
                    tables.set(entrie.table, tables.get(entrie.table).concat(entrie.values))
                }
                else {
                    // creates the table if it exists
                    console.log("created new table: " + entrie.table)
                    tables.set(entrie.table, entrie.values)

                    // adds the new table to visualize to the current graphs
                    colors.set(entrie.table, "rgb(" + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ")")
                    currentGraphs.push(entrie.table)

                    //updates the graphs
                    updateGraph()
                }
            })

            updateGraph()
        }
        else {
            throw "error, bad message"
        }
    })

    socket.addEventListener("open", function () {
        // document.getElementById("table").disabled = false
        // document.getElementById("show").disabled = false

        // uncomment these to enable the show table button and text field


        // enables the connect buttons
        //document.getElementById("url").hidden = true
        document.getElementById("connect").hidden = true

        console.log("Succesfully joined")
    })
}

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