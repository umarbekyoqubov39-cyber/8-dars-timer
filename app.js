const timeDisplay = document.getElementById("vaqt");
const input = document.querySelector("input");
const button = document.querySelector(".button");

const stopBtn = document.createElement("button");
stopBtn.textContent = "to'xtatish";
stopBtn.className = "button stop-button";
stopBtn.style.borderColor = "gray";
stopBtn.style.color = "red";
stopBtn.style.display = "none";
button.parentElement.appendChild(stopBtn);

let countdown = null;
let totalSeconds = 0;
let isPaused = false;

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

function playAlarm() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const frequencies = [880, 1100, 880, 1100, 880];
  let time = audioCtx.currentTime;

  frequencies.forEach((freq) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(freq, time);

    gainNode.gain.setValueAtTime(0.4, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    oscillator.start(time);
    oscillator.stop(time + 0.4);

    time += 0.5;
  });
}

function startTimer(seconds) {
  if (countdown) clearInterval(countdown);

  totalSeconds = seconds;
  isPaused = false;
  stopBtn.textContent = "to'xtatish";
  stopBtn.style.display = "inline-block";
  timeDisplay.textContent = formatTime(totalSeconds);

  countdown = setInterval(() => {
    totalSeconds--;

    if (totalSeconds < 0) {
      clearInterval(countdown);
      countdown = null;
      stopBtn.style.display = "none";
      timeDisplay.textContent = "00:00:00";
      playAlarm();
      return;
    }

    timeDisplay.textContent = formatTime(totalSeconds);
  }, 1000);
}

button.addEventListener("click", (e) => {
  e.preventDefault();

  const value = parseInt(input.value, 10);

  if (isNaN(value) || value <= 0) {
    alert("Iltimos, musbat son kiriting (soniyalarda)!");
    return;
  }

  input.value = "";
  startTimer(value);
});

// To'xtatish / Davom etish tugmasi
stopBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!isPaused) {
    // Pauzaga olish
    clearInterval(countdown);
    countdown = null;
    isPaused = true;
    stopBtn.textContent = "davom etish";
  } else {
    // Davom ettirish
    isPaused = false;
    stopBtn.textContent = "to'xtatish";

    countdown = setInterval(() => {
      totalSeconds--;

      if (totalSeconds < 0) {
        clearInterval(countdown);
        countdown = null;
        stopBtn.style.display = "none";
        timeDisplay.textContent = "00:00:00";
        playAlarm();
        return;
      }

      timeDisplay.textContent = formatTime(totalSeconds);
    }, 1000);
  }
});
