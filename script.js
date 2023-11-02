const url = 'https://corsproxy.io/?' + encodeURIComponent('https://raw.githubusercontent.com/mrdaveu/licksite/main/database.json');

async function fadeInAudio(audio, duration) {
   audio.volume = 0;
   audio.play();
   
   for (let i = 0; i <= duration; i += 10) {
     await new Promise(resolve => setTimeout(resolve, 10));
     audio.volume = i / duration;
   }
}

document.addEventListener("DOMContentLoaded", function() {
   const navigation = document.getElementById("navigation");
   fetch(url)
      .then(response => response.json())
      .then(data => {
         console.log(data);
         Object.keys(data).forEach(id => {
            const listItem = document.createElement("li");
            listItem.className = "data";
            ['songName', 'artist', 'difficulty', 'instrument', 'tempo'].forEach(key => {
            const div = document.createElement("div");
            div.innerHTML = key === 'difficulty' ? ['V.Easy', 'Easy', 'Medium', 'Hard', 'V.Hard'][data[id][key] - 1] : data[id][key];
            listItem.appendChild(div);
            });
            listItem.addEventListener("mouseover", function() {
            updateContent(data[id], id);
            });
            listItem.addEventListener("click", function() {
               updateContent(data[id], id);
            });
            navigation.appendChild(listItem);
         });
      });

   function updateContent(item, id) {
      const xml_src = "https://raw.githubusercontent.com/mrdaveu/licksite/main/" + id + ".musicxml";
      const audio_src = "https://raw.githubusercontent.com/mrdaveu/licksite/main/" + id + ".m4a";
      document.getElementById("osmdContainer").innerHTML = "";
      document.getElementById("title").innerHTML = "";
      const osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay("osmdContainer");
      osmd.setOptions({
         backend: "svg",
         drawTitle: false,
         drawMeasureNumbers: false, 
         defaultFontFamily: 'Noto Serif',
         drawingParameters: "compacttight"
      });
      osmd
         .load(xml_src)
         .then(() => {
            if (window.innerWidth < 650) {
               osmd.Zoom = 0.66; 
            }
            else {
               osmd.Zoom = 0.75;
            }
            osmd.render();
         });
         const titleElement = document.createElement("h2");
         const artistElement = document.createElement("div");
         const subheadElement = document.createElement("h3");
       
         titleElement.innerHTML = item["songName"] || "";
         artistElement.innerHTML = item["albumName"] ? `${item["artist"]} on "${item["albumName"]}"` : (item["artist"] || "");
         subheadElement.innerHTML = 
         (item["tempo"] ? `Tempo: ${item["tempo"]}` : "") + (item["difficulty"] ? ` / ${['Easiest', 'Easier', 'Easy', 'Not That Easy', 'Not Easy At All'][item["difficulty"] - 1]}` : "")
         + (item["chordProgression"] ? ` / Chords: ${item["chordProgression"]}` : "");
         document.getElementById("title").appendChild(titleElement);
         document.getElementById("title").appendChild(artistElement);
         document.getElementById("title").appendChild(subheadElement);

         // Update description
         const description = document.getElementById("description");
         description.innerHTML = item["description"] ? `${item["description"]}` : "";
      }
      const audio = new Audio(audio_src);
      fadeInAudio(audio, 2000);
});

document.addEventListener('DOMContentLoaded', (event) => {
   // Initialize button and div elements
   const backButton = document.getElementById("backButton");
   const navigationDiv = document.getElementById("navigation");
   const contentDiv = document.getElementById("content");
   function toggleVisibility() {
      if (window.innerWidth < 1050 && contentDiv.style.display == "block") {
        navigationDiv.style.display = "none";
      } 
      else if (window.innerWidth < 1050) {
        contentDiv.style.display = "none";
      }
      else {
         navigationDiv.style.display = "block";
         contentDiv.style.display = "block";
      }
    }
   
    // Initial call to set visibility
    toggleVisibility();
    
    // Event listener for window resize
    window.addEventListener("resize", toggleVisibility);
    
   // Event listener for back button
   backButton.addEventListener("click", function() {
     contentDiv.style.display = "none";
     navigationDiv.style.display = "block";
   });
 
   // Assuming you have a list of li elements with a class 'nav-item'
   const listItems = document.querySelectorAll(".data");
   listItems.forEach((item) => {
     item.addEventListener("click", function() {
         if (window.innerWidth < 1050) {
            navigationDiv.style.display = "none";
            contentDiv.style.display = "block";
         }
         else {}
     });
   });
 });
 
