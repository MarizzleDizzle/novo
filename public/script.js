// Sample apartments data (falls benötigt für Fallback)
const sampleApartments = [
  {
    id: 1,
    name: "Moderne Wohnung in Berlin-Mitte",
    description: "Helle 2-Zimmer-Wohnung in bester Lage",
    price_per_night: 89,
    location: "Berlin, Deutschland",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    features: ["WLAN", "Küche", "TV"]
  }
];

// Hauptinitialisierung
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('addApartmentForm')) {
    initAddApartmentForm();
  }
  // Weitere Initialisierungen hier einfügen...
});

// Wohnung hinzufügen Formular
async function initAddApartmentForm() {
  const form = document.getElementById('addApartmentForm');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }
    
    const formData = new FormData(form);
    const apartmentData = {
      title: formData.get('title'),
      description: formData.get('description'),
      address: formData.get('address'),
      city: formData.get('city'),
      zip: formData.get('zip'),
      country: formData.get('country'),
      guests: formData.get('guests'),
      bedrooms: formData.get('bedrooms'),
      beds: formData.get('beds'),
      bathrooms: formData.get('bathrooms'),
      size: formData.get('size') || null,
      price: formData.get('price'),
      minStay: formData.get('minStay'),
      availableNow: document.getElementById('availableNow').checked ? 1 : 0,
      availableFrom: document.getElementById('availableFromDate').value || null,
      wifi: document.getElementById('wifiCheck').checked,
      kitchen: document.getElementById('kitchenCheck').checked,
      parking: document.getElementById('parkingCheck').checked,
      tv: document.getElementById('tvCheck').checked
    };

    try {
      const response = await fetch('/api/apartments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apartmentData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Speichern');
      }
      
      const result = await response.json();
      alert(result.message);
      window.location.href = 'host-apartments.html';
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler: ' + error.message);
    }
  });

  // Bildervorschau
  document.getElementById('apartmentImages').addEventListener('change', function(e) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    Array.from(this.files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'img-thumbnail';
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });

  // Verfügbarkeit umschalten
  document.getElementById('availableLater').addEventListener('change', function() {
    document.getElementById('availableFromDate').disabled = !this.checked;
  });

  // Kartenmodal (falls benötigt)
  if (document.getElementById('openMapBtn')) {
    document.getElementById('openMapBtn').addEventListener('click', initMapModal);
  }
}

// Kartenmodal Initialisierung
function initMapModal() {
  const mapModal = new bootstrap.Modal(document.getElementById('mapModal'));
  const map = L.map('map').setView([51.1657, 10.4515], 6);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  
  let marker;
  
  // Suchfunktionalität
  document.getElementById('mapSearch').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const query = this.value;
      if (query.length > 2) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
          .then(response => response.json())
          .then(data => {
            if (data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lon = parseFloat(data[0].lon);
              map.setView([lat, lon], 15);
              
              if (marker) marker.setLatLng([lat, lon]);
              else marker = L.marker([lat, lon]).addTo(map);
            }
          });
      }
    }
  });
  
  // Kartenklick-Handler
  map.on('click', function(e) {
    if (marker) marker.setLatLng(e.latlng);
    else marker = L.marker(e.latlng).addTo(map);
  });
  
  // Standort bestätigen
  document.getElementById('confirmLocationBtn').addEventListener('click', function() {
    if (marker) {
      const latLng = marker.getLatLng();
      document.getElementById('apartmentLat').value = latLng.lat;
      document.getElementById('apartmentLng').value = latLng.lng;
      
      const preview = document.getElementById('mapPreview');
      preview.innerHTML = `<span class="text-success"><i class="fas fa-check-circle me-1"></i>Standort ausgewählt</span>`;
    }
    mapModal.hide();
  });
  
  mapModal.show();
}

// Hilfsfunktionen
function getCountryName(code) {
  switch(code) {
    case 'DE': return 'Deutschland';
    case 'AT': return 'Österreich';
    case 'CH': return 'Schweiz';
    default: return '';
  }
}