export const gradingSystems = [
  {
    title: "Australian",
    grades: ["7", "8", "9/10", "11", "12", "13", "14/15", "15/16", "17", "18", "19", "20", "20/21", "21", "22", "22/23", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39"],
  },
  {
    title: "British",
    grades: ["M 1", "D 2", "VD 3A", "VD 3B/HVD 3B", "HVD 3C/S 3C", "MS 4A", "S 4B/HS 4B", "HS 4B/VS 4B", "HVS 4C", "HVS 5A", "E1 5A", "E1 5B", "E2 5B", "E2 5C", "E3 5C", "E3 6A", "E4 6A", "E4 6B", "E5 6B", "E5 6B/E6 6B", "E6 6B", "E6 6C", "E7 6C", "E7 7A", "E8 7A", "E8 7B", "E9 7B", "E10 7B", "E10 7C", "E11 7C", "E11 8A", "E11 8B", "E11 8C"]
  },
  {
    title: "Font",
    grades: ["1", "1", "1", "1", "1", "1+", "2", "2+", "3", "3+", "4", "4+", "5", "5+", "6A", "6A+", "6B", "6B+", "6C", "6C+", "7A", "7A+", "7B", "7B+", "7C", "7C+", "8A", "8A+", "8B", "8B+", "8C", "8C+", "9A"]
  },
  {
    title: "French",
    grades: ["2", "2+", "3", "3+", "4", "4+", "5a", "5b", "5c", "6a", "6a+", "6b", "6b+", "6c", "6c/6c+", "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+", "8a", "8a+", "8b", "8b+", "8c", "8c+", "9a", "9a+", "9b", "9b+", "9c"],
  },
  {
    title: "Hueco",
    grades: ["VB", "VB", "VB", "VB", "VB", "VB", "VB", "VB", "VB", "VB", "V0", "V0+", "V1", "V2", "V2", "V3", "V4", "V4", "V5", "V5", "V6", "V7", "V8", "V8", "V9", "V10", "V11", "V12", "V13", "V14", "V15", "V16", "V17"]
  },
  {
    title: "Kurtyka",
    grades: ["II", 'II+', 'III+', 'IV', 'IV+', 'V-', 'V', 'V+', 'VI', 'VI+', 'VI.1', 'VI.1+', 'VI.2', 'VI.2', 'VI.2+', 'VI.3', 'VI.3', 'VI.3+', 'VI.4', 'VI.4', 'VI.4+', 'VI.5', 'VI.5+', 'VI.5+/VI.6', 'VI.6', 'VI.6+', 'VI.7', 'VI.7+', 'VI.8', 'VI.8', 'VI.8', 'VI.8', 'VI.8', 'VI.8'],
  },
  {
    title: "South African",
    grades: ["8", "9", "10/11", "12", "13", "14", "15", "16", "17/18", "19", "20", "21", "22", "22/23", "23/24", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41"],
  },
  {
    title: "UIAA",
    grades: ["III-", "III", "III+", "IV-", "IV", "IV+/V-", "V-/V", "V+/VI-", "VI-/VI", "VI/VI+", "VII-", "VII-/VII", "VII/VII+", "VII+", "VIII-", "VIII", "VIII/VIII+", "VIII+", "IX-", "IX-/IX", "IX/IX+", "IX+", "X-", "X-/X", "X/X+", "X+", "XI-", "XI", "XI+", "XI+/XII-", "XII-/XII", "XII", "XII+"],
  },
  {
    title: "Yosemite Decimal Scale",
    grades: ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "5.10a", "5.10b", "5.10c", "5.10d", "5.11a", "5.11b", "5.11c", "5.11d", "5.12a", "5.12b", "5.12c", "5.12d", "5.13a", "5.13b", "5.13c", "5.13d", "5.14a", "5.14b", "5.14c", "5.14d", "5.15a", "5.15b", "5.15c", "5.15d"],
  },
];

export const cragTags = [
  "Quick Drying",
  "Slow Drying",
  "Quick Walk-in",
  "Long Walk-in",
  "Esoteric",
  "Family Friendly",
  "Good Landings",
  "Highballs",
  "Lowballs",
  "Public Transport"
];

export const areaTags = [
  "Quick Drying",
  "Slow Drying",
  "Easy Access",
  "Hard to Find",
  "Highballs",
  "Lowballs",
  "Needs a Brush",
  "Bad Landings",
  "Good Landings"
];

export const routeTags = [
  "Crimps",
  "Slopers",
  "Pockets",
  "Jugs",
  "Gaston",
  "Undercuts",
  "Highball",
  "Lowball",
  "Slab",
  "Overhanging",
  "Vert"
];

export const routeTypes = ["Sport", "Trad", "Boulder"];

export const rockTypes = [
  "Gritstone",
  "Limestone",
  "Plastic",
  "Sandstone",
  "Wood",
];

export const routeTypeDefaultGradingSystem = {
  "Sport": "French",
  "Trad": "British",
  "Boulder": "Font"
}
