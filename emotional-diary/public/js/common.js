document.addEventListener("DOMContentLoaded", () => {
    const bgm = document.getElementById("bgm");
  
    const savedTime = localStorage.getItem("bgmTime");
    if (savedTime) {
      bgm.currentTime = parseFloat(savedTime);
    }
  
    setInterval(() => {
      if (!bgm.paused) {
        localStorage.setItem("bgmTime", bgm.currentTime.toString());
      }
    }, 1000);
  });
  