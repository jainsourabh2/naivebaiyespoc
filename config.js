//module.exports.statement='&nbsp; <TABLE cellSpacing=0 cols=1 rules=groups border=1 frame=void> <COLGROUP> <COL width=493></COLGROUP> <TBODY><TR><TD Aalign=top align=left width=493 height=697>He owns Happiest Minds and stays in Thane. While servicing we shld have explored possibilitty of fixing a jt call with pbg &amp; hsl rm to sign up for hsl rm as well improve trading volumes 16/12/08 <BR> Sign up for ISA, WAS 16/12/08 <BR>Position gold bar 16/12/08 <BR>Probe re. AL/HL &amp; Various fx pdts offered by the bank.</TD></TR></TBODY></TABLE>';

//module.exports.statement='Client is been an nri for more than 12 years and is based in Saudi. He is in the business of wholesale trading. His family consists of wife and 2 kids. His annual income is around 150-200k. His bankers include hsbc and sbi. his total networth would be in the range of 4-5 mio usd.';

//module.exports.statement='The customer is working for Qatar insurance company and he is 29 years old. Newly married and he is settled in Abudhabi.//';

//module.exports.statement='The customer works in GASCO, engineer by profession and he has few deposits in INR with Hdfc. The customer earns AED 40,000/-pm. Settled down with his family in Abudhabi and he is from Chennai.';

module.exports.statement='The customer works for Arabtec in the auditing department in World trade centre in Abudhabi. The customer has been settled here for more than 2 decades and he has a diversed portfolio in terms of currencies.';

//module.exports.statement='Mobile +91 97150344287&nbsp; <BR>Email<A href="mailto:ksridhar9@yahoo.com">ksridhar9@yahoo.com</A><BR>Birth date 08/05/1974&nbsp;<BR>';

//module.exports.statement='The customer is settled in UAE.';

module.exports.recordset=[
{NoteItemID:"101",Details:'The customer is working for Qatar insurance company and he is 29 years old. Newly married and he is settled in Abudhabi.'},
{NoteItemID:"102",Details:'Mobile +91 97150344287&nbsp; <BR>Email<A href="mailto:ksridhar9@yahoo.com">ksridhar9@yahoo.com</A><BR>Birth date 08/05/1974&nbsp;<BR>'},
{NoteItemID:"103",Details:''},
{NoteItemID:"104",Details:'The customer works for Arabtec in the auditing department in World trade centre in Abudhabi. The customer has been settled here for more than 2 decades and he has a diversed portfolio in terms of currencies.'},
{NoteItemID:"105",Details:'&nbsp; <TABLE cellSpacing=0 cols=1 rules=groups border=1 frame=void> <COLGROUP> <COL width=493></COLGROUP> <TBODY><TR><TD Aalign=top align=left width=493 height=697>He owns a company and stays in Thane. While servicing we shld have explored possibilitty of fixing a jt call with pbg &amp; hsl rm to sign up for hsl rm as well improve trading volumes 16/12/08 <BR> Sign up for ISA, WAS 16/12/08 <BR>Position gold bar 16/12/08 <BR>Probe re. AL/HL &amp; Various fx pdts offered by the bank.</TD></TR></TBODY></TABLE>'}
];

const 	zero 	= 	0,
		ten		= 	10,
		twenty	=	20,
		thirty	=	30,
		forty	=	40,
		fifty	=	50,
		sixty	=	60,
		seventy	=	70,
		eighty	=	80,
		ninety	=	90,
		hundred	=	100;

const	businessman = 	"BusinessMan",
		salaried	=	"Salaried",
		none		=	"None";

module.exports.filename='sample1.txt';
module.exports.output='output.json';
module.exports.classifier = 'english.muc.7class.distsim.crf.ser.gz';

module.exports.trainingModel=[
{category:"Salaried",statement:"Customer works in a company"},
{category:"Salaried",statement:"Customer is employed in a company"},
{category:"Salaried",statement:"Customer is employeed in a company"},
{category:"Salaried",statement:"Customers annual income is some lacs per annum"},
{category:"Salaried",statement:"Customer loves his job"},
{category:"Salaried",statement:"Customer hates his job"},
{category:"Salaried",statement:"Customers job timings are 8 am to 10 pm"},
{category:"Salaried",statement:"Customers shift starts at noon"},
{category:"Salaried",statement:"Customers shift starts at night"},
{category:"Salaried",statement:"Customer is working in a company"},
{category:"Salaried",statement:"He works in a company"},
{category:"Salaried",statement:"He is employed in a company"},
{category:"Salaried",statement:"He is employeed in a company"},
{category:"Salaried",statement:"His annual income is some lacs per annum"},
{category:"Salaried",statement:"He loves his job"},
{category:"Salaried",statement:"He hates his job"},
{category:"Salaried",statement:"His job timings are 8 am to 10 pm"},
{category:"Salaried",statement:"His shift starts at noon"},
{category:"Salaried",statement:"His shift starts at night"},
{category:"Salaried",statement:"He is working in a company"},
{category:"BusinessMan",statement:"Customer owns a shop"},
{category:"BusinessMan",statement:"Customer is a BusinessMan"},
{category:"BusinessMan",statement:"Customers shops is in a location"},
{category:"BusinessMan",statement:"Customers turnover is lacs per annum"},
{category:"BusinessMan",statement:"Customer is a business tycoon"},
{category:"BusinessMan",statement:"Customer is selfemployeed"},
{category:"BusinessMan",statement:"Customer runs a family business"},
{category:"BusinessMan",statement:"Customer owns a family business"},
{category:"BusinessMan",statement:"Customer is a partner"},
{category:"BusinessMan",statement:"Customer has an office in location."},
{category:"BusinessMan",statement:"He owns a shop"},
{category:"BusinessMan",statement:"He is a BusinessMan"},
{category:"BusinessMan",statement:"His shop is in a location"},
{category:"BusinessMan",statement:"His business turnover is lacs per annum"},
{category:"BusinessMan",statement:"He is a business tycoon"},
{category:"BusinessMan",statement:"He is selfemployeed"},
{category:"BusinessMan",statement:"He owns a factory"},
{category:"BusinessMan",statement:"He runs a family business"},
{category:"BusinessMan",statement:"He owns a family business"},
{category:"BusinessMan",statement:"He is a partner"},
{category:"BusinessMan",statement:"He has an office in location."}
//{category:"SE Professional",statement:"He is a government officer"}
];

module.exports.salaried=[
{key:"working"},
{key:"employed"},
{key:"employeed"},
{key:"job"},
{key:"works"},
{key:"salary"},
{key:"salaried"},
{key:"engineer"}
];

module.exports.businessman=[
{key:"businessman"},
{key:"turnover"},
{key:"tycoon"},
{key:"crores"},
{key:"selfemployeed"},
{key:"self-employeed"},
{key:"factory"},
{key:"partner"},
{key:"owner"},
{key:"owns"}
];

module.exports.salaried2words=[
{key1:"working",key2:"company"},
{key1:"employed",key2:"currently"},
{key1:"job",key2:"salary"},
{key1:"salary",key2:"individual"},
{key1:"salaried",key2:"individual"},
{key1:"working",key2:"as"},
{key1:"working",key2:"with"},
{key1:"working",key2:"is"},
{key1:"employed",key2:"at"},
{key1:"employeed",key2:"at"},
{key1:"employed",key2:"in"},
{key1:"employeed",key2:"in"},
{key1:"works",key2:"in"},
{key1:"works",key2:"for"}
];

module.exports.businessman2words=[
{key1:"business",key2:"owns"},
{key1:"turnover",key2:"annual"},
{key1:"tycoon",key2:"business"},
{key1:"crores",key2:"turnover"},
{key1:"Self",key2:"employeed"},
{key1:"owns",key2:"business"},
{key1:"has",key2:"business"},
{key1:"family",key2:"business"},
{key1:"in",key2:"business"},
{key1:"has",key2:"office"},
{key1:"owns",key2:"office"},
{key1:"of",key2:"owner"},
{key1:"has",key2:"shop"},
{key1:"owns",key2:"shop"},
{key1:"owns",key2:"company"},
{key1:"owns",key2:"factory"}
];

module.exports.classBusinessman = businessman;
module.exports.classSalaried 	= salaried;
module.exports.classNone		= none;	

module.exports.confidencePercentage={
	zero 	: 	zero,
	twenty	:	twenty,
	thirty	: 	thirty,
	forty 	: 	forty,
	sixty	:	sixty,
	seventy : 	seventy,
	ninety 	:	ninety 
}