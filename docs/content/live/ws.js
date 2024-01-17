socket = null

const protocol = "wss";
const server = "192.168.3.61"
const port = 443

function connect() {
    // graph.destroy()
    // graph = new Chart(document.getElementById("graph"), config)
    // currentGraphs = []
    // updateGraph()
    // colors = new Map()
    // tables = new Map()
    // disables the connect buttons
    // document.getElementById("url").disabled = true

    document.getElementById("connect").disabled = true
    document.getElementById("graph").hidden = true

    // Connect to Server
    socket = new WebSocket(`${protocol}://${server}:${port}`)

    socket.addEventListener("error", function (event) {
        console.log(event.data)
    })

    socket.addEventListener("close", function (event) {
        console.log("closed")

        document.getElementById("connect").disabled = false
        document.getElementById("connect").hidden = false
        document.getElementById("graph").hidden = true
    })

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

    socket.addEventListener("open", function (event) {
        // document.getElementById("table").disabled = false
        // document.getElementById("show").disabled = false

        // uncomment these to enable the show table button and text field


        // enables the connect buttons
        //document.getElementById("url").hidden = true
        document.getElementById("connect").hidden = true
        document.getElementById("graph").hidden = false

        console.log(`Succesfully joined using ${socket.protocol} protocol`)
    })
}