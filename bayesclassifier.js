var Tokenizer 		= require('sentence-tokenizer');
var tokenizer		= new Tokenizer('Chuck');
var natural			= require('natural'),
  classifier 		= new natural.BayesClassifier(),
  wordtokenizer		= new natural.WordTokenizer();
var config 			= require('./config.js');
var sanitizeHtml 	= require('sanitize-html');
var node_ner 		= require('node-ner');
var fs 				= require('fs');
var async			= require('async');
var ner 			= new node_ner({
						install_path:	''
						});
var tokens;
var date = new Date();
console.log("Process Start Time : " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
var salCount=0;
var busCount=0;
var sal2Count=false;
var bus2Count=false;
var confPercentage=0;
var derClass;
var classBusinessman = config.classBusinessman;
var classSalaried = config.classSalaried;
var bayesclassifier;

var trainingModel = config.trainingModel;
var salaried = config.salaried;
var businessman = config.businessman;
var salaried2words = config.salaried2words;
var businessman2words = config.businessman2words;

//Adding Documents to the New Model.
for(var i=0;i<trainingModel.length;i++)
{
	classifier.addDocument(trainingModel[i].statement, trainingModel[i].category);
}

//Train the classifier
classifier.train();

//Data Cleansing for the HTML tags	
	input = sanitizeHtml(config.statement, {
		allowedTags: [],
		allowedAttributes: []
	});
	
	input = input.replace(/&amp;/gi,'&').trim();

tokenizer.setEntry(input);

//Tokenizing the sentence from the paragraph.
var sent = tokenizer.getSentences();

// Looping through all the formed sentences.
for(var i=0;i<sent.length;i++)
{
	//console.log((sent[i]));
	// Data cleansing.
	//sent[i] = sent[i].replace(/<BR>/gi,'').trim();
	//sent[i] = sent[i].replace(/&nbsp/gi,'').trim();
	//sent[i] = sent[i].replace(/&amp;/gi,'&').trim();
	
	//Tokenizing the words from the sentence
	tokens = wordtokenizer.tokenize(sent[i]);

	//Initializing the counts to 0
	//salCount = 0;
	//busCount = 0;
	
	// Looping through the generated words.
	for(j=0;j<tokens.length;j++){
		//Looping through to match the word with the salaried keywords.
		for(s=0;s<salaried.length;s++){
			//Finding String Distance using the JaroWinklerDistance API.
			var JWD = natural.JaroWinklerDistance(tokens[j].toLowerCase(),salaried[s].key.toLowerCase());
			// Checking if the word matches salaried dictionary or if the string distance id greater than 0.8.
			if(tokens[j].toLowerCase()==salaried[s].key.toLowerCase() || (parseFloat(JWD) > 0.9)){
				//Incrementing the counter.
				salCount = salCount + 1;
				}
		}		

		//Looping through to match the word with the businessman keywords.
		for(b=0;b<businessman.length;b++){
			//Finding String Distance using the JaroWinklerDistance API.
			var JWD = natural.JaroWinklerDistance(tokens[j].toLowerCase(),businessman[b].key.toLowerCase());
			// Checking if the word matches businessman dictionary or if the string distance id greater than 0.8.
			if(tokens[j].toLowerCase()==businessman[b].key.toLowerCase() || (parseFloat(JWD) > 0.9)){
				//Incrementing the counter.
				busCount = busCount + 1;
				}	
		}
	
		//Spitting the results.
		//console.log(sent[i] +" - "+ classifier.classify(sent[i]) + " - " + tokens[j] + " - " +salCount + " - " + busCount);
	}

	//Tokenizing the words from the sentence
	var tokens2words = wordtokenizer.tokenize(sent[i]);

	//Making the array lower case.
	for(var t2w=0;t2w<tokens2words.length;t2w++){
		tokens2words[t2w] = tokens2words[t2w].toLowerCase(); 
	}

	//Looping through to match the sentence with the businessman2words keywords.
	for(ss=0;ss<salaried2words.length;ss++){
				
		//checking existence in the array.
		if(tokens2words.indexOf(salaried2words[ss].key1.toLowerCase()) > -1 && tokens2words.indexOf(salaried2words[ss].key2.toLowerCase()) > -1){
			sal2Count = true;
		} else{
			//console.log("2 Words not Present in Salary2Words");
		}	
	}
	
	
	//Looping through to match the sentence with the businessman2words keywords.
	for(bb=0;bb<businessman2words.length;bb++){
	
		//checking existence in the array.
		if(tokens2words.indexOf(businessman2words[bb].key1.toLowerCase()) > -1 && tokens2words.indexOf(businessman2words[bb].key2.toLowerCase()) > -1){
			bus2Count = true;
		} else{
			//console.log("2 Words not Present in Business2Words");
		}	
	}
	
	//console.log(sal2Count);
	//console.log(bus2Count);
	//console.log(salCount);
	//console.log(busCount);
	//console.log(sent[i]);
	//console.log(classifier.classify(sent[i]));
	//console.log(config.statement);
	//console.log(classifier.classify(config.statement));	
	
	//console.log(input);	
	
}

	/*	

	First check th appropriate baiyesclassifier
	=> Apply the derived Class	
		First check (double word for true and single word for >0)
		=> Apply the derived category with 90 confidence percentage.
			Else
			Check double word for true and single word =0
			=> Apply the derived category with 70 confidence percentage.
				Else
				Check double word for false  and single word > 0	
				=> Apply the derived category with 40 confidence percentage.
					Else
					Check double word for false  and single word = 0	
					=> Apply the derived category with 0 confidence percentage.
				
	*/
	//Deriving the Confidence Percentage and Class.
	//---------------------------------------------
	bayesclassifier = classifier.classify(config.statement);
	if(bayesclassifier.toLowerCase() == classBusinessman.toLowerCase()){
		derClass = classBusinessman; 
		if(bus2Count == true && parseInt(busCount) > 0){
			confPercentage = config.confidencePercentage.ninety; 
		} else if (bus2Count == true && parseInt(busCount) == 0) {
			confPercentage = config.confidencePercentage.sixty;
		} else if (bus2Count == false && parseInt(busCount) > 0)  {
			confPercentage = config.confidencePercentage.thirty;
		} else if (bus2Count == false && parseInt(busCount) == 0 && sal2Count == false && parseInt(salCount) == 0 ) {
			confPercentage = config.confidencePercentage.zero;
		} else if (sal2Count == true && parseInt(salCount) > 0) {
			confPercentage = config.confidencePercentage.seventy;
			derClass = classSalaried;
		} else if (sal2Count == true && parseInt(salCount) == 0) {
			confPercentage = config.confidencePercentage.forty;
			derClass = classSalaried;
		} else if (sal2Count == false && parseInt(salCount) > 0)  {
			confPercentage = config.confidencePercentage.twenty;
			derClass = classSalaried;
		} else if (sal2Count == false && parseInt(salCount) == 0) {
			confPercentage = config.confidencePercentage.zero;
			derClass = classSalaried;
		}
	} else if (bayesclassifier.toLowerCase() == classSalaried.toLowerCase()) {
		derClass = classSalaried;
		if(sal2Count==true && parseInt(salCount) > 0){ 
			confPercentage = config.confidencePercentage.ninety; 
		} else if (sal2Count==true && parseInt(salCount) == 0) {
			confPercentage = config.confidencePercentage.sixty;
		} else if (sal2Count==false && parseInt(salCount) > 0)  {
			confPercentage = config.confidencePercentage.thirty;
		} else if (sal2Count==false && parseInt(salCount) == 0 && bus2Count ==false && parseInt(busCount) == 0 ) {
			confPercentage = config.confidencePercentage.zero;
		} else if (bus2Count == true && parseInt(busCount) > 0) {
			confPercentage = config.confidencePercentage.seventy;
			derClass = classBusinessman;
		} else if (bus2Count == true && parseInt(busCount) == 0) {
			confPercentage = config.confidencePercentage.forty;
			derClass = classBusinessman;
		} else if (bus2Count == false && parseInt(busCount) > 0)  {
			confPercentage = config.confidencePercentage.twenty;
			derClass = classBusinessman;
		} else if (bus2Count == false && parseInt(busCount) == 0) {
			confPercentage = config.confidencePercentage.zero;
			derClass = classBusinessman;
		}		
	}
	
	async.waterfall([
		function(callback){
			fs.writeFile(config.filename, input, function(err) {
				if(err) {
					return console.log(err);
				}
			
				//console.log("The file was saved!");

				ner.fromFile(config.filename, function(entities) {
					//console.log(entities);
					console.log("=======================================================================================");
					console.log("Results");
					console.log("=======================================================================================");
					console.log("Input : " + input);
					console.log("");
					console.log("Baiyes Classifier : " + bayesclassifier);
					console.log("");
					console.log("Derived Classifier : " + derClass);
					console.log("");
					console.log("Confidence Percentage : " + confPercentage );
					console.log("");
					console.log("Extracted Name Entities (Stanford NER) : " + JSON.stringify(entities));
					console.log("=======================================================================================");
					console.log("=======================================================================================");
					var date1 = new Date();
					console.log("Process End Time : " + date1.getDate() + "/" + (date1.getMonth()+1) + "/" + date1.getFullYear() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds());
				})		
			})
			callback(null, 'Processed File');
		},
		function(arg2,callback){
			//fs.unlink(config.filename)
			callback(null, 'Removed File');
		}		
	],function (err, result) {
		// result now equals 'done'    
		}
	); 