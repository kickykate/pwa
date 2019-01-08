function matchIt() {
	this.initialize = function() {
		// Define our database with indexable fields
		this.db.version(1).stores({
		  clothes: 'key, category, clothing'
		});
	};
	this.put = function(clothes) {
		this.db.clothes.put(clothes);
	};
	this.get = function(id) {
		// to do later
	};
	this.getAllTops = async function () {
		// to do later
	};
	this.getAllBottoms = async function () {
		// to do later
	};
	this.getTop = function() {
        // to do later
	};
    this.getBottom = function() {
        // to do later{
	};
	
	this.db = new Dexie("matchIt");	
	this.initialize();
};

const fileinput = document.getElementById('input-picture');

fileinput.addEventListener('change', (e) => {
    var entry = {
        category: "top",
        clothing: "short",
        key: Math.random()
    };

    var matchItDb = new matchIt();
    matchItDb.put(entry);
})