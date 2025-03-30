async function ladeApartments() {
    const res = await fetch('/api/apartments');
    const data = await res.json();
    const wohnungenDiv = document.getElementById('wohnungen');
    wohnungenDiv.innerHTML = '';
  
    data.apartments.forEach(apartment => {
      const div = document.createElement('div');
      div.classList.add('apartment-card');
      div.innerHTML = `
        <h3>${apartment.name}</h3>
        <p>${apartment.description}</p>
        <p><strong>${apartment.price_per_night}€</strong> pro Nacht</p>
      `;
      wohnungenDiv.appendChild(div);
    });
  }
  
  ladeApartments(); // beim Start automatisch laden