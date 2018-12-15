const dbName = "clothes_db";

var db;
var objectStore;
var request = indexedDB.open(dbName, 2);

var clothes = [];

request.onerror = function(event) {
  // Handle errors.
};
request.onsuccess = function(event) {
  db = event.target.result;
};
request.onupgradeneeded = function(event) {
	console.log("onupgradeneeded");
	
	var db = event.target.result;
	
	// Create an objectStore to hold information about our customers. We're
	// going to use "ssn" as our key path because it's guaranteed to be
	// unique - or at least that's what I was told during the kickoff meeting.
	var objectStore = db.createObjectStore("clothes", { keyPath: "key" });
  
	// Create an index to search customers by name. We may have duplicates
	// so we can't use a unique index.
	objectStore.createIndex("category", "category", { unique: false });

	// Create an index to search customers by email. We want to ensure that
	// no two customers have the same email, so use a unique index.
	objectStore.createIndex("clothing", "clothing", { unique: false });

	// Use transaction oncomplete to make sure the objectStore creation is 
	// finished before adding data into it.
	objectStore.transaction.oncomplete = function(event) {
		// Store values in the newly created objectStore.
		var customerObjectStore = db.transaction("clothes", "readwrite").objectStore("customers");
		customerData.forEach(function(customer) {
		customerObjectStore.put(customer);
		});
	};
};
request.put = function (clothes) {
	console.log('in put');
	
	// Open a transaction to the database
	var transaction = db.transaction(["clothes"], "readwrite").objectStore("clothes");

	// Put the blob into the dabase
	var key = clothes.key;
	
	console.log('before put');
	
	var put = transaction.put(clothes);
	
	console.log('after put');
};
request.get = function(key) {
	var objectStore = db.transaction("clothes", "readwrite").objectStore("clothes");
	var index = objectStore.index("category");

	index.get("warm").onsuccess = function(event) {
		console.log(event.target.result);
	};
}
request.query = function(key) {
	var objectStore = db.transaction("clothes", "readwrite").objectStore("clothes");
	var index = objectStore.index("category");

	// Using a normal cursor to grab whole customer record objects
	index.openCursor().onsuccess = function(event) {
	  var cursor = event.target.result;
	  if (cursor) {
		// cursor.key is a name, like "Bill", and cursor.value is the whole object.
		console.log(cursor.value.category + " " + cursor.value.clothing + " " + cursor.value.key);
		
		clothes.push(cursor.value);
		
		cursor.continue();
	  }
	};

	console.log("get one at random");
	// get one at random
	var index = Math.floor(Math.random() * (clothes.length - 0 + 1)) + 0;
	console.log(index);
	
	console.log(clothes[index]);
}
request.showAll = function() {
	console.log(clothes);

	var container = document.getElementById('cards');
	var output = "";
	
	for(var i = 0; i < clothes.length - 1; i++) {
		//var urlCreator = window.URL || window.webkitURL;
		//var imageUrl = urlCreator.createObjectURL(clothes[i].image);

		var imageBlob = request.arrayBufferToBlob(clothes[i].image, clothes[i].imageType);
		
		var binaryData = [];
		binaryData.push(clothes[i].image);
		var imageUrl = window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}));
		
		output += "<article><img class='article-img' src='" + imageUrl + "' alt=' '/><h1 class='article-title'>" + clothes[i].category + clothes[i].clothing + "</h1></article>";
	}
	
	container.innerHTML = output
}
request.blah = function() {
	request.query("test");
	request.showAll();
}
request.testPut = function() {
	console.log("before testPut")

	var o = {
		key: "sup",
		category: "bleh"
	};
	
	var objectStore = db.transaction(['clothes'], "readwrite").objectStore('clothes');
	var updateTitleRequest = objectStore.put(o);
	
	console.log("after testPut")
}
request.arrayBufferToBlob = function (buffer, type) {
  return new Blob([buffer], {type: type});
}
request.blobToArrayBuffer = function (blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      resolve(reader.result);
    });
    reader.addEventListener('error', reject);
    reader.readAsArrayBuffer(blob);
  });
}

const fileInput = document.getElementById('input-picture');

fileInput.addEventListener('change', (e) => {
	console.log('on change');
	
	var category = document.querySelector('input[name="category"]:checked').value;
	var clothing = document.querySelector('input[name="clothing"]:checked').value;

	request.blobToArrayBuffer(e.target.files[0])
		.then(function(arrayBuffer) {
			var clothing = {
				category: category,
				clothing: clothing,
				image: arrayBuffer,
				imageType: typeof e.target.files[0],
				key: Math.random()
			};

			request.put(clothing);
		});
});