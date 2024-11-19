fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Sélection des conteneurs pour les cartes
    const hebergementsContainer = document.querySelector('.hebergements-cards');
    const populairesContainer = document.querySelector('.populaires-cards');
    const hebergementData = data.hebergements;

    // Limite le nombre de logements affichés par défaut
    const maxVisible = 6;

    function afficherLogements(logements) {
      hebergementsContainer.innerHTML = ""; // Réinitialiser le conteneur

      logements.forEach((hebergement, index) => {
        const card = document.createElement('a');
        card.href = `logement.html?id=${hebergement.id}`;
        card.className = 'hebercard';
        card.innerHTML = `
          <article>
            <img src="${hebergement.image}" alt="${hebergement.name}">
            <div class="card-content">
              <div class="card-txt">
                <h3 class="card-title">${hebergement.name}</h3>
                <p class="card-subtitle">Nuit à partir de ${hebergement.price} <span class="euro">€</span></p>
              </div>
              <div class="card-rating">
                ${'<i class="fa-xs fa-solid fa-star" aria-hidden="true"></i>'.repeat(hebergement.rating)}
                ${'<i class="fa-xs fa-solid fa-star neutral-star" aria-hidden="true"></i>'.repeat(5 - hebergement.rating)}
                <span class="sr-only">Note de ${hebergement.rating} sur 5</span>
              </div>
            </div>
          </article>
        `;
        
        // Masquer les cartes au-delà de la limite
        if (index < maxVisible) {
          hebergementsContainer.appendChild(card);
        } else {
          card.style.display = 'none'; // Masquer la carte
          hebergementsContainer.appendChild(card);
        }
      });
    }
    // Afficher tous les hébergements par défaut
    afficherLogements(data.hebergements);

     // Ajouter des événements de clic sur les filtres
    function searchHotels() {
      const ville = document.getElementById("ville").value.toLowerCase();
      const nombrePersonnes = parseInt(document.getElementById("personnes").value) || 0;

      console.log("Ville :", ville);
      console.log("Nombre de personnes :", nombrePersonnes);

      const filteredHotels = hebergementData.filter(hebergement => {

        const matchVille = ville ? hebergement.city && hebergement.city.toLowerCase().includes(ville): true;
        const matchCapacite = nombrePersonnes > 0 ? nombrePersonnes <= hebergement.features.capacity : true;

        return matchVille && matchCapacite;
      });
      console.log("Hébergements filtrés :", filteredHotels);

      afficherLogements(filteredHotels);
      updateHebergementCards();

    }

    document.getElementById("searchButton").addEventListener("click", function (event) {
      event.preventDefault();
      searchHotels();
    });

    function updateHebergementCards () {
      const cardHebergement = document.querySelector('.hebergements-cards');
      cardHebergement.classList.remove('hebergements-cards');
      cardHebergement.classList.add('hebergements-cards-filtre');
    }

    afficherLogements(hebergementData);
 
    

    

    // Ajouter le bouton "Afficher plus"
    const showMoreButton = document.createElement('span');
    showMoreButton.textContent = 'Afficher plus';
    showMoreButton.className = 'showmore';
    hebergementsContainer.appendChild(showMoreButton);

    // Ajouter un gestionnaire d'événements pour afficher plus de cartes
    showMoreButton.addEventListener('click', () => {
      const hiddenCards = hebergementsContainer.querySelectorAll('.hebercard[style*="display: none"]');
      hiddenCards.forEach(card => {
        card.style.display = 'block'; // Afficher la carte
      });
      showMoreButton.style.display = 'none'; // Masquer le bouton après affichage
    });

    // Génération des cartes Populaires
    data.populaires.forEach(populaire => {
      const card = document.createElement('a');
      card.href = `logement.html?id=${populaire.id}`;  // Redirection avec l'ID du populaire
      card.innerHTML = `
        <article class="card">
          <img src="${populaire.image}" alt="${populaire.name}">
          <div class="card-content">
            <div class="card-txt">
              <h3 class="card-title">${populaire.name}</h3>
              <p class="card-subtitle">Nuit à partir de ${populaire.price} <span class="euro">€</span></p>
            </div>
            <div class="card-rating">
              ${'<i class="fa-xs fa-solid fa-star" aria-hidden="true"></i>'.repeat(populaire.rating)}
              ${'<i class="fa-xs fa-solid fa-star neutral-star" aria-hidden="true"></i>'.repeat(5 - populaire.rating)}
              <span class="sr-only">Note de ${populaire.rating} sur 5</span>
            </div>
          </div>
        </article>
      `;
      populairesContainer.appendChild(card);
    });
  })
  .catch(error => console.error('Erreur lors du chargement du fichier JSON:', error));

