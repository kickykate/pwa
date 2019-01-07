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
		this.db.clothes.get(id);
	};
	this.getAllTops = async function () {
		return await this.db.clothes.where('clothing').equalsIgnoreCase("top").toArray();
	};
	this.getAllBottoms = async function () {
		return await this.db.clothes.where('clothing').equalsIgnoreCase("bottom").toArray();
	};
	this.getTop = function() {
		var allTops = this.getAllTops()
			.then(function(allTops) {
				var index = Math.floor(Math.random() * (allTops.length));
				return allTops[index];
		});;
	};
	this.getBottom = function() {
		var allBottoms = this.getAllBottoms()
			.then(function(allBottoms) {
				var index = Math.floor(Math.random() * (allBottoms.length));
				return allBottoms[index];
		})
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

const fileInput = document.getElementById('input-picture');

fileInput.addEventListener('change', (e) => {
	var category = document.querySelector('input[name="category"]:checked').value;
	var clothing = document.querySelector('input[name="clothing"]:checked').value;
	
	imageHelper.blobToArrayBuffer(e.target.files[0])
		.then(function(arrayBuffer) {
			var entry = {
				category: category,
				clothing: clothing,
				image: arrayBuffer,
				imageType: typeof e.target.files[0],
				key: Math.random()
			};

			var matchItDb = new matchIt();
			matchItDb.put(entry);
		});
});

showSection = function(clothes, title) {
	var container = document.getElementById('cards');
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

this.showAll();