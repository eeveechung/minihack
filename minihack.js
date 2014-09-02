var searchItem = "";

//array of json's of healthy alternatives
var healthy=[
	{"food": "ounces of Tenderloin Steak", "calories": 63},
	{"food": "Boiled Eggs", "calories": 77},
	{"food": "slices of Wheat Toast", "calories": 75},
	{"food": "Apples", "calories": 95},
	{"food": "filets of Salmon", "calories": 190},
	{"food": "cups of Greek Yogurt", "calories": 140},
	{"food": "Carrots", "calories": 25},
	{"food": "Strawberries", "calories": 9},
	{"food": "Oats 'N Honey Granola Bars", "calories": 95},
	{"food": "glasses of Orange Juice", "calories": 112}
]

//random number to generate healthy food comparison
var randHealthy = 0;

$(function() {   // when document is ready
	$("#form1").submit(function() {
	// $('#button').click(function(){
		console.log("Clicked");
		$("#comparison").html("");
			var phraseEntry = $("#phraseEntry1").val();
			// $("#choices").html("POOP");
			$("#part1").hide()
			$("#part2").show()
			getSearchItem(phraseEntry);
		console.log("searched");

	});
		// return false;
		console.log("what");
} );

$(function() {   // when document is ready
	$("#form2").submit(function() {
	// $('#button').click(function(){
		console.log("Clicked");
		var phraseEntry = $("#phraseEntry2").val();
		// $("#choices").html("POOP");
		getSearchItem(phraseEntry);
		console.log("searched");
	});
		// return false;
		console.log("what");
} );



//application id -- f531e2ed
//application key -- d781805e35dfc834e8c2a04a83a90939
//EXAMPLE LAYS SEARCH: curl -v  -X GET "https://api.nutritionix.com/v1_1/search/lays?results=0%3A20&cal_min=0&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id&appId=f531e2ed&appKey=d781805e35dfc834e8c2a04a83a90939"
// [phrase] ? results = [fields] &appId=f531e2ed&appKey=d781805e35dfc834e8c2a04a83a90939

//makes a call to Nutritionix API to search for phrase entered in form
function getSearchItem(phraseEntry) {
	console.log("in getSearchItem()");
	var url = "https://api.nutritionix.com/v1_1/search/";
	var phrase = phraseEntry;
	var lower_range = 0;
	var upper_range = 10
	var numResults = "?results="+lower_range+"%3A"+upper_range; //searches 
	var api_info = "&appId=f531e2ed&appKey=d781805e35dfc834e8c2a04a83a90939";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url+phrase+numResults+api_info);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.onreadystatechange = function () {
	  if (this.readyState == 4) {
	  	obj = JSON.parse(this.responseText); 
        $("#choices").html(showSearchResults(obj)); 
	  }
	};
	xhr.send(null);
	// $.ajax({
	// 	type: 'GET',
	// 	url: url + mode + actorID + api_key,
	// 	async: false,
	// 	jsonpCallback: 'displayInfo',
	// 	contentType: 'application/json',
	// 	dataType: "jsonp"
	// });
}

//parses the responseText from search of phraseEntry into 10 items shown on page
function showSearchResults(response) {
	resultHTML = "";
	console.log(response)
	$.each(response.hits, function(key, value){
		var item = value.fields;
		var button = "<button type='button' class='foodChoice'";
		button += "id="+item.item_id;
		button += " onclick='getCalories(this.id)' >";
		button += item.item_name;
		button += "</button>";
		console.log(key + ": " + item.item_name);
		resultHTML += button + "<br><br>";
	});
	return resultHTML;
}

function displaySearchResults(response) {
	console.log("in display");
}

//makes a call to Nutritionix API to search for calories of selected item
function getCalories(item_id){
	console.log("getting calories");
	console.log(item_id);

	var url = "https://api.nutritionix.com/v1_1/item?id=";
	var api_info = "&appId=f531e2ed&appKey=d781805e35dfc834e8c2a04a83a90939";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url+item_id+api_info);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.onreadystatechange = function () {
	  if (this.readyState == 4) {
	  	// console.log(this.responseText);
	  	obj = JSON.parse(this.responseText);
		searchItem = obj.item_name; //global
        convertCalories(obj.nf_calories); 
	  }
	};
	xhr.send(null);
}


//takes in item calories and generates conversion to healthy meals
function convertCalories(calories){
	console.log(calories);
	len = healthy.length;
	ind = Math.floor((Math.random() * len)); //Get random number for index of array

	//fill array with division of searched item calories by healthy food calories
	conversions = [];
	for (i = 0; i < len; i++){
		conversions.push(Number((calories/healthy[i].calories).toFixed(1)));
	}

	//generate random number and pass through loadComparison
	loadComparison(conversions, ind);
}

//loads a healthy food comparison based on randHealthy in array 'healthy'
function loadComparison(conversions, ind){
	console.log("conversions1: "+conversions);
	resultHTML = "";
	food_name = healthy[ind].food;
	food_comparison = conversions[ind];
	// question = "How many "+food_name+" have the same calories as one "+searchItem+"?";
	question = "One " + searchItem + " is equivalent to eating <br>" + food_comparison + " " +food_name +".";
	// console.log("conversions2: "+conversions);
	button = "<button onclick='loadComparison(["+conversions+"], "+(ind+1)%healthy.length+")'>Show me another comparison!</button>";
	// console.log("conversions3: "+conversions);

	resultHTML += question+"<br><br>"+button;

	$("#comparison").html(resultHTML);

	console.log(question);
	// console.log(healthy[ind].food + ": " + healthy[ind].calories);

}


//convert all 10 items into cheetos
//put that somewhere (json)
//randomly pick one
//display it "how many "+food+" are in "+searched item+"?"
//if click "show me more!" button: display next item
