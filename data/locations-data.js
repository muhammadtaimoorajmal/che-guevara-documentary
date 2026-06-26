// ============================================================
// LOCATIONS DATA — CHE GUEVARA: PATRIA O MUERTE
// Map coordinates are in [x%, y%] relative to our SVG map viewport
// ============================================================
const locations = [
  {
    id: "rosario",
    name: "Rosario, Argentina",
    country: "Argentina",
    coordinates: { lat: -32.9589, lng: -60.6931 },
    // Map canvas position (0-100% of map area)
    mapPos: { x: 31.5, y: 73.5 },
    year: "1928",
    event: "Birth of Ernesto Guevara",
    description: "Birthplace of Ernesto 'Che' Guevara, June 14, 1928.",
    type: "birth",
    color: "#cc0000",
    order: 1
  },
  {
    id: "buenos-aires",
    name: "Buenos Aires, Argentina",
    country: "Argentina",
    coordinates: { lat: -34.6037, lng: -58.3816 },
    mapPos: { x: 32.0, y: 74.5 },
    year: "1947–1951",
    event: "Medical School",
    description: "Studied medicine at the University of Buenos Aires.",
    type: "education",
    color: "#d4a017",
    order: 2
  },
  {
    id: "machu-picchu",
    name: "Machu Picchu, Peru",
    country: "Peru",
    coordinates: { lat: -13.1631, lng: -72.5450 },
    mapPos: { x: 27.5, y: 67.5 },
    year: "1952",
    event: "Motorcycle Diaries Journey",
    description: "A spiritual turning point in the motorcycle journey across South America.",
    type: "travel",
    color: "#d4a017",
    order: 3
  },
  {
    id: "san-pablo",
    name: "San Pablo Leper Colony, Peru",
    country: "Peru",
    coordinates: { lat: -5.1000, lng: -72.8000 },
    mapPos: { x: 26.5, y: 62.5 },
    year: "1952",
    event: "Motorcycle Diaries — San Pablo",
    description: "Che swam across the Amazon to celebrate with leper colony patients.",
    type: "travel",
    color: "#d4a017",
    order: 4
  },
  {
    id: "guatemala",
    name: "Guatemala City, Guatemala",
    country: "Guatemala",
    coordinates: { lat: 14.6349, lng: -90.5069 },
    mapPos: { x: 19.5, y: 55.0 },
    year: "1953–1954",
    event: "Political Awakening",
    description: "Witnessed CIA coup against Árbenz. Radicalization complete.",
    type: "political",
    color: "#3a86ff",
    order: 5
  },
  {
    id: "mexico-city",
    name: "Mexico City, Mexico",
    country: "Mexico",
    coordinates: { lat: 19.4326, lng: -99.1332 },
    mapPos: { x: 17.0, y: 51.0 },
    year: "1954–1956",
    event: "Meeting Fidel Castro",
    description: "Historic meeting with Fidel Castro. Joined the 26th of July Movement.",
    type: "revolution",
    color: "#cc0000",
    order: 6
  },
  {
    id: "tuxpan",
    name: "Tuxpan, Mexico",
    country: "Mexico",
    coordinates: { lat: 20.9575, lng: -97.4053 },
    mapPos: { x: 17.5, y: 50.0 },
    year: "1956",
    event: "Granma Departure",
    description: "Point of departure for the Granma expedition to Cuba.",
    type: "revolution",
    color: "#cc0000",
    order: 7
  },
  {
    id: "cuba",
    name: "Cuba",
    country: "Cuba",
    coordinates: { lat: 21.5218, lng: -79.3422 },
    mapPos: { x: 22.5, y: 49.5 },
    year: "1956–1965",
    event: "Cuban Revolution & Government",
    description: "Landing on the Granma, Sierra Maestra, Havana, government roles — nine transformative years.",
    type: "revolution",
    color: "#cc0000",
    order: 8
  },
  {
    id: "santa-clara",
    name: "Santa Clara, Cuba",
    country: "Cuba",
    coordinates: { lat: 22.4061, lng: -79.9642 },
    mapPos: { x: 22.0, y: 49.8 },
    year: "1958 / 1997",
    event: "Battle of Santa Clara / Eternal Resting Place",
    description: "Decisive battle that broke Batista's regime. Che is buried here in the Mausoleum.",
    type: "memorial",
    color: "#cc0000",
    order: 9
  },
  {
    id: "new-york",
    name: "New York, USA",
    country: "United States",
    coordinates: { lat: 40.7489, lng: -73.9680 },
    mapPos: { x: 24.5, y: 40.5 },
    year: "1964",
    event: "United Nations Address",
    description: "December 11, 1964 — electrifying speech to the UN General Assembly.",
    type: "speech",
    color: "#3a86ff",
    order: 10
  },
  {
    id: "algiers",
    name: "Algiers, Algeria",
    country: "Algeria",
    coordinates: { lat: 36.7372, lng: 3.0865 },
    mapPos: { x: 47.5, y: 42.5 },
    year: "1964",
    event: "Afro-Asian Solidarity Conference",
    description: "Speech condemning socialist countries for perpetuating unequal trade with developing nations.",
    type: "speech",
    color: "#3a86ff",
    order: 11
  },
  {
    id: "congo",
    name: "Congo (DRC)",
    country: "Democratic Republic of Congo",
    coordinates: { lat: -4.0383, lng: 21.7587 },
    mapPos: { x: 52.5, y: 60.0 },
    year: "1965",
    event: "Congo Campaign",
    description: "Seven-month guerrilla campaign in support of Simba rebels. A painful learning experience.",
    type: "military",
    color: "#d4a017",
    order: 12
  },
  {
    id: "bolivia",
    name: "Ñancahuazú, Bolivia",
    country: "Bolivia",
    coordinates: { lat: -18.6700, lng: -63.9000 },
    mapPos: { x: 29.5, y: 69.5 },
    year: "1966–1967",
    event: "Bolivia Campaign",
    description: "Final revolutionary campaign. Eleven months of brutal guerrilla warfare.",
    type: "military",
    color: "#d4a017",
    order: 13
  },
  {
    id: "la-higuera",
    name: "La Higuera, Bolivia",
    country: "Bolivia",
    coordinates: { lat: -18.8333, lng: -63.9833 },
    mapPos: { x: 29.6, y: 70.0 },
    year: "1967",
    event: "Capture & Martyrdom",
    description: "October 9, 1967 — captured and executed. Last words: 'Shoot, coward!'",
    type: "death",
    color: "#cc0000",
    order: 14
  }
];

// Path segments for animated journey (pairs of location IDs)
const journeyPath = [
  ["rosario", "buenos-aires"],
  ["buenos-aires", "machu-picchu"],
  ["machu-picchu", "san-pablo"],
  ["san-pablo", "guatemala"],
  ["guatemala", "mexico-city"],
  ["mexico-city", "tuxpan"],
  ["tuxpan", "cuba"],
  ["cuba", "santa-clara"],
  ["santa-clara", "new-york"],
  ["new-york", "algiers"],
  ["algiers", "congo"],
  ["congo", "cuba"],
  ["cuba", "bolivia"],
  ["bolivia", "la-higuera"],
  ["la-higuera", "santa-clara"]
];
