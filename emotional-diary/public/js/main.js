document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You have to login.");
      location.href = "login.html";
      return;
    }
  
    const shelf = document.querySelector(".shelf");
  
    try {
      const res = await fetch(`/api/diary?userId=${userId}`);
      const data = await res.json();
  
      const recent25 = data.slice(0, 25); //cerrently only show the most recent 25 entries
      if (recent25.length === 0) {
        // If no entries, show an empty orb
        const emptyOrb = document.createElement("div");
        emptyOrb.classList.add("orb", "empty");
        emptyOrb.title = "No diaries yet";
      
        emptyOrb.addEventListener("click", () => {
          showCard({
            date: "None",
            emotion: "None",
            keyword1: "-",
            keyword2: "-",
            keyword3: "-"
          });
        });
      
        shelf.appendChild(emptyOrb);
        return;
      }
      recent25.forEach(entry => {
        const orb = document.createElement("div");
        orb.classList.add("orb", entry.emotion.toLowerCase());
        orb.title = `${entry.date} - ${entry.emotion}`;
  
        // show card when clicked
        orb.addEventListener("click", () => {
          showCard(entry);
        });
  
        shelf.appendChild(orb);
      });
    } catch (err) {
      console.error("Loading erroe:", err);
      alert("We cannot load emotion orb.");
    }
  });
  
  // showing as a card
  function showCard(entry) {
    // remove old card if exists
    const oldCard = document.getElementById("diary-card");
    if (oldCard) oldCard.remove();
  
    const card = document.createElement("div");
    card.id = "diary-card";
    card.classList.add("card");
  
    card.innerHTML = `
      <h3>${entry.date}</h3>
      <p><strong>Emotion:</strong> ${entry.emotion}</p>
      <p><strong>Keywords:</strong></p>
      <ul>
        <li>${entry.keyword1}</li>
        <li>${entry.keyword2}</li>
        <li>${entry.keyword3}</li>
      </ul>
    `;
  
    document.querySelector(".container").appendChild(card);
  }