// Apartments hinzufügen (mit Bild-Upload)
async function initAddApartmentForm() {
  const form = document.getElementById('addApartmentForm');
  form.setAttribute('enctype', 'multipart/form-data');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch('/api/apartments', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Speichern');
      }

      const result = await response.json();
      alert(result.message);
      window.location.href = 'host-dashboard.html';
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler: ' + error.message);
    }
  });
}

// Apartments laden und auf der Übersichtsseite anzeigen
async function loadApartments() {
  const container = document.getElementById('apartments-container');
  if (!container) return;

  container.innerHTML = '';

  try {
    const response = await fetch('/api/apartments');
    const apartments = await response.json();

    apartments.forEach(apartment => {
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-4';

      const firstImage = apartment.images ? JSON.parse(apartment.images)[0] : null;
      const imageUrl = firstImage ? `/uploads/${firstImage}` : 'https://via.placeholder.com/400x250';

      card.innerHTML = `
        <div class="card h-100">
          <img src="${imageUrl}" class="card-img-top" alt="Apartment Bild">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${apartment.title || 'Kein Titel'}</h5>
            <p class="card-text">${apartment.city || ''}</p>
            <p class="card-text"><strong>Preis:</strong> ${apartment.price || 0} € / Nacht</p>
            <a href="apartmentDetails.html?id=${apartment.id}" class="btn btn-primary mt-auto">Details</a>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Fehler beim Laden der Apartments:', error);
    container.innerHTML = '<p>Fehler beim Laden der Apartments.</p>';
  }
}

// Einzelnes Apartment laden für die Detailseite
async function loadApartmentDetails() {
  const params = new URLSearchParams(window.location.search);
  const apartmentId = params.get('id');

  if (!apartmentId) return;

  try {
    const response = await fetch(`/api/apartments/${apartmentId}`);
    const apartment = await response.json();

    if (!apartment) {
      console.error('Apartment nicht gefunden');
      return;
    }

    document.querySelector('.card-title').textContent = apartment.title || 'Titel';
    document.querySelector('.card-body p').textContent = apartment.description || 'Beschreibung folgt.';
    document.getElementById('price-per-night').textContent = apartment.price || '-';

    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.innerHTML = '';

    const images = apartment.images ? JSON.parse(apartment.images) : [];

    images.forEach((imgName, index) => {
      const div = document.createElement('div');
      div.className = `carousel-item ${index === 0 ? 'active' : ''}`;
      div.innerHTML = `<img src="/uploads/${imgName}" class="d-block w-100" alt="Bild">`;
      carouselInner.appendChild(div);
    });

    // Ausstattung laden
    const featuresContainer = document.getElementById('features-container');
    featuresContainer.innerHTML = '';
    const amenities = apartment.amenities ? JSON.parse(apartment.amenities) : {};

    Object.keys(amenities).forEach(feature => {
      if (amenities[feature]) {
        const div = document.createElement('div');
        div.className = 'col-md-6';
        div.innerHTML = `<i class="fas fa-check text-success"></i> ${feature}`;
        featuresContainer.appendChild(div);
      }
    });

  } catch (error) {
    console.error('Fehler beim Laden der Apartmentdetails:', error);
  }
}

// Seite fertig geladen

document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('addApartmentForm')) {
    initAddApartmentForm();
  }
  if (document.getElementById('apartments-container')) {
    loadApartments();
  }
  if (document.getElementById('apartmentCarousel')) {
    loadApartmentDetails();
  }
});
