const CARD_COPIES = 4;
const HAND_SIZE = 4;
const TUTORIAL_KEY = "exam-board-game-tutorial-seen-v1";
const MUSIC_KEY = "exam-board-game-music-enabled-v1";
const ELIMINATION_FIRST_DELAY = 1600;
const ELIMINATION_STEP_DELAY = 2400;
const ELIMINATION_FADE_DELAY = 1500;
const VICTORY_REVEAL_DELAY = 650;
const SHUFFLE_ANIMATION_DURATION = 1600;
const CHECK_RULE_ANIMATION_DURATION = 780;
const TEACHER_QUESTION_DURATION = 4000;
document.documentElement.dataset.gameVersion = "coin-fix-1";

const SKILL_BY_VALUE = {
  10: "peekSelf",
  11: "peekOther",
  12: "passNotes",
  13: "hallMonitor"
};

const SPECIALS = {
  peekSelf: {
    title: "Peek Notes",
    zh: "偷看笔记",
    text: "查看自己的一张暗牌。/ Look at one of your facedown cards."
  },
  peekOther: {
    title: "Peek Neighbor",
    zh: "偷看同桌",
    text: "查看另一位玩家的一张暗牌。/ Look at one facedown card from another player."
  },
  passNotes: {
    title: "Pass Notes",
    zh: "传纸条",
    text: "和另一位玩家交换 1 张牌。/ Swap one card with another player."
  },
  hallMonitor: {
    title: "Hall Monitor",
    zh: "监考检查",
    text: "翻硬币判定：红面被抓 +2 风险，绿面安全 -3 风险。/ Flip a coin: red means caught +2 Risk, green means safe -3 Risk."
  }
};

const CHEATING_CHECKS = [
  {
    title: "两张相同数字 / Matching Numbers",
    text: "拥有两张相同数字牌的玩家 +4 分。/ Players with two matching number cards get +4.",
    penalty: 4,
    applies(cards) {
      const seen = new Set();
      return numericValues(cards).some(value => {
        if (seen.has(value)) return true;
        seen.add(value);
        return false;
      });
    }
  },
  {
    title: "连续数字 / Consecutive Numbers",
    text: "拥有任意连续数字的玩家 +5 分。/ Players with any consecutive numbers get +5.",
    penalty: 5,
    applies(cards) {
      const values = new Set(numericValues(cards));
      return [...values].some(value => values.has(value + 1));
    }
  },
  {
    title: "1 和 13 / 1 and 13",
    text: "同时拥有 1 和 13 的玩家 +3 分。/ Players holding both 1 and 13 get +3.",
    penalty: 3,
    applies(cards) {
      const values = new Set(numericValues(cards));
      return values.has(1) && values.has(13);
    }
  },
  {
    title: "三张奇数 / Three Odd Cards",
    text: "拥有至少 3 张奇数牌的玩家 +4 分。/ Players with at least three odd cards get +4.",
    penalty: 4,
    applies(cards) {
      return numericValues(cards).filter(value => value % 2 === 1).length >= 3;
    }
  },
  {
    title: "5 的倍数 / Multiples of 5",
    text: "拥有 5 或 10 的玩家 +3 分。/ Players holding 5 or 10 get +3.",
    penalty: 3,
    applies(cards) {
      return numericValues(cards).some(value => value % 5 === 0);
    }
  }
];

const els = {
  players: document.querySelector("#players"),
  humanCards: document.querySelector("#humanCards"),
  humanEstimate: document.querySelector("#humanEstimate"),
  roundLabel: document.querySelector("#roundLabel"),
  turnLabel: document.querySelector("#turnLabel"),
  deckCount: document.querySelector("#deckCount"),
  discardCount: document.querySelector("#discardCount"),
  discardTop: document.querySelector("#discardTop"),
  phasePill: document.querySelector("#phasePill"),
  instruction: document.querySelector("#instruction"),
  drawnArea: document.querySelector("#drawnArea"),
  actionButtons: document.querySelector("#actionButtons"),
  log: document.querySelector("#log"),
  shuffleOverlay: document.querySelector("#shuffleOverlay"),
  bgMusic: document.querySelector("#bgMusic"),
  cardClickSound: document.querySelector("#cardClickSound"),
  victorySound: document.querySelector("#victorySound"),
  musicBtn: document.querySelector("#musicBtn"),
  teacherWalkway: document.querySelector(".teacher-walkway"),
  teacherQuestionBurst: document.querySelector("#teacherQuestionBurst"),
  drawBtn: document.querySelector("#drawBtn"),
  discardBtn: document.querySelector("#discardBtn"),
  tutorialBtn: document.querySelector("#tutorialBtn"),
  tutorialDialog: document.querySelector("#tutorialDialog"),
  tutorialCloseBtn: document.querySelector("#tutorialCloseBtn"),
  newGameBtn: document.querySelector("#newGameBtn"),
  choiceDialog: document.querySelector("#choiceDialog"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogText: document.querySelector("#dialogText"),
  dialogOptions: document.querySelector("#dialogOptions"),
  cardPreviewDialog: document.querySelector("#cardPreviewDialog"),
  cardPreviewTitle: document.querySelector("#cardPreviewTitle"),
  cardPreviewText: document.querySelector("#cardPreviewText"),
  cardPreviewArea: document.querySelector("#cardPreviewArea"),
  cardPreviewCloseBtn: document.querySelector("#cardPreviewCloseBtn"),
  coinDialog: document.querySelector("#coinDialog"),
  coinIntro: document.querySelector("#coinIntro"),
  coin: document.querySelector("#coin"),
  coinResult: document.querySelector("#coinResult"),
  coinFlipBtn: document.querySelector("#coinFlipBtn"),
  coinContinueBtn: document.querySelector("#coinContinueBtn"),
  scoreDialog: document.querySelector("#scoreDialog"),
  scoreTitle: document.querySelector("#scoreTitle"),
  finalCheck: document.querySelector("#finalCheck"),
  victoryBanner: document.querySelector("#victoryBanner"),
  scoreRows: document.querySelector("#scoreRows"),
  revealFinalBtn: document.querySelector("#revealFinalBtn"),
  playAgainBtn: document.querySelector("#playAgainBtn"),
  checkPreview: document.querySelector("#checkPreview")
};

let nextCardId = 1;
let state;
let finalScoreData = null;
let eliminationTimers = [];
let shuffleTimer = null;
let checkRuleTimer = null;
let teacherQuestionTimer = null;
let musicEnabled = true;
let musicStarted = false;
let humanSkillInProgress = false;

function createNumberCard(value) {
  if (SKILL_BY_VALUE[value]) {
    return createSkillCard(value, SKILL_BY_VALUE[value]);
  }
  return { id: nextCardId++, kind: "number", value };
}

function createSkillCard(value, type) {
  return { id: nextCardId++, kind: "skill", value, type };
}

function shuffle(cards) {
  const copy = cards.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck() {
  const deck = [];
  for (let copy = 0; copy < CARD_COPIES; copy += 1) {
    for (let value = 1; value <= 13; value += 1) {
      deck.push(createNumberCard(value));
    }
  }
  return shuffle(deck);
}

function newPlayer(name, avatar, ai) {
  return {
    name,
    avatar,
    ai,
    cards: [],
    known: Array(HAND_SIZE).fill(false),
    modifier: 0
  };
}

function cardsLabel(count) {
  return `${count} 张 / ${count} cards`;
}

function hasSeenTutorial() {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === "yes";
  } catch {
    return false;
  }
}

function markTutorialSeen() {
  try {
    localStorage.setItem(TUTORIAL_KEY, "yes");
  } catch {
    // Local files can occasionally block storage; the guide still works without persistence.
  }
}

function openTutorial() {
  if (!els.tutorialDialog || els.tutorialDialog.open) return;
  els.tutorialDialog.showModal();
}

function closeTutorial() {
  markTutorialSeen();
  if (els.tutorialDialog?.open) els.tutorialDialog.close();
}

function loadMusicPreference() {
  try {
    const saved = localStorage.getItem(MUSIC_KEY);
    return saved === null ? true : saved === "yes";
  } catch {
    return true;
  }
}

function saveMusicPreference(enabled) {
  try {
    localStorage.setItem(MUSIC_KEY, enabled ? "yes" : "no");
  } catch {
    // Music still works without local storage.
  }
}

function initMusic() {
  musicEnabled = loadMusicPreference();
  if (els.bgMusic) {
    els.bgMusic.volume = 0.42;
    els.bgMusic.loop = true;
  }
  updateMusicButton();
}

function updateMusicButton() {
  if (!els.musicBtn) return;
  const isPlaying = Boolean(musicEnabled && els.bgMusic && !els.bgMusic.paused);
  els.musicBtn.textContent = !musicEnabled
    ? "音乐关 / Music Off"
    : isPlaying
      ? "音乐开 / Music On"
      : "播放音乐 / Play Music";
  els.musicBtn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
  els.musicBtn.classList.toggle("muted", !musicEnabled);
}

function tryStartMusic() {
  if (!musicEnabled || !els.bgMusic) return;
  const playPromise = els.bgMusic.play();
  if (playPromise?.then) {
    playPromise
      .then(() => {
        musicStarted = true;
        updateMusicButton();
      })
      .catch(() => {
        musicStarted = false;
        updateMusicButton();
      });
  } else {
    musicStarted = true;
    updateMusicButton();
  }
}

function stopMusic() {
  if (!els.bgMusic) return;
  els.bgMusic.pause();
  musicStarted = false;
  updateMusicButton();
}

function toggleMusic() {
  if (!musicEnabled) {
    musicEnabled = true;
    saveMusicPreference(musicEnabled);
    updateMusicButton();
    tryStartMusic();
    return;
  }

  if (els.bgMusic?.paused) {
    saveMusicPreference(true);
    tryStartMusic();
    return;
  }

  musicEnabled = false;
  saveMusicPreference(musicEnabled);
  updateMusicButton();
  stopMusic();
}

function handleMusicGesture() {
  if (!musicStarted) tryStartMusic();
}

function handleActionMusicGesture(event) {
  const button = event.target.closest?.("button");
  if (!button || button === els.musicBtn) return;
  handleMusicGesture();
}

function initSoundEffects() {
  if (els.cardClickSound) {
    els.cardClickSound.volume = 0.72;
  }
  if (els.victorySound) {
    els.victorySound.volume = 0.86;
  }
}

function playCardClickSound() {
  if (!els.cardClickSound) return;
  els.cardClickSound.currentTime = 0;
  const playPromise = els.cardClickSound.play();
  if (playPromise?.catch) playPromise.catch(() => {});
}

function playVictorySound() {
  if (!els.victorySound) return;
  els.victorySound.currentTime = 0;
  const playPromise = els.victorySound.play();
  if (playPromise?.catch) playPromise.catch(() => {});
}

function handleCardClickSound(event) {
  if (event.target.closest?.(".card, .pile-button")) {
    playCardClickSound();
  }
}

function showFirstGameTutorial() {
  if (hasSeenTutorial()) return;
  window.setTimeout(openTutorial, SHUFFLE_ANIMATION_DURATION + 180);
}

function startGame() {
  clearEliminationTimers();
  clearShuffleTimer();
  clearCheckRuleAnimation();
  clearTeacherQuestion();
  humanSkillInProgress = false;
  finalScoreData = null;
  nextCardId = 1;
  const deck = buildDeck();
  const activeCheckIndex = randomCheckIndex();
  const players = [
    newPlayer("David", "player1.jpg", false),
    newPlayer("JingJing", "player2.jpg", true),
    newPlayer("leemon", "player3.jpg", true),
    newPlayer("Monica", "player4.jpg", true)
  ];

  for (let cardIndex = 0; cardIndex < HAND_SIZE; cardIndex += 1) {
    players.forEach(player => {
      player.cards.push(deck.pop());
    });
  }

  players[0].known[0] = true;
  players[0].known[1] = true;

  const discardPile = [deck.pop()];
  state = {
    deck,
    discardPile,
    players,
    currentPlayer: 0,
    round: 1,
    phase: "chooseSource",
    drawnCard: null,
    selection: null,
    doneDeclaredBy: null,
    finalTurnsRemaining: null,
    gameOver: false,
    finalScoreData: null,
    activeCheckIndex,
    checkRuleSerial: 0,
    logs: []
  };

  addLog("考试开始。你已经秘密看过自己的前两张牌。/ Exam begins. You secretly looked at your first two cards.", {
    type: "start",
    actor: 0
  });
  render();
  playShuffleAnimation();
}

function playShuffleAnimation() {
  if (!els.shuffleOverlay) return;
  els.shuffleOverlay.hidden = false;
  els.shuffleOverlay.classList.remove("playing");
  void els.shuffleOverlay.offsetWidth;
  els.shuffleOverlay.classList.add("playing");
  shuffleTimer = window.setTimeout(() => {
    els.shuffleOverlay.hidden = true;
    els.shuffleOverlay.classList.remove("playing");
    shuffleTimer = null;
  }, SHUFFLE_ANIMATION_DURATION);
}

function clearShuffleTimer() {
  if (!shuffleTimer) return;
  window.clearTimeout(shuffleTimer);
  shuffleTimer = null;
  if (els.shuffleOverlay) {
    els.shuffleOverlay.hidden = true;
    els.shuffleOverlay.classList.remove("playing");
  }
}

function randomCheckIndex(excludeIndex = null) {
  const indexes = CHEATING_CHECKS
    .map((_, index) => index)
    .filter(index => index !== excludeIndex);
  const pool = indexes.length ? indexes : [0];
  return pool[Math.floor(Math.random() * pool.length)];
}

function currentCheck() {
  return CHEATING_CHECKS[state?.activeCheckIndex] || CHEATING_CHECKS[0];
}

function rotateCheckRule() {
  state.activeCheckIndex = randomCheckIndex(state.activeCheckIndex);
  state.checkRuleSerial += 1;
}

function clearCheckRuleAnimation() {
  if (checkRuleTimer) {
    window.clearTimeout(checkRuleTimer);
    checkRuleTimer = null;
  }
  els.checkPreview?.classList.remove("switching");
}

function triggerTeacherQuestion() {
  if (!els.teacherWalkway || !els.teacherQuestionBurst) return;
  clearTeacherQuestion();

  const rect = els.teacherWalkway.getBoundingClientRect();
  const questionLeft = Math.min(window.innerWidth - 72, Math.max(72, rect.left + rect.width * 0.5));
  const questionTop = Math.min(window.innerHeight - 24, Math.max(90, rect.top + rect.height * 0.18));
  els.teacherQuestionBurst.style.setProperty("--question-left", `${questionLeft}px`);
  els.teacherQuestionBurst.style.setProperty("--question-top", `${questionTop}px`);

  els.teacherWalkway.classList.add("questioning");
  els.teacherQuestionBurst.classList.remove("active");
  void els.teacherQuestionBurst.offsetWidth;
  els.teacherQuestionBurst.classList.add("active");
  showBodyTeacherQuestionBurst(questionLeft, questionTop);

  teacherQuestionTimer = window.setTimeout(clearTeacherQuestion, TEACHER_QUESTION_DURATION);
}

function showBodyTeacherQuestionBurst(questionLeft, questionTop) {
  document.querySelectorAll(".teacher-question-burst.body-burst").forEach(element => element.remove());
  const burst = document.createElement("div");
  burst.className = "teacher-question-burst body-burst active";
  burst.setAttribute("aria-hidden", "true");
  burst.style.setProperty("--question-left", `${questionLeft}px`);
  burst.style.setProperty("--question-top", `${questionTop}px`);

  for (let index = 0; index < 3; index += 1) {
    const mark = document.createElement("span");
    mark.textContent = "?";
    burst.appendChild(mark);
  }

  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), TEACHER_QUESTION_DURATION + 450);
}

function clearTeacherQuestion() {
  if (teacherQuestionTimer) {
    window.clearTimeout(teacherQuestionTimer);
    teacherQuestionTimer = null;
  }
  els.teacherWalkway?.classList.remove("questioning");
  els.teacherQuestionBurst?.classList.remove("active");
  document.querySelectorAll(".teacher-question-burst.body-burst").forEach(element => element.remove());
}

function animateCheckRule() {
  if (!els.checkPreview) return;
  clearCheckRuleAnimation();
  els.checkPreview.classList.remove("switching");
  void els.checkPreview.offsetWidth;
  els.checkPreview.classList.add("switching");
  checkRuleTimer = window.setTimeout(() => {
    els.checkPreview.classList.remove("switching");
    checkRuleTimer = null;
  }, CHECK_RULE_ANIMATION_DURATION);
}

function currentPlayer() {
  return state.players[state.currentPlayer];
}

function topDiscard() {
  return state.discardPile[state.discardPile.length - 1] || null;
}

function isValueCard(card) {
  return card?.kind === "number" || card?.kind === "skill";
}

function isSkillCard(card) {
  return card?.kind === "skill" || card?.kind === "special";
}

function numericValues(cards) {
  return cards.filter(isValueCard).map(card => card.value);
}

function handBaseScore(player) {
  return numericValues(player.cards).reduce((sum, value) => sum + value, 0);
}

function knownHumanScore() {
  return state.players[0].cards.reduce((sum, card, index) => {
    if (!state.players[0].known[index] || !isValueCard(card)) return sum;
    return sum + card.value;
  }, 0);
}

function estimatePlayerLabel(playerIndex) {
  const player = state.players[playerIndex];
  if (playerIndex === 0) return `已知风险：${knownHumanScore() + player.modifier} / Known Risk: ${knownHumanScore() + player.modifier}`;
  const knownCount = player.known.filter(Boolean).length;
  return knownCount ? `已看过 ${knownCount} 张 / ${knownCount} seen` : "暗牌未知 / Unknown";
}

function render() {
  if (!state) return;
  renderTopbar();
  renderCheckRule();
  renderPlayers();
  renderPiles();
  renderHuman();
  renderTurnPanel();
  renderLog();
}

function renderTopbar() {
  els.roundLabel.textContent = String(state.round);
  els.turnLabel.textContent = currentPlayer().name;
}

function renderCheckRule() {
  if (!els.checkPreview) return;
  const check = currentCheck();
  els.checkPreview.innerHTML = "";

  const kicker = document.createElement("span");
  kicker.className = "check-rule-kicker";
  kicker.textContent = state.gameOver
    ? "最终规则 / Final Rule"
    : `第 ${state.round} 回合规则 / Round ${state.round} Rule`;

  const title = document.createElement("strong");
  title.className = "check-rule-title";
  title.textContent = check.title;

  const text = document.createElement("span");
  text.className = "check-rule-text";
  text.textContent = check.text;

  const penalty = document.createElement("span");
  penalty.className = "check-rule-penalty";
  penalty.textContent = `命中 +${check.penalty} 风险 / Hit +${check.penalty} Risk`;

  els.checkPreview.append(kicker, title, text, penalty);
}

function renderPlayers() {
  els.players.innerHTML = "";
  state.players.slice(1).forEach((player, offset) => {
    const index = offset + 1;
    const hasSelectableCard = player.cards.some((_, cardIndex) => cardIsSelectable(index, cardIndex));
    const panel = document.createElement("article");
    panel.className = `player-panel${state.currentPlayer === index ? " active" : ""}${hasSelectableCard ? " selecting" : ""}`;
    panel.innerHTML = `
      <div class="player-head">
        <div class="face"><img src="assets/avatars/${player.avatar}" alt="${player.name}"></div>
        <div>
          <span class="player-name">${player.name}</span>
          <span class="risk">${estimatePlayerLabel(index)}</span>
        </div>
      </div>
      <div class="player-cards"></div>
    `;
    const cardArea = panel.querySelector(".player-cards");
    player.cards.forEach((card, cardIndex) => {
      const selectable = cardIsSelectable(index, cardIndex);
      const previewable = !state.selection && !state.gameOver && player.known[cardIndex];
      const element = renderCard(card, {
        visible: state.gameOver || player.known[cardIndex],
        small: true,
        badge: player.known[cardIndex] && !state.gameOver ? "已知 / Known" : "",
        onClick: selectable
          ? () => selectBoardCard(index, cardIndex)
          : previewable
            ? () => showKnownCardPreview(index, cardIndex)
            : null
      });
      if (selectable) element.classList.add("selectable");
      if (previewable) element.classList.add("previewable");
      cardArea.appendChild(element);
    });
    els.players.appendChild(panel);
  });
}

function renderPiles() {
  els.deckCount.textContent = cardsLabel(state.deck.length);
  els.discardCount.textContent = cardsLabel(state.discardPile.length);
  els.discardTop.innerHTML = "";
  els.discardTop.className = "deck-card";
  const top = topDiscard();
  if (top) {
    els.discardTop.appendChild(renderCard(top, { visible: true, medium: true }));
  } else {
    els.discardTop.className = "deck-card card empty-discard";
    els.discardTop.textContent = "空 / Empty";
  }

  const canChoose = state.currentPlayer === 0 && state.phase === "chooseSource";
  els.drawBtn.disabled = !canChoose;
  els.discardBtn.disabled = !canChoose || !top;
}

function renderHuman() {
  const humanZone = document.querySelector(".human-zone");
  humanZone.classList.toggle("active", state.currentPlayer === 0 && !state.gameOver);
  humanZone.classList.toggle("selecting", state.players[0].cards.some((_, index) => cardIsSelectable(0, index)));
  els.humanEstimate.textContent = estimatePlayerLabel(0);
  els.humanCards.innerHTML = "";
  state.players[0].cards.forEach((card, index) => {
    const canPickForSwap = state.phase === "chooseSwap" && state.currentPlayer === 0;
    const selectable = cardIsSelectable(0, index);
    const previewable = !state.selection && !canPickForSwap && (state.gameOver || state.players[0].known[index]);
    const element = renderCard(card, {
      visible: state.gameOver || state.players[0].known[index],
      badge: state.players[0].known[index] && !state.gameOver ? "已记住 / Known" : "",
      onClick: selectable
        ? () => selectBoardCard(0, index)
        : canPickForSwap
          ? () => swapHumanCard(index)
          : previewable
            ? () => showKnownCardPreview(0, index)
            : null
    });
    if (canPickForSwap) element.classList.add("selected");
    if (selectable) element.classList.add("selectable");
    if (previewable) element.classList.add("previewable");
    els.humanCards.appendChild(element);
  });
}

function renderTurnPanel() {
  els.drawnArea.innerHTML = "";
  els.actionButtons.innerHTML = "";

  if (state.gameOver) {
    els.phasePill.textContent = "已结算 / Scored";
    els.instruction.textContent = "本局已经结束。/ This game is over.";
    return;
  }

  if (state.currentPlayer !== 0) {
    els.phasePill.textContent = `${currentPlayer().name} 行动中 / Acting`;
    els.instruction.textContent = "AI 正在思考。/ AI is thinking.";
    els.drawnArea.appendChild(note("请稍等，其他玩家会自动完成回合。/ Please wait. The AI players will finish their turns automatically."));
    return;
  }

  if (state.doneDeclaredBy !== null) {
    els.phasePill.textContent = `最后 ${state.finalTurnsRemaining} 回合 / Final ${state.finalTurnsRemaining} turns`;
  } else {
    els.phasePill.textContent = "你的回合 / Your Turn";
  }

  if (state.selection) {
    els.phasePill.textContent = state.selection.title;
    els.instruction.textContent = state.selection.instruction;
    if (state.drawnCard) {
      els.drawnArea.appendChild(renderCard(state.drawnCard, { visible: true, medium: true }));
      const label = document.createElement("div");
      label.className = "drawn-note";
      label.textContent = "牌桌上发亮的手牌可以点击。/ Click a glowing hand card on the table.";
      els.drawnArea.appendChild(label);
    } else {
      els.drawnArea.appendChild(note("牌桌上发亮的手牌可以点击。/ Click a glowing hand card on the table."));
    }
    addActionButton("取消选择 / Cancel", "ghost", cancelBoardSelection);
    return;
  }

  if (state.phase === "chooseSource") {
    els.instruction.textContent = "选择抽牌堆，或拿弃牌堆最上面的牌。/ Choose the draw pile, or take the top card from the discard pile.";
    els.drawnArea.appendChild(note("弃牌堆的牌是公开的，抽牌堆则充满未知。/ The discard pile is public. The draw pile is unknown."));
    return;
  }

  if (state.phase === "action" || state.phase === "chooseSwap") {
    els.instruction.textContent = state.phase === "chooseSwap"
      ? "选择你要换掉的一张手牌。被换下的牌会进入弃牌堆。/ Choose one of your cards to replace. The old card goes to the discard pile."
      : "决定如何处理刚拿到的牌。/ Decide what to do with the card you just took.";
    els.drawnArea.appendChild(renderCard(state.drawnCard, { visible: true, medium: true }));
    const label = document.createElement("div");
    label.className = "drawn-note";
    label.textContent = cardDescription(state.drawnCard);
    els.drawnArea.appendChild(label);

    if (humanSkillInProgress) {
      els.instruction.textContent = "监考老师正在靠近，请等待判定。/ The Hall Monitor is approaching. Wait for the check.";
      els.drawnArea.appendChild(note("技能正在处理，硬币窗口马上出现。/ Resolving the skill. The coin window will appear soon."));
      return;
    }

    if (state.drawnCard.kind === "number") {
      addActionButton("换入手牌 / Swap In", "primary", () => {
        state.phase = "chooseSwap";
        render();
      });
    } else if (state.drawnCard.kind === "skill") {
      const skillButtonLabel = state.drawnCard.type === "hallMonitor"
        ? "翻硬币 / Flip Coin"
        : "使用技能 / Use Skill";
      addActionButton(skillButtonLabel, "gold", useHumanSpecial);
      addActionButton("换入手牌 / Swap In", "primary", () => {
        state.phase = "chooseSwap";
        render();
      });
    } else {
      addActionButton("使用特殊卡 / Use Special", "gold", useHumanSpecial);
    }
    addActionButton("直接弃牌 / Discard", "ghost", discardHumanDrawn);
    return;
  }

  if (state.phase === "doneDecision") {
    els.instruction.textContent = "你的回合结束。可以继续等待，或宣布 Done 让其他玩家各获得最后 1 个回合。/ Your turn is over. Continue, or declare Done so every other player gets one final turn.";
    els.drawnArea.appendChild(note("交卷时机很关键：低分获胜，但最后会有一条随机作弊检查。/ Timing matters: the lowest Risk Score wins, but a random Cheating Check happens at the end."));
    addActionButton("继续游戏 / Continue", "primary", () => finishHumanTurn(false));
    addActionButton("宣布 Done / Declare Done", "gold", () => finishHumanTurn(true));
  }
}

function renderLog() {
  els.log.innerHTML = "";
  state.logs.slice(-18).forEach(entry => {
    const logEntry = normalizeLogEntry(entry);
    const item = document.createElement("div");
    item.className = `log-entry visual-log ${logEntry.type}`;
    item.title = logEntry.text;
    item.setAttribute("aria-label", logEntry.text);
    item.appendChild(renderLogAvatar(logEntry.actor));

    const track = document.createElement("div");
    track.className = "log-track";
    renderLogTrack(track, logEntry);
    item.appendChild(track);
    els.log.appendChild(item);
  });
  els.log.scrollTop = els.log.scrollHeight;
}

function normalizeLogEntry(entry) {
  if (typeof entry === "string") return { text: entry, type: "note", actor: null };
  return {
    text: entry.text || "牌局事件 / Game event",
    type: entry.type || "note",
    actor: Number.isInteger(entry.actor) ? entry.actor : null,
    ...entry
  };
}

function renderLogTrack(track, entry) {
  if (entry.type === "start") {
    track.appendChild(renderLogSymbol("start"));
    track.appendChild(renderLogCard(null, false));
    track.appendChild(renderLogCard(null, false));
    return;
  }

  if (entry.type === "draw") {
    track.appendChild(renderLogPile(entry.source, entry.card));
    track.appendChild(renderLogSymbol("arrow"));
    track.appendChild(renderLogCard(entry.card, entry.visible));
    return;
  }

  if (entry.type === "swapIn") {
    track.appendChild(renderLogCard(entry.card, entry.visible));
    track.appendChild(renderLogSymbol("swap"));
    track.appendChild(renderLogCard(entry.oldCard, entry.oldVisible));
    return;
  }

  if (entry.type === "discard") {
    track.appendChild(renderLogCard(entry.card, entry.visible));
    track.appendChild(renderLogSymbol("arrow"));
    track.appendChild(renderLogPile("discard", entry.card));
    return;
  }

  if (entry.type === "peek") {
    track.appendChild(renderLogSymbol("eye"));
    track.appendChild(renderLogAvatar(entry.target));
    track.appendChild(renderLogCard(entry.card, entry.visible));
    return;
  }

  if (entry.type === "pass") {
    track.appendChild(renderLogCard(null, false));
    track.appendChild(renderLogSymbol("swap"));
    track.appendChild(renderLogAvatar(entry.target));
    track.appendChild(renderLogCard(null, false));
    return;
  }

  if (entry.type === "monitor") {
    track.appendChild(renderLogSymbol("monitor"));
    track.appendChild(renderLogSymbol(entry.outcome === "caught" ? "caught" : "clear"));
    return;
  }

  if (entry.type === "done") {
    track.appendChild(renderLogSymbol("done"));
    return;
  }

  if (entry.type === "reshuffle") {
    track.appendChild(renderLogPile("discard"));
    track.appendChild(renderLogSymbol("shuffle"));
    track.appendChild(renderLogPile("draw"));
    return;
  }

  if (entry.type === "check") {
    track.appendChild(renderLogSymbol("check"));
    track.appendChild(renderLogCard(null, false));
    return;
  }

  track.appendChild(renderLogSymbol("note"));
}

function renderLogAvatar(playerIndex) {
  const avatar = document.createElement("div");
  avatar.className = "log-avatar";
  const player = Number.isInteger(playerIndex) ? state.players[playerIndex] : null;
  if (!player) {
    avatar.classList.add("system");
    return avatar;
  }
  const img = document.createElement("img");
  img.src = `assets/avatars/${player.avatar}`;
  img.alt = player.name;
  avatar.appendChild(img);
  return avatar;
}

function renderLogCard(card, visible = false) {
  if (!card) {
    const back = document.createElement("div");
    back.className = "card log-card back-card";
    return back;
  }
  const cardElement = renderCard(card, { visible: Boolean(visible) });
  cardElement.classList.add("log-card");
  return cardElement;
}

function renderLogPile(source, card = null) {
  if (source === "discard" && card) {
    const pileCard = renderLogCard(card, true);
    pileCard.classList.add("log-pile");
    return pileCard;
  }
  const pile = document.createElement("div");
  pile.className = `log-pile ${source === "discard" ? "discard-pile" : "draw-pile back-card"}`;
  return pile;
}

function renderLogSymbol(type) {
  const symbol = document.createElement("span");
  symbol.className = `log-symbol ${type}`;
  return symbol;
}

function renderCard(card, options = {}) {
  const visible = options.visible;
  const cardEl = document.createElement(options.onClick ? "button" : "div");
  if (options.onClick) {
    cardEl.type = "button";
    cardEl.addEventListener("click", options.onClick);
  }
  cardEl.className = `card${options.small ? " small" : ""}${options.medium ? " medium" : ""}`;

  if (!visible) {
    cardEl.classList.add("back-card");
    return cardEl;
  }

  cardEl.classList.toggle("revealed", Boolean(options.badge));

  if (isValueCard(card)) {
    const img = document.createElement("img");
    img.src = `assets/cards/${card.value}.png`;
    img.alt = card.kind === "skill"
      ? `技能牌 ${card.value} / Skill Card ${card.value}`
      : `数字牌 ${card.value} / Number Card ${card.value}`;
    cardEl.appendChild(img);
  } else {
    const special = SPECIALS[card.type];
    cardEl.classList.add("special-card");
    cardEl.innerHTML = `
      <span class="special-type">Special</span>
      <strong>${special.zh}</strong>
      <span>${special.title}</span>
    `;
  }

  if (options.badge) {
    const badge = document.createElement("span");
    badge.className = "card-badge";
    badge.textContent = options.badge;
    cardEl.appendChild(badge);
  }

  return cardEl;
}

function note(text) {
  const element = document.createElement("div");
  element.className = "drawn-note";
  element.textContent = text;
  return element;
}

function wait(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

function addActionButton(label, className, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.className = className;
  button.addEventListener("click", handler);
  els.actionButtons.appendChild(button);
}

function isTeacherReactionButton(label) {
  return label.includes("使用技能")
    || label.includes("使用特殊卡")
    || label.includes("翻硬币")
    || label.includes("Use Skill")
    || label.includes("Use Special")
    || label.includes("Flip Coin");
}

function handleTeacherReactionButtonPress(event) {
  const button = event.target.closest?.("button");
  if (!button) return;
  if (button.closest("#coinDialog")) return;
  const label = `${button.textContent || ""} ${button.getAttribute("aria-label") || ""}`;
  if (isTeacherReactionButton(label)) triggerTeacherQuestion();
}

function cardIsSelectable(playerIndex, cardIndex) {
  return Boolean(state.selection?.allow?.(playerIndex, cardIndex));
}

function beginBoardCardSelection({ title, instruction, allow }) {
  return new Promise(resolve => {
    state.selection = {
      title,
      instruction,
      previousPhase: state.phase,
      allow,
      resolve
    };
    state.phase = "selectCard";
    render();
  });
}

function selectBoardCard(playerIndex, cardIndex) {
  const selection = state.selection;
  if (!selection || !selection.allow(playerIndex, cardIndex)) return;
  state.selection = null;
  state.phase = selection.previousPhase || "action";
  selection.resolve({ playerIndex, cardIndex });
  render();
}

function cancelBoardSelection() {
  const selection = state.selection;
  if (!selection) return;
  state.selection = null;
  state.phase = selection.previousPhase || "action";
  selection.resolve(null);
  render();
}

function showKnownCardPreview(playerIndex, cardIndex) {
  const player = state.players[playerIndex];
  return showCardPreview({
    title: `${player.name} 第 ${cardIndex + 1} 张 / Slot ${cardIndex + 1}`,
    text: cardDescription(player.cards[cardIndex]),
    card: player.cards[cardIndex]
  });
}

function showCardPreview({ title, text, card }) {
  return new Promise(resolve => {
    if (els.cardPreviewDialog.open) {
      els.cardPreviewDialog.close();
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      els.cardPreviewCloseBtn.removeEventListener("click", closePreview);
      els.cardPreviewDialog.removeEventListener("close", finish);
      resolve();
    };
    const closePreview = () => {
      if (els.cardPreviewDialog.open) {
        els.cardPreviewDialog.close();
      } else {
        finish();
      }
    };

    els.cardPreviewTitle.textContent = title;
    els.cardPreviewText.textContent = text;
    els.cardPreviewArea.innerHTML = "";
    const cardElement = renderCard(card, { visible: true });
    els.cardPreviewArea.appendChild(cardElement);
    els.cardPreviewCloseBtn.addEventListener("click", closePreview);
    els.cardPreviewDialog.addEventListener("close", finish);
    els.cardPreviewDialog.showModal();
  });
}

function cardShortName(card) {
  if (!card) return "空 / Empty";
  if (card.kind === "number") return String(card.value);
  if (card.kind === "skill") return `${card.value} / ${SPECIALS[card.type].title}`;
  return `${SPECIALS[card.type].zh} / ${SPECIALS[card.type].title}`;
}

function cardDescription(card) {
  if (card.kind === "number") return `数字牌 ${card.value}，最终风险值会计入分数。/ Number Card ${card.value}. It counts toward your final Risk Score.`;
  if (card.kind === "skill") {
    const special = SPECIALS[card.type];
    return `技能牌 ${card.value}：${special.zh}。${special.text} 如果留在手里，仍会按 ${card.value} 分计入风险。/ Skill Card ${card.value}: ${special.title}. If kept in hand, it still counts as ${card.value} Risk.`;
  }
  const special = SPECIALS[card.type];
  return `${special.zh} / ${special.title}: ${special.text}`;
}

function addLog(text, event = {}) {
  state.logs.push({ text, ...event });
  renderLog();
}

function refillDeckIfNeeded() {
  if (state.deck.length > 0 || state.discardPile.length <= 1) return;
  const top = state.discardPile.pop();
  state.deck = shuffle(state.discardPile);
  state.discardPile = [top];
  addLog("抽牌堆用尽，弃牌堆洗混后形成新的抽牌堆。/ The draw pile ran out. The discard pile was shuffled into a new draw pile.", {
    type: "reshuffle"
  });
}

function drawFromDeck() {
  refillDeckIfNeeded();
  return state.deck.pop() || null;
}

function humanDrawFromDeck() {
  if (state.currentPlayer !== 0 || state.phase !== "chooseSource") return;
  const card = drawFromDeck();
  if (!card) return;
  state.drawnCard = card;
  state.phase = "action";
  addLog(`你从抽牌堆抽到 ${cardShortName(card)}。/ You drew ${cardShortName(card)} from the draw pile.`, {
    type: "draw",
    actor: 0,
    source: "draw",
    card,
    visible: true
  });
  render();
}

function humanTakeDiscard() {
  if (state.currentPlayer !== 0 || state.phase !== "chooseSource" || !topDiscard()) return;
  const card = state.discardPile.pop();
  state.drawnCard = card;
  state.phase = "action";
  addLog(`你拿走弃牌堆顶的 ${cardShortName(card)}。/ You took ${cardShortName(card)} from the discard pile.`, {
    type: "draw",
    actor: 0,
    source: "discard",
    card,
    visible: true
  });
  render();
}

function swapHumanCard(index) {
  if (!state.drawnCard || !isValueCard(state.drawnCard)) return;
  const player = state.players[0];
  const oldCard = player.cards[index];
  player.cards[index] = state.drawnCard;
  player.known[index] = true;
  state.discardPile.push(oldCard);
  addLog(`你把 ${state.drawnCard.value} 换入第 ${index + 1} 张手牌，弃掉 ${cardShortName(oldCard)}。/ You swapped ${state.drawnCard.value} into slot ${index + 1} and discarded ${cardShortName(oldCard)}.`, {
    type: "swapIn",
    actor: 0,
    card: state.drawnCard,
    oldCard,
    visible: true,
    oldVisible: true
  });
  state.drawnCard = null;
  state.phase = "doneDecision";
  render();
}

function discardHumanDrawn() {
  if (!state.drawnCard) return;
  state.discardPile.push(state.drawnCard);
  addLog(`你弃掉 ${cardShortName(state.drawnCard)}。/ You discarded ${cardShortName(state.drawnCard)}.`, {
    type: "discard",
    actor: 0,
    card: state.drawnCard,
    visible: true
  });
  state.drawnCard = null;
  state.phase = "doneDecision";
  render();
}

async function useHumanSpecial() {
  if (humanSkillInProgress) return;
  const card = state.drawnCard;
  if (!isSkillCard(card)) return;
  humanSkillInProgress = true;
  render();
  try {
    triggerTeacherQuestion();
    await wait(TEACHER_QUESTION_DURATION);
  } finally {
    humanSkillInProgress = false;
    render();
  }

  if (!state.drawnCard || state.drawnCard.id !== card.id || state.currentPlayer !== 0 || state.phase !== "action") return;

  if (card.type === "peekSelf") {
    const pick = await beginBoardCardSelection({
      title: "偷看笔记 / Peek Notes",
      instruction: "点击你自己的一张手牌来查看。/ Click one of your own hand cards to look at it.",
      allow: playerIndex => playerIndex === 0
    });
    if (!pick) return;
    state.players[0].known[pick.cardIndex] = true;
    render();
    await showCardPreview({
      title: `你的第 ${pick.cardIndex + 1} 张牌 / Your Slot ${pick.cardIndex + 1}`,
      text: "你现在记住了这张牌。/ You now remember this card.",
      card: state.players[0].cards[pick.cardIndex]
    });
    addLog(`你偷看并记住了自己的第 ${pick.cardIndex + 1} 张牌。/ You looked at and remembered your card in slot ${pick.cardIndex + 1}.`, {
      type: "peek",
      actor: 0,
      target: 0,
      card: state.players[0].cards[pick.cardIndex],
      visible: true
    });
  }

  if (card.type === "peekOther") {
    const pick = await beginBoardCardSelection({
      title: "偷看同桌 / Peek Neighbor",
      instruction: "点击任意一位对手的一张手牌来查看。/ Click one hand card from any opponent to look at it.",
      allow: playerIndex => playerIndex !== 0
    });
    if (!pick) return;
    const target = pick.playerIndex;
    const index = pick.cardIndex;
    state.players[target].known[index] = true;
    render();
    await showCardPreview({
      title: `${state.players[target].name} 第 ${index + 1} 张 / Slot ${index + 1}`,
      text: "你看到了这张对手手牌。/ You saw this opponent card.",
      card: state.players[target].cards[index]
    });
    addLog(`你看到了 ${state.players[target].name} 的第 ${index + 1} 张手牌。/ You saw ${state.players[target].name}'s hand card in slot ${index + 1}.`, {
      type: "peek",
      actor: 0,
      target,
      card: state.players[target].cards[index],
      visible: true
    });
  }

  if (card.type === "passNotes") {
    const ownPick = await beginBoardCardSelection({
      title: "传纸条 / Pass Notes",
      instruction: "先点击你要交出去的一张手牌。/ First click one of your hand cards to give away.",
      allow: playerIndex => playerIndex === 0
    });
    if (!ownPick) return;
    const targetPick = await beginBoardCardSelection({
      title: "传纸条 / Pass Notes",
      instruction: "再点击任意对手的一张手牌完成交换。/ Then click one opponent hand card to finish the swap.",
      allow: playerIndex => playerIndex !== 0
    });
    if (!targetPick) return;
    const ownIndex = ownPick.cardIndex;
    const target = targetPick.playerIndex;
    const targetIndex = targetPick.cardIndex;
    exchangeCards(0, ownIndex, target, targetIndex);
    addLog(`你和 ${state.players[target].name} 交换了 1 张牌。/ You swapped one card with ${state.players[target].name}.`, {
      type: "pass",
      actor: 0,
      target
    });
  }

  if (card.type === "hallMonitor") {
    const caught = await showHallMonitorCoinFlip(0);
    if (caught === null) return;
    resolveHallMonitor(0, caught);
  }

  state.discardPile.push(card);
  state.drawnCard = null;
  state.phase = "doneDecision";
  render();
}

function exchangeCards(playerA, slotA, playerB, slotB) {
  const a = state.players[playerA];
  const b = state.players[playerB];
  [a.cards[slotA], b.cards[slotB]] = [b.cards[slotB], a.cards[slotA]];
  [a.known[slotA], b.known[slotB]] = [b.known[slotB], a.known[slotA]];
}

function showHallMonitorCoinFlip(playerIndex) {
  return new Promise(resolve => {
    if (els.coinDialog.open) {
      els.coinDialog.close();
    }

    let outcome = null;
    let settled = false;

    const cleanup = () => {
      els.coinFlipBtn.removeEventListener("click", flipCoin);
      els.coinContinueBtn.removeEventListener("click", closeDialog);
      els.coinDialog.removeEventListener("close", handleClose);
    };

    const finish = value => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(value);
    };

    const handleClose = () => {
      finish(outcome);
    };

    const closeDialog = () => {
      if (els.coinDialog.open) {
        els.coinDialog.close();
      } else {
        finish(outcome);
      }
    };

    const flipCoin = () => {
      if (outcome !== null) return;
      outcome = Math.random() < 0.5;
      els.coinFlipBtn.disabled = true;
      els.coin.className = "coin";
      void els.coin.offsetWidth;
      els.coin.className = "coin flipping";
      els.coinResult.className = "coin-result";
      els.coinResult.textContent = "硬币正在翻转。/ The coin is flipping.";

      window.setTimeout(() => {
        if (settled) return;
        els.coin.className = `coin ${outcome ? "caught" : "clear"}`;
        els.coinResult.className = `coin-result ${outcome ? "caught" : "clear"}`;
        els.coinResult.textContent = outcome
          ? "红面：被监考抓到，风险 +2。/ Red: caught by the Hall Monitor, +2 Risk."
          : "绿面：没有被抓到，风险 -3。/ Green: safe, -3 Risk.";
        els.coinFlipBtn.hidden = true;
        els.coinContinueBtn.hidden = false;
        els.coinContinueBtn.focus();
      }, 820);
    };

    const player = state.players[playerIndex];
    els.coinIntro.textContent = `${player.name} 翻硬币判定：红面被抓 +2，绿面安全 -3。/ ${player.name} flips a coin: red is caught +2, green is safe -3.`;
    els.coin.className = "coin waiting";
    els.coinResult.className = "coin-result";
    els.coinResult.textContent = "点击翻硬币开始判定。/ Flip the coin to decide.";
    els.coinFlipBtn.hidden = false;
    els.coinFlipBtn.disabled = false;
    els.coinContinueBtn.hidden = true;
    els.coinFlipBtn.addEventListener("click", flipCoin);
    els.coinContinueBtn.addEventListener("click", closeDialog);
    els.coinDialog.addEventListener("close", handleClose);
    els.coinDialog.showModal();
  });
}

function resolveHallMonitor(playerIndex, forcedCaught = null) {
  const player = state.players[playerIndex];
  const caught = typeof forcedCaught === "boolean" ? forcedCaught : Math.random() < 0.5;
  if (caught) {
    player.modifier += 2;
    addLog(`${player.name} 被监考发现，总风险 +2 分。/ ${player.name} got caught by the Hall Monitor: +2 Risk.`, {
      type: "monitor",
      actor: playerIndex,
      outcome: "caught"
    });
  } else {
    player.modifier -= 3;
    addLog(`${player.name} 没有被抓到，总风险 -3 分。/ ${player.name} avoided getting caught: -3 Risk.`, {
      type: "monitor",
      actor: playerIndex,
      outcome: "clear"
    });
  }
}

async function chooseOpponent(title, text) {
  const options = state.players
    .map((player, index) => ({ player, index }))
    .filter(item => item.index !== 0)
    .map(item => ({
      label: item.player.name,
      value: item.index
    }));
  return showChoice(title, text, options);
}

async function chooseCardSlot(title, text, playerIndex) {
  const player = state.players[playerIndex];
  return showChoice(title, text, player.cards.map((card, index) => ({
    label: playerIndex === 0 && player.known[index]
      ? `第 ${index + 1} 张 / Slot ${index + 1}: ${cardShortName(card)}`
      : `第 ${index + 1} 张牌 / Slot ${index + 1}`,
    value: index
  })));
}

function showChoice(title, text, options) {
  return new Promise(resolve => {
    els.dialogTitle.textContent = title;
    els.dialogText.textContent = text;
    els.dialogOptions.innerHTML = "";
    options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option.label;
      button.addEventListener("click", () => {
        els.choiceDialog.close();
        resolve(option.value);
      });
      els.dialogOptions.appendChild(button);
    });
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "ghost";
    cancel.textContent = "取消 / Cancel";
    cancel.addEventListener("click", () => {
      els.choiceDialog.close();
      resolve(null);
    });
    els.dialogOptions.appendChild(cancel);
    els.choiceDialog.showModal();
  });
}

function finishHumanTurn(declareDone) {
  if (declareDone && state.doneDeclaredBy === null) {
    state.doneDeclaredBy = 0;
    state.finalTurnsRemaining = state.players.length - 1;
    addLog("你宣布 Done。其他玩家各获得最后 1 个回合。/ You declared Done. Every other player gets one final turn.", {
      type: "done",
      actor: 0
    });
  }
  finishTurn(0);
}

function finishTurn(playerIndex) {
  if (state.doneDeclaredBy !== null && playerIndex !== state.doneDeclaredBy) {
    state.finalTurnsRemaining -= 1;
    if (state.finalTurnsRemaining <= 0) {
      finishGame();
      return;
    }
  }

  state.currentPlayer = (state.currentPlayer + 1) % state.players.length;
  const advancedRound = state.currentPlayer === 0;
  if (advancedRound) {
    state.round += 1;
    rotateCheckRule();
  }
  state.phase = state.currentPlayer === 0 ? "chooseSource" : "ai";
  state.drawnCard = null;
  render();
  if (advancedRound) animateCheckRule();

  if (state.currentPlayer !== 0) {
    window.setTimeout(runAiTurn, 650);
  }
}

function runAiTurn() {
  if (state.gameOver || state.currentPlayer === 0) return;
  const index = state.currentPlayer;
  const player = state.players[index];
  const discard = topDiscard();
  let card;
  let sourceZh = "抽牌堆";
  let sourceEn = "draw pile";

  if (discard && shouldTakeDiscard(player, discard)) {
    card = state.discardPile.pop();
    sourceZh = "弃牌堆";
    sourceEn = "discard pile";
  } else {
    card = drawFromDeck();
  }

  if (!card) {
    finishTurn(index);
    return;
  }

  addLog(`${player.name} 从${sourceZh}拿到 ${cardShortName(card)}。/ ${player.name} took ${cardShortName(card)} from the ${sourceEn}.`, {
    type: "draw",
    actor: index,
    source: sourceEn === "discard pile" ? "discard" : "draw",
    card,
    visible: sourceEn === "discard pile"
  });

  if (isSkillCard(card)) {
    aiUseSpecial(index, card);
  } else {
    aiHandleNumber(index, card);
  }

  if (state.doneDeclaredBy === null && shouldAiDeclareDone(index)) {
    state.doneDeclaredBy = index;
    state.finalTurnsRemaining = state.players.length - 1;
    addLog(`${player.name} 宣布 Done。其他玩家各获得最后 1 个回合。/ ${player.name} declared Done. Every other player gets one final turn.`, {
      type: "done",
      actor: index
    });
  }

  render();
  window.setTimeout(() => finishTurn(index), 550);
}

function shouldTakeDiscard(player, card) {
  if (isSkillCard(card)) {
    if (card.type === "hallMonitor") return handBaseScore(player) > 25;
    return Math.random() < 0.35;
  }
  const highestIndex = highestCardIndex(player);
  if (highestIndex === -1) return false;
  return card.value + 2 < player.cards[highestIndex].value;
}

function aiHandleNumber(playerIndex, card) {
  const player = state.players[playerIndex];
  const highestIndex = highestCardIndex(player);
  if (highestIndex !== -1 && card.value < player.cards[highestIndex].value) {
    const oldCard = player.cards[highestIndex];
    player.cards[highestIndex] = card;
    player.known[highestIndex] = false;
    state.discardPile.push(oldCard);
    addLog(`${player.name} 换掉了一张高风险牌。/ ${player.name} swapped out a high-risk card.`, {
      type: "swapIn",
      actor: playerIndex,
      card,
      oldCard,
      visible: false,
      oldVisible: false
    });
  } else {
    state.discardPile.push(card);
    addLog(`${player.name} 弃掉 ${cardShortName(card)}。/ ${player.name} discarded ${cardShortName(card)}.`, {
      type: "discard",
      actor: playerIndex,
      card,
      visible: false
    });
  }
}

function aiUseSpecial(playerIndex, card) {
  const player = state.players[playerIndex];
  if (card.type === "peekSelf") {
    addLog(`${player.name} 偷看了自己的笔记。/ ${player.name} peeked at their own notes.`, {
      type: "peek",
      actor: playerIndex,
      target: playerIndex,
      visible: false
    });
  }

  if (card.type === "peekOther") {
    const target = randomOtherPlayer(playerIndex);
    addLog(`${player.name} 偷看了 ${state.players[target].name} 的一张牌。/ ${player.name} peeked at one card from ${state.players[target].name}.`, {
      type: "peek",
      actor: playerIndex,
      target,
      visible: false
    });
  }

  if (card.type === "passNotes") {
    const ownIndex = highestCardIndex(player);
    const target = randomOtherPlayer(playerIndex);
    const targetIndex = Math.floor(Math.random() * HAND_SIZE);
    if (ownIndex !== -1) {
      exchangeCards(playerIndex, ownIndex, target, targetIndex);
      addLog(`${player.name} 和 ${state.players[target].name} 传了纸条。/ ${player.name} passed notes with ${state.players[target].name}.`, {
        type: "pass",
        actor: playerIndex,
        target
      });
    }
  }

  if (card.type === "hallMonitor") {
    resolveHallMonitor(playerIndex);
  }

  state.discardPile.push(card);
}

function highestCardIndex(player) {
  let highest = -1;
  let highestValue = -Infinity;
  player.cards.forEach((card, index) => {
    if (isValueCard(card) && card.value > highestValue) {
      highest = index;
      highestValue = card.value;
    }
  });
  return highest;
}

function randomOtherPlayer(playerIndex) {
  const others = state.players.map((_, index) => index).filter(index => index !== playerIndex);
  return others[Math.floor(Math.random() * others.length)];
}

function shouldAiDeclareDone(playerIndex) {
  if (state.round < 3) return false;
  const player = state.players[playerIndex];
  const score = handBaseScore(player) + player.modifier;
  if (score <= 14) return true;
  if (score <= 18 && state.round >= 5) return Math.random() < 0.45;
  return state.round >= 8 && score <= 22 && Math.random() < 0.3;
}

function finishGame() {
  state.gameOver = true;
  state.phase = "gameOver";
  const check = currentCheck();
  const rows = state.players.map((player, index) => {
    const base = handBaseScore(player);
    const penalty = check.applies(player.cards) ? check.penalty : 0;
    const total = base + player.modifier + penalty;
    return { player, playerIndex: index, base, modifier: player.modifier, penalty, total };
  });
  const winnerScore = Math.min(...rows.map(row => row.total));
  state.finalScoreData = { check, rows, winnerScore };
  addLog(`作弊检查揭示：${check.title}。最低风险分获胜。/ Cheating Check revealed: ${check.title}. Lowest Risk Score wins.`, {
    type: "check"
  });
  render();
  showScores(check, rows, winnerScore);
}

function showScores(check, rows, winnerScore) {
  clearEliminationTimers();
  finalScoreData = { check, rows, winnerScore };
  state.finalScoreData = finalScoreData;
  els.scoreTitle.textContent = "卡面分数 / Card Scores";
  els.finalCheck.textContent = "先看每个人 4 张手牌的卡面总分。/ First, check each player's four-card score.";
  els.victoryBanner.hidden = true;
  els.revealFinalBtn.hidden = false;
  els.revealFinalBtn.disabled = false;
  els.playAgainBtn.hidden = true;
  els.scoreRows.innerHTML = "";
  rows.forEach(row => {
    els.scoreRows.appendChild(renderScoreRow(row, {
      stage: "base",
      score: row.base
    }));
  });
  els.scoreDialog.showModal();
  els.scoreDialog.dataset.autoReveal = "armed";
  const autoRevealTimer = window.setTimeout(() => {
    if (els.scoreDialog.open && !els.revealFinalBtn.hidden) {
      els.scoreDialog.dataset.autoReveal = "fired";
      revealFinalScores();
    }
  }, 4500);
  eliminationTimers.push(autoRevealTimer);
}

function renderScoreRow(row, options = {}) {
  const scoreRow = document.createElement("div");
  const rank = options.rank ? `<span class="score-rank">${options.rank}</span>` : "";
  const avatar = options.winner ? victoryAvatar(row.player) : row.player.avatar;
  scoreRow.className = `score-row ${options.stage || "base"}`;
  if (options.eliminated) scoreRow.classList.add("eliminated");
  if (options.winner) scoreRow.classList.add("winner");
  scoreRow.dataset.playerIndex = String(row.playerIndex);
  scoreRow.innerHTML = `
    <div class="score-player">
      ${rank}
      <div class="score-avatar"><img src="assets/avatars/${avatar}" alt="${row.player.name}"></div>
      <strong>${row.player.name}</strong>
    </div>
    <div class="score-cards"></div>
    <div class="score-total">${options.score}</div>
  `;
  const cards = scoreRow.querySelector(".score-cards");
  row.player.cards.forEach(card => cards.appendChild(renderCard(card, { visible: true })));
  if (options.stage === "final") {
    const detail = document.createElement("small");
    detail.textContent = `卡面 ${row.base} + 监考 ${formatSigned(row.modifier)} + 检查 ${formatSigned(row.penalty)} = ${row.total}`;
    cards.appendChild(detail);
  }
  return scoreRow;
}

function victoryAvatar(player) {
  return player.avatar.replace(/(\.[a-zA-Z0-9]+)$/, "-win$1");
}

function revealFinalScores() {
  finalScoreData = finalScoreData || state.finalScoreData;
  if (!finalScoreData) return;
  clearEliminationTimers();
  const { check, rows } = finalScoreData;
  const ranked = rows
    .slice()
    .sort((a, b) => b.total - a.total || b.base - a.base || a.playerIndex - b.playerIndex);

  els.scoreTitle.textContent = "最终结算 / Final Reckoning";
  els.finalCheck.textContent = `${check.title}: ${check.text}`;
  els.revealFinalBtn.hidden = true;
  els.playAgainBtn.hidden = true;
  els.victoryBanner.hidden = true;
  renderFinalQueue(ranked, new Set());

  const eliminated = new Set();
  ranked.slice(0, -1).forEach((row, index) => {
    const timer = window.setTimeout(() => {
      const element = els.scoreRows.querySelector(`[data-player-index="${row.playerIndex}"]`);
      if (!element) return;
      element.classList.add("eliminated");
      const removeTimer = window.setTimeout(() => {
        eliminated.add(row.playerIndex);
        renderFinalQueue(ranked, eliminated);
        if (index === ranked.length - 2) {
          const victoryTimer = window.setTimeout(() => {
            showVictory(ranked[ranked.length - 1]);
          }, VICTORY_REVEAL_DELAY);
          eliminationTimers.push(victoryTimer);
        }
      }, ELIMINATION_FADE_DELAY);
      eliminationTimers.push(removeTimer);
    }, ELIMINATION_FIRST_DELAY + index * ELIMINATION_STEP_DELAY);
    eliminationTimers.push(timer);
  });
}

function renderFinalQueue(ranked, eliminated) {
  els.scoreRows.innerHTML = "";
  ranked.forEach((row, index) => {
    if (eliminated.has(row.playerIndex)) return;
    els.scoreRows.appendChild(renderScoreRow(row, {
      stage: "final",
      score: row.total,
      rank: ranked.length - index,
      winner: ranked.length - eliminated.size === 1
    }));
  });
}

function showVictory(winner) {
  els.scoreTitle.textContent = "Victory!";
  els.victoryBanner.hidden = false;
  playVictorySound();
  els.finalCheck.textContent = `${winner.player.name} 留在记分板上。最低风险获胜。/ ${winner.player.name} remains on the board. Lowest Risk wins.`;
  els.playAgainBtn.hidden = false;
}

function clearEliminationTimers() {
  eliminationTimers.forEach(timer => window.clearTimeout(timer));
  eliminationTimers = [];
}

function formatSigned(value) {
  return value > 0 ? `+${value}` : String(value);
}

function handleRevealFinalEvent(event) {
  const button = event.target.closest?.("#revealFinalBtn");
  if (!button || button.hidden || button.disabled) return;
  event.preventDefault();
  revealFinalScores();
}

function handleScoreDialogClose() {
  if (els.scoreDialog.returnValue === "revealFinal") {
    els.scoreDialog.returnValue = "";
    window.setTimeout(() => {
      if (!els.scoreDialog.open) els.scoreDialog.showModal();
      revealFinalScores();
    }, 0);
    return;
  }
  clearEliminationTimers();
}

els.drawBtn.addEventListener("click", humanDrawFromDeck);
els.discardBtn.addEventListener("click", humanTakeDiscard);
els.musicBtn.addEventListener("click", toggleMusic);
els.tutorialBtn.addEventListener("click", openTutorial);
els.tutorialCloseBtn.addEventListener("click", closeTutorial);
els.tutorialDialog.addEventListener("close", markTutorialSeen);
els.newGameBtn.addEventListener("click", startGame);
els.scoreDialog.addEventListener("close", handleScoreDialogClose);
els.revealFinalBtn.addEventListener("click", handleRevealFinalEvent);
els.revealFinalBtn.addEventListener("pointerdown", handleRevealFinalEvent);
els.revealFinalBtn.addEventListener("mousedown", handleRevealFinalEvent);
document.addEventListener("pointerdown", handleTeacherReactionButtonPress, true);
document.addEventListener("click", handleTeacherReactionButtonPress, true);
document.addEventListener("pointerdown", handleCardClickSound, true);
document.addEventListener("pointerdown", handleMusicGesture, true);
document.addEventListener("click", handleMusicGesture, true);
document.addEventListener("click", handleRevealFinalEvent);
document.addEventListener("pointerdown", handleRevealFinalEvent);
document.addEventListener("mousedown", handleRevealFinalEvent);
document.addEventListener("click", handleRevealFinalEvent, true);
document.addEventListener("pointerdown", handleRevealFinalEvent, true);
document.addEventListener("mousedown", handleRevealFinalEvent, true);
els.playAgainBtn.addEventListener("click", () => {
  clearEliminationTimers();
  els.scoreDialog.close();
  startGame();
});

initSoundEffects();
initMusic();
startGame();
showFirstGameTutorial();
