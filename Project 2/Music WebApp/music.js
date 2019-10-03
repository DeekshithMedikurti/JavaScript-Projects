// Put your Last.fm API key here
var api_key = "f45b23d766f17a0e73efec090c17ddf7";

function sendRequest() {
    var xhr = new XMLHttpRequest();
    var method = "artist.getinfo";
    var artist = encodeURI(document.getElementById("form-input").value);
    xhr.open("GET", "proxy.php?method=" + method + "&artist=" + artist + "&api_key=" + api_key + "&format=json", true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            var json = JSON.parse(this.responseText);
            if (json != null) {
                var artist = json["artist"]
                renderArtist(artist)
            }
        }
    };
    xhr.send();
}

function renderArtist(artist) {
    var div = document.getElementById("output")
    div.setAttribute('align','center')
    var artist_name = artist["name"]
    var artist_bio = artist["bio"]
    var artist_link = artist_bio["links"]["link"]["href"]
    var artist_summary = artist_bio["content"]
    div.innerHTML = `
    <h1 class="app-title"> ${artist_name}</h1><br>
    <img src="${artist["image"][2]['#text']}"><br>
    <a href=${artist_link}> Click here to visit ${artist_name}</a><br>
    <p>${artist_summary}</p><br>
    `
    getTopAlbums()
}

function getTopAlbums(){
    var xhr = new XMLHttpRequest();
    var method = "artist.gettopalbums";
    var artist = encodeURI(document.getElementById("form-input").value);
    xhr.open("GET", "proxy.php?method=" + method + "&artist=" + artist + "&api_key=" + api_key + "&format=json", true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            var json = JSON.parse(this.responseText);
            if (json != null) {
                renderAlbums(json)
            }
        }
    };
    xhr.send();
}

function renderAlbums(json){
    var listOfAlbums = json["topalbums"]["album"]
    var artist_name = document.getElementById("form-input").value
    console.log(artist_name)
    document.getElementById("albums_list").innerHTML = `
    <h2 class="albums-title">Top Albums of ${artist_name}</h2>
    ${listOfAlbums.map(function(album){
        if(album.name != '(null)'){
            return `
        <div class="album">
            <h3 class="album-title">${album.name}</h3>
            <img class="album-photo" src="${album["image"][2]['#text']}">
        </div>
        `
        }
    }).join('')}
    `
    getSimilarArtists()
}

function getSimilarArtists(){
    var xhr = new XMLHttpRequest();
    var method = "artist.getSimilar";
    var artist = encodeURI(document.getElementById("form-input").value);
    xhr.open("GET", "proxy.php?method=" + method + "&artist=" + artist + "&api_key=" + api_key + "&format=json", true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            var json = JSON.parse(this.responseText);
            if (json != null) {
                renderSimilarArtists(json)
            }
        }
    };
    xhr.send();
}

function renderSimilarArtists(json){
    var listOfSimilarArtists = json["similarartists"]["artist"]
    console.log(listOfSimilarArtists[0]['url'])
    document.getElementById("similar_artists").innerHTML = `
    <h4 class="albums-title">Similar Artists</h4>
    ${listOfSimilarArtists.map(function(artist){
        if(artist.name != '(null)'){
            return `
        <div>
            <h5 class="album-title">${artist.name}</h5>
        </div>
        `
        }
    }).join('')}
    `
}