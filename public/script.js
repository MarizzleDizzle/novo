// Sample data - in a real app this would come from an API
const sampleApartments = [
  {
    id: 1,
    name: "Moderne Wohnung in Berlin-Mitte",
    description: "Helle und moderne 2-Zimmer-Wohnung in bester Lage mit Blick auf den Park.",
    price_per_night: 89,
    location: "Berlin",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["WLAN", "Küche", "TV", "Heizung", "Arbeitsplatz"]
  },
  {
    id: 2,
    name: "Gemütliches Ferienhaus am See",
    description: "Traumhaftes Ferienhaus direkt am See mit eigenem Steg und Boot.",
    price_per_night: 120,
    location: "Mecklenburgische Seenplatte",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["WLAN", "Küche", "TV", "Kamin", "Garten", "Parkplatz"]
  },
  {
    id: 3,
    name: "Luxus-Penthouse mit Alpenblick",
    description: "Exklusives Penthouse mit atemberaubendem Blick auf die Alpen und erstklassiger Ausstattung.",
    price_per_night: 250,
    location: "Garmisch-Partenkirchen",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["WLAN", "Gourmetküche", "Smart TV", "Whirlpool", "Sauna", "Parkplatz"]
  }
];

// Load featured apartments on homepage
function loadFeaturedApartments() {
  const container = document.getElementById('featured-apartments');
  
  if (!container) return;
  
  container.innerHTML = sampleApartments.map(apartment => `
    <div class="col-md-4">
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
          <p class="card-text">${apartment.description}</p>
          <div class="features mb-3">
            ${apartment.features.map(feature => `<span class="badge bg-light text-dark me-1 mb-1">${feature}</span>`).join('')}
          </div>
        </div>
        <div class="card-footer bg-white border-0">
          <div class="d-flex justify-content-between align-items-center">
            <span class="price">${apartment.price_per_night}€ <small class="text-muted">/ Nacht</small></span>
            <a href="apartment.html?id=${apartment.id}" class="btn btn-primary btn-sm">Details</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Load all apartments on apartments page
async function loadAllApartments() {
  const container = document.getElementById('apartments-container');
  
  if (!container) return;
  
  try {
    // In a real app, we would fetch from an API
    // const res = await fetch('/api/apartments');
    // const data = await res.json();
    
    // For now, using sample data
    const data = { apartments: sampleApartments };
    
    container.innerHTML = data.apartments.map(apartment => `
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
            <p class="card-text">${apartment.description}</p>
            <div class="features mb-3">
              ${apartment.features.slice(0, 4).map(feature => `<span class="badge bg-light text-dark me-1 mb-1">${feature}</span>`).join('')}
              ${apartment.features.length > 4 ? `<span class="badge bg-light text-dark">+${apartment.features.length - 4} mehr</span>` : ''}
            </div>
          </div>
          <div class="card-footer bg-white border-0">
            <div class="d-flex justify-content-between align-items-center">
              <span class="price">${apartment.price_per_night}€ <small class="text-muted">/ Nacht</small></span>
              <a href="apartment.html?id=${apartment.id}" class="btn btn-primary btn-sm">Details</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading apartments:', error);
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
        <h3>Fehler beim Laden der Wohnungen</h3>
        <p>Bitte versuchen Sie es später erneut.</p>
      </div>
    `;
  }
}

// Load apartment details
function loadApartmentDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const apartmentId = urlParams.get('id');
  const apartment = sampleApartments.find(a => a.id == apartmentId);
  
  const container = document.getElementById('apartment-details');
  const bookingForm = document.getElementById('booking-form');
  
  if (!container || !apartment) return;
  
  container.innerHTML = `
    <div class="row">
      <div class="col-lg-8">
        <div class="card mb-4">
          <div id="apartmentCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="${apartment.image}" class="d-block w-100" alt="${apartment.name}">
              </div>
              <div class="carousel-item">
                <img src="https://images.unsplash.com/photo-1582719471383-c3ec6b9e3c0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" class="d-block w-100" alt="Living room">
              </div>
              <div class="carousel-item">
                <img src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" class="d-block w-100" alt="Bedroom">
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#apartmentCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#apartmentCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
          <div class="card-body">
            <h1 class="card-title">${apartment.name}</h1>
            <div class="d-flex align-items-center mb-3">
              <div class="rating me-2">
                <i class="fas fa-star"></i> ${apartment.rating}
              </div>
              <span class="text-muted">${apartment.location}</span>
            </div>
            
            <h4 class="mt-4">Beschreibung</h4>
            <p>${apartment.description}</p>
            
            <h4 class="mt-4">Ausstattung</h4>
            <div class="row">
              ${apartment.features.map(feature => `
                <div class="col-md-6 mb-2">
                  <i class="fas fa-check text-success me-2"></i> ${feature}
                </div>
              `).join('')}
            </div>
            
            <h4 class="mt-4">Standort</h4>
            <div class="ratio ratio-16x9 mb-4">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.409746318991!2d13.39384931580703!3d52.51446177981197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851c741ee5d6f%3A0x6a3b3e3b3e3b3e3b!2sBrandenburger%20Tor!5e0!3m2!1sde!2sde!4v1620000000000!5m2!1sde!2sde" 
                width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card shadow-sm sticky-top" style="top: 20px;">
          <div class="card-body">
            <h3 class="card-title">${apartment.price_per_night}€ <small class="text-muted">pro Nacht</small></h3>
            
            <form id="booking-form">
              <div class="mb-3">
                <label for="checkin" class="form-label">Anreise</label>
                <input type="date" class="form-control" id="checkin" required>
              </div>
              <div class="mb-3">
                <label for="checkout" class="form-label">Abreise</label>
                <input type="date" class="form-control" id="checkout" required>
              </div>
              <div class="mb-3">
                <label for="guests" class="form-label">Gäste</label>
                <select class="form-select" id="guests" required>
                  <option value="1">1 Gast</option>
                  <option value="2" selected>2 Gäste</option>
                  <option value="3">3 Gäste</option>
                  <option value="4">4 Gäste</option>
                  <option value="5">5 Gäste</option>
                  <option value="6">6+ Gäste</option>
                </select>
              </div>
              
              <h5 class="mt-4">Zusatzleistungen</h5>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="extra-bed" value="20">
                <label class="form-check-label" for="extra-bed">
                  Zusatzbett (20€/Nacht)
                </label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="breakfast" value="15">
                <label class="form-check-label" for="breakfast">
                  Frühstück (15€/Tag)
                </label>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="parking" value="10">
                <label class="form-check-label" for="parking">
                  Parkplatz (10€/Tag)
                </label>
              </div>
              
              <button type="submit" class="btn btn-primary w-100 py-2">
                Jetzt buchen
              </button>
            </form>
            
            <div class="d-flex justify-content-between mt-3">
              <small class="text-muted">Keine Vorauszahlung nötig</small>
              <small class="text-muted">Stornierung möglich</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listener to booking form
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // In a real app, this would redirect to a booking confirmation page
      window.location.href = 'booking-confirmation.html';
    });
  }
}

// Initialize page based on URL
document.addEventListener('DOMContentLoaded', function() {
  const path = window.location.pathname;
  
  if (path.endsWith('index.html') || path === '/') {
    loadFeaturedApartments();
  } else if (path.endsWith('apartments.html')) {
    loadAllApartments();
  } else if (path.endsWith('apartment.html')) {
    loadApartmentDetails();
  }
  
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});