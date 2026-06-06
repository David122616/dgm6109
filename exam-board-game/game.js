const CARD_COPIES = 4;
const SPECIAL_COPIES = 3;
const HAND_SIZE = 4;

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
    text: "立刻进行一次 50/50 检查。/ Immediately resolve a 50/50 check."
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
  drawBtn: document.querySelector("#drawBtn"),
  discardBtn: document.querySelector("#discardBtn"),
  newGameBtn: document.querySelector("#newGameBtn"),
  choiceDialog: document.querySelector("#choiceDialog"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogText: document.querySelector("#dialogText"),
  dialogOptions: document.querySelector("#dialogOptions"),
  scoreDialog: document.querySelector("#scoreDialog"),
  finalCheck: document.querySelector("#finalCheck"),
  scoreRows: document.querySelector("#scoreRows"),
  playAgainBtn: document.querySelector("#playAgainBtn"),
  checkPreview: document.querySelector("#checkPreview")
};

let nextCardId = 1;
let state;

function createNumberCard(value) {
  return { id: nextCardId++, kind: "number", value };
}

function createSpecialCard(type) {
  return { id: nextCardId++, kind: "special", type };
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
  Object.keys(SPECIALS).forEach(type => {
    for (let copy = 0; copy < SPECIAL_COPIES; copy += 1) {
      deck.push(createSpecialCard(type));
    }
  });
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

function startGame() {
  nextCardId = 1;
  const deck = buildDeck();
  const players = [
    newPlayer("You / 你", "You", false),
    newPlayer("Player 2 / 玩家 2", "二", true),
    newPlayer("Player 3 / 玩家 3", "三", true),
    newPlayer("Player 4 / 玩家 4", "四", true)
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
    doneDeclaredBy: null,
    finalTurnsRemaining: null,
    gameOver: false,
    logs: []
  };

  addLog("考试开始。你已经秘密看过自己的前两张牌。/ Exam begins. You secretly looked at your first two cards.");
  render();
}

function currentPlayer() {
  return state.players[state.currentPlayer];
}

function topDiscard() {
  return state.discardPile[state.discardPile.length - 1] || null;
}

function numericValues(cards) {
  return cards.filter(card => card.kind === "number").map(card => card.value);
}

function handBaseScore(player) {
  return numericValues(player.cards).reduce((sum, value) => sum + value, 0);
}

function knownHumanScore() {
  return state.players[0].cards.reduce((sum, card, index) => {
    if (!state.players[0].known[index] || card.kind !== "number") return sum;
    return sum + card.value;
  }, 0);
}

function estimatePlayerLabel(playerIndex) {
  const player = state.players[playerIndex];
  if (playerIndex === 0) return `已知风险：${knownHumanScore() + player.modifier} / Known Risk: ${knownHumanScore() + player.modifier}`;
  const known = player.known
    .map((isKnown, index) => isKnown ? cardShortName(player.cards[index]) : null)
    .filter(Boolean);
  return known.length ? `已知 / Known: ${known.join(", ")}` : "暗牌未知 / Unknown";
}

function render() {
  if (!state) return;
  renderTopbar();
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

function renderPlayers() {
  els.players.innerHTML = "";
  state.players.slice(1).forEach((player, offset) => {
    const index = offset + 1;
    const panel = document.createElement("article");
    panel.className = `player-panel${state.currentPlayer === index ? " active" : ""}`;
    panel.innerHTML = `
      <div class="player-head">
        <div class="face">${player.avatar}</div>
        <div>
          <span class="player-name">${player.name}</span>
          <span class="risk">${estimatePlayerLabel(index)}</span>
        </div>
      </div>
      <div class="player-cards"></div>
    `;
    const cardArea = panel.querySelector(".player-cards");
    player.cards.forEach((card, cardIndex) => {
      cardArea.appendChild(renderCard(card, {
        visible: state.gameOver || player.known[cardIndex],
        small: true,
        badge: player.known[cardIndex] && !state.gameOver ? "已知 / Known" : ""
      }));
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
  els.humanEstimate.textContent = estimatePlayerLabel(0);
  els.humanCards.innerHTML = "";
  state.players[0].cards.forEach((card, index) => {
    const canPickForSwap = state.phase === "chooseSwap" && state.currentPlayer === 0;
    const element = renderCard(card, {
      visible: state.gameOver || state.players[0].known[index],
      badge: state.players[0].known[index] && !state.gameOver ? "已记住 / Known" : "",
      onClick: canPickForSwap ? () => swapHumanCard(index) : null
    });
    if (canPickForSwap) element.classList.add("selected");
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

    if (state.drawnCard.kind === "number") {
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
    const item = document.createElement("div");
    item.className = "log-entry";
    item.textContent = entry;
    els.log.appendChild(item);
  });
  els.log.scrollTop = els.log.scrollHeight;
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

  if (card.kind === "number") {
    const img = document.createElement("img");
    img.src = `assets/cards/${card.value}.png`;
    img.alt = `数字牌 ${card.value} / Number Card ${card.value}`;
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

function addActionButton(label, className, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.className = className;
  button.addEventListener("click", handler);
  els.actionButtons.appendChild(button);
}

function cardShortName(card) {
  if (!card) return "空 / Empty";
  if (card.kind === "number") return String(card.value);
  return `${SPECIALS[card.type].zh} / ${SPECIALS[card.type].title}`;
}

function cardDescription(card) {
  if (card.kind === "number") return `数字牌 ${card.value}，最终风险值会计入分数。/ Number Card ${card.value}. It counts toward your final Risk Score.`;
  const special = SPECIALS[card.type];
  return `${special.zh} / ${special.title}: ${special.text}`;
}

function addLog(text) {
  state.logs.push(text);
  renderLog();
}

function refillDeckIfNeeded() {
  if (state.deck.length > 0 || state.discardPile.length <= 1) return;
  const top = state.discardPile.pop();
  state.deck = shuffle(state.discardPile);
  state.discardPile = [top];
  addLog("抽牌堆用尽，弃牌堆洗混后形成新的抽牌堆。/ The draw pile ran out. The discard pile was shuffled into a new draw pile.");
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
  addLog(`你从抽牌堆抽到 ${cardShortName(card)}。/ You drew ${cardShortName(card)} from the draw pile.`);
  render();
}

function humanTakeDiscard() {
  if (state.currentPlayer !== 0 || state.phase !== "chooseSource" || !topDiscard()) return;
  const card = state.discardPile.pop();
  state.drawnCard = card;
  state.phase = "action";
  addLog(`你拿走弃牌堆顶的 ${cardShortName(card)}。/ You took ${cardShortName(card)} from the discard pile.`);
  render();
}

function swapHumanCard(index) {
  if (!state.drawnCard || state.drawnCard.kind !== "number") return;
  const player = state.players[0];
  const oldCard = player.cards[index];
  player.cards[index] = state.drawnCard;
  player.known[index] = true;
  state.discardPile.push(oldCard);
  addLog(`你把 ${state.drawnCard.value} 换入第 ${index + 1} 张手牌，弃掉 ${cardShortName(oldCard)}。/ You swapped ${state.drawnCard.value} into slot ${index + 1} and discarded ${cardShortName(oldCard)}.`);
  state.drawnCard = null;
  state.phase = "doneDecision";
  render();
}

function discardHumanDrawn() {
  if (!state.drawnCard) return;
  state.discardPile.push(state.drawnCard);
  addLog(`你弃掉 ${cardShortName(state.drawnCard)}。/ You discarded ${cardShortName(state.drawnCard)}.`);
  state.drawnCard = null;
  state.phase = "doneDecision";
  render();
}

async function useHumanSpecial() {
  const card = state.drawnCard;
  if (!card || card.kind !== "special") return;

  if (card.type === "peekSelf") {
    const index = await chooseCardSlot("偷看笔记 / Peek Notes", "选择自己的一张牌查看。/ Choose one of your cards to look at.", 0);
    if (index === null) return;
    state.players[0].known[index] = true;
    addLog(`你偷看了自己的第 ${index + 1} 张牌：${cardShortName(state.players[0].cards[index])}。/ You looked at your card in slot ${index + 1}: ${cardShortName(state.players[0].cards[index])}.`);
  }

  if (card.type === "peekOther") {
    const target = await chooseOpponent("偷看同桌 / Peek Neighbor", "选择一位玩家。/ Choose a player.");
    if (target === null) return;
    const index = await chooseCardSlot("偷看同桌 / Peek Neighbor", `选择 ${state.players[target].name} 的一张牌。/ Choose one card from ${state.players[target].name}.`, target);
    if (index === null) return;
    state.players[target].known[index] = true;
    addLog(`你看到了 ${state.players[target].name} 的第 ${index + 1} 张牌：${cardShortName(state.players[target].cards[index])}。/ You saw ${state.players[target].name}'s card in slot ${index + 1}: ${cardShortName(state.players[target].cards[index])}.`);
  }

  if (card.type === "passNotes") {
    const ownIndex = await chooseCardSlot("传纸条 / Pass Notes", "选择你要交出去的一张牌。/ Choose one of your cards to give away.", 0);
    if (ownIndex === null) return;
    const target = await chooseOpponent("传纸条 / Pass Notes", "选择交换对象。/ Choose a player to swap with.");
    if (target === null) return;
    const targetIndex = await chooseCardSlot("传纸条 / Pass Notes", `选择 ${state.players[target].name} 的一张牌。/ Choose one card from ${state.players[target].name}.`, target);
    if (targetIndex === null) return;
    exchangeCards(0, ownIndex, target, targetIndex);
    addLog(`你和 ${state.players[target].name} 交换了 1 张牌。/ You swapped one card with ${state.players[target].name}.`);
  }

  if (card.type === "hallMonitor") {
    resolveHallMonitor(0);
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

function resolveHallMonitor(playerIndex) {
  const player = state.players[playerIndex];
  const caught = Math.random() < 0.5;
  if (caught) {
    player.modifier += 2;
    addLog(`${player.name} 被监考发现，最高数字牌额外 +2 分。/ ${player.name} got caught by the Hall Monitor: +2 Risk.`);
  } else {
    player.modifier -= 3;
    addLog(`${player.name} 没有被抓到，总风险 -3 分。/ ${player.name} avoided getting caught: -3 Risk.`);
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
    addLog("你宣布 Done。其他玩家各获得最后 1 个回合。/ You declared Done. Every other player gets one final turn.");
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
  if (state.currentPlayer === 0) state.round += 1;
  state.phase = state.currentPlayer === 0 ? "chooseSource" : "ai";
  state.drawnCard = null;
  render();

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

  addLog(`${player.name} 从${sourceZh}拿到 ${cardShortName(card)}。/ ${player.name} took ${cardShortName(card)} from the ${sourceEn}.`);

  if (card.kind === "number") {
    aiHandleNumber(index, card);
  } else {
    aiUseSpecial(index, card);
  }

  if (state.doneDeclaredBy === null && shouldAiDeclareDone(index)) {
    state.doneDeclaredBy = index;
    state.finalTurnsRemaining = state.players.length - 1;
    addLog(`${player.name} 宣布 Done。其他玩家各获得最后 1 个回合。/ ${player.name} declared Done. Every other player gets one final turn.`);
  }

  render();
  window.setTimeout(() => finishTurn(index), 550);
}

function shouldTakeDiscard(player, card) {
  if (card.kind === "special") return card.type === "hallMonitor" && handBaseScore(player) > 25;
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
    addLog(`${player.name} 换掉了一张高风险牌。/ ${player.name} swapped out a high-risk card.`);
  } else {
    state.discardPile.push(card);
    addLog(`${player.name} 弃掉 ${cardShortName(card)}。/ ${player.name} discarded ${cardShortName(card)}.`);
  }
}

function aiUseSpecial(playerIndex, card) {
  const player = state.players[playerIndex];
  if (card.type === "peekSelf") {
    addLog(`${player.name} 偷看了自己的笔记。/ ${player.name} peeked at their own notes.`);
  }

  if (card.type === "peekOther") {
    const target = randomOtherPlayer(playerIndex);
    addLog(`${player.name} 偷看了 ${state.players[target].name} 的一张牌。/ ${player.name} peeked at one card from ${state.players[target].name}.`);
  }

  if (card.type === "passNotes") {
    const ownIndex = highestCardIndex(player);
    const target = randomOtherPlayer(playerIndex);
    const targetIndex = Math.floor(Math.random() * HAND_SIZE);
    if (ownIndex !== -1) {
      exchangeCards(playerIndex, ownIndex, target, targetIndex);
      addLog(`${player.name} 和 ${state.players[target].name} 传了纸条。/ ${player.name} passed notes with ${state.players[target].name}.`);
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
    if (card.kind === "number" && card.value > highestValue) {
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
  const check = CHEATING_CHECKS[Math.floor(Math.random() * CHEATING_CHECKS.length)];
  els.checkPreview.textContent = `${check.title}: ${check.text}`;
  const rows = state.players.map(player => {
    const base = handBaseScore(player);
    const penalty = check.applies(player.cards) ? check.penalty : 0;
    const total = base + player.modifier + penalty;
    return { player, base, modifier: player.modifier, penalty, total };
  });
  const winnerScore = Math.min(...rows.map(row => row.total));
  addLog(`作弊检查揭示：${check.title}。最低风险分获胜。/ Cheating Check revealed: ${check.title}. Lowest Risk Score wins.`);
  render();
  showScores(check, rows, winnerScore);
}

function showScores(check, rows, winnerScore) {
  els.finalCheck.textContent = `${check.title}: ${check.text}`;
  els.scoreRows.innerHTML = "";
  rows.forEach(row => {
    const scoreRow = document.createElement("div");
    scoreRow.className = `score-row${row.total === winnerScore ? " winner" : ""}`;
    scoreRow.innerHTML = `
      <strong>${row.player.name}</strong>
      <div class="score-cards"></div>
      <div class="score-total">${row.total}</div>
    `;
    const cards = scoreRow.querySelector(".score-cards");
    row.player.cards.forEach(card => cards.appendChild(renderCard(card, { visible: true })));
    const detail = document.createElement("small");
    detail.textContent = `数字 ${row.base} + 监考 ${row.modifier} + 检查 ${row.penalty} / Numbers ${row.base} + Monitor ${row.modifier} + Check ${row.penalty}`;
    cards.appendChild(detail);
    els.scoreRows.appendChild(scoreRow);
  });
  els.scoreDialog.showModal();
}

els.drawBtn.addEventListener("click", humanDrawFromDeck);
els.discardBtn.addEventListener("click", humanTakeDiscard);
els.newGameBtn.addEventListener("click", startGame);
els.playAgainBtn.addEventListener("click", () => {
  els.scoreDialog.close();
  startGame();
});

startGame();
