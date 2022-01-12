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


function breweryInfo(sample)
{
    //console.log(sample);
    d3.json('http://127.0.0.1:5500/beer_api/'+sample).then((data)=>{
        let breweryEntry = data;
        console.log(breweryEntry)
        console.log(breweryEntry[0])
        
        //clearing data for "fresh display"
        d3.select("#sample-metadata").html("");

        Object.entries(breweryEntry[0]).slice(1).forEach(([key,value])=> {
            if(key == "company_name") {
                key = "Company Name: ";
            } else if (key == "street_address"){
                key ="Street Address: ";
            }else if ( key == "city"){
                key = "City: ";
            }else if ( key == "company_phone"){
                key = "Company Phone Number: ";
            }else if ( key == "state"){
                key = "State: ";
            }else if ( key == "zipcode"){
                key = "Zipcode: ";
            }else if ( key == "company_type"){
                key = "Brewery Type: ";
            } else if ( key == "member_type"){
                key = "Membership Status: ";
            } else if ( key == "independent_craft"){
                key = "Independent Craft Brewery: "; 
            }else if ( key == "latitude: "){
                key = "Latitude: ";
            }else if ( key == "longitude"){
                key = "Longitude: "
            }else if ( key == "address"){
                key = ""; 
                value = "";
            };

            d3.select("#sample-metadata")
                .append("h5").style("font-weight",700).text(`${key}`)
                .append("tspan").style("font-weight", 300).text(`${value}`); 
        });
    });
}

function radioFilter(selection){
    let membership = selection;
    if (selection == "option2") {
        //option 2 = Associate Members Only
        membership = "/Beer Association Associate Member "
    } else if(selection == "option3"){
        //option 3 = Beer Association member 
        membership = "/Beer Association Member"
    }else if (selection == "option4"){
        membership = "/No Membership"
    };
 	d3.json('http://127.0.0.1:5500/beer_api'+membership).then(function(data) {
 		console.log(selection);
        if (selection == "option2") {
            //option 2 = Associate Members Only
        };
 	}); 
}; 


 function buildPieChart(){
     d3.json("http://127.0.0.1:5500/beer_api").then((data)=>{
        //filtering by membership 
        let not_member = data.filter(membershipS =>membershipS.member_type == "No Membership").length; 
        let BAmember = data.filter(membershipS =>membershipS.member_type == "Beer Association Member").length; 
        let BAAmember = data.filter(membershipS =>membershipS.member_type == "Beer Association Associate Member").length; 

        total_count = not_member + BAmember + BAAmember; 
        let array = [not_member, BAmember , BAAmember];
        let array2 = [];
        for(var i = 0, length = array.length; i < length; i++){
            array2[i] = (array[i]/total_count)*100;
        }

        var data = [{
            values: array2,
            labels: ['No Membership', 'Beer Association Member', 'Beer Association "Associate" Member'],
            type: 'pie'
          }];
          
        var layout = {
            title: "Membership Summary",
            height: 400,
            width: 500
        };
          
        Plotly.newPlot('pie', data, layout);

    });

}

function buildBarChart(){
    d3.json("http://127.0.0.1:5500/beer_api").then((data)=>{
        //filtering by type 
        let breweryT = ['Taproom','Planning','Micro','Brewpub','Regional','Large','Contract','Proprietor'];
        let taproom = data.filter(membershipS =>membershipS.company_type == breweryT[0]).length; 
        let planning = data.filter(membershipS =>membershipS.company_type == breweryT[1]).length; 
        let micro = data.filter(membershipS =>membershipS.company_type == breweryT[2]).length; 
        let brewpub = data.filter(membershipS =>membershipS.company_type == breweryT[3]).length; 
        let Regional = data.filter(membershipS =>membershipS.company_type == breweryT[4]).length;
        let Large = data.filter(membershipS =>membershipS.company_type == breweryT[5]).length;
        let contract = data.filter(membershipS =>membershipS.company_type == breweryT[6]).length;
        let prop = data.filter(membershipS =>membershipS.company_type == breweryT[7]).length; 

        let barChart = {
            y: [taproom,planning,micro,brewpub,Regional,Large,contract,prop],
            x: breweryT, 
            text: ['Taproom','Planning','Microbrewery','Brewpub','Regional','Large','Contract','Proprietor'], 
            type: "bar", 
        }; 

        let layout = {
            title: "Different Brewery Types"
        }

        Plotly.newPlot("bar", [barChart], layout); 

    });
};

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

        // 
        breweryInfo(first_brewery); 
        radioFilter("option1");
        buildBarChart();
        buildPieChart()
    });
};

//function that updates the dashboard 
function optionChanged(item)
{
    //call breweryInfo function to change the item 
    breweryInfo(item);  
}

//call the initialize function 
initialize(); 