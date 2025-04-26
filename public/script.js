// Sample apartment data
const sampleApartments = [
  {
    id: 1,
    name: "Moderne Wohnung in Berlin-Mitte",
    description: "Helle und moderne 2-Zimmer-Wohnung in bester Lage mit Blick auf den Park. Die Wohnung wurde kürzlich renoviert und verfügt über eine voll ausgestattete Küche, ein komfortables Schlafzimmer mit Doppelbett und ein geräumiges Wohnzimmer mit Schlafcouch für zusätzliche Gäste.",
    price_per_night: 89,
    location: "Berlin, Deutschland",
    rating: 4.8,
    reviews_count: 24,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["WLAN (kostenlos)", "Voll ausgestattete Küche", "Smart TV", "Klimaanlage", "Parkplatz (gegen Gebühr)", "Waschmaschine"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1582719471383-c3ec6b9e3c0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    reviews: [
      { name: "Anna M.", rating: 5.0, date: "März 2023", text: "Tolle Wohnung in perfekter Lage! Sehr sauber und mit allem ausgestattet, was man braucht. Der Vermieter war super freundlich und hilfsbereit." },
      { name: "Thomas K.", rating: 4.5, date: "Januar 2023", text: "Schöne Wohnung, zentral gelegen. Das Bett könnte etwas bequemer sein, aber insgesamt ein guter Aufenthalt." }
    ],
    extras: [
      { id: 1, name: "Zusatzbett", price: 20, per: "Nacht" },
      { id: 2, name: "Frühstück", price: 15, per: "Tag" },
      { id: 3, name: "Parkplatz", price: 10, per: "Tag" }
    ],
    map_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.409746318991!2d13.39384931580703!3d52.51446177981197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851c741ee5d6f%3A0x6a3b3e3b3e3b3e3b!2sBrandenburger%20Tor!5e0!3m2!1sde!2sde!4v1620000000000!5m2!1sde!2sde"
  },
  {
    id: 2,
    name: "Luxuriöses Apartment in München-Schwabing",
    description: "Elegantes Apartment im trendigen Schwabing mit hochwertiger Ausstattung. Die Wohnung bietet einen offenen Wohn-/Essbereich mit Designermöbeln, eine voll ausgestattete Premium-Küche und ein geräumiges Schlafzimmer mit Kingsize-Bett. Ideal für anspruchsvolle Gäste, die München in stilvollem Ambiente erleben möchten.",
    price_per_night: 145,
    location: "München, Deutschland",
    rating: 4.9,
    reviews_count: 18,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: [
      "WLAN (High-Speed)",
      "Premium-Küche mit Nespresso-Maschine",
      "Smart TV mit Streaming-Diensten",
      "Klimaanlage",
      "Waschmaschine/Trockner",
      "Balkon mit Stadteinblick",
      "Arbeitsplatz mit Monitor"
    ],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    reviews: [
      { 
        name: "Sophie L.", 
        rating: 5.0, 
        date: "April 2023", 
        text: "Absolut traumhafte Wohnung! Die Ausstattung lässt keine Wünsche offen und die Lage ist perfekt für München-Besuche. Der Vermieter hat uns sogar eine Willkommensflasche Wein dagelassen - toller Service!" 
      },
      { 
        name: "Markus R.", 
        rating: 4.5, 
        date: "Februar 2023", 
        text: "Sehr schönes Apartment mit hochwertiger Einrichtung. Die Küche ist besser ausgestattet als meine eigene zu Hause. Kleiner Minuspunkt für die etwas laute Straße am Morgen." 
      }
    ],
    extras: [
      { id: 1, name: "Parkplatz (Tiefgarage)", price: 18, per: "Tag" },
      { id: 2, name: "Premium-Frühstück", price: 22, per: "Person/Tag" },
      { id: 3, name: "Reinigungsservice", price: 45, per: "Aufenthalt" }
    ],
    map_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.123456789012!2d11.57345678901234!3d48.16789123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479e75c123456789%3A0xabcdef1234567890!2sSchwabing%2C%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1234567890123!5m2!1sde!2sde"
  },
  {
    id: 3,
    name: "Modernes Hafencity-Loft mit Elbblick",
    description: "Spektakuläres Loft in Hamburgs trendiger Hafencity mit direktem Blick auf die Elbe. Die industriell-chic eingerichtete Wohnung bietet auf 75qm einen großen Wohnbereich mit Lounge-Ecke, eine Gourmetküche mit Insel und ein stilvolles Bad mit Regendusche. Perfekte Lage für Hamburg-Entdecker!",
    price_per_night: 165,
    location: "Hamburg, Deutschland",
    rating: 4.7,
    reviews_count: 15,
    image: "https://images.unsplash.com/photo-1582719471383-c3ec6b9e3c0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: [
      "WLAN (Glasfaser)",
      "Designerküche mit Weinregal",
      "55-Zoll Ultra HD Smart TV",
      "Premium-Soundanlage",
      "Regendusche & Badewanne",
      "Tageslicht-Arbeitsplatz",
      "Fahrräder zur Verfügung"
    ],
    images: [
      "https://images.unsplash.com/photo-1582719471383-c3ec6b9e3c0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    reviews: [
      { 
        name: "Janina K.", 
        rating: 5.0, 
        date: "Mai 2023", 
        text: "Wow! Der Blick auf die Elbe ist atemberaubend, besonders bei Sonnenuntergang. Das Loft ist noch schöner als auf den Fotos und die Lage perfekt - alles Wichtige ist zu Fuß erreichbar. Komme definitiv wieder!" 
      },
      { 
        name: "Oliver T.", 
        rating: 4.0, 
        date: "März 2023", 
        text: "Tolle Wohnung mit einzigartigem Flair. Die Küche ist ein Traum für Hobbyköche. Die einzigen kleinen Kritikpunkte: Die Klimaanlage war etwas laut und es gab morgens etwas Schiffsgeräusche vom Hafen." 
      }
    ],
    extras: [
      { id: 1, name: "Parkplatz (sicher)", price: 15, per: "Tag" },
      { id: 2, name: "Fahrradverleih", price: 12, per: "Tag" },
      { id: 3, name: "Brunch-Korb", price: 35, per: "Aufenthalt" }
    ],
    map_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2367.123456789012!2d9.98765432101234!3d53.54123456789012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b18abcdef12345%3A0x987654321abcde!2sHafencity%2C%20Hamburg!5e0!3m2!1sde!2sde!4v1234567890123!5m2!1sde!2sde"
  }
];

// Load apartments for apartments.html
function loadApartments() {
  const container = document.getElementById('apartments-container');
  
  if (!container) return;
  
  container.innerHTML = sampleApartments.map(apartment => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card apartment-card h-100">
        <img src="${apartment.image}" class="card-img-top" alt="${apartment.name}">
        <div class="card-body">
          <div class="d-flex justify-content-between mb-2">
            <h5 class="card-title mb-0">${apartment.name}</h5>
            <div class="rating">
              <i class="fas fa-star"></i> ${apartment.rating}
            </div>
          </div>
          <p class="text-muted">${apartment.location}</p>
          <p class="card-text">${apartment.description.substring(0, 100)}...</p>
          <div class="features mb-3">
            ${apartment.features.slice(0, 3).map(feature => `<span class="badge bg-light text-dark me-1 mb-1">${feature}</span>`).join('')}
            ${apartment.features.length > 3 ? `<span class="badge bg-light text-dark">+${apartment.features.length - 3} mehr</span>` : ''}
          </div>
        </div>
        <div class="card-footer bg-white border-0">
          <div class="d-flex justify-content-between align-items-center">
            <span class="price">${apartment.price_per_night}€ <small class="text-muted">/ Nacht</small></span>
            <a href="apartmentDetails.html?id=${apartment.id}" class="btn btn-primary btn-sm">Details</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Load apartment details for apartmentDetails.html
function loadApartmentDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const apartmentId = urlParams.get('id');
  const apartment = sampleApartments.find(a => a.id == apartmentId);
  
  if (!apartment) {
    window.location.href = 'apartments.html';
    return;
  }

  // Set page title
  document.title = `${apartment.name} | Movo`;

  // Load images to carousel
  const carouselInner = document.querySelector('#apartmentCarousel .carousel-inner');
  carouselInner.innerHTML = apartment.images.map((img, index) => `
    <div class="carousel-item ${index === 0 ? 'active' : ''}">
      <img src="${img}" class="d-block w-100" alt="Wohnungsbild ${index + 1}">
    </div>
  `).join('');

  // Set apartment details
  document.querySelector('.card-title').textContent = apartment.name;
  document.querySelector('.rating .fw-bold').textContent = apartment.rating;
  document.querySelector('.rating .text-muted').textContent = `(${apartment.reviews_count} Bewertungen)`;
  document.querySelector('.text-muted i.fa-map-marker-alt').parentNode.innerHTML = 
    `<i class="fas fa-map-marker-alt me-1"></i> ${apartment.location}`;
  document.querySelector('.card-body p').textContent = apartment.description;
  
  // Set features
  const featuresContainer = document.querySelector('#features-container');
  featuresContainer.innerHTML = apartment.features.map(feature => `
    <div class="col-md-6 mb-2">
      <i class="fas fa-check text-success me-2"></i> ${feature}
    </div>
  `).join('');

  // Set reviews
  const reviewsContainer = document.querySelector('#reviews-container');
  reviewsContainer.innerHTML = apartment.reviews.map(review => `
    <div class="card mb-3">
      <div class="card-body">
        <div class="d-flex justify-content-between mb-2">
          <h5 class="mb-0">${review.name}</h5>
          <div class="rating">
            <i class="fas fa-star text-warning"></i> ${review.rating}
          </div>
        </div>
        <p class="text-muted">${review.date}</p>
        <p>${review.text}</p>
      </div>
    </div>
  `).join('');

  // Set price and rating in booking form
  document.getElementById('price-per-night').textContent = apartment.price_per_night;
  document.getElementById('avg-rating').textContent = apartment.rating;
  document.getElementById('reviews-count').textContent = `(${apartment.reviews_count} Bewertungen)`;

  // Set extras
  const extrasContainer = document.getElementById('extras-container');
  extrasContainer.innerHTML = apartment.extras.map(extra => `
    <div class="form-check mb-2">
      <input class="form-check-input extra-option" type="checkbox" id="extra-${extra.id}" 
             data-price="${extra.price}" data-per="${extra.per}">
      <label class="form-check-label" for="extra-${extra.id}">
        ${extra.name} (${extra.price}€/${extra.per})
      </label>
    </div>
  `).join('');

  // Set map
  document.getElementById('locationMap').src = apartment.map_url;

  // Initialize price calculation
  initPriceCalculation(apartment.price_per_night);
}

// Initialize price calculation for booking form
function initPriceCalculation(basePrice) {
  const calculateTotal = () => {
    const checkin = new Date(document.getElementById('checkin').value);
    const checkout = new Date(document.getElementById('checkout').value);
    
    if (checkin && checkout && checkin < checkout) {
      const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
      let total = basePrice * nights;
      
      // Add extras
      document.querySelectorAll('.extra-option:checked').forEach(extra => {
        const price = parseFloat(extra.dataset.price);
        const per = extra.dataset.per;
        total += per === 'Nacht' ? price * nights : price;
      });
      
      document.getElementById('total-price').textContent = `${total}€`;
    }
  };

  // Event listeners
  document.getElementById('checkin').addEventListener('change', calculateTotal);
  document.getElementById('checkout').addEventListener('change', calculateTotal);
  document.querySelectorAll('.extra-option').forEach(extra => {
    extra.addEventListener('change', calculateTotal);
  });

  // Booking form submission
  document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const apartmentId = new URLSearchParams(window.location.search).get('id');
    const apartment = sampleApartments.find(a => a.id == apartmentId);
    
    const bookingData = {
      apartmentId: apartment.id,
      apartmentName: apartment.name,
      checkin: document.getElementById('checkin').value,
      checkout: document.getElementById('checkout').value,
      guests: document.getElementById('guests').value,
      extras: Array.from(document.querySelectorAll('.extra-option:checked')).map(el => ({
        id: el.id.replace('extra-', ''),
        name: el.nextElementSibling.textContent.trim().split(' (')[0],
        price: parseFloat(el.dataset.price)
      })),
      totalPrice: parseFloat(document.getElementById('total-price').textContent.replace('€', ''))
    };

    sessionStorage.setItem('lastBooking', JSON.stringify(bookingData));
    window.location.href = 'bookingForm.html';
  });

  // Set default dates (today + tomorrow)
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  document.getElementById('checkin').valueAsDate = today;
  document.getElementById('checkout').valueAsDate = tomorrow;
  
  // Initial calculation
  calculateTotal();
}

// Load booking form data
function loadBookingForm() {
  if (!document.getElementById('completeBookingForm')) return;
  
  const bookingData = JSON.parse(sessionStorage.getItem('lastBooking'));
  if (!bookingData) {
    window.location.href = 'apartments.html';
    return;
  }

  const apartment = sampleApartments.find(a => a.id == bookingData.apartmentId);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  // Set booking overview
  document.getElementById('booking-apartment-title').textContent = apartment.name;
  document.getElementById('form-checkin').textContent = formatDate(bookingData.checkin);
  document.getElementById('form-checkout').textContent = formatDate(bookingData.checkout);
  document.getElementById('form-guests').textContent = bookingData.guests;
  document.getElementById('form-total-price').textContent = `${bookingData.totalPrice}€`;
  
  // Set extras
  const extrasList = document.getElementById('form-extras');
  extrasList.innerHTML = bookingData.extras.map(extra => 
    `<li>${extra.name} (${extra.price}€${extra.id === '3' ? '/Tag' : extra.id === '2' ? '/Tag' : '/Nacht'})</li>`
  ).join('');

  // Form submission
  document.getElementById('completeBookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect all form data
    const formData = {
      personal: {
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        zip: document.getElementById('zip').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value
      },
      payment: document.querySelector('input[name="paymentMethod"]:checked').value,
      booking: bookingData
    };

    // In a real app, you would send this to your backend here
    console.log('Form data to be sent to backend:', formData);
    
    // For demo purposes, we'll store it and proceed to confirmation
    sessionStorage.setItem('completeBookingData', JSON.stringify(formData));
    window.location.href = 'bookingConfirmation.html';
  });
}

// Load booking confirmation data
function loadBookingConfirmation() {
  if (!document.getElementById('booking-apartment-name')) return;
  
  const completeData = JSON.parse(sessionStorage.getItem('completeBookingData'));
  if (!completeData) {
    window.location.href = 'apartments.html';
    return;
  }

  const bookingData = completeData.booking;
  const apartment = sampleApartments.find(a => a.id == bookingData.apartmentId);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  // Calculate nights
  const nights = Math.ceil(
    (new Date(bookingData.checkout) - new Date(bookingData.checkin)) / 
    (1000 * 60 * 60 * 24)
  );

  // Set data
  document.getElementById('booking-apartment-name').textContent = apartment.name;
  document.getElementById('booking-checkin').textContent = formatDate(bookingData.checkin);
  document.getElementById('booking-checkout').textContent = formatDate(bookingData.checkout);
  document.getElementById('booking-nights').textContent = nights;
  document.getElementById('booking-guests').textContent = `${bookingData.guests} ${bookingData.guests == 1 ? 'Gast' : 'Gäste'}`;
  document.getElementById('booking-total-price').textContent = `${bookingData.totalPrice}€`;
  document.getElementById('booking-payment-method').textContent = 
    completeData.payment === 'paypal' ? 'PayPal' : 
    completeData.payment === 'creditcard' ? 'Kreditkarte' : 'Banküberweisung';
  document.getElementById('booking-number').textContent = `MOVO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Set address from form data
  document.getElementById('booking-address').innerHTML = `
    ${completeData.personal.address}<br>
    ${completeData.personal.zip} ${completeData.personal.city}<br>
    ${completeData.personal.country === 'DE' ? 'Deutschland' : 
      completeData.personal.country === 'AT' ? 'Österreich' : 
      completeData.personal.country === 'CH' ? 'Schweiz' : 'Anderes Land'}
  `;
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('apartments-container')) {
    loadApartments();
  } else if (document.getElementById('apartmentCarousel')) {
    loadApartmentDetails();
  } else if (document.getElementById('completeBookingForm')) {
    loadBookingForm();
  } else if (document.getElementById('booking-apartment-name')) {
    loadBookingConfirmation();
  }
});