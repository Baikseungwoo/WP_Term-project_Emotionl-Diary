// Handle diary submission with emotion analysis
document.addEventListener("DOMContentLoaded", () => {
    const extractBtn = document.getElementById("extract-btn");
    if (!extractBtn) return;
  
    extractBtn.addEventListener("click", async () => {
      const content = document.getElementById("diary-content").value;
      const date = document.getElementById("diary-date").value;
      const userId = localStorage.getItem("userId");
  
      if (!content || !date) {
        alert("Please select a date and write something.");
        return;
      }
  
      try {
        const res = await fetch("/api/diary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, date, content })
        });
  
        const data = await res.json();
        if (res.ok) {
          alert("Diary saved with emotion analysis!");
          location.href = "main.html";
        } else {
          alert("Failed to save: " + data.error);
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Server error occurred.");
      }
    });
  });
  