const timestamp = new Date().getTime();
const url = 'https://corsproxy.io/?' + encodeURIComponent('raw.githubusercontent.com/mrdaveu/licksite/main/database.json?v=') + timestamp;
const url2 = 'https://licks.site/database.json/'
let activeAudio = null;

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
   const contentDiv = document.getElementById("content");
   const aboutPage = document.getElementById("content")
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
            div.innerHTML = key === 'difficulty' ? ['V.Easy', 'Easy', 'Medium', 'Hard', 'V.Hard'][data[id][key] - 1] : data[id][key];
            listItem.appendChild(div);
            });
            listItem.addEventListener("mouseover", function() {
               updateContent(data[id], id);
            });
            listItem.addEventListener("click", function() {
               updateContent(data[id], id);
               if (window.innerWidth < 1050) {
                  navigation.style.display = "none";
                  contentDiv.style.display = "block";
                  }
               else {}
            });
         navigation.appendChild(listItem);
         });
         const uniqueContributors = Array.from(new Set(Object.values(data).map(item => item.contributor))).join(', ');
         const contributorsText = 'Thank you to our contributors ' + uniqueContributors + '.';
         const aboutDiv = document.getElementById('about');
         aboutDiv.textContent = contributorsText;
      });
});

function updateContent(item, id) {
   const xml_src = "https://raw.githubusercontent.com/mrdaveu/licksite/main/" + id + ".musicxml";
   const audio_src = "https://raw.githubusercontent.com/mrdaveu/licksite/main/" + id + ".m4a";
   const audio = new Audio(audio_src);
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

   const nav = document.getElementById("data" + id);
   document.querySelectorAll('li.data div.active').forEach((activeNavItem) => {
       activeNavItem.classList.remove('active');
   });
   nav.children[0].classList.add('active');
   nav.children[1].classList.add('active');
   function playAudio() {

      if (activeAudio) {
        activeAudio.pause();
      }
      audio.play();
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
 
   // class 'nav-item' switcher 
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
   // event listener for pressing 'about'  
   const aboutButton = document.getElementById('aboutButton');
   const aboutPage = document.querySelector('.aboutPage');
   const otherElements = document.querySelectorAll('.header, .grid, .footer');

   aboutButton.addEventListener('click', () => {
       // Toggle visibility of the about page
       if (aboutPage.style.display === 'none' || aboutPage.style.display === '') {
           aboutPage.style.display = 'block';

           // Hide other elements
           otherElements.forEach(element => {
               element.style.display = 'none';
           });
       } else {
           aboutPage.style.display = 'none';

           // Show other elements
           otherElements.forEach(element => {
               element.style.display = 'block';
           });
       }
   });
 });
 