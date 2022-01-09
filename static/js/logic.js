//tile layers for the backgrounds of the map 
var defaultMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

//grayscale 
var grayscale =  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

//watercolor 
var watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});

//topography 
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let basemaps = {
    "Gray Scale": grayscale,
    "Water Color": watercolor,
    Topography: topo,
    Default: defaultMap
}; 

// map object 
var myMap = L.map("map", {
    center: [36.7783, -119.4179], 
    zoom: 3, 
    layers: [defaultMap, grayscale, watercolor,topo]
}); 

defaultMap.addTo(myMap); 


const all_breweries  = 'http://127.0.0.1:5500/beer_api'

d3.json(all_breweries).then(function(data) {
    //console.log(data);
    console.log(data)
});



// d3.json("/get-json").then(function(brands) {
//     var matrix = [],
//         nodes = brands.nodes;
//         //n = nodes.length;
//     console.log(nodes)
// });

// function demoInfo(sample)
// {
//     //console.log(sample);
    
//     // d3.json("url.").then((data)=>{
//     //     let metaData = data.metadata;
        
//     //     //filtering
//     //     let result = metaData.filter(sampleResult => sampleResult.id == sample); 

//     //     //grab index 0 
//     //     let resultD = result[0];
//     //     console.log("I ran")
//     //     console.log(resultD)
//     //     console.log(metaData)
//     //     //clearing data for "fresh display"
//     //     /d3.select("#sample-metadata").html("");

//     //     Object.entries(resultD).forEach(([key,value])=> {
//     //         d3.select("#sample-metadata")
//     //             .append("h5").text(`${key}: ${value}`); 
//     //     });
//     // });
    
// }

function breweryInfo(sample)
{
    //console.log(sample);
    d3.json('http://127.0.0.1:5500/beer_api/'+sample).then((data)=>{
        let breweryEntry = data;
        console.log(breweryEntry)
        console.log(breweryEntry[0])
        
        //filtering
        //let result = metaData.filter(breweryResult => brewery.company_name == brewery); 
        
        //grab index 0 
        //let resultD = breweryEntry[0];
        //console.log(resultD)

        //clearing data for "fresh display"
        d3.select("#sample-metadata").html("");

        Object.entries(breweryEntry[0]).forEach(([key,value])=> {
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`); 
        });
    });
}



//function that initialize in the dashboard 
function initialize()
{

    //access the dropdown selector from the index.html files
    var select = d3.select("#selDataset"); 
    
    d3.json('http://127.0.0.1:5500/beer_api/brewery_names').then((data)=>{
        let brewery_names = data; 
        //console.log(data); 
        //console.log(data[0]);

        //for each to create objects for each samples 
        brewery_names.forEach((brewery) => {
             select.append("option") 
                 .text(brewery)
                 .property("value", brewery); 
        });
        let first_brewery = brewery_names[0];
        //console.log(first_brewery)

        // for metadata 
        breweryInfo(first_brewery); 
        //buildBarChart(first_sample); 
        //buildBubChart(first_sample); 

    });
};

//function that updates the dashboard 
function optionChanged(item)
{
    //call demoInfo function to change the item 
    breweryInfo(item);  
    //call bar chart 
    //buildBarChart(item); 
    //call bubble chart 
    //buildBubChart(item); 

}

//call the initialize function 
initialize(); 