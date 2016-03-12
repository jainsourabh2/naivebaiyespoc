var Tokenizer 	= require('sentence-tokenizer');
var tokenizer	= new Tokenizer('Chuck');
var natural	= require('natural'),
  classifier 	= new natural.BayesClassifier(),
  wordtokenizer	= new natural.WordTokenizer();
var config 	= require('./config.js');
var sanitizeHtml = require('sanitize-html');
var tokens;
var salCount=0;
var busCount=0;
var sal2Count=false;
var bus2Count=false;

//console.log(config.trainingModel.category[0]);
var trainingModel = config.trainingModel;
var salaried = config.salaried;
var businessman = config.businessman;
var salaried2words = config.salaried2words;
var businessman2words = config.businessman2words;

//console.log(salaried.length);
//console.log(businessman.length);
//console.log(trainingModel.length);
//Adding Documents to the New Model.
for(var i=0;i<trainingModel.length;i++)
{
//console.log(trainingModel[i].category);
//console.log(trainingModel[i].statement);
	classifier.addDocument(trainingModel[i].statement, trainingModel[i].category);
}

//Train the classifier
classifier.train();

//tokenizer.setEntry("<BR> He runs a garment factory. His annual salary is 5 crores. He has a son and a daughter. He has an account with ICICI. He is retired RBI officer. He is a partner with milan supari");

//tokenizer.setEntry("&nbsp;Family Size: 2,Antointte nagpal &amp; her son...");

//Data Cleansing for the HTML tags	
	input = sanitizeHtml(config.statement, {
		allowedTags: [],
		allowedAttributes: []
	});

tokenizer.setEntry(input);
//console.log(Ngrams.bigrams("How are you?"));

//Tokenizing the sentence from the paragraph.
var sent = tokenizer.getSentences();

// Looping through all the formed sentences.
for(var i=0;i<sent.length;i++)
{
	//console.log((sent[i]));
	// Data cleansing.
	//sent[i] = sent[i].replace(/<BR>/gi,'').trim();
	//sent[i] = sent[i].replace(/&nbsp/gi,'').trim();
	sent[i] = sent[i].replace(/&amp;/gi,'').trim();
	
	//Tokenizing the words from the sentence
	tokens = wordtokenizer.tokenize(sent[i]);
	//console.log(tokens.length);
	//Initializing the counts to 0
	salCount = 0;
	busCount = 0;
	
	// Looping through the generated words.
	for(j=0;j<tokens.length;j++){
		//Looping through to match the word with the salaried keywords.
		for(s=0;s<salaried.length;s++){
			//Finding String Distance using the JaroWinklerDistance API.
			var JWD = natural.JaroWinklerDistance(tokens[j].toLowerCase(),salaried[s].key.toLowerCase());
			// Checking if the word matches salaried dictionary or if the string distance id greater than 0.8.
			if(tokens[j].toLowerCase()==salaried[s].key.toLowerCase() || (parseFloat(JWD) > 0.9)){
				//console.log(salCount);
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
		console.log(sent[i] +" - "+ classifier.classify(sent[i]) + " - " + tokens[j] + " - " +salCount + " - " + busCount);
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
	
	console.log(sal2Count);
	console.log(bus2Count);
	console.log(salCount);
	console.log(busCount);
	var bayesclassifier = console.log(classifier.classify(config.statement));
	
	console.log(input);
	
}