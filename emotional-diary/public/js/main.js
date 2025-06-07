document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");
    if (!userId || userId === "null") {
      alert("You must be logged in.");
      location.href = "login.html";
      return;
    }
  
    const shelf = document.querySelector(".shelf");
  
    try {
      const res = await fetch(`/api/diary?userId=${userId}`);
  
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }
  
      const data = await res.json();
      const recent25 = data.slice(0, 25); // Show the most recent 25 entries
  
      if (recent25.length === 0) {
        // No diary entries found - show a single black orb
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
  
      // Render emotion orbs
      recent25.forEach(entry => {
        const orb = document.createElement("div");
        orb.classList.add("orb", entry.emotion.toLowerCase());
        orb.title = `${entry.date} - ${entry.emotion}`;
  
        orb.addEventListener("click", () => {
          showCard(entry);
        });
  
        shelf.appendChild(orb);
      });
    } catch (err) {
      console.error("Error loading orbs:", err);
      alert("Failed to load emotion orbs.");
    }
  });
  
  // Show detailed diary entry as a card
  let currentCardId = null; // cerrnt card ID (전역변수)

  function showCard(entry) {
    // close when clicking the same card
    if (currentCardId === entry.diaryId) {
      const existing = document.getElementById("diary-card");
      if (existing) existing.remove();
      currentCardId = null;
      return;
    }
  
    // remove old card if exists
    const oldCard = document.getElementById("diary-card");
    if (oldCard) oldCard.remove();
  
    // create new card
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
    currentCardId = entry.diaryId; // remember current card ID
  }