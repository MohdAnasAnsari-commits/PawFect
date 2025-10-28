document.addEventListener('DOMContentLoaded', () => {

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if(href.startsWith('#') && document.querySelector(href)){
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    // --- FADE-IN ANIMATION ON SCROLL ---
    const allSections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        allSections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
             sec.classList.add('visible');
            }
       });
    });
    

    // --- SECTION DISPLAY ---
    const sections = ['pet-section', 'services-section', 'rating-section', 'contact-section'];
    function showSection(sectionId){
        sections.forEach(id => {
            const sec = document.getElementById(id);
            sec.style.display = (id === sectionId) ? (id === 'pet-section' ? 'flex' : 'block') : 'none';
        });
    }

    function setActiveLink(linkId){
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        if(linkId) document.getElementById(linkId).classList.add('active');
    }

    document.getElementById('home-link').addEventListener('click', e => {
        e.preventDefault();
        showSection('pet-section');
        setActiveLink('home-link');
    });

    document.getElementById('services-link').addEventListener('click', e => {
        e.preventDefault();
        showSection('services-section');
        setActiveLink('services-link');
    });

    document.getElementById('rating-link').addEventListener('click', e => {
        e.preventDefault();
        showSection('rating-section');
        setActiveLink('rating-link');
        renderRatings();
    });

    // --- LOGIN / LOGOUT ---
    const loginLogoutBtn = document.getElementById('login-logout-btn');

    function checkLogin(){
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        loginLogoutBtn.textContent = isLoggedIn ? 'Logout' : 'Login';
    }
    checkLogin();

    loginLogoutBtn.addEventListener('click', e => {
        e.preventDefault();
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if(isLoggedIn){
            localStorage.setItem('isLoggedIn','false');
            alert('✅ You have been logged out!');
            checkLogin();
        } else {
            const name = prompt('Enter Name:');
            const email = prompt('Enter Email:');
            const password = prompt('Enter Password:');
            if(name && email && password){
                localStorage.setItem('pawfectUser', JSON.stringify({name,email,password}));
                localStorage.setItem('isLoggedIn','true');
                alert('✅ Logged in successfully!');
                checkLogin();
            }
        }
    });

    // --- BOOKING MODAL ---
    const bookingOverlay = document.getElementById('booking-overlay');
    const bookingForm = document.getElementById('booking-form');
    const closeBookingBtn = document.getElementById('close-booking');

    function openBookingForm(){ bookingOverlay.style.display = 'flex'; }
    function closeBookingForm(){ bookingOverlay.style.display = 'none'; }

    document.querySelectorAll('.pet-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if(isLoggedIn){
                openBookingForm();
            } else {
                alert('⚠️ Please login to book an appointment.');
            }
        });
    });

    closeBookingBtn.addEventListener('click', closeBookingForm);

    // --- Payment QR Codes ---
    const qrCodes = {
        "Google Pay": "QR.png",
        "PhonePe": "QR.png",
        "Paytm": "QR.png"
    };

    bookingForm.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(bookingForm);
        const petName = formData.get('petName');
        const petType = formData.get('petType');
        const service = formData.get('service');
        const date = formData.get('appointmentDate');
        const contact = formData.get('contact');
        const address = formData.get('address');
        const paymentMethod = formData.get('paymentMethod');

        closeBookingForm();

        // If payment QR is needed
        if(paymentMethod in qrCodes){
            const qrModal = document.createElement('div');
            qrModal.innerHTML = `
                <div id="qr-overlay" style="display:flex; position:fixed; top:0; left:0; width:100%; height:100%;
                    background: rgba(0,0,0,0.7); z-index:10000; justify-content:center; align-items:center;">
                    <div style="background:white; padding:30px; border-radius:8px; text-align:center; width:90%; max-width:400px;">
                        <h2 style="color:#4CAF50; margin-bottom:20px;">Scan to Pay via ${paymentMethod}</h2>
                        <img src="${qrCodes[paymentMethod]}" alt="${paymentMethod} QR" style="width:200px; height:200px; object-fit:contain;">
                        <p style="margin-top:15px; font-size:0.95rem; color:#666;">After payment, click Confirm to finalize booking.</p>
                        <button id="confirm-qr" style="margin-top:20px; background:#e36464; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">Confirm</button>
                    </div>
                </div>`;
            document.body.appendChild(qrModal);

            document.getElementById('confirm-qr').addEventListener('click', () => {
                qrModal.remove();
                showBookingConfirmation(petName, petType, service, date, contact,address, paymentMethod);
            });
        } else {
            showBookingConfirmation(petName, petType, service, date, contact,address, paymentMethod);
        }

        bookingForm.reset();
    });

    function showBookingConfirmation(petName, petType, service, date, contact,address, payment){
        const confirmModal = document.createElement('div');
        confirmModal.innerHTML = `
            <div id="confirmation-overlay" style="display:flex; position:fixed; top:0; left:0; width:100%; height:100%;
                background: rgba(0,0,0,0.5); z-index:10001; justify-content:center; align-items:center;">
                <div style="background:white; padding:30px; border-radius:8px; text-align:center; width:90%; max-width:400px;">
                    <h2 style="color:#4CAF50;">🎉 Booking Confirmed!</h2>
                    <p style="margin-top:15px; font-size:1.1rem; color:#333;">Your slot is booked.</p>
                    <p style="margin-top:10px; font-size:0.95rem; color:#666;">
                        <strong>Pet:</strong> ${petName} (${petType})<br>
                        <strong>Service:</strong> ${service}<br>
                        <strong>Date:</strong> ${new Date(date).toLocaleString()}<br>
                        <strong>Contact:</strong> ${contact}<br>
                        <strong>Address:</strong> ${address}<br>
                        <strong>Payment:</strong> ${payment}
                    </p>
                    <button id="close-confirmation" style="margin-top:20px; background:#e36464; color:white; border:none; 
                        padding:10px 20px; border-radius:5px; cursor:pointer;">OK</button>
                </div>
            </div>`;
        document.body.appendChild(confirmModal);

        document.getElementById('close-confirmation').addEventListener('click', () => {
            confirmModal.remove();
        });
    }

    // --- STAR RATING SYSTEM ---
    const stars = document.querySelectorAll('.star-rating span');
    const ratingInput = document.getElementById('rating');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const val = parseInt(star.dataset.value);
            stars.forEach(s => s.classList.remove('hover'));
            stars.forEach(s => {
                if(parseInt(s.dataset.value) <= val) s.classList.add('hover');
            });
        });

        star.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.remove('hover'));
        });

        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
            ratingInput.value = selectedRating;
            stars.forEach(s => s.classList.remove('selected'));
            stars.forEach(s => {
                if(parseInt(s.dataset.value) <= selectedRating) s.classList.add('selected');
            });
        });
    });

    // --- SAVE AND DISPLAY RATINGS ---
    function saveRating(ratingData){
        const ratings = JSON.parse(localStorage.getItem('pawfectRatings') || '[]');
        ratings.push(ratingData);
        localStorage.setItem('pawfectRatings', JSON.stringify(ratings));
    }

    function renderRatings(){
        const ratingsList = document.getElementById('ratings-list');
        ratingsList.innerHTML = '';
        const ratings = JSON.parse(localStorage.getItem('pawfectRatings') || '[]');
        if(ratings.length === 0){
            ratingsList.innerHTML = '<p>No ratings yet. Be the first to rate!</p>';
            return;
        }
        ratings.forEach(r => {
            const div = document.createElement('div');
            div.style.background = '#fff';
            div.style.padding = '15px';
            div.style.marginBottom = '10px';
            div.style.borderLeft = '5px solid #e36464';
            div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
            div.innerHTML = `<strong>${r.user}</strong> (${r.rating}⭐️)<p>${r.comment}</p><small style="color:#666;">${r.time}</small>`;
            ratingsList.appendChild(div);
        });
    }

    document.getElementById('rating-form').addEventListener('submit', e => {
        e.preventDefault();
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if(!isLoggedIn){ alert('⚠️ Please login to submit rating!'); return; }

        const rating = document.getElementById('rating').value;
        const comment = document.getElementById('comment').value;
        const user = JSON.parse(localStorage.getItem('pawfectUser')).name || 'Anonymous';
        saveRating({user, rating, comment, time: new Date().toLocaleString()});
        document.getElementById('rating-form').reset();
        renderRatings();
        alert('✅ Thank you for your feedback!');
    });

    // --- CONTACT SECTION NAVIGATION ---
    const contactLink = document.getElementById('contact-link');
    if(contactLink){
        contactLink.addEventListener('click', e => {
            e.preventDefault();
            showSection('contact-section');
            setActiveLink('contact-link');
        });
    }

    // --- CONTACT FORM FUNCTIONALITY ---
    const contactForm = document.getElementById('contact-form');
    if(contactForm){
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            const messages = JSON.parse(localStorage.getItem('pawfectMessages') || '[]');
            messages.push({ name, email, message, time: new Date().toLocaleString() });
            localStorage.setItem('pawfectMessages', JSON.stringify(messages));

            alert(`✅ Thank you, ${name}! Your message has been sent successfully.`);
            contactForm.reset();
        });
    }

});
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    // Load reviews from localStorage
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [
        { name: "Janvi", text: "Amazing service!" },
        { name: "Anas", text: "Really loved it!" },
        { name: "Shivam", text: "Will come back again." }
    ];

    // Create review cards
    reviews.forEach(review => {
        const div = document.createElement('div');
        div.className = 'review';
        div.innerHTML = `<p>"${review.text}"</p><h4>- ${review.name}</h4>`;
        track.appendChild(div);
    });

    let index = 0;

    function updateCarousel() {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
        index = (index === 0) ? reviews.length - 1 : index - 1;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        index = (index === reviews.length - 1) ? 0 : index + 1;
        updateCarousel();
    });

    // Optional: auto slide every 5 seconds
    setInterval(() => {
        nextBtn.click();
    }, 5000);
});
document.addEventListener('DOMContentLoaded', () => {
  const shopBtn = document.getElementById('shopBtn');
  const shopOptions = document.getElementById('shopOptions');

  // Toggle Shop Section
  shopBtn.addEventListener('click', () => {
    shopOptions.classList.toggle('hidden');
  });

  // Product Data
  const dogProductsData = [
    {name: "Dog Food", price: "$25", img:"dog/dog-food.jpg"},
    {name: "Dog Treats", price: "$10", img:"dog/dog-treat.jpg"},
    {name: "Dog Toys", price: "$15", img:"dog/dog-toys.jpg"},
    {name: "Grooming Supplies", price: "$20", img:"dog/grooming.jpg"},
    {name: "Oral Care", price: "$12", img:"dog/oral.jpg"},
    {name: "Walk Essentials", price: "$18", img:"dog/walk.jpg"},
    {name: "Beds & Mats", price: "$35", img:"dog/beds.jpg"},
    {name: "Supplements", price: "$22", img:"dog/supl.jpg"},
    {name: "Bowls & Diners", price: "$15", img:"dog/bowl.jpg"},
    {name: "Dog Shoes", price: "$20", img:"dog/shoes.jpg"},
    {name: "Dog Accessories", price: "$40", img:"dog/dog-accessories.jpg"}
  ];

  const catProductsData = [
    {name: "Cat Food", price: "$23", img:"cat/cat-food.jpg"},
    {name: "Cat Treats", price: "$9", img:"cat/cat-treat.jpg"},
    {name: "Cat Litter & Supplies", price: "$18", img:"cat/catlitter.jpg"},
    {name: "Cat Toys", price: "$12", img:"cat/cat-toys.jpg"},
    {name: "Scratchers", price: "$25", img:"cat/skatechers.jpg"},
    {name: "Grooming Essentials", price: "$20", img:"cat/groom.jpg"},
    {name: "Cat Walk", price: "$30", img:"cat/boots.jpg"},
    {name: "Houses & Tents", price: "$40", img:"cat/house.jpg"}
  ];

  function renderProducts(containerId, products) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>${p.price}</p>
        <button>Buy Now</button>
      `;
      container.appendChild(card);
    });
  }

  renderProducts('dogProducts', dogProductsData);
  renderProducts('catProducts', catProductsData);
});

// --- SHOP BUY NOW PAYMENT & CONFIRMATION POPUP ---
document.addEventListener('click', function(e) {
  if (e.target && e.target.textContent.trim() === 'Buy Now') {
    e.preventDefault();
    const productName = e.target.parentElement.querySelector('h4').textContent;

    // Create payment popup with QR
    const qrPopup = document.createElement('div');
    qrPopup.innerHTML = `
      <div id="shop-qr-overlay" style="
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center;
        z-index: 20000;">
        <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; max-width: 400px; width: 90%;">
          <h2 style="color: #4CAF50;">Pay for ${productName}</h2>
          <p style="margin: 10px 0 20px; color: #333;">Scan this QR to complete payment:</p>
          <img src="QR.png" alt="QR Code" style="width:200px; height:200px; object-fit:contain;">
          <button id="confirm-payment" style="margin-top:20px; background:#4CAF50; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">Confirm Payment</button>
          <button id="cancel-payment" style="margin-top:20px; background:#ccc; color:#333; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; margin-left:10px;">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(qrPopup);

    // Confirm payment button
    document.getElementById('confirm-payment').addEventListener('click', () => {
      qrPopup.remove();

      // Show confirmation popup
      const confirmPopup = document.createElement('div');
      confirmPopup.innerHTML = `
        <div id="shop-confirm-overlay" style="
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center;
          z-index: 20001;">
          <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; max-width: 400px; width: 90%;">
            <h2 style="color: #4CAF50;">✅ Item Purchased!</h2>
            <p style="margin-top:15px; color:#333;">Your ${productName} will be delivered to you in two days.</p>
            <button id="close-confirm" style="margin-top:20px; background:#e36464; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(confirmPopup);

      document.getElementById('close-confirm').addEventListener('click', () => {
        confirmPopup.remove();
      });
    });

    // Cancel payment button
    document.getElementById('cancel-payment').addEventListener('click', () => {
      qrPopup.remove();
    });
  }
});


// --- ADOPT ME POPUP ---
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('adopt-btn')) {
    const petName = e.target.parentElement.querySelector('h4').textContent;

    const adoptPopup = document.createElement('div');
    adoptPopup.innerHTML = `
      <div id="adopt-overlay" style="
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center;
        z-index:30000;">
        <div style="background:white; padding:25px; border-radius:10px; text-align:center; max-width:400px; width:90%;">
          <h2 style="color:#e36464;">Adopt ${petName} ❤️</h2>
          <p style="margin-top:10px; color:#333;">
            Thank you for choosing adoption! Our team will contact you soon to proceed.
          </p>
          <button id="close-adopt" style="margin-top:20px; background:#e36464; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(adoptPopup);

    document.getElementById('close-adopt').addEventListener('click', () => {
      adoptPopup.remove();
    });
  }
});


// --- SIMPLE CHATBOT / FAQ ASSISTANT ---
document.addEventListener('DOMContentLoaded', () => {
  const chatbotBtn = document.getElementById('chatbot-toggle');
  const chatbox = document.getElementById('chatbox');
  const chatBody = document.getElementById('chat-body');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');

  // Toggle chatbot visibility
  chatbotBtn.addEventListener('click', () => {
    chatbox.classList.toggle('hidden');
  });

  // Predefined quick responses
  const responses = {
    "hi": "Hello! 👋 Welcome to Pawfect Grooming. How can I assist you?",
    "hello": "Hi there! 😊 How can I help?",
    "hours": "🕒 We're open from 9 AM to 8 PM every day!",
    "services": "🐶 We offer Bath & Brush, Haircut & Styling, Nail Trimming, and Full Groom Packages.",
    "location": "📍 We're located at Subhas Nagar, Dehradun.",
    "contact": "📞 You can call us at +91 8077496931 or message us here!",
    "booking": "🐾 You can book directly using the 'Book Now' button on the top!",
    "bye": "Goodbye! 👋 Have a pawfect day!",
    "default": "I'm just a little assistant 🐾 — try asking about 'hours', 'services', or 'contact'.",
    "thankyou":"Thank you to contact us.",
    "Thankyou":"Thank you to contact us.",
    "thank you":"Thank you to contact us.",
    "how to pet":"1)Approach slowly and let your pet sniff you. 2)Pet gently around the head and back. 3)Always watch for signs of discomfort.",
    "pet care tips":"1)Feed a balanced diet suitable for your pet's age.2)Regular exercise is important for physical and mental health.3)Schedule routine vet check-ups and vaccinations."
  };

  function addMessage(message, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'user-msg' : 'bot-msg';
    msgDiv.textContent = message;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function botReply(userText) {
    const lower = userText.toLowerCase();
    const reply = responses[lower] || 
      Object.keys(responses).find(key => lower.includes(key)) 
        ? responses[Object.keys(responses).find(key => lower.includes(key))] 
        : responses.default;
    setTimeout(() => addMessage(reply, 'bot'), 500);
  }

  chatSend.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
      addMessage(text, 'user');
      chatInput.value = '';
      botReply(text);
    }
  });

  chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      chatSend.click();
    }
  });
});
