/**
 * Simple Logbook - Curated Offline Destinations & Places Directory
 *
 * Lightweight, high-quality offline travel directory of popular global destinations,
 * iconic places of interest, and fast lookup & search utilities.
 * Completely self-contained with zero external dependencies.
 */

/**
 * Standard Place Category Keys:
 * 'history'  - Historical sites, ruins, monuments, ancient architecture
 * 'nature'   - Parks, viewpoints, beaches, mountains, gardens, rivers
 * 'museum'   - Museums, art galleries, cultural institutes
 * 'cafe'     - Iconic cafes, famous eateries, gastronomic quarters
 * 'shopping' - Historic bazaars, famous avenues, artisan districts
 * 'other'    - Modern landmarks, observation decks, entertainment
 */

const DESTINATIONS = [
  // ==========================================
  // TURKEY
  // ==========================================
  {
    id: 'istanbul-tr',
    city: 'Istanbul',
    country: 'Turkey',
    countryCode: 'TR',
    flag: '🇹🇷',
    aliases: ['İstanbul', 'Constantinople', 'Stamboul'],
    popularPlaces: [
      {
        id: 'ist-hagia-sophia',
        name: 'Hagia Sophia (Ayasofya)',
        category: 'history',
        shortDesc: 'A breathtaking 6th-century architectural masterpiece spanning Byzantine and Ottoman eras.',
        tags: ['landmark', 'architecture', 'byzantine', 'ottoman', 'unesco'],
      },
      {
        id: 'ist-topkapi-palace',
        name: 'Topkapı Palace',
        category: 'museum',
        shortDesc: 'The grand royal residence of Ottoman sultans with lush courtyards and sacred relics.',
        tags: ['palace', 'ottoman', 'sultan', 'museum', 'bosphorus'],
      },
      {
        id: 'ist-blue-mosque',
        name: 'Blue Mosque (Sultanahmet)',
        category: 'history',
        shortDesc: 'Famed for its six minarets and over 20,000 hand-painted blue İznik ceramic tiles.',
        tags: ['mosque', 'tiles', 'sultanahmet', 'historic'],
      },
      {
        id: 'ist-grand-bazaar',
        name: 'Grand Bazaar (Kapalıçarşı)',
        category: 'shopping',
        shortDesc: 'One of the world’s oldest and largest covered markets, featuring over 4,000 vibrant shops.',
        tags: ['market', 'spices', 'carpets', 'crafts', 'souvenirs'],
      },
      {
        id: 'ist-galata-tower',
        name: 'Galata Tower',
        category: 'history',
        shortDesc: 'Medieval stone watchtower offering panoramic 360-degree vistas over the Golden Horn.',
        tags: ['viewpoint', 'medieval', 'panoramic', 'genoa'],
      },
      {
        id: 'ist-bosphorus-cruise',
        name: 'Bosphorus Ferry & Strait Cruise',
        category: 'nature',
        shortDesc: 'A scenic maritime journey sailing right between the European and Asian continents.',
        tags: ['cruise', 'sea', 'sunset', 'waterway', 'ferry'],
      },
      {
        id: 'ist-karakoy-cafes',
        name: 'Karaköy Artisan Cafés',
        category: 'cafe',
        shortDesc: 'Charming coastal neighborhood filled with specialty third-wave coffees and baklava.',
        tags: ['coffee', 'baklava', 'pastry', 'coastal', 'food'],
      },
    ],
  },
  {
    id: 'antalya-tr',
    city: 'Antalya',
    country: 'Turkey',
    countryCode: 'TR',
    flag: '🇹🇷',
    aliases: ['Kaleiçi', 'Pamphylia'],
    popularPlaces: [
      {
        id: 'ayt-kaleici',
        name: 'Kaleiçi Old Town',
        category: 'history',
        shortDesc: 'Charming labyrinth of restored Ottoman mansions, cobblestone streets, and Hadrian’s Gate.',
        tags: ['old-town', 'ottoman', 'roman-gate', 'walkable'],
      },
      {
        id: 'ayt-duden-waterfalls',
        name: 'Lower Düden Waterfalls',
        category: 'nature',
        shortDesc: 'Dramatic natural cascade plunging directly off rocky Mediterranean cliffs into the sea.',
        tags: ['waterfall', 'cliffs', 'mediterranean', 'nature'],
      },
      {
        id: 'ayt-konyaalti-beach',
        name: 'Konyaaltı Beach & Promenade',
        category: 'nature',
        shortDesc: 'Expansive pebble beach framed against the majestic backdrop of the Beydağları mountains.',
        tags: ['beach', 'mountains', 'swimming', 'coastal'],
      },
      {
        id: 'ayt-aspendos',
        name: 'Aspendos Ancient Theatre',
        category: 'history',
        shortDesc: 'One of the most impeccably preserved Greco-Roman theatres from antiquity.',
        tags: ['ancient', 'theatre', 'roman', 'archaeology'],
      },
      {
        id: 'ayt-antalya-museum',
        name: 'Antalya Archaeological Museum',
        category: 'museum',
        shortDesc: 'World-renowned museum housing extraordinary Roman marble sculptures and sarcophagi.',
        tags: ['sculptures', 'statues', 'roman', 'museum'],
      },
      {
        id: 'ayt-marina-cafes',
        name: 'Old City Marina Cafés',
        category: 'cafe',
        shortDesc: 'Scenic seaside cafes overlooking luxury yachts and fishing boats beneath the citadel.',
        tags: ['harbor', 'seafood', 'sunset', 'drinks'],
      },
    ],
  },
  {
    id: 'cappadocia-tr',
    city: 'Cappadocia',
    country: 'Turkey',
    countryCode: 'TR',
    flag: '🇹🇷',
    aliases: ['Kapadokya', 'Nevsehir', 'Nevşehir', 'Goreme', 'Göreme', 'Urgup', 'Ürgüp'],
    popularPlaces: [
      {
        id: 'cap-goreme-open-air',
        name: 'Göreme Open-Air Museum',
        category: 'museum',
        shortDesc: 'Monastic cave complex featuring centuries-old Byzantine rock-cut frescoed churches.',
        tags: ['cave-churches', 'frescoes', 'byzantine', 'unesco'],
      },
      {
        id: 'cap-hot-air-balloon',
        name: 'Sunrise Hot Air Balloon Flight',
        category: 'nature',
        shortDesc: 'Unforgettable morning flight drifting over fairy chimneys and colorful sunrise valleys.',
        tags: ['balloons', 'sunrise', 'aerial', 'fairy-chimneys'],
      },
      {
        id: 'cap-derinkuyu',
        name: 'Derinkuyu Underground City',
        category: 'history',
        shortDesc: 'Multi-level subterranean haven carved deep into volcanic rock to shelter thousands.',
        tags: ['underground', 'tunnel', 'history', 'ancient'],
      },
      {
        id: 'cap-uchisar-castle',
        name: 'Uçhisar Rock Castle',
        category: 'history',
        shortDesc: 'The highest volcanic point in Cappadocia providing panoramic sunset views.',
        tags: ['citadel', 'panoramic', 'sunset', 'viewpoint'],
      },
      {
        id: 'cap-love-valley',
        name: 'Love & Rose Valley Trails',
        category: 'nature',
        shortDesc: 'Spectacular hiking trails weaving past tall eroded volcanic spire formations.',
        tags: ['hiking', 'valleys', 'rock-formations', 'nature'],
      },
      {
        id: 'cap-avanos-pottery',
        name: 'Avanos Pottery Workshops',
        category: 'shopping',
        shortDesc: 'Traditional kick-wheel red clay pottery crafted using soil from the Kizilirmak River.',
        tags: ['pottery', 'crafts', 'artisan', 'shopping'],
      },
    ],
  },
  {
    id: 'izmir-tr',
    city: 'Izmir',
    country: 'Turkey',
    countryCode: 'TR',
    flag: '🇹🇷',
    aliases: ['İzmir', 'Smyrna', 'Cesme', 'Çeşme', 'Alacati', 'Alaçatı', 'Ephesus', 'Efes'],
    popularPlaces: [
      {
        id: 'izm-ephesus',
        name: 'Ephesus Ancient City (Efes)',
        category: 'history',
        shortDesc: 'Magnificent Greco-Roman metropolis home to the Library of Celsus and Great Theatre.',
        tags: ['ancient', 'roman', 'unesco', 'ruins', 'library'],
      },
      {
        id: 'izm-kordon',
        name: 'Alsancak Kordon Promenade',
        category: 'nature',
        shortDesc: 'Iconic waterfront lawn where locals gather at dusk to watch the Aegean sunset.',
        tags: ['waterfront', 'sunset', 'biking', 'promenade'],
      },
      {
        id: 'izm-kemeralti',
        name: 'Historical Kemeraltı Bazaar',
        category: 'shopping',
        shortDesc: 'Bustling historic market packed with spice stalls, silversmiths, and coffee roasters.',
        tags: ['bazaar', 'street-food', 'antiques', 'coffee'],
      },
      {
        id: 'izm-asansor',
        name: 'Historical Elevator (Tarihi Asansör)',
        category: 'history',
        shortDesc: '1907 public elevator linking shoreline quarters with cliffside panoramic dining.',
        tags: ['elevator', 'viewpoint', 'heritage', 'coastal'],
      },
      {
        id: 'izm-alacati',
        name: 'Alaçatı Windmills & Stone Streets',
        category: 'cafe',
        shortDesc: 'Idyllic Aegean stone village renowned for bougainvillea vines, bistros, and windsurfing.',
        tags: ['aegean', 'boutique', 'cafes', 'windmills'],
      },
      {
        id: 'izm-virgin-mary',
        name: 'House of the Virgin Mary',
        category: 'history',
        shortDesc: 'Peaceful biblical shrine nestled amid pine forests on Mount Koressos.',
        tags: ['shrine', 'spiritual', 'pilgrimage', 'serene'],
      },
    ],
  },

  // ==========================================
  // ITALY
  // ==========================================
  {
    id: 'rome-it',
    city: 'Rome',
    country: 'Italy',
    countryCode: 'IT',
    flag: '🇮🇹',
    aliases: ['Roma', 'Eternal City', 'Vatican'],
    popularPlaces: [
      {
        id: 'rom-colosseum',
        name: 'Colosseum & Roman Forum',
        category: 'history',
        shortDesc: 'The epic amphitheater of gladiatorial battles and the civic core of ancient Rome.',
        tags: ['gladiator', 'roman', 'amphitheatre', 'unesco'],
      },
      {
        id: 'rom-vatican-museums',
        name: 'Vatican Museums & Sistine Chapel',
        category: 'museum',
        shortDesc: 'Immense Papal collections crowned by Michelangelo’s sublime ceiling frescoes.',
        tags: ['michelangelo', 'frescoes', 'papal', 'art'],
      },
      {
        id: 'rom-trevi-fountain',
        name: 'Trevi Fountain (Fontana di Trevi)',
        category: 'history',
        shortDesc: 'Baroque marble wonder where tossing a coin guarantees your return to Rome.',
        tags: ['fountain', 'baroque', 'tradition', 'marble'],
      },
      {
        id: 'rom-pantheon',
        name: 'The Pantheon',
        category: 'history',
        shortDesc: '2,000-year-old temple boasting the world’s largest unreinforced concrete dome and oculus.',
        tags: ['dome', 'oculus', 'roman-temple', 'architecture'],
      },
      {
        id: 'rom-trastevere',
        name: 'Trastevere Dining District',
        category: 'cafe',
        shortDesc: 'Bohemian cobbled alleyways famous for authentic Roman pasta dishes like carbonara.',
        tags: ['pasta', 'carbonara', 'trattoria', 'nightlife'],
      },
      {
        id: 'rom-villa-borghese',
        name: 'Villa Borghese Gardens',
        category: 'nature',
        shortDesc: 'Lush English-style landscape gardens offering peaceful shaded walks and Bernini statues.',
        tags: ['park', 'gardens', 'bernini', 'relaxation'],
      },
    ],
  },
  {
    id: 'florence-it',
    city: 'Florence',
    country: 'Italy',
    countryCode: 'IT',
    flag: '🇮🇹',
    aliases: ['Firenze', 'Tuscany'],
    popularPlaces: [
      {
        id: 'flr-duomo',
        name: 'Cathedral of Santa Maria del Fiore (Duomo)',
        category: 'history',
        shortDesc: 'Brunelleschi’s revolutionary terracotta dome commanding the Renaissance skyline.',
        tags: ['duomo', 'dome', 'renaissance', 'cathedral'],
      },
      {
        id: 'flr-uffizi',
        name: 'Uffizi Gallery',
        category: 'museum',
        shortDesc: 'World’s premier Renaissance art museum exhibiting Botticelli, Da Vinci, and Raphael.',
        tags: ['renaissance', 'botticelli', 'paintings', 'fine-art'],
      },
      {
        id: 'flr-ponte-vecchio',
        name: 'Ponte Vecchio',
        category: 'history',
        shortDesc: 'Medieval closed-spandrel arch bridge lined with glistening goldsmith shops over the Arno.',
        tags: ['bridge', 'goldsmiths', 'river', 'medieval'],
      },
      {
        id: 'flr-accademia',
        name: 'Galleria dell’Accademia',
        category: 'museum',
        shortDesc: 'Home to Michelangelo’s masterpiece sculpture, the towering marble David.',
        tags: ['david', 'sculpture', 'michelangelo', 'marble'],
      },
      {
        id: 'flr-piazzale-michelangelo',
        name: 'Piazzale Michelangelo',
        category: 'nature',
        shortDesc: 'Panoramic hillside terrace showcasing the quintessential postcard sunset view of Florence.',
        tags: ['sunset', 'viewpoint', 'panoramic', 'terrace'],
      },
      {
        id: 'flr-mercato-centrale',
        name: 'Mercato Centrale',
        category: 'cafe',
        shortDesc: 'Vibrant indoor food hall with artisanal Tuscan cheeses, truffles, and Chianti wine.',
        tags: ['tuscan', 'food-hall', 'truffle', 'wine'],
      },
    ],
  },
  {
    id: 'venice-it',
    city: 'Venice',
    country: 'Italy',
    countryCode: 'IT',
    flag: '🇮🇹',
    aliases: ['Venezia', 'Veneta'],
    popularPlaces: [
      {
        id: 'ven-st-marks',
        name: 'St. Mark’s Basilica & Piazza',
        category: 'history',
        shortDesc: 'Gilded Byzantine basilica with sparkling gold mosaics dominating Venice’s grandest square.',
        tags: ['basilica', 'mosaics', 'byzantine', 'piazza'],
      },
      {
        id: 'ven-doges-palace',
        name: 'Doge’s Palace (Palazzo Ducale)',
        category: 'museum',
        shortDesc: 'Venetian Gothic palace of the rulers, linked to the historic prisons by Bridge of Sighs.',
        tags: ['palace', 'gothic', 'bridge-of-sighs', 'history'],
      },
      {
        id: 'ven-grand-canal',
        name: 'Grand Canal & Gondola Tour',
        category: 'nature',
        shortDesc: 'Venice’s main water artery lined with majestic 13th to 18th-century noble palazzi.',
        tags: ['gondola', 'canal', 'water', 'romance'],
      },
      {
        id: 'ven-rialto-bridge',
        name: 'Rialto Bridge',
        category: 'history',
        shortDesc: 'The oldest bridge spanning the Grand Canal, renowned for its stone arches and shops.',
        tags: ['bridge', 'landmark', 'rialto', 'canal'],
      },
      {
        id: 'ven-burano-island',
        name: 'Burano & Murano Islands',
        category: 'history',
        shortDesc: 'Famous lagoon islands known for rainbow-colored houses and centuries-old glassblowing.',
        tags: ['colorful', 'glassblowing', 'islands', 'lace'],
      },
      {
        id: 'ven-caffe-florian',
        name: 'Caffè Florian',
        category: 'cafe',
        shortDesc: 'Italy’s oldest café operating since 1720 under the arcades of St. Mark’s Square.',
        tags: ['historic-cafe', 'espresso', 'orchestra', 'luxury'],
      },
    ],
  },
  {
    id: 'milan-it',
    city: 'Milan',
    country: 'Italy',
    countryCode: 'IT',
    flag: '🇮🇹',
    aliases: ['Milano', 'Lombardy'],
    popularPlaces: [
      {
        id: 'mil-duomo',
        name: 'Duomo di Milano & Rooftop Terraces',
        category: 'history',
        shortDesc: 'Stunning Gothic marble cathedral with open rooftop walkways among intricately carved spires.',
        tags: ['cathedral', 'gothic', 'rooftop', 'spires'],
      },
      {
        id: 'mil-galleria',
        name: 'Galleria Vittorio Emanuele II',
        category: 'shopping',
        shortDesc: 'Magnificent glass-domed 19th-century arcade known as the salon of Milan.',
        tags: ['arcade', 'luxury', 'fashion', 'architecture'],
      },
      {
        id: 'mil-last-supper',
        name: 'Santa Maria delle Grazie (The Last Supper)',
        category: 'museum',
        shortDesc: 'Convent refectory preserving Leonardo da Vinci’s iconic mural fresco.',
        tags: ['da-vinci', 'last-supper', 'unesco', 'masterpiece'],
      },
      {
        id: 'mil-sforza-castle',
        name: 'Sforza Castle (Castello Sforzesco)',
        category: 'history',
        shortDesc: 'Formidable Renaissance fortress complex surrounded by Parco Sempione.',
        tags: ['fortress', 'castle', 'renaissance', 'park'],
      },
      {
        id: 'mil-brera',
        name: 'Pinacoteca di Brera & Art District',
        category: 'museum',
        shortDesc: 'Celebrated public art gallery surrounded by cobblestone streets and chic cafes.',
        tags: ['gallery', 'art', 'bohemian', 'chic'],
      },
      {
        id: 'mil-navigli',
        name: 'Navigli Canals & Aperitivo Bars',
        category: 'cafe',
        shortDesc: 'Lively canal district engineered in part by Leonardo, perfect for evening aperitivo.',
        tags: ['aperitivo', 'canals', 'drinks', 'nightlife'],
      },
    ],
  },

  // ==========================================
  // FRANCE
  // ==========================================
  {
    id: 'paris-fr',
    city: 'Paris',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    aliases: ['City of Light', 'Paname'],
    popularPlaces: [
      {
        id: 'par-eiffel-tower',
        name: 'Eiffel Tower',
        category: 'history',
        shortDesc: 'Gustave Eiffel’s wrought-iron lattice monument defining the Parisian skyline.',
        tags: ['eiffel', 'monument', 'iron', 'viewpoint'],
      },
      {
        id: 'par-louvre',
        name: 'Louvre Museum',
        category: 'museum',
        shortDesc: 'The world’s largest art museum, home to the Mona Lisa and Venus de Milo.',
        tags: ['museum', 'mona-lisa', 'glass-pyramid', 'art'],
      },
      {
        id: 'par-notre-dame',
        name: 'Cathédrale Notre-Dame de Paris',
        category: 'history',
        shortDesc: 'French Gothic masterpiece on the Île de la Cité with gargoyles and rose windows.',
        tags: ['cathedral', 'gothic', 'seine', 'island'],
      },
      {
        id: 'par-montmartre',
        name: 'Montmartre & Sacré-Cœur',
        category: 'history',
        shortDesc: 'Hilltop artist village crowned by the white domes of the Basilica of Sacré-Cœur.',
        tags: ['artists', 'basilica', 'viewpoint', 'bohemian'],
      },
      {
        id: 'par-musee-orsay',
        name: 'Musée d’Orsay',
        category: 'museum',
        shortDesc: 'Former Beaux-Arts railway station featuring the world’s finest Impressionist paintings.',
        tags: ['impressionism', 'monet', 'van-gogh', 'station'],
      },
      {
        id: 'par-champs-elysees',
        name: 'Champs-Élysées & Arc de Triomphe',
        category: 'shopping',
        shortDesc: 'Monumental boulevard connecting luxury boutiques with Napoleon’s triumphal arch.',
        tags: ['avenue', 'shopping', 'arc-de-triomphe', 'fashion'],
      },
      {
        id: 'par-luxembourg-gardens',
        name: 'Jardin du Luxembourg',
        category: 'nature',
        shortDesc: 'Elegant 17th-century formal gardens surrounding the French Senate palace.',
        tags: ['gardens', 'palace', 'park', 'peaceful'],
      },
    ],
  },
  {
    id: 'nice-fr',
    city: 'Nice',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    aliases: ['Côte d’Azur', 'French Riviera', 'Nizza'],
    popularPlaces: [
      {
        id: 'nce-promenade',
        name: 'Promenade des Anglais',
        category: 'nature',
        shortDesc: 'Iconic palm-lined coastal boulevard curving around the azure Baie des Anges.',
        tags: ['promenade', 'mediterranean', 'palms', 'cycling'],
      },
      {
        id: 'nce-castle-hill',
        name: 'Castle Hill (Colline du Château)',
        category: 'nature',
        shortDesc: 'Verdant hilltop park featuring cascading waterfalls and sweeping coastal panoramas.',
        tags: ['viewpoint', 'waterfall', 'panoramic', 'park'],
      },
      {
        id: 'nce-vieux-nice',
        name: 'Vieux Nice (Old Town)',
        category: 'history',
        shortDesc: 'Atmospheric pastel-colored alleyways brimming with warm bakeries and socca stands.',
        tags: ['old-town', 'socca', 'pastel', 'narrow-streets'],
      },
      {
        id: 'nce-cours-saleya',
        name: 'Cours Saleya Market',
        category: 'shopping',
        shortDesc: 'Famed daily open-air market showcasing fresh flowers, lavender honey, and olives.',
        tags: ['flower-market', 'local-produce', 'provence', 'souvenirs'],
      },
      {
        id: 'nce-matisse-museum',
        name: 'Musée Matisse',
        category: 'museum',
        shortDesc: '17th-century Genovese villa tracing Henri Matisse’s evolution and paper cut-outs.',
        tags: ['matisse', 'art', 'museum', 'riviera'],
      },
      {
        id: 'nce-chagall-museum',
        name: 'Marc Chagall National Museum',
        category: 'museum',
        shortDesc: 'Luminous museum dedicated to Chagall’s monumental biblical message works.',
        tags: ['chagall', 'paintings', 'stained-glass', 'art'],
      },
    ],
  },
  {
    id: 'lyon-fr',
    city: 'Lyon',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    aliases: ['Lugdunum', 'Rhône-Alpes'],
    popularPlaces: [
      {
        id: 'lyo-vieux-lyon',
        name: 'Vieux Lyon & Secret Traboules',
        category: 'history',
        shortDesc: 'Renaissance quarter famed for secret passageways historically used by silk weavers.',
        tags: ['renaissance', 'passageways', 'traboules', 'unesco'],
      },
      {
        id: 'lyo-fourviere',
        name: 'Basilique Notre-Dame de Fourvière',
        category: 'history',
        shortDesc: 'Majestic white hilltop basilica with ornate mosaics overlooking the Rhône and Saône.',
        tags: ['basilica', 'hilltop', 'viewpoint', 'funicular'],
      },
      {
        id: 'lyo-parc-tete-dor',
        name: 'Parc de la Tête d’Or',
        category: 'nature',
        shortDesc: 'Immense urban park boasting a boating lake, botanical greenhouse, and deer park.',
        tags: ['park', 'botanical-garden', 'lake', 'greenery'],
      },
      {
        id: 'lyo-halles-paul-bocuse',
        name: 'Les Halles de Lyon Paul Bocuse',
        category: 'cafe',
        shortDesc: 'Legendary covered food market representing the pinnacle of French gastronomy.',
        tags: ['gastronomy', 'bocuse', 'cheese', 'charcuterie', 'wine'],
      },
      {
        id: 'lyo-confluences',
        name: 'Musée des Confluences',
        category: 'museum',
        shortDesc: 'Striking deconstructivist glass and steel science museum where two rivers merge.',
        tags: ['modern-architecture', 'science', 'natural-history', 'rivers'],
      },
      {
        id: 'lyo-place-bellecour',
        name: 'Place Bellecour',
        category: 'history',
        shortDesc: 'One of Europe’s largest open pedestrian squares, dominated by an equestrian statue of Louis XIV.',
        tags: ['square', 'pedestrian', 'statue', 'city-center'],
      },
    ],
  },

  // ==========================================
  // SPAIN
  // ==========================================
  {
    id: 'barcelona-es',
    city: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    flag: '🇪🇸',
    aliases: ['Barna', 'Catalonia', 'Catalunya'],
    popularPlaces: [
      {
        id: 'bcn-sagrada-familia',
        name: 'Basílica de la Sagrada Família',
        category: 'history',
        shortDesc: 'Antoni Gaudí’s awe-inspiring modernist basilica with forest-like stone columns.',
        tags: ['gaudi', 'modernisme', 'basilica', 'unesco'],
      },
      {
        id: 'bcn-park-guell',
        name: 'Park Güell',
        category: 'nature',
        shortDesc: 'Fairytale public park featuring vibrant mosaic salamanders and panoramic sea views.',
        tags: ['gaudi', 'mosaics', 'viewpoint', 'park'],
      },
      {
        id: 'bcn-casa-batllo',
        name: 'Casa Batlló & Casa Milà',
        category: 'museum',
        shortDesc: 'Gaudí’s sculptural residential masterpieces along the elegant Passeig de Gràcia.',
        tags: ['architecture', 'gaudi', 'rooftop', 'design'],
      },
      {
        id: 'bcn-gothic-quarter',
        name: 'Gothic Quarter (Barri Gòtic)',
        category: 'history',
        shortDesc: 'Medieval stone core with narrow streets, Roman walls, and quiet tapas courtyards.',
        tags: ['medieval', 'gothic', 'narrow-lanes', 'tapas'],
      },
      {
        id: 'bcn-boqueria',
        name: 'La Boqueria Market',
        category: 'cafe',
        shortDesc: 'World-famous food market right off Las Ramblas bursting with fresh juices and jamón.',
        tags: ['tapas', 'market', 'jamon', 'ramblas'],
      },
      {
        id: 'bcn-barceloneta',
        name: 'Barceloneta Beach',
        category: 'nature',
        shortDesc: 'Bustling golden sand Mediterranean beach lined with seafood chiringuitos.',
        tags: ['beach', 'sea', 'seafood', 'coastal'],
      },
    ],
  },
  {
    id: 'madrid-es',
    city: 'Madrid',
    country: 'Spain',
    countryCode: 'ES',
    flag: '🇪🇸',
    aliases: ['Villa y Corte'],
    popularPlaces: [
      {
        id: 'mad-prado',
        name: 'Prado National Museum',
        category: 'museum',
        shortDesc: 'Spain’s premier art museum featuring masterpieces by Velázquez, Goya, and El Greco.',
        tags: ['velazquez', 'goya', 'art', 'museum', 'masterpieces'],
      },
      {
        id: 'mad-royal-palace',
        name: 'Royal Palace of Madrid',
        category: 'history',
        shortDesc: 'Europe’s largest functioning royal residence with lavishly decorated banquet halls.',
        tags: ['royal-palace', 'monarchy', 'throne-room', 'architecture'],
      },
      {
        id: 'mad-retiro-park',
        name: 'El Retiro Park & Crystal Palace',
        category: 'nature',
        shortDesc: 'Historic UNESCO green sanctuary featuring a rowing lake and glowing glass pavilion.',
        tags: ['park', 'boating', 'crystal-palace', 'gardens'],
      },
      {
        id: 'mad-plaza-mayor',
        name: 'Plaza Mayor',
        category: 'history',
        shortDesc: 'Grand 17th-century arcaded square once used for royal coronations and bullfights.',
        tags: ['plaza', 'historic', 'arcades', 'calamari-sandwich'],
      },
      {
        id: 'mad-reina-sofia',
        name: 'Reina Sofía National Museum',
        category: 'museum',
        shortDesc: 'Modern art museum celebrated for Picasso’s poignant masterpiece Guernica.',
        tags: ['picasso', 'guernica', 'dali', 'modern-art'],
      },
      {
        id: 'mad-gran-via',
        name: 'Gran Vía & Plaza de España',
        category: 'shopping',
        shortDesc: 'The bustling showcase street of Madrid known for grand theaters and premier stores.',
        tags: ['shopping', 'theatre', 'architecture', 'city-center'],
      },
      {
        id: 'mad-mercado-san-miguel',
        name: 'Mercado de San Miguel',
        category: 'cafe',
        shortDesc: 'Historic cast-iron market offering gourmet pinchos, vermouth, and Iberian ham.',
        tags: ['market', 'pinchos', 'tapas', 'vermouth'],
      },
    ],
  },
  {
    id: 'seville-es',
    city: 'Seville',
    country: 'Spain',
    countryCode: 'ES',
    flag: '🇪🇸',
    aliases: ['Sevilla', 'Andalusia', 'Andalucía'],
    popularPlaces: [
      {
        id: 'sev-alcazar',
        name: 'Royal Alcázar of Seville',
        category: 'history',
        shortDesc: 'Exquisite Mudéjar royal palace complex with courtyards and fragrant citrus gardens.',
        tags: ['mudejar', 'palace', 'gardens', 'unesco'],
      },
      {
        id: 'sev-cathedral',
        name: 'Seville Cathedral & La Giralda',
        category: 'history',
        shortDesc: 'The world’s largest Gothic cathedral featuring Christopher Columbus’s tomb.',
        tags: ['gothic', 'cathedral', 'giralda-tower', 'tomb'],
      },
      {
        id: 'sev-plaza-espana',
        name: 'Plaza de España',
        category: 'history',
        shortDesc: 'Colossal semi-circular plaza adorned with tiled alcoves representing every Spanish province.',
        tags: ['azulejos', 'plaza', 'bridges', 'cinema'],
      },
      {
        id: 'sev-barrio-santa-cruz',
        name: 'Barrio Santa Cruz',
        category: 'history',
        shortDesc: 'Romantic former Jewish quarter of whitewashed houses, iron balconies, and jasmine.',
        tags: ['whitewashed', 'old-quarter', 'jasmine', 'romantic'],
      },
      {
        id: 'sev-setas',
        name: 'Metropol Parasol (Las Setas)',
        category: 'other',
        shortDesc: 'The world’s largest wooden structure offering a futuristic rooftop winding walkway.',
        tags: ['modern', 'wooden-structure', 'viewpoint', 'architecture'],
      },
      {
        id: 'sev-triana-tapas',
        name: 'Triana Tapas & Flamenco Quarter',
        category: 'cafe',
        shortDesc: 'Vibrant riverside barrio known for authentic flamenco tablaos and ceramic craft shops.',
        tags: ['flamenco', 'tapas', 'river', 'pottery'],
      },
    ],
  },

  // ==========================================
  // UNITED KINGDOM
  // ==========================================
  {
    id: 'london-gb',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    aliases: ['Greater London', 'The Big Smoke'],
    popularPlaces: [
      {
        id: 'lon-tower-bridge',
        name: 'Tower of London & Tower Bridge',
        category: 'history',
        shortDesc: 'Nearly 1,000-year-old royal fortress safeguarding the Crown Jewels beside Tower Bridge.',
        tags: ['crown-jewels', 'castle', 'bridge', 'thames'],
      },
      {
        id: 'lon-british-museum',
        name: 'British Museum',
        category: 'museum',
        shortDesc: 'World-renowned institution under a great glass dome housing the Rosetta Stone.',
        tags: ['rosetta-stone', 'antiquities', 'museum', 'free-entry'],
      },
      {
        id: 'lon-big-ben',
        name: 'Big Ben & Palace of Westminster',
        category: 'history',
        shortDesc: 'Iconic neo-Gothic parliamentary clock tower standing proudly along the River Thames.',
        tags: ['big-ben', 'parliament', 'clock-tower', 'landmark'],
      },
      {
        id: 'lon-buckingham-palace',
        name: 'Buckingham Palace',
        category: 'history',
        shortDesc: 'Official royal residence in London famous for the ceremonial Changing of the Guard.',
        tags: ['royal', 'guards', 'palace', 'monarchy'],
      },
      {
        id: 'lon-hyde-park',
        name: 'Hyde Park & Kensington Gardens',
        category: 'nature',
        shortDesc: 'Expansive royal park featuring the Serpentine lake and peaceful Italian gardens.',
        tags: ['park', 'lake', 'greenery', 'gardens'],
      },
      {
        id: 'lon-borough-market',
        name: 'Borough Market',
        category: 'cafe',
        shortDesc: 'Historic railway arch food market packed with artisan cheeses, pies, and street food.',
        tags: ['street-food', 'artisan', 'market', 'railway-arches'],
      },
      {
        id: 'lon-covent-garden',
        name: 'Covent Garden',
        category: 'shopping',
        shortDesc: 'Charming market hall with street performers, fashion boutiques, and dining piazzas.',
        tags: ['shopping', 'performers', 'piazzas', 'west-end'],
      },
    ],
  },
  {
    id: 'edinburgh-gb',
    city: 'Edinburgh',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    aliases: ['Dùn Èideann', 'Auld Reekie', 'Scotland'],
    popularPlaces: [
      {
        id: 'edi-castle',
        name: 'Edinburgh Castle',
        category: 'history',
        shortDesc: 'Historic volcanic stronghold dominating the skyline and guarding the Honours of Scotland.',
        tags: ['castle', 'volcano', 'fortress', 'scottish-history'],
      },
      {
        id: 'edi-royal-mile',
        name: 'The Royal Mile',
        category: 'history',
        shortDesc: 'Cobbled thoroughfare linking the Castle with Holyrood Palace, filled with closes and wynds.',
        tags: ['cobblestone', 'old-town', 'whisky', 'ghost-tours'],
      },
      {
        id: 'edi-arthurs-seat',
        name: 'Arthur’s Seat & Holyrood Park',
        category: 'nature',
        shortDesc: 'Ancient extinct volcano providing an exhilarating hike with sweeping coastal vistas.',
        tags: ['hiking', 'volcano', 'panoramic', 'nature'],
      },
      {
        id: 'edi-holyroodhouse',
        name: 'Palace of Holyroodhouse',
        category: 'history',
        shortDesc: 'Official Scottish residence of the British monarch and home of Mary Queen of Scots.',
        tags: ['royal-palace', 'mary-queen-of-scots', 'history'],
      },
      {
        id: 'edi-national-museum',
        name: 'National Museum of Scotland',
        category: 'museum',
        shortDesc: 'Diverse museum showcasing Scottish history, world cultures, and Dolly the cloned sheep.',
        tags: ['museum', 'science', 'scottish-heritage', 'rooftop'],
      },
      {
        id: 'edi-calton-hill',
        name: 'Calton Hill',
        category: 'nature',
        shortDesc: 'Prominent hill featuring neoclassical monuments and the classic view of Edinburgh.',
        tags: ['monuments', 'neoclassical', 'sunset', 'viewpoint'],
      },
    ],
  },

  // ==========================================
  // GERMANY
  // ==========================================
  {
    id: 'berlin-de',
    city: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    aliases: ['Hauptstadt'],
    popularPlaces: [
      {
        id: 'ber-brandenburg-gate',
        name: 'Brandenburg Gate (Brandenburger Tor)',
        category: 'history',
        shortDesc: '18th-century neoclassical monument and the world symbol of German unity.',
        tags: ['monument', 'unity', 'neoclassical', 'landmark'],
      },
      {
        id: 'ber-reichstag',
        name: 'Reichstag Building & Glass Dome',
        category: 'history',
        shortDesc: 'Seat of the German federal parliament featuring Norman Foster’s transparent dome.',
        tags: ['parliament', 'glass-dome', 'architecture', 'viewpoint'],
      },
      {
        id: 'ber-museum-island',
        name: 'Museum Island (Museumsinsel)',
        category: 'museum',
        shortDesc: 'UNESCO complex of five world-class museums including the Pergamon and Neues Museum.',
        tags: ['unesco', 'nefertiti', 'museum-complex', 'spree'],
      },
      {
        id: 'ber-east-side-gallery',
        name: 'East Side Gallery',
        category: 'history',
        shortDesc: '1.3-kilometer open-air remnant of the Berlin Wall painted with international murals.',
        tags: ['berlin-wall', 'murals', 'street-art', 'cold-war'],
      },
      {
        id: 'ber-tiergarten',
        name: 'Tiergarten Park',
        category: 'nature',
        shortDesc: 'Immense forested urban park centered around the golden Victory Column.',
        tags: ['park', 'nature', 'victory-column', 'green-lung'],
      },
      {
        id: 'ber-kudamm',
        name: 'Kurfürstendamm & KaDeWe',
        category: 'shopping',
        shortDesc: 'Famous shopping avenue anchored by Europe’s largest department store, KaDeWe.',
        tags: ['department-store', 'shopping', 'luxury', 'food-floor'],
      },
    ],
  },
  {
    id: 'munich-de',
    city: 'Munich',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    aliases: ['München', 'Bavaria', 'Bayern'],
    popularPlaces: [
      {
        id: 'muc-marienplatz',
        name: 'Marienplatz & Neues Rathaus',
        category: 'history',
        shortDesc: 'Central town square famed for the mechanical Glockenspiel show atop the City Hall.',
        tags: ['glockenspiel', 'gothic-revival', 'square', 'historic'],
      },
      {
        id: 'muc-english-garden',
        name: 'English Garden (Englischer Garten)',
        category: 'nature',
        shortDesc: 'Sprawling park larger than Central Park, famous for river surfers on the Eisbach wave.',
        tags: ['river-surfing', 'beer-garden', 'park', 'nature'],
      },
      {
        id: 'muc-nymphenburg',
        name: 'Nymphenburg Palace',
        category: 'history',
        shortDesc: 'Lavish summer residence of Bavarian kings set within grand baroque canal gardens.',
        tags: ['baroque', 'palace', 'bavarian-royalty', 'gardens'],
      },
      {
        id: 'muc-deutsches-museum',
        name: 'Deutsches Museum',
        category: 'museum',
        shortDesc: 'The world’s largest science and technology museum located on an island in the Isar.',
        tags: ['science', 'technology', 'interactive', 'engineering'],
      },
      {
        id: 'muc-hofbrauhaus',
        name: 'Hofbräuhaus München',
        category: 'cafe',
        shortDesc: 'Historic 16th-century beer hall with oompah bands, giant pretzels, and Bavarian dishes.',
        tags: ['beer-hall', 'bavarian', 'pretzels', 'tradition'],
      },
      {
        id: 'muc-viktualienmarkt',
        name: 'Viktualienmarkt',
        category: 'shopping',
        shortDesc: 'Open-air gourmet food market offering regional Bavarian cheeses, wurst, and flowers.',
        tags: ['farmers-market', 'gourmet', 'cheese', 'bavaria'],
      },
    ],
  },

  // ==========================================
  // JAPAN
  // ==========================================
  {
    id: 'tokyo-jp',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    aliases: ['東京', 'Edo'],
    popularPlaces: [
      {
        id: 'tyo-senso-ji',
        name: 'Sensō-ji Temple (Asakusa)',
        category: 'history',
        shortDesc: 'Tokyo’s oldest Buddhist temple fronted by the iconic red Kaminarimon Thunder Gate.',
        tags: ['buddhist', 'temple', 'lantern', 'asakusa'],
      },
      {
        id: 'tyo-shibuya-crossing',
        name: 'Shibuya Crossing & Hachiko Statue',
        category: 'other',
        shortDesc: 'The busiest pedestrian scramble crossing on Earth, illuminated by neon screens.',
        tags: ['scramble', 'neon', 'hachiko', 'urban-energy'],
      },
      {
        id: 'tyo-meiji-shrine',
        name: 'Meiji Jingu Shrine',
        category: 'history',
        shortDesc: 'Serene Shinto shrine enveloped in an evergreen forest of over 100,000 trees.',
        tags: ['shinto', 'torii-gate', 'forest', 'peaceful'],
      },
      {
        id: 'tyo-shinjuku-gyoen',
        name: 'Shinjuku Gyoen National Garden',
        category: 'nature',
        shortDesc: 'Expansive park blending Japanese traditional, English landscape, and French formal styles.',
        tags: ['cherry-blossom', 'garden', 'greenery', 'tranquil'],
      },
      {
        id: 'tyo-akihabara',
        name: 'Akihabara Electric Town',
        category: 'shopping',
        shortDesc: 'World capital of anime, gaming, retro electronics, and pop-culture collectibles.',
        tags: ['anime', 'gaming', 'electronics', 'manga'],
      },
      {
        id: 'tyo-tsukiji-market',
        name: 'Tsukiji Outer Market',
        category: 'cafe',
        shortDesc: 'Legendary seafood marketplace bustling with fresh sushi bars and grilled wagyu skewers.',
        tags: ['sushi', 'street-food', 'seafood', 'wagyu'],
      },
      {
        id: 'tyo-skytree',
        name: 'Tokyo Skytree',
        category: 'other',
        shortDesc: 'The world’s tallest free-standing broadcast tower with sweeping vistas to Mount Fuji.',
        tags: ['observation-deck', 'mount-fuji', 'skyline', 'tower'],
      },
    ],
  },
  {
    id: 'kyoto-jp',
    city: 'Kyoto',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    aliases: ['京都', 'Kansai'],
    popularPlaces: [
      {
        id: 'kyo-fushimi-inari',
        name: 'Fushimi Inari Taisha',
        category: 'history',
        shortDesc: 'Mountaintop Shinto shrine renowned for thousands of vermilion torii tunnel gates.',
        tags: ['torii-gates', 'shinto', 'mountain-trail', 'fox-statues'],
      },
      {
        id: 'kyo-kinkaku-ji',
        name: 'Kinkaku-ji (Golden Pavilion)',
        category: 'history',
        shortDesc: 'Zen Buddhist temple covered in pure gold leaf reflecting serenely over a mirror pond.',
        tags: ['gold-leaf', 'zen', 'pond', 'unesco'],
      },
      {
        id: 'kyo-arashiyama',
        name: 'Arashiyama Bamboo Grove',
        category: 'nature',
        shortDesc: 'Ethereal forest path lined with soaring green bamboo stalks swaying in the breeze.',
        tags: ['bamboo', 'nature-walk', 'ethereal', 'arashiyama'],
      },
      {
        id: 'kyo-kiyomizu-dera',
        name: 'Kiyomizu-dera Temple',
        category: 'history',
        shortDesc: 'Ancient wooden temple whose grand stage overhangs the cliffside without a single nail.',
        tags: ['wooden-stage', 'spring-water', 'cliffside', 'temple'],
      },
      {
        id: 'kyo-gion',
        name: 'Gion Historic Geisha District',
        category: 'history',
        shortDesc: 'Preserved wooden machiya merchant townhouses where geiko and maiko hurry to appointments.',
        tags: ['geisha', 'machiya', 'teahouses', 'traditional'],
      },
      {
        id: 'kyo-nishiki-market',
        name: 'Nishiki Market ("Kyoto’s Kitchen")',
        category: 'cafe',
        shortDesc: 'Five-block covered food corridor packed with skewers, matcha sweets, and pickles.',
        tags: ['matcha', 'food-stalls', 'tsukemono', 'kitchen'],
      },
    ],
  },
  {
    id: 'osaka-jp',
    city: 'Osaka',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    aliases: ['大阪', 'Naniwa'],
    popularPlaces: [
      {
        id: 'osa-castle',
        name: 'Osaka Castle & Park',
        category: 'history',
        shortDesc: 'Imposing 16th-century samurai fortress surrounded by moats and cherry blossoms.',
        tags: ['samurai', 'castle', 'moat', 'history'],
      },
      {
        id: 'osa-dotonbori',
        name: 'Dōtonbori Gastronomy District',
        category: 'cafe',
        shortDesc: 'Electric neon canal famous for the Glico running man sign and takoyaki street stalls.',
        tags: ['takoyaki', 'okonomiyaki', 'neon', 'street-food'],
      },
      {
        id: 'osa-umeda-sky',
        name: 'Umeda Sky Building (Floating Garden)',
        category: 'other',
        shortDesc: 'Futuristic twin skyscrapers connected at top by an open-air circular observation deck.',
        tags: ['modern-architecture', 'viewpoint', 'skyline', 'observation-deck'],
      },
      {
        id: 'osa-shinsekai',
        name: 'Shinsekai & Tsūtenkaku Tower',
        category: 'other',
        shortDesc: 'Retro entertainment quarter preserved from the early 20th century, famed for kushikatsu.',
        tags: ['retro', 'kushikatsu', 'tower', 'vintage'],
      },
      {
        id: 'osa-kuromon',
        name: 'Kuromon Ichiba Market',
        category: 'cafe',
        shortDesc: 'Bustling covered marketplace specializing in grilled giant crab, uni, and Kobe beef.',
        tags: ['seafood', 'kobe-beef', 'market', 'grill'],
      },
      {
        id: 'osa-usj',
        name: 'Universal Studios Japan',
        category: 'other',
        shortDesc: 'World-famous theme park featuring Super Nintendo World and The Wizarding World of Harry Potter.',
        tags: ['theme-park', 'nintendo', 'entertainment', 'attractions'],
      },
    ],
  },

  // ==========================================
  // UNITED STATES
  // ==========================================
  {
    id: 'new-york-us',
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    aliases: ['NYC', 'New York City', 'The Big Apple', 'Manhattan'],
    popularPlaces: [
      {
        id: 'nyc-central-park',
        name: 'Central Park',
        category: 'nature',
        shortDesc: 'Massive 843-acre urban oasis featuring lakes, ice rinks, and tranquil shaded woodlands.',
        tags: ['park', 'oasis', 'manhattan', 'boating'],
      },
      {
        id: 'nyc-statue-of-liberty',
        name: 'Statue of Liberty & Ellis Island',
        category: 'history',
        shortDesc: 'Colossal neoclassical copper monument to liberty standing in New York Harbor.',
        tags: ['monument', 'freedom', 'harbor', 'immigration'],
      },
      {
        id: 'nyc-met',
        name: 'The Metropolitan Museum of Art (The Met)',
        category: 'museum',
        shortDesc: 'One of the world’s greatest museums, housing 5,000 years of global artistic treasures.',
        tags: ['art', 'egyptian', 'paintings', 'rooftop'],
      },
      {
        id: 'nyc-times-square',
        name: 'Times Square & Broadway',
        category: 'other',
        shortDesc: 'Electrifying commercial crossroads bathed in giant digital billboards and world-class theatre.',
        tags: ['broadway', 'theatre', 'billboards', 'crossroads'],
      },
      {
        id: 'nyc-empire-state',
        name: 'Empire State Building',
        category: 'other',
        shortDesc: 'Iconic 102-story Art Deco skyscraper commanding legendary views of Manhattan.',
        tags: ['art-deco', 'skyscraper', 'viewpoint', 'skyline'],
      },
      {
        id: 'nyc-brooklyn-bridge',
        name: 'Brooklyn Bridge & DUMBO',
        category: 'history',
        shortDesc: 'Historic stone-arch suspension bridge linking Manhattan to Brooklyn waterfront parks.',
        tags: ['bridge', 'suspension', 'walking', 'skyline-views'],
      },
      {
        id: 'nyc-fifth-avenue',
        name: 'Fifth Avenue Shopping',
        category: 'shopping',
        shortDesc: 'Prestigious retail avenue lined with flagship luxury stores and architectural landmarks.',
        tags: ['luxury', 'shopping', 'flagship', 'fashion'],
      },
    ],
  },
  {
    id: 'san-francisco-us',
    city: 'San Francisco',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    aliases: ['SF', 'Bay Area', 'Frisco'],
    popularPlaces: [
      {
        id: 'sfo-golden-gate-bridge',
        name: 'Golden Gate Bridge',
        category: 'other',
        shortDesc: 'International Orange suspension bridge soaring majestically across the Golden Gate strait.',
        tags: ['bridge', 'engineering', 'fog', 'bay'],
      },
      {
        id: 'sfo-alcatraz',
        name: 'Alcatraz Island',
        category: 'history',
        shortDesc: 'Infamous maximum-security federal island penitentiary once holding Al Capone.',
        tags: ['island', 'prison', 'history', 'ferry'],
      },
      {
        id: 'sfo-fishermans-wharf',
        name: 'Fisherman’s Wharf & Pier 39',
        category: 'cafe',
        shortDesc: 'Historic waterfront wharf famous for clam chowder in sourdough bowls and sunbathing sea lions.',
        tags: ['clam-chowder', 'sea-lions', 'sourdough', 'waterfront'],
      },
      {
        id: 'sfo-golden-gate-park',
        name: 'Golden Gate Park',
        category: 'nature',
        shortDesc: 'Over 1,000 acres of lush gardens, Japanese Tea Garden, and the de Young Museum.',
        tags: ['park', 'tea-garden', 'conservatory', 'greenery'],
      },
      {
        id: 'sfo-cable-cars',
        name: 'Historic Cable Cars & Lombard Street',
        category: 'other',
        shortDesc: 'World’s last manually operated cable car system scaling steep hills and crooked streets.',
        tags: ['cable-car', 'lombard-street', 'hills', 'vintage'],
      },
      {
        id: 'sfo-chinatown',
        name: 'San Francisco Chinatown',
        category: 'shopping',
        shortDesc: 'The oldest Chinatown in North America, filled with dragon gates and herbalist apothecaries.',
        tags: ['chinatown', 'dim-sum', 'dragon-gate', 'culture'],
      },
    ],
  },
  {
    id: 'los-angeles-us',
    city: 'Los Angeles',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    aliases: ['LA', 'City of Angels', 'Hollywood'],
    popularPlaces: [
      {
        id: 'lax-griffith-observatory',
        name: 'Griffith Observatory & Hollywood Sign',
        category: 'nature',
        shortDesc: 'Iconic hilltop observatory boasting planetarium shows and prime views of the Hollywood Sign.',
        tags: ['observatory', 'hollywood-sign', 'sunset', 'skyline'],
      },
      {
        id: 'lax-santa-monica-pier',
        name: 'Santa Monica Pier & Beach',
        category: 'nature',
        shortDesc: 'Historic pier marking the western terminus of Route 66 with a solar-powered Ferris wheel.',
        tags: ['beach', 'pier', 'route-66', 'ocean'],
      },
      {
        id: 'lax-getty-center',
        name: 'The Getty Center',
        category: 'museum',
        shortDesc: 'Richard Meier-designed travertine museum atop the Santa Monica Mountains with van Gogh’s Irises.',
        tags: ['museum', 'architecture', 'gardens', 'van-gogh'],
      },
      {
        id: 'lax-walk-of-fame',
        name: 'Hollywood Walk of Fame',
        category: 'other',
        shortDesc: 'World-famous sidewalk sidewalk celebrating over 2,700 brass stars of entertainment legends.',
        tags: ['stars', 'celebrities', 'grauman', 'hollywood-blvd'],
      },
      {
        id: 'lax-venice-beach',
        name: 'Venice Beach Boardwalk',
        category: 'cafe',
        shortDesc: 'Eclectic seaside promenade filled with street performers, skateparks, and coastal bistros.',
        tags: ['skatepark', 'boardwalk', 'coastal', 'bohemian'],
      },
      {
        id: 'lax-rodeo-drive',
        name: 'Rodeo Drive (Beverly Hills)',
        category: 'shopping',
        shortDesc: 'Three blocks of ultra-luxury haute couture and designer fashion houses.',
        tags: ['luxury', 'beverly-hills', 'designer', 'fashion'],
      },
    ],
  },

  // ==========================================
  // NETHERLANDS
  // ==========================================
  {
    id: 'amsterdam-nl',
    city: 'Amsterdam',
    country: 'Netherlands',
    countryCode: 'NL',
    flag: '🇳🇱',
    aliases: ['Mokum', 'Holland'],
    popularPlaces: [
      {
        id: 'ams-rijksmuseum',
        name: 'Rijksmuseum',
        category: 'museum',
        shortDesc: 'The Dutch national museum showcasing Rembrandt’s Night Watch and Vermeer masterworks.',
        tags: ['rembrandt', 'vermeer', 'dutch-masters', 'art'],
      },
      {
        id: 'ams-van-gogh-museum',
        name: 'Van Gogh Museum',
        category: 'museum',
        shortDesc: 'The world’s largest collection of paintings, drawings, and letters by Vincent van Gogh.',
        tags: ['van-gogh', 'sunflowers', 'post-impressionism', 'museum'],
      },
      {
        id: 'ams-anne-frank-house',
        name: 'Anne Frank House',
        category: 'history',
        shortDesc: 'The preserved canal-house secret annex where Anne Frank wrote her famous wartime diary.',
        tags: ['world-war-2', 'diary', 'secret-annex', 'history'],
      },
      {
        id: 'ams-jordaan-canals',
        name: 'Jordaan Canal District',
        category: 'history',
        shortDesc: 'UNESCO 17th-century canal ring lined with narrow gabled houses and arched stone bridges.',
        tags: ['canals', 'unesco', 'bridges', 'cycling'],
      },
      {
        id: 'ams-vondelpark',
        name: 'Vondelpark',
        category: 'nature',
        shortDesc: 'Amsterdam’s most popular English-style urban park with ponds, open-air cafes, and lawns.',
        tags: ['park', 'biking', 'ponds', 'relaxation'],
      },
      {
        id: 'ams-bloemenmarkt',
        name: 'Bloemenmarkt (Floating Flower Market)',
        category: 'shopping',
        shortDesc: 'The world’s only floating flower market, featuring colorful Dutch tulips and wooden clogs.',
        tags: ['tulips', 'flowers', 'market', 'souvenirs'],
      },
    ],
  },

  // ==========================================
  // GREECE
  // ==========================================
  {
    id: 'athens-gr',
    city: 'Athens',
    country: 'Greece',
    countryCode: 'GR',
    flag: '🇬🇷',
    aliases: ['Athina', 'Αθήna'],
    popularPlaces: [
      {
        id: 'ath-acropolis',
        name: 'Acropolis & Parthenon',
        category: 'history',
        shortDesc: 'The crowning rocky citadel of ancient classical civilization dedicated to the goddess Athena.',
        tags: ['parthenon', 'classical-greece', 'ancient', 'unesco'],
      },
      {
        id: 'ath-acropolis-museum',
        name: 'Acropolis Museum',
        category: 'museum',
        shortDesc: 'State-of-the-art museum displaying surviving sculptures discovered on the Sacred Rock.',
        tags: ['sculptures', 'cariatids', 'parthenon-frieze', 'museum'],
      },
      {
        id: 'ath-plaka',
        name: 'Plaka Historic Neighborhood',
        category: 'history',
        shortDesc: 'The picturesque "Neighborhood of the Gods" under the Acropolis, lined with tavernas.',
        tags: ['tavernas', 'old-town', 'bougainvillea', 'cobblestone'],
      },
      {
        id: 'ath-ancient-agora',
        name: 'Ancient Agora of Athens',
        category: 'history',
        shortDesc: 'The civic and commercial heartbeat of ancient Athens where Socrates and Plato once walked.',
        tags: ['agora', 'hephaestus-temple', 'philosophy', 'ruins'],
      },
      {
        id: 'ath-mount-lycabettus',
        name: 'Mount Lycabettus',
        category: 'nature',
        shortDesc: 'The highest limestone hill in Athens offering panoramic 360-degree sunset views.',
        tags: ['sunset', 'panoramic', 'hiking', 'funicular'],
      },
      {
        id: 'ath-monastiraki',
        name: 'Monastiraki Flea Market',
        category: 'shopping',
        shortDesc: 'Lively bazaar packed with antiques, leather sandals, and traditional Greek souvenirs.',
        tags: ['flea-market', 'antiques', 'sandals', 'bazaar'],
      },
    ],
  },
  {
    id: 'santorini-gr',
    city: 'Santorini',
    country: 'Greece',
    countryCode: 'GR',
    flag: '🇬🇷',
    aliases: ['Thira', 'Thera', 'Fira', 'Oia', 'Cyclades'],
    popularPlaces: [
      {
        id: 'san-oia-sunset',
        name: 'Oia Sunset Point & Blue Domes',
        category: 'nature',
        shortDesc: 'World-famous cliffside village overlooking the caldera, renowned for pastel sunsets.',
        tags: ['blue-domes', 'sunset', 'caldera', 'cycladic'],
      },
      {
        id: 'san-fira-trail',
        name: 'Fira to Oia Caldera Trail',
        category: 'nature',
        shortDesc: 'A dramatic 10-kilometer rim trail hike high above the volcanic Aegean Sea.',
        tags: ['hiking', 'cliffside', 'caldera', 'scenic'],
      },
      {
        id: 'san-red-beach',
        name: 'Red Beach (Kokkini Paralia)',
        category: 'nature',
        shortDesc: 'Unique volcanic beach framed by towering rust-red lava cliffs and turquoise waters.',
        tags: ['red-beach', 'volcanic', 'swimming', 'cliffs'],
      },
      {
        id: 'san-akrotiri',
        name: 'Akrotiri Prehistoric City',
        category: 'history',
        shortDesc: 'Minoan Bronze Age settlement preserved in volcanic ash, often called the Greek Pompeii.',
        tags: ['minoan', 'bronze-age', 'archaeology', 'ruins'],
      },
      {
        id: 'san-santo-wines',
        name: 'Cliffside Winery & Cafés',
        category: 'cafe',
        shortDesc: 'Vineyard perched on the rim serving crisp Assyrtiko volcanic wine and local fava.',
        tags: ['wine-tasting', 'assyrtiko', 'caldera-view', 'gastronomy'],
      },
      {
        id: 'san-pyrgos',
        name: 'Pyrgos Traditional Village',
        category: 'history',
        shortDesc: 'Fortified medieval hilltop village offering quiet labyrinth alleys and Venetian ruins.',
        tags: ['medieval', 'venetian', 'labyrinth', 'traditional'],
      },
    ],
  },

  // ==========================================
  // SWITZERLAND
  // ==========================================
  {
    id: 'zurich-ch',
    city: 'Zurich',
    country: 'Switzerland',
    countryCode: 'CH',
    flag: '🇨🇭',
    aliases: ['Zürich', 'Zuerich'],
    popularPlaces: [
      {
        id: 'zrh-lake-zurich',
        name: 'Lake Zurich Promenade',
        category: 'nature',
        shortDesc: 'Picturesque lakeshore promenade dotted with swan boats, gardens, and Alpine views.',
        tags: ['lake', 'promenade', 'alps-view', 'boating'],
      },
      {
        id: 'zrh-altstadt',
        name: 'Altstadt (Old Town) & Lindenhof',
        category: 'history',
        shortDesc: 'Medieval streets flanking the Limmat river, culminating at peaceful hilltop Lindenhof.',
        tags: ['old-town', 'medieval', 'river', 'viewpoint'],
      },
      {
        id: 'zrh-bahnhofstrasse',
        name: 'Bahnhofstrasse',
        category: 'shopping',
        shortDesc: 'One of the world’s most exclusive shopping avenues, famous for luxury Swiss watchmakers.',
        tags: ['luxury', 'swiss-watches', 'shopping', 'avenue'],
      },
      {
        id: 'zrh-kunsthaus',
        name: 'Kunsthaus Zürich',
        category: 'museum',
        shortDesc: 'Switzerland’s largest art museum holding major modern and contemporary Swiss collections.',
        tags: ['art-museum', 'giacometti', 'modern-art', 'monet'],
      },
      {
        id: 'zrh-uetliberg',
        name: 'Uetliberg Mountain',
        category: 'nature',
        shortDesc: 'Zurich’s panoramic home mountain offering forest hikes and sweeping views over the city and Alps.',
        tags: ['mountain', 'panoramic', 'hiking', 'train-ride'],
      },
      {
        id: 'zrh-grossmunster',
        name: 'Grossmünster & Fraumünster',
        category: 'history',
        shortDesc: 'Twin Romanesque towers and Marc Chagall’s stained-glass windows across the Limmat.',
        tags: ['churches', 'chagall', 'stained-glass', 'romanesque'],
      },
    ],
  },
  {
    id: 'geneva-ch',
    city: 'Geneva',
    country: 'Switzerland',
    countryCode: 'CH',
    flag: '🇨🇭',
    aliases: ['Genève', 'Genf'],
    popularPlaces: [
      {
        id: 'gva-jet-deau',
        name: 'Jet d’Eau Water Fountain',
        category: 'nature',
        shortDesc: 'Monumental water plume pumping 500 liters per second 140 meters into Lake Geneva’s sky.',
        tags: ['fountain', 'lake-geneva', 'icon', 'water'],
      },
      {
        id: 'gva-old-town',
        name: 'Vieille Ville & St. Pierre Cathedral',
        category: 'history',
        shortDesc: 'Ancient hilltop quarter of cobblestone lanes where John Calvin led the Reformation.',
        tags: ['reformation', 'cathedral', 'cobblestone', 'old-town'],
      },
      {
        id: 'gva-palais-des-nations',
        name: 'Palais des Nations (UN Headquarters)',
        category: 'museum',
        shortDesc: 'European headquarters of the United Nations situated in serene Ariana Park.',
        tags: ['united-nations', 'diplomacy', 'park', 'international'],
      },
      {
        id: 'gva-jardin-anglais',
        name: 'Jardin Anglais & L’Horloge Fleurie',
        category: 'nature',
        shortDesc: 'Lakeside English garden featuring the colorful floral clock honoring Swiss watchmaking.',
        tags: ['flower-clock', 'park', 'lakeside', 'watchmaking'],
      },
      {
        id: 'gva-patek-philippe',
        name: 'Patek Philippe Museum',
        category: 'museum',
        shortDesc: 'Prestigious horological museum displaying five centuries of exquisite Swiss timepieces.',
        tags: ['watches', 'horology', 'craftsmanship', 'museum'],
      },
      {
        id: 'gva-carouge',
        name: 'Carouge Bohemian Quarter',
        category: 'cafe',
        shortDesc: 'Italianate district known as Geneva’s Greenwich Village, filled with artisan cafes and bistros.',
        tags: ['bohemian', 'bistros', 'artisans', 'italianate'],
      },
    ],
  },
  {
    id: 'lucerne-ch',
    city: 'Lucerne',
    country: 'Switzerland',
    countryCode: 'CH',
    flag: '🇨🇭',
    aliases: ['Luzern', 'Lake Lucerne'],
    popularPlaces: [
      {
        id: 'luc-chapel-bridge',
        name: 'Chapel Bridge (Kapellbrücke)',
        category: 'history',
        shortDesc: '14th-century covered wooden footbridge featuring historic interior triangular paintings.',
        tags: ['wooden-bridge', 'watertower', 'medieval', 'paintings'],
      },
      {
        id: 'luc-mount-pilatus',
        name: 'Mount Pilatus Cogwheel Railway',
        category: 'nature',
        shortDesc: 'Exhilarating ascent on the world’s steepest cogwheel railway to alpine summits.',
        tags: ['cogwheel-train', 'alps', 'mountain-peak', 'cable-car'],
      },
      {
        id: 'luc-lake-cruise',
        name: 'Lake Lucerne Steamboat Cruise',
        category: 'nature',
        shortDesc: 'Classic scenic voyage sailing between towering dramatic mountain peaks and fjord-like bays.',
        tags: ['steamboat', 'lake', 'scenic', 'fjord-like'],
      },
      {
        id: 'luc-lion-monument',
        name: 'Lion Monument (Löwendenkmal)',
        category: 'history',
        shortDesc: 'Poignant dying lion carved into a sandstone rock cliff commemorating fallen Swiss Guards.',
        tags: ['rock-relief', 'memorial', 'sandstone', 'mark-twain'],
      },
      {
        id: 'luc-transport-museum',
        name: 'Swiss Museum of Transport',
        category: 'museum',
        shortDesc: 'Switzerland’s most visited museum, packed with locomotives, planes, and space simulators.',
        tags: ['trains', 'aviation', 'interactive', 'family'],
      },
      {
        id: 'luc-old-town',
        name: 'Lucerne Old Town Squares',
        category: 'history',
        shortDesc: 'Pedestrian squares enclosed by historic merchant buildings adorned with vibrant frescoes.',
        tags: ['frescoes', 'squares', 'shopping', 'pedestrian'],
      },
    ],
  },

  // ==========================================
  // PORTUGAL
  // ==========================================
  {
    id: 'lisbon-pt',
    city: 'Lisbon',
    country: 'Portugal',
    countryCode: 'PT',
    flag: '🇵🇹',
    aliases: ['Lisboa'],
    popularPlaces: [
      {
        id: 'lis-belem-tower',
        name: 'Belém Tower (Torre de Belém)',
        category: 'history',
        shortDesc: '16th-century Manueline limestone fortress guarding the mouth of the Tagus River.',
        tags: ['manueline', 'fortress', 'unesco', 'maritime'],
      },
      {
        id: 'lis-jeronimos',
        name: 'Jerónimos Monastery',
        category: 'history',
        shortDesc: 'Magnificent monastery symbolizing the Portuguese Age of Discovery and Vasco da Gama’s resting place.',
        tags: ['cloisters', 'monastery', 'vasco-da-gama', 'unesco'],
      },
      {
        id: 'lis-alfama',
        name: 'Alfama Quarter & Tram 28',
        category: 'history',
        shortDesc: 'Lisbon’s oldest neighborhood of steep whitewashed alleys echoing with mournful Fado music.',
        tags: ['fado', 'tram-28', 'miradouros', 'azulejos'],
      },
      {
        id: 'lis-castelo-sao-jorge',
        name: 'Castelo de São Jorge',
        category: 'history',
        shortDesc: 'Hilltop Moorish castle providing commanding views across Lisbon’s red-tiled roofs.',
        tags: ['moorish', 'castle', 'viewpoint', 'pine-trees'],
      },
      {
        id: 'lis-time-out-market',
        name: 'Time Out Market Lisboa',
        category: 'cafe',
        shortDesc: 'Curated gourmet food market bringing Lisbon’s top chefs and pastel de nata under one roof.',
        tags: ['pastel-de-nata', 'chefs', 'food-hall', 'tasting'],
      },
      {
        id: 'lis-miradouros',
        name: 'Miradouro de Santa Luzia',
        category: 'nature',
        shortDesc: 'Romantic bougainvillea-shaded terrace with blue azulejo tiles overlooking Alfama.',
        tags: ['terrace', 'viewpoint', 'azulejos', 'romantic'],
      },
    ],
  },
  {
    id: 'porto-pt',
    city: 'Porto',
    country: 'Portugal',
    countryCode: 'PT',
    flag: '🇵🇹',
    aliases: ['Oporto', 'Douro'],
    popularPlaces: [
      {
        id: 'opo-dom-luis-bridge',
        name: 'Dom Luís I Bridge',
        category: 'history',
        shortDesc: 'Double-deck metal arch bridge designed by Eiffel’s partner, spanning the Douro River.',
        tags: ['iron-bridge', 'douro', 'eiffel-disciple', 'viewpoint'],
      },
      {
        id: 'opo-ribeira',
        name: 'Ribeira Waterfront District',
        category: 'cafe',
        shortDesc: 'UNESCO-listed riverfront of vibrant colorful houses, outdoor terraces, and rabelo boats.',
        tags: ['waterfront', 'river', 'unesco', 'terrace-dining'],
      },
      {
        id: 'opo-livraria-lello',
        name: 'Livraria Lello',
        category: 'shopping',
        shortDesc: 'One of the world’s most breathtaking Neo-Gothic bookstores with a famous crimson staircase.',
        tags: ['bookstore', 'neo-gothic', 'crimson-staircase', 'literature'],
      },
      {
        id: 'opo-clerigos',
        name: 'Clérigos Church & Tower',
        category: 'history',
        shortDesc: '75-meter Baroque bell tower rewarding climbers with panoramic vistas of Porto.',
        tags: ['bell-tower', 'baroque', 'panoramic', 'landmark'],
      },
      {
        id: 'opo-wine-cellars',
        name: 'Port Wine Lodges (Vila Nova de Gaia)',
        category: 'cafe',
        shortDesc: 'Centuries-old riverside cellars aging tawny and ruby Port wine straight from the Douro Valley.',
        tags: ['port-wine', 'cellars', 'wine-tasting', 'douro'],
      },
      {
        id: 'opo-sao-bento',
        name: 'São Bento Railway Station',
        category: 'history',
        shortDesc: 'Grand station hall lined with 20,000 historic blue-and-white azulejo tiles.',
        tags: ['azulejos', 'railway-station', 'tiles', 'art'],
      },
    ],
  },

  // ==========================================
  // CZECH REPUBLIC
  // ==========================================
  {
    id: 'prague-cz',
    city: 'Prague',
    country: 'Czech Republic',
    countryCode: 'CZ',
    flag: '🇨🇿',
    aliases: ['Praha', 'Bohemia', 'City of a Hundred Spires'],
    popularPlaces: [
      {
        id: 'prg-charles-bridge',
        name: 'Charles Bridge (Karlův most)',
        category: 'history',
        shortDesc: '14th-century Gothic stone pedestrian bridge lined with 30 Baroque statues over the Vltava.',
        tags: ['gothic-bridge', 'statues', 'vltava', 'dawn-walk'],
      },
      {
        id: 'prg-prague-castle',
        name: 'Prague Castle & St. Vitus Cathedral',
        category: 'history',
        shortDesc: 'The largest ancient castle complex in the world, crowned by soaring Gothic cathedral spires.',
        tags: ['castle-complex', 'cathedral', 'gothic', 'golden-lane'],
      },
      {
        id: 'prg-astronomical-clock',
        name: 'Old Town Square & Astronomical Clock',
        category: 'history',
        shortDesc: 'Historic square where crowds gather hourly to watch the 600-year-old clock’s animated Apostles.',
        tags: ['astronomical-clock', 'old-town', 'square', 'historic'],
      },
      {
        id: 'prg-mala-strana',
        name: 'Malá Strana (Lesser Town)',
        category: 'history',
        shortDesc: 'Picturesque Baroque quarter beneath the castle full of quiet gardens and embassies.',
        tags: ['baroque', 'quiet-gardens', 'quaint', 'palaces'],
      },
      {
        id: 'prg-petrin-hill',
        name: 'Petřín Hill & Lookout Tower',
        category: 'nature',
        shortDesc: 'Peaceful hilltop park featuring an Eiffel-style observation tower and fruit orchards.',
        tags: ['park', 'eiffel-tower', 'viewpoint', 'orchard'],
      },
      {
        id: 'prg-wenceslas-square',
        name: 'Wenceslas Square & National Museum',
        category: 'shopping',
        shortDesc: 'Vibrant grand boulevard of Prague, center of modern cultural life, shopping, and history.',
        tags: ['boulevard', 'shopping', 'museum', 'nightlife'],
      },
    ],
  },

  // ==========================================
  // AUSTRIA
  // ==========================================
  {
    id: 'vienna-at',
    city: 'Vienna',
    country: 'Austria',
    countryCode: 'AT',
    flag: '🇦🇹',
    aliases: ['Wien'],
    popularPlaces: [
      {
        id: 'vie-schonbrunn',
        name: 'Schönbrunn Palace & Imperial Gardens',
        category: 'history',
        shortDesc: 'Magnificent 1,441-room summer baroque palace of Habsburg monarchs and Empress Sisi.',
        tags: ['habsburg', 'baroque-palace', 'gardens', 'unesco'],
      },
      {
        id: 'vie-st-stephens',
        name: 'St. Stephen’s Cathedral (Stephansdom)',
        category: 'history',
        shortDesc: 'Gothic cathedral towering over the Ringstraße with its distinct colorful tiled roof.',
        tags: ['cathedral', 'gothic', 'tiled-roof', 'landmark'],
      },
      {
        id: 'vie-belvedere',
        name: 'Belvedere Palace & Klimt Collection',
        category: 'museum',
        shortDesc: 'Baroque palace housing Gustav Klimt’s golden masterworks, including The Kiss.',
        tags: ['klimt', 'the-kiss', 'baroque', 'art-gallery'],
      },
      {
        id: 'vie-hofburg',
        name: 'Hofburg Imperial Palace',
        category: 'history',
        shortDesc: 'Winter palace of the Habsburgs home to the Spanish Riding School and imperial apartments.',
        tags: ['imperial', 'spanish-riding-school', 'sisi', 'palace'],
      },
      {
        id: 'vie-coffeehouses',
        name: 'Traditional Viennese Coffeehouses',
        category: 'cafe',
        shortDesc: 'UNESCO intangible heritage tradition serving Sachertorte with melange coffee on marble tables.',
        tags: ['sachertorte', 'coffee-culture', 'unesco', 'tradition'],
      },
      {
        id: 'vie-prater',
        name: 'Prater & Giant Ferris Wheel',
        category: 'other',
        shortDesc: 'Historic amusement park featuring the nostalgic 1897 wooden Giant Ferris Wheel.',
        tags: ['ferris-wheel', 'amusement-park', 'nostalgia', 'viewpoint'],
      },
    ],
  },
  {
    id: 'salzburg-at',
    city: 'Salzburg',
    country: 'Austria',
    countryCode: 'AT',
    flag: '🇦🇹',
    aliases: ['Mozartstadt', 'Salzkammergut'],
    popularPlaces: [
      {
        id: 'szg-hohensalzburg',
        name: 'Hohensalzburg Fortress',
        category: 'history',
        shortDesc: 'Formidable 11th-century cliff-top fortress dominating the skyline of Salzburg.',
        tags: ['fortress', 'castle', 'funicular', 'panoramic'],
      },
      {
        id: 'szg-mirabell',
        name: 'Mirabell Palace & Baroque Gardens',
        category: 'nature',
        shortDesc: 'Lush geometric gardens famous from The Sound of Music and the Marble Hall.',
        tags: ['sound-of-music', 'gardens', 'palace', 'pegasus'],
      },
      {
        id: 'szg-mozarts-birthplace',
        name: 'Mozart’s Birthplace (Getreidegasse 9)',
        category: 'museum',
        shortDesc: 'Bright yellow townhouse where Wolfgang Amadeus Mozart was born in 1756.',
        tags: ['mozart', 'classical-music', 'birthplace', 'museum'],
      },
      {
        id: 'szg-getreidegasse',
        name: 'Getreidegasse Historic Lane',
        category: 'shopping',
        shortDesc: 'Bustling shopping street famous for ornate wrought-iron guild signs hanging overhead.',
        tags: ['guild-signs', 'wrought-iron', 'shopping', 'old-town'],
      },
      {
        id: 'szg-cathedral',
        name: 'Salzburg Cathedral (Salzburger Dom)',
        category: 'history',
        shortDesc: 'Seventeenth-century Baroque cathedral where Mozart was baptized.',
        tags: ['cathedral', 'baroque', 'domplatz', 'sacred'],
      },
      {
        id: 'szg-hellbrunn',
        name: 'Hellbrunn Palace & Trick Fountains',
        category: 'history',
        shortDesc: 'Playful Renaissance pleasure palace famous for mechanical trick water fountains.',
        tags: ['water-fountains', 'palace', 'playful', 'renaissance'],
      },
    ],
  },

  // ==========================================
  // THAILAND
  // ==========================================
  {
    id: 'bangkok-th',
    city: 'Bangkok',
    country: 'Thailand',
    countryCode: 'TH',
    flag: '🇹🇭',
    aliases: ['Krung Thep', 'Siam'],
    popularPlaces: [
      {
        id: 'bkk-grand-palace',
        name: 'The Grand Palace & Wat Phra Kaew',
        category: 'history',
        shortDesc: 'Dazzling royal compound safeguarding the revered Emerald Buddha.',
        tags: ['royal-palace', 'emerald-buddha', 'gold-spires', 'sacred'],
      },
      {
        id: 'bkk-wat-arun',
        name: 'Wat Arun (Temple of Dawn)',
        category: 'history',
        shortDesc: 'Iconic riverside temple encrusted in colorful porcelain mosaics reflecting on the river.',
        tags: ['temple', 'porcelain', 'chao-phraya', 'sunset'],
      },
      {
        id: 'bkk-wat-pho',
        name: 'Wat Pho (Reclining Buddha)',
        category: 'history',
        shortDesc: 'Historic temple complex housing a 46-meter gold leaf reclining Buddha and Thai massage school.',
        tags: ['reclining-buddha', 'thai-massage', 'gold-leaf', 'temple'],
      },
      {
        id: 'bkk-chatuchak',
        name: 'Chatuchak Weekend Market',
        category: 'shopping',
        shortDesc: 'Sprawling bazaar with over 15,000 stalls selling crafts, clothing, street food, and antiques.',
        tags: ['market', 'weekend-market', 'bargains', 'street-shopping'],
      },
      {
        id: 'bkk-chao-phraya',
        name: 'Chao Phraya River Express & Canals',
        category: 'nature',
        shortDesc: 'Scenic riverboat transit navigating bustling waterways and traditional canal stilt houses.',
        tags: ['river', 'longtail-boat', 'canals', 'waterway'],
      },
      {
        id: 'bkk-yaowarat',
        name: 'Yaowarat (Chinatown Street Food)',
        category: 'cafe',
        shortDesc: 'Electrifying neon thoroughfare celebrated worldwide for seafood stir-fries and noodles.',
        tags: ['street-food', 'chinatown', 'noodles', 'night-market'],
      },
    ],
  },
  {
    id: 'phuket-th',
    city: 'Phuket',
    country: 'Thailand',
    countryCode: 'TH',
    flag: '🇹🇭',
    aliases: ['Andaman', 'Patong'],
    popularPlaces: [
      {
        id: 'hkt-big-buddha',
        name: 'Big Buddha Phuket',
        category: 'history',
        shortDesc: 'Towering 45-meter white Burmese marble Buddha statue atop Nakkerd Hill overlooking Chalong Bay.',
        tags: ['buddha', 'marble', 'hilltop', 'panoramic'],
      },
      {
        id: 'hkt-old-town',
        name: 'Old Phuket Town',
        category: 'history',
        shortDesc: 'Historic neighborhood of colorful Sino-Portuguese shophouses, cafes, and street art.',
        tags: ['sino-portuguese', 'shophouses', 'street-art', 'heritage'],
      },
      {
        id: 'hkt-kata-beach',
        name: 'Kata & Kata Noi Beaches',
        category: 'nature',
        shortDesc: 'Pristine golden sand bays fringed by palm trees with excellent swimming and seasonal surfing.',
        tags: ['beach', 'swimming', 'surfing', 'palms'],
      },
      {
        id: 'hkt-phang-nga',
        name: 'Phang Nga Bay & James Bond Island',
        category: 'nature',
        shortDesc: 'Breathtaking emerald bay dotted with sheer vertical limestone karsts rising out of the sea.',
        tags: ['limestone-karsts', 'kayaking', 'james-bond', 'emerald-water'],
      },
      {
        id: 'hkt-wat-chalong',
        name: 'Wat Chalong (Wat Chaithararam)',
        category: 'history',
        shortDesc: 'Phuket’s largest and most revered Buddhist temple monastery decorated with ornate pagodas.',
        tags: ['temple', 'monastery', 'pagoda', 'spiritual'],
      },
      {
        id: 'hkt-promthep-cape',
        name: 'Promthep Cape Sunset',
        category: 'nature',
        shortDesc: 'Phuket’s southernmost rocky promontory famous for dramatic sunset views over the Andaman Sea.',
        tags: ['sunset', 'promontory', 'andaman-sea', 'lighthouse'],
      },
    ],
  },

  // ==========================================
  // UNITED ARAB EMIRATES
  // ==========================================
  {
    id: 'dubai-ae',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    aliases: ['DXB'],
    popularPlaces: [
      {
        id: 'dxb-burj-khalifa',
        name: 'Burj Khalifa & Dubai Fountain',
        category: 'other',
        shortDesc: 'The world’s tallest building soaring 828 meters over choreographed musical fountain waters.',
        tags: ['burj-khalifa', 'tallest-building', 'fountain-show', 'viewpoint'],
      },
      {
        id: 'dxb-dubai-mall',
        name: 'The Dubai Mall',
        category: 'shopping',
        shortDesc: 'One of the world’s largest shopping destinations, featuring an Olympic ice rink and giant aquarium.',
        tags: ['mall', 'aquarium', 'shopping', 'luxury'],
      },
      {
        id: 'dxb-palm-jumeirah',
        name: 'Palm Jumeirah & The Pointe',
        category: 'nature',
        shortDesc: 'Iconic man-made palm-tree-shaped archipelago lined with luxury resorts and beach clubs.',
        tags: ['palm-island', 'coastal', 'atlantis', 'beachfront'],
      },
      {
        id: 'dxb-desert-safari',
        name: 'Arabian Desert Safari',
        category: 'nature',
        shortDesc: 'Thrilling 4x4 dune bashing across golden sand dunes followed by Bedouin camp dinners.',
        tags: ['desert', 'dunes', 'safari', 'bedouin-camp'],
      },
      {
        id: 'dxb-al-fahidi',
        name: 'Al Fahidi Historic District & Dubai Creek',
        category: 'history',
        shortDesc: 'Traditional wind-tower architecture and historic wooden abra boats crossing the creek.',
        tags: ['heritage', 'wind-towers', 'abra-boat', 'creek'],
      },
      {
        id: 'dxb-miracle-garden',
        name: 'Dubai Miracle Garden',
        category: 'nature',
        shortDesc: 'Extravagant floral paradise displaying over 150 million blooming flowers in full sculptural design.',
        tags: ['flowers', 'botanical', 'sculptures', 'world-record'],
      },
    ],
  },

  // ==========================================
  // EGYPT
  // ==========================================
  {
    id: 'cairo-eg',
    city: 'Cairo',
    country: 'Egypt',
    countryCode: 'EG',
    flag: '🇪🇬',
    aliases: ['Al-Qahirah', 'Giza'],
    popularPlaces: [
      {
        id: 'cai-pyramids-giza',
        name: 'Giza Pyramids & Great Sphinx',
        category: 'history',
        shortDesc: 'The only surviving ancient wonder of the world, guarded by the enigmatic Great Sphinx.',
        tags: ['ancient-wonder', 'pyramids', 'sphinx', 'pharaohs', 'unesco'],
      },
      {
        id: 'cai-gem',
        name: 'Grand Egyptian Museum (GEM)',
        category: 'museum',
        shortDesc: 'Colossal museum near the pyramids dedicated to preserving the complete Tutankhamun collection.',
        tags: ['tutankhamun', 'egyptology', 'museum', 'antiquities'],
      },
      {
        id: 'cai-khan-el-khalili',
        name: 'Khan el-Khalili Bazaar',
        category: 'shopping',
        shortDesc: 'Historic 14th-century medieval open-air souk filled with brass lamps, spices, and copperware.',
        tags: ['souk', 'bazaar', 'spices', 'lamps', 'historic'],
      },
      {
        id: 'cai-citadel',
        name: 'Citadel of Saladin & Mosque of Muhammad Ali',
        category: 'history',
        shortDesc: 'Medieval Islamic fortress on the Mokattam hills with the striking alabaster mosque domes.',
        tags: ['citadel', 'alabaster-mosque', 'saladin', 'viewpoint'],
      },
      {
        id: 'cai-coptic-cairo',
        name: 'Coptic Cairo & Hanging Church',
        category: 'history',
        shortDesc: 'Ancient Christian enclave within Old Roman Babylon fortress walls, featuring the Hanging Church.',
        tags: ['coptic', 'hanging-church', 'babylon-fortress', 'sacred'],
      },
      {
        id: 'cai-nile-felucca',
        name: 'Nile River Felucca Sail',
        category: 'nature',
        shortDesc: 'Serene sunset sailing along the legendary Nile River on traditional wooden canvas boats.',
        tags: ['nile', 'felucca', 'sailing', 'sunset', 'river'],
      },
    ],
  },
];

// ==========================================
// LOOKUP & SEARCH HELPER UTILITIES
// ==========================================

/**
 * Normalizes input text for resilient fuzzy matching:
 * - Trims whitespace
 * - Converts Turkish characters (İ, ı, ş, ğ, ü, ö, ç)
 * - Removes diacritics / accents (é, ñ, etc.)
 * - Converts to lowercase
 *
 * @param {string} str
 * @returns {string}
 */
const normalizeText = (str) => {
  if (!str) return '';
  return str
    .toString()
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Returns all curated destinations.
 *
 * @returns {Array<object>}
 */
const getAllDestinations = () => DESTINATIONS;

/**
 * Retrieves a destination object by its exact or case-insensitive city id.
 *
 * @param {string} cityId - e.g. 'istanbul-tr', 'paris-fr'
 * @returns {object|null} Destination object or null if not found
 */
const getCityById = (cityId) => {
  if (!cityId || typeof cityId !== 'string') return null;
  const target = cityId.trim().toLowerCase();
  return DESTINATIONS.find((dest) => dest.id.toLowerCase() === target) || null;
};

/**
 * Searches destinations matching query against:
 * 1. City display name
 * 2. Country name or 2-letter ISO code
 * 3. Known aliases (e.g. Kapadokya, Roma, Barna, NYC)
 * 4. Place names or tags (as secondary relevance)
 *
 * Results are scored and ranked for best relevance.
 *
 * @param {string} query - Search term
 * @param {number} [maxResults=10] - Maximum items to return
 * @returns {Array<object>} Array of matching city objects
 */
const searchDestinations = (query, maxResults = 10) => {
  const normQuery = normalizeText(query);
  if (!normQuery) return [];

  const scored = [];

  for (const dest of DESTINATIONS) {
    const normCity = normalizeText(dest.city);
    const normCountry = normalizeText(dest.country);
    const normCode = normalizeText(dest.countryCode);
    const normId = normalizeText(dest.id);

    let score = 0;

    // Exact city match
    if (normCity === normQuery) {
      score += 100;
    } else if (normCity.startsWith(normQuery)) {
      score += 75;
    } else if (normCity.includes(normQuery)) {
      score += 50;
    }

    // Exact country code match (e.g. "TR", "IT", "FR")
    if (normCode === normQuery) {
      score += 60;
    }

    // Country name match
    if (normCountry === normQuery) {
      score += 45;
    } else if (normCountry.startsWith(normQuery)) {
      score += 35;
    } else if (normCountry.includes(normQuery)) {
      score += 25;
    }

    // ID match (e.g. "istanbul-tr")
    if (normId === normQuery || normId.startsWith(normQuery)) {
      score += 40;
    }

    // Aliases check
    if (Array.isArray(dest.aliases)) {
      for (const alias of dest.aliases) {
        const normAlias = normalizeText(alias);
        if (normAlias === normQuery) {
          score += 80;
          break;
        } else if (normAlias.startsWith(normQuery)) {
          score += 50;
          break;
        } else if (normAlias.includes(normQuery)) {
          score += 30;
          break;
        }
      }
    }

    // Popular places / tags match (gives a minor relevance bump if user searches a landmark like "Colosseum")
    if (Array.isArray(dest.popularPlaces)) {
      for (const place of dest.popularPlaces) {
        const normPlace = normalizeText(place.name);
        if (normPlace.includes(normQuery)) {
          score += 20;
          break;
        }
        if (Array.isArray(place.tags)) {
          if (place.tags.some((t) => normalizeText(t) === normQuery)) {
            score += 15;
            break;
          }
        }
      }
    }

    if (score > 0) {
      scored.push({ dest, score });
    }
  }

  // Sort descending by relevance score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, maxResults).map((item) => item.dest);
};

/**
 * Looks for the best matching city object by name, id, or free-form city string in a trip.
 * Handles strings like "Istanbul, Turkey", "Paris", "Kapadokya", or "rome-it".
 *
 * @param {string} cityQuery - Free-form string or city name
 * @returns {object|null} Best matching city destination object or null
 */
const findCityByQuery = (cityQuery) => {
  if (!cityQuery || typeof cityQuery !== 'string') return null;

  const trimmed = cityQuery.trim();
  if (!trimmed) return null;

  // 1. Direct ID match
  const directId = getCityById(trimmed);
  if (directId) return directId;

  // 2. Exact city name or alias match
  const normQuery = normalizeText(trimmed);

  for (const dest of DESTINATIONS) {
    if (normalizeText(dest.city) === normQuery) {
      return dest;
    }
    if (Array.isArray(dest.aliases)) {
      for (const alias of dest.aliases) {
        if (normalizeText(alias) === normQuery) {
          return dest;
        }
      }
    }
  }

  // 3. Composite string split (e.g. "Rome, Italy" or "Istanbul / Turkey" or "Paris (France)")
  const parts = trimmed
    .split(/[,/\\()\-]/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length > 1) {
    for (const part of parts) {
      const normPart = normalizeText(part);
      if (!normPart || normPart.length < 2) continue;

      for (const dest of DESTINATIONS) {
        if (normalizeText(dest.city) === normPart) {
          return dest;
        }
        if (Array.isArray(dest.aliases)) {
          for (const alias of dest.aliases) {
            if (normalizeText(alias) === normPart) {
              return dest;
            }
          }
        }
      }
    }
  }

  // 4. Substring search check
  const searchResults = searchDestinations(trimmed, 1);
  if (searchResults.length > 0) {
    return searchResults[0];
  }

  return null;
};

// Export both CommonJS and ES module compatible format
const destinationsExport = {
  DESTINATIONS,
  getAllDestinations,
  getCityById,
  searchDestinations,
  findCityByQuery,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = destinationsExport;
  module.exports.default = destinationsExport;
}
