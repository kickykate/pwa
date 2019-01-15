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
		return await this.db.clothes.where('clothing').equalsIgnoreCase('top').toArray();
	};
	this.getAllBottoms = async function () {
		return await this.db.clothes.where('clothing').equalsIgnoreCase('bottom').toArray();
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

var imageHelper = {
	arrayBufferToBlob: function (buffer, type) {
		return new Blob([buffer], {type: type});
	},
	blobToArrayBuffer: function (blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.addEventListener('loadend', (e) => {
				resolve(reader.result);
			});
			reader.addEventListener('error', reject);
			reader.readAsArrayBuffer(blob);
		});
	}
};

const fileinput = document.getElementById('input-picture');
var myImage;
var myImageType;

fileinput.addEventListener('change', (e) => {
	myImage = e.target.files[0];
	myImageType = typeof e.target.files[0];
});

var btnAdd = document.getElementById("btnadd");
btnAdd.addEventListener('click', (e) => {
	var category = document.querySelector('input[name="category"]:checked').value;
	var clothing = document.querySelector('input[name="clothing"]:checked').value;
	
	// var myImage = fileinput.files[0];

	imageHelper.blobToArrayBuffer(myImage)
		.then(function(arrayBuffer) {
			var entry = {
				category: category,
				clothing: clothing,
				image: arrayBuffer,
				imageType: myImageType,
				key: Math.random()
			};

			var matchItDb = new matchIt();
			matchItDb.put(entry);

			alert('saved!!!');
		});
});

var btnShow = document.getElementById("btnShow");
btnShow.addEventListener('click', (e) => {
	location.reload();
})

showSection = function(clothes, title) {
	var container = document.getElementById('clothes-section');
	var output = "<h1>" + title + "</h1>";
	
	for(var i = 0; i < clothes.length - 1; i++) {
		var imageBlob = imageHelper.arrayBufferToBlob(clothes[i].image, clothes[i].imageType);
		
		var binaryData = [];
		binaryData.push(clothes[i].image);
		var imageUrl = window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}));
		
		output += "<article><img class='article-img' src='" + imageUrl + "' alt=' '/><h1 class='article-title'>" + clothes[i].category + clothes[i].clothing + "</h1></article>";
	}
	
	container.innerHTML = output
};

showAll = function() {
	var matchItDb = new matchIt();
	matchItDb.getAllTops().then((clothes) => { showSection(clothes, "tops") });
	matchItDb.getAllBottoms().then((clothes) => { showSection(clothes, "bottoms") });
};

var matchItDb = new matchIt();
this.showAll();