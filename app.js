const initialDeck = [
  { sr: 'Dobro jutro', es: 'Buenos días' },
  { sr: 'Kako si?', es: '¿Cómo estás?' },
  { sr: 'Hvala', es: 'Gracias' },
  { sr: 'Gde je stanica?', es: '¿Dónde está la estación?' },
  { sr: 'Želim da učim španski', es: 'Quiero aprender español' },
  { sr: 'Koliko košta?', es: '¿Cuánto cuesta?' },
  { sr: 'Vidimo se sutra', es: 'Nos vemos mañana' },
];

const state = {
  due: initialDeck.map((card, index) => ({ ...card, id: index + 1, interval: 1, streak: 0 })),
  current: null,
  showBack: false,
  stats: {
    correct: 0,
    hard: 0,
    total: 0,
  },
};

const frontText = document.getElementById('frontText');
const backText = document.getElementById('backText');
const backLabel = document.getElementById('backLabel');
const correctCount = document.getElementById('correctCount');
const hardCount = document.getElementById('hardCount');
const totalCount = document.getElementById('totalCount');
const flipBtn = document.getElementById('flipBtn');
const againBtn = document.getElementById('againBtn');
const hardBtn = document.getElementById('hardBtn');
const easyBtn = document.getElementById('easyBtn');
const cardForm = document.getElementById('cardForm');

function drawCard() {
  if (state.due.length === 0) {
    frontText.textContent = 'Nema više kartica za sada 🎉';
    backText.textContent = '';
    backLabel.classList.add('hidden');
    backText.classList.add('hidden');
    flipBtn.disabled = true;
    againBtn.disabled = true;
    hardBtn.disabled = true;
    easyBtn.disabled = true;
    return;
  }

  state.current = state.due.shift();
  state.showBack = false;

  frontText.textContent = state.current.sr;
  backText.textContent = state.current.es;
  backLabel.classList.add('hidden');
  backText.classList.add('hidden');

  flipBtn.disabled = false;
  againBtn.disabled = true;
  hardBtn.disabled = true;
  easyBtn.disabled = true;
}

function updateStats() {
  correctCount.textContent = String(state.stats.correct);
  hardCount.textContent = String(state.stats.hard);
  totalCount.textContent = String(state.stats.total);
}

function revealAnswer() {
  if (!state.current) return;
  state.showBack = true;
  backLabel.classList.remove('hidden');
  backText.classList.remove('hidden');

  againBtn.disabled = false;
  hardBtn.disabled = false;
  easyBtn.disabled = false;
}

function scoreCard(rating) {
  if (!state.current) return;

  state.stats.total += 1;

  if (rating === 'again') {
    state.current.streak = 0;
    state.current.interval = 1;
    state.due.push(state.current);
  }

  if (rating === 'hard') {
    state.current.streak += 1;
    state.current.interval += 1;
    state.stats.hard += 1;
    state.due.splice(Math.min(1, state.due.length), 0, state.current);
  }

  if (rating === 'easy') {
    state.current.streak += 1;
    state.current.interval *= 2;
    state.stats.correct += 1;
    if (state.current.interval < 6) {
      state.due.push(state.current);
    }
  }

  updateStats();
  drawCard();
}

flipBtn.addEventListener('click', revealAnswer);
againBtn.addEventListener('click', () => scoreCard('again'));
hardBtn.addEventListener('click', () => scoreCard('hard'));
easyBtn.addEventListener('click', () => scoreCard('easy'));

cardForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(cardForm);
  const sr = String(formData.get('serbian') || '').trim();
  const es = String(formData.get('spanish') || '').trim();

  if (!sr || !es) return;

  state.due.push({
    id: Date.now(),
    sr,
    es,
    interval: 1,
    streak: 0,
  });

  cardForm.reset();

  if (!state.current) {
    drawCard();
  }
});

updateStats();
drawCard();
