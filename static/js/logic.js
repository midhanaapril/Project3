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