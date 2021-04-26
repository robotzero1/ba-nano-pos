const productButtons = document.querySelectorAll(".product-button");
const qrcodeArea = document.querySelector("#qrcode-area");
const monkeyArea = document.querySelector("#monkey-area");
const confirmingArea = document.querySelector("#tx-confirming-area");
const statusArea = document.querySelector("#status-area");
const statusWaiting = document.querySelector("#status-waiting");
const statusComplete = document.querySelector("#status-complete");
const statusFailed = document.querySelector("#status-failed");
const monkeyFooter = document.querySelector("#monkey-footer");
const prices = {
  product1: 2,
  product2: 3,
  product3: 1
};
let quantity = {
  product1: 0,
  product2: 0,
  product3: 0
};
let priceTotal = 0;
const totalDisplay = document.querySelector("#total-display");
let qcode;
let qrCodeOnScreen = false;
let monkeyList = [];
const banoAddy = "ban_1takcf13py4ughp65sres7cg7bm9wekki16n63dmiq55z9nt3y39mwe45tn7";
let pendingTimer = null;

Array.from(productButtons).forEach(button => {
  button.addEventListener('click', function(e) {
    quantity[button.id]++;
    button.lastChild.textContent = quantity[button.id];
    recalculateTotal();
    drawQRCode(priceTotal);
    clearTimeout(pendingTimer);
    pendingTimer = setTimeout(wrapper, 3 * 1000); // no input for 3 secs start wrapper function
  });

  button.addEventListener('mousedown', function(e) {
    button.style.backgroundColor = "red";
  });

  button.addEventListener('mouseup', function(e) {
    button.style.backgroundColor = "darkgreen";
    button.firstChild.style.filter = "brightness(50%)";
  });

  //TODO Long press to clear this product qty

})

function recalculateTotal() {
  // nope
  //Array.from(prices).forEach(product => {
  //    priceTotal += prices[product] * quantity[product];
  //})

  // blurgh
  priceTotal = prices.product1 * quantity.product1 + prices.product2 * quantity.product2 + prices.product3 * quantity.product3
  totalDisplay.firstElementChild.textContent = priceTotal;
}

function drawQRCode(priceTotal) {
  let text4QRCode = "banano:" + banoAddy + "?amount=" + priceTotal + "00000000000000000000000000000&label=Banana%20Fund";
  let options = {
    text: text4QRCode,
    colorLight: "#FBDD11",
    height: 200,
    width: 200
  };
  if (qrCodeOnScreen) {
    qrcode.clear();
  }
  qrcode = new QRCode(qrcodeArea, options);
  qrCodeOnScreen = true;
}

function updateStatus(status) {
  if (status == "waiting") {
    statusWaiting.style.display = "block";
  }
  if (status == "complete") {
    statusWaiting.style.display = "none";
    statusComplete.style.display = "block";
  }
  if (status == "failed") {
    statusWaiting.style.display = "none";
    statusFailed.style.display = "block";
  }
}

function showMonkeyFooter(txSource, txBlock) {
  const myHeaders = new Headers();
  const myRequest = new Request("https://monkey.banano.cc/api/v1/monkey/" + txSource, {
    method: "GET",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
  });

  fetch(myRequest)
    .then(handleMonkeyErrors)
    .then((response) => response.text())
    .then((monkeySVG) => {
      let monkeyBox = document.createElement("div");
      monkeyBox.classList.add("monkey-box");
      let sourceAndBlock = txSource + txBlock;
      monkeyBox.id = sourceAndBlock;
      monkeyBox.addEventListener("click", function(e) {
        showMonkeyForConfirm(monkeySVG, sourceAndBlock);
      });
      monkeyFooter.appendChild(monkeyBox).innerHTML = monkeySVG;

    })
    .catch(error => console.log(error));
}

function handleMonkeyErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function showMonkeyForConfirm(monkeySVG, sourceAndBlock) {
  qrcodeArea.style.display = "none";
  monkeyArea.innerHTML = monkeySVG;
  monkeyArea.style.display = "block";
  monkeyArea.addEventListener("click", function(e) {
    document.querySelector("body").style.opacity = 0.4;
    confirmingArea.style.display = "block";
    confirmOnServer(sourceAndBlock);
  });
}

function confirmOnServer(confirmSourceAndBlock) {
  let confirmSource = confirmSourceAndBlock.substring(0, 64); // assume source account is 64 characters
  let confirmBlock = confirmSourceAndBlock.substring(64);
  const myHeaders = new Headers();
  // request to banopos.live will fail due to cors
  const request = "https://monkeybrain.bananopos.live/?account=" + confirmSource + "&block=" + confirmBlock;

  const myRequest = new Request(request, {
    method: "GET",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
  });

  fetch(myRequest)
    .then(handleMonkeyErrors)
    .then((response) => response.text())
    .then((message) => {
      if (message == 'ok') {
        confirmingArea.remove();
        document.querySelector("body").style.opacity = 1;
        monkeyArea.classList.add("pop");
        monkeyArea.addEventListener('animationend', () => {
          document.querySelector("#" + confirmSourceAndBlock).remove();
        });
        totalDisplay.textContent = "CONFIRMED";
      }
    })
    .catch(error => console.log(error));
}

// https://levelup.gitconnected.com/how-to-turn-settimeout-and-setinterval-into-promises-6a4977f0ace3
const serverCheck = async () => {
  const url = 'https://kaliumapi.appditto.com/api';
  window.bananocoinBananojs.setBananodeApiUrl(url);
  const pending = await window.bananocoinBananojs.getAccountsPending([banoAddy], 9, true); // get up to 9 pending blocks for this addy
  let hashes = Object.entries(pending.blocks[banoAddy]);
  hashes.forEach((block) => {
    let txBlock = block[0]; // block hash;
    let txSource = block[1].source; // block.amount;        
    let txAmount = block[1].amount; // block.source;
    if (priceTotal == txAmount / 100000000000000000000000000000) { // block amount matches total price
      if (!monkeyList.includes(txSource)) { // not shown yet
        showMonkeyFooter(txSource, txBlock); // show pending monkey in footer
        monkeyList.push(txSource);
      }
    }

  })
  if (monkeyList.length === 0) {
    // no matching transactions
    return false;
  }
  return true;
}

const asyncInterval = async (callback, ms, triesLeft = 1) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      if (await callback()) { 
        if (triesLeft <= 1) { // Payments found and timeout
          resolve();
          updateStatus("complete");
          clearInterval(interval);
        }
      } else if (triesLeft <= 1) { // No payments found and timeout
        updateStatus("failed");
        reject();
        clearInterval(interval);
      }
      triesLeft--;
    }, ms);
  });
}
const wrapper = async () => {
  console.log("wrapper running");
  updateStatus("waiting");
  try {
    await asyncInterval(serverCheck, 15000); // check for payments every 15 secs
  } catch (e) {
    console.log('error handling - show x in interface');
  }
  console.log("Done!");
}
