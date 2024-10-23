const timestamp = new Date().getTime();
const url = 'https://corsproxy.io/?' + encodeURIComponent('raw.githubusercontent.com/mrdaveu/licksite/main/database.json?v=') + timestamp;
const url2 = 'https://licks.site/database.json/';
let activeAudio = null;

// Create a map to store and reuse audio instances
const audioMap = new Map();

async function fadeInAudio(audio, duration) {
   try {
      audio.volume = 0;
      await audio.play();
      
      for (let i = 0; i <= duration; i += 10) {
         await new Promise(resolve => setTimeout(resolve, 10));
         audio.volume = Math.min(i / duration, 1);
      }
   } catch (error) {
      console.error("Failed to fade in audio:", error);
      // Optionally, display a user-friendly message or take other actions
   }
}

document.addEventListener("DOMContentLoaded", function() {
   const navigation = document.getElementById("navigation");
   const contentDiv = document.getElementById("content");
   
   fetch(url2)
      .then(response => response.json())
      .then(data => {
         console.log(data);
         Object.keys(data).forEach(id => {
            const listItem = document.createElement("li");
            listItem.className = "data";
            listItem.id = "data" + id;
            
            ['songName', 'artist', 'difficulty', 'instrument', 'tempo'].forEach(key => {
               const div = document.createElement("div");
               div.innerHTML = key === 'difficulty' 
                  ? ['V.Easy', 'Easy', 'Medium', 'Hard', 'V.Hard'][data[id][key] - 1] 
                  : data[id][key];
               listItem.appendChild(div);
            });
            
            // Use 'mouseenter' and ensure it's triggered by the parent only
            listItem.addEventListener("mouseenter", function(event) {
               if (event.currentTarget === event.target || event.target === listItem) {
                  updateContent(data[id], id);
               }
            });
            
            listItem.addEventListener("click", function() {
               updateContent(data[id], id);
               if (window.innerWidth < 1050) {
                  navigation.style.display = "none";
                  contentDiv.style.display = "block";
               }
            });
         navigation.appendChild(listItem);
         });
         const uniqueContributors = Array.from(new Set(Object.values(data).map(item => item.contributor))).join(', ');
         const contributorsText = 'Thank you to our contributors ' + uniqueContributors + '.';
         const aboutDiv = document.getElementById('about');
         aboutDiv.textContent = contributorsText;
      })
      .catch(error => {
         console.error("Failed to fetch data:", error);
         // Optionally, display an error message to the user
      });
});

function updateContent(item, id) {
   const xml_src = "https://raw.githubusercontent.com/mrdaveu/licksite/main/" + id + ".musicxml";
   const audio_src = "https://raw.githubusercontent.com/mrdaveu/licksite/main/" + id + ".m4a";
   
   // Reuse audio instances from the map
   let audio;
   if (audioMap.has(id)) {
      audio = audioMap.get(id);
   } else {
      audio = new Audio(audio_src);
      audioMap.set(id, audio);
   }
   
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
      })
      .catch(error => {
         console.error("Failed to load or render music XML:", error);
         // Optionally, notify the user
      });
      
   const titleElement = document.createElement("h2");
   const artistElement = document.createElement("div");
   const subheadElement = document.createElement("h3");
   
   titleElement.innerHTML = item["songName"] || "";
   artistElement.innerHTML = item["albumName"] ? `${item["artist"]} on "${item["albumName"]}"` : (item["artist"] || "");
   subheadElement.innerHTML = 
      (item["tempo"] ? `Tempo: ${item["tempo"]}` : "") + 
      (item["difficulty"] ? ` / ${['Easiest', 'Easier', 'Easy', 'Not That Easy', 'Not Easy At All'][item["difficulty"] - 1]}` : "") +
      (item["chordProgression"] ? ` / Chords: ${item["chordProgression"]}` : "");
   
   const titleContainer = document.getElementById("title");
   titleContainer.appendChild(titleElement);
   titleContainer.appendChild(artistElement);
   titleContainer.appendChild(subheadElement);

   // Update description
   const description = document.getElementById("description");
   description.innerHTML = item["description"] ? `${item["description"]}` : "";

   const nav = document.getElementById("data" + id);
   document.querySelectorAll('li.data div.active').forEach((activeNavItem) => {
       activeNavItem.classList.remove('active');
   });
   nav.children[0].classList.add('active');
   nav.children[1].classList.add('active');

   function playAudio() {
      if (activeAudio && activeAudio !== audio) {
         activeAudio.pause();
      }
      audio.play().catch(error => {
         console.error("Audio playback failed:", error);
         // Optionally, notify the user or handle the error
      });
      activeAudio = audio;
   }
   playAudio();
   
   const playButton = document.getElementById("playLick");
   playButton.addEventListener("click", () => {
      playAudio();
   });
}

document.addEventListener('DOMContentLoaded', (event) => {
   // Initialize button and div elements
   const backButton = document.getElementById("backButton");
   const navigationDiv = document.getElementById("navigation");
   const contentDiv = document.getElementById("content");
   
   function toggleVisibility() {
      if (window.innerWidth < 1050 && contentDiv.style.display === "block") {
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
 
   // Class 'nav-item' switcher 
   const listItems = document.querySelectorAll(".data");
   listItems.forEach((item) => {
     item.addEventListener("click", function() {
         if (window.innerWidth < 1050) {
            navigationDiv.style.display = "none";
            contentDiv.style.display = "block";
         }
     });
   });
   
   // Event listener for pressing 'about'  
   const aboutButton = document.getElementById('aboutButton');
   const closeButton = document.getElementById('closeButton');
   const aboutPage = document.querySelector('.aboutPage');
   
   aboutButton.addEventListener('click', () => {
       aboutPage.style.display = 'block'; 
   });
   
   closeButton.addEventListener('click', () => {
       aboutPage.style.display = 'none'; 
   });
});
