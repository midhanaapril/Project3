// Create the tile layer that will be the background of our map.
var defaultMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var layers = {
    tapRoomL: new L.LayerGroup(),
    largeL: new L.LayerGroup(),
    contractL: new L.LayerGroup(),
    propL: new L.LayerGroup(),
    brewpubL: new L.LayerGroup(),
    microL: new L.LayerGroup(),
    regionaL: new L.LayerGroup()
};
  

// map object 
var myMap = L.map("map", {
    center: [32.6620, -83.4376], 
    zoom: 7, 
    layers: [
        layers.tapRoomL,
        layers.largeL,
        layers.brewpubL,
        layers.propL,
        layers.contractL,
        layers.regionaL,
        layers.microL
    ]
}); 

defaultMap.addTo(myMap); 

var overlays = {
    "Taproom":layers.tapRoomL,
    "Large Brewery":layers.largeL,
    "Brewpub":layers.brewpubL,
    "Proprietary":layers.propL,
    "Contract Brewery":layers.contractL,
    "Regional Brewery":layers.regionaL,
    "Micro Brewery":layers.microL
};
  
// Create a control for our layers, and add our overlays to it.
L.control.layers(null, overlays).addTo(myMap);

// Initialize an object that contains icons for each layer group.
var tapI = L.icon({
    iconUrl: 'beerIcon_tap.png',
    iconSize: [38,38]
});

// var newMarker = L.marker([32.6620, -83.4376], {
//     icon: icons[tapRoomL]
// });

L.marker([32.6620, -83.4376], {icon: tapI}).addTo(layers[tapRoomL]);

// const all_breweries  = 'http://127.0.0.1:5500/beer_api'

// d3.json(all_breweries).then(function(data) {
//     //console.log(data);
//     console.log(data)
// });


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
    d3.select("#definition").html("");
    let btype = selection;
    let tDef = ""; 
    if (selection == "brewpub") {
        btype = "Brewpub";
        tDef =  "A brewpub is like a taproom in the fact that it is an extension of the " +
            "brewery itself however food and other activities are incorporated in many instances." +
            "The brewpub seeks to showcase the brewery’s method of brewing as well as the " +
            "skills required to produce a quality product."
    } else if(selection == "micro"){
        btype = "Microbrewery";
        tDef = "A microbrewery is a brewery that produces less than 15,000 " +
            "barrels of beer each year.  A common misconception is that all microbreweries " +
            "produce craft beer. This is false. The only measure to define a brewery as a " +
            "microbrewery is the volume of beer they produce";
    }else if (selection == "regional"){
        btype = "Regional Brewery";
        tDef = "A regional brewery is defined by the volume of beer that " +
            "is produced. To be classified as a regional brewery, the brewery must produce " +
            "between 15,000 and 6,000,000 barrels of beer a year."
    }else if (selection == "taproom"){
        btype = "Taproom";
        tDef = "A taproom is an extension of a brewery. This set up is used to bring beer" + 
            "directly to their customers without having to have a line of distribution. " +
            "The focus of a taproom is the beer itself so there are rarely any food services offered at all.";
    }else if (selection == "contract"){
        btype = "Contract Brewery";
        tDef = "A contract brewery is a brewery for hire. These breweries" +
            "contract with other brands to produce and package their products. The contract " +
            "brewery follows all direction given by their client. "
    }else if (selection == "prop"){
        btype = "Proprietor Brewery";
        tDef = "This type of brewery rents out excess space and " +
            "equipment to other brewers to produce their beer. These breweries foster beer " +
            "development by allowing small brewers to gain access to the industry without as " +
            "many entry costs. "
    }else if (selection == "large"){
        btype = "Large Brewery";
        tDef = "A large brewery is defined by the volume of beer that is " +
            "produced. To be classified as a regional brewery, the brewery must produce over " +
            "6,000,000 barrels of beer a year."
    };
    
    d3.select("#definition")
        .append("h5").style("font-weight",700).text(btype+ " ")
        .append("tspan").style("font-weight", 300).text(tDef); 
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
            array2[i] = Math.round((array[i]/total_count)*100);
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
        let breweryT = ['Taproom','Brewpub','Micro','Regional','Contract','Large','Proprietor'];
        let taproom = data.filter(membershipS =>membershipS.company_type == breweryT[0]).length; 
        let brewpub = data.filter(membershipS =>membershipS.company_type == breweryT[1]).length; 
        let micro = data.filter(membershipS =>membershipS.company_type == breweryT[2]).length; 
        let Regional = data.filter(membershipS =>membershipS.company_type == breweryT[3]).length;
        let contract = data.filter(membershipS =>membershipS.company_type == breweryT[4]).length;
        let Large = data.filter(membershipS =>membershipS.company_type == breweryT[5]).length;
        let prop = data.filter(membershipS =>membershipS.company_type == breweryT[6]).length; 

        let barChart = {
            y: [taproom,brewpub,micro,Regional,contract,Large,prop],
            x: breweryT, 
            text: ['Taproom', 'Brewpub','Microbrewery','Regional','Contract','Large','Proprietor'], 
            type: "bar", 
            oreintation: "h"
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
        radioFilter("taproom");
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