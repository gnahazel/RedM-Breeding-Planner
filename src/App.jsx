import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEYS = {
  horses: "redm-breeding-planner-horses",
  pairings: "redm-breeding-planner-pairings",
  language: "redm-breeding-planner-language",
};

const translations = {
  de: {
    appLabel: "RedM Stable Tool",
    appTitle: "Breeding Planner",
    appSubtitle:
      "Pferde verwalten, Zuchttiere auswählen, Abstammungen vergleichen und riskante Verwandtschaften erkennen.",
    switchLanguage: "English",
    resetDemo: "Demo zurücksetzen",
    resetDemoConfirm:
      "Demo-Daten wirklich zurücksetzen? Deine aktuell gespeicherten Pferde und Pairings werden dadurch gelöscht.",

    backupTitle: "Daten sichern & laden",
    backupDescription:
      "Exportiere Pferde und gespeicherte Pairings als CSV-Backup oder lade ein Backup wieder hoch.",
    exportCsv: "CSV exportieren",
    importCsv: "CSV importieren",
    backupTip:
      "Tipp: Vor größeren Änderungen einmal exportieren. Beim Import werden die aktuellen Browser-Daten ersetzt.",
    emptyCsvError: "Die CSV-Datei enthält keine importierbaren Daten.",
    invalidCsvError: (columns) =>
      `Die CSV-Datei passt nicht zum Breeding Planner. Fehlende Spalten: ${columns}`,
    importConfirm: (horseCount, pairingCount) =>
      `CSV importieren?\n\nDadurch werden deine aktuellen Daten ersetzt.\n\nImport gefunden:\n- ${horseCount} Pferde\n- ${pairingCount} Pairing(s)`,
    importSuccess: "Import erfolgreich. Deine Daten wurden ersetzt.",
    importReadError: "Die Datei konnte nicht gelesen werden.",
    importGenericError: "Die CSV-Datei konnte nicht importiert werden.",

    plannerTitle: "Breeding Planner",
    plannerDescription:
      "Wähle verfügbare Zuchtpferde aus und prüfe automatisch die Abstammung.",
    selectStallion: "Hengst auswählen",
    selectMare: "Stute auswählen",
    selectStallionPlaceholder: "Bitte Hengst wählen",
    selectMarePlaceholder: "Bitte Stute wählen",
    stallionPedigree: "Hengst-Abstammung",
    marePedigree: "Stuten-Abstammung",
    pairingNote: "Notiz zum Pairing",
    pairingNotePlaceholder: "z. B. Ziel: Farbe, Linie, RP-Story, Temperament ...",
    savePairing: "Pairing speichern",

    relationshipNone: "Keine Verwandtschaft gefunden",
    relationshipNoneMessage:
      "Im geprüften Pedigree wurden keine gemeinsamen Vorfahren gefunden.",
    relationshipVeryClose: "Sehr nahe Verwandtschaft",
    relationshipVeryCloseMessage:
      "Gemeinsame Elternteile wurden gefunden. Diese Paarung ist nicht empfohlen.",
    relationshipClose: "Nahe Verwandtschaft",
    relationshipCloseMessage: "Gemeinsame Vorfahren liegen sehr nah im Pedigree.",
    relationshipDistant: "Entfernte Verwandtschaft",
    relationshipDistantMessage:
      "Es gibt gemeinsame Vorfahren, aber weiter hinten im Pedigree.",
    relationshipVeryDistant: "Sehr entfernte Verwandtschaft",
    relationshipVeryDistantMessage:
      "Es gibt gemeinsame Vorfahren in späteren Generationen.",
    sharedAncestorsOf: (stallion, mare) =>
      `Gemeinsame Vorfahren von ${stallion} und ${mare}:`,
    stallionGeneration: "beim Hengst",
    mareGeneration: "bei der Stute",
    generation: "Generation",
    warning: "Warnung",
    understood: "Verstanden",

    filterBreed: "Rasse filtern",
    allBreeds: "Alle Rassen",
    filterBaseColor: "Base Color",
    filterModifier1: "Modifier 1",
    filterModifier2: "Modifier 2",
    filterPattern: "Pattern",
    allOptions: "Alle",
    resetFilters: "Filter zurücksetzen",
    resetSelection: "Auswahl zurücksetzen",
    noMatchingHorse: "Kein passendes Pferd gefunden.",

    horseDatabase: "Pferdedatenbank",
    horseDatabaseDescription:
      "Aufklappen, um Hengste, Stuten und weitere Pferde zu verwalten.",
    open: "öffnen",
    close: "schließen",
    horsesCount: (count) => `${count} Pferde`,
    stallions: "Hengste",
    stallionsDescription: "Alle männlichen Zucht- und Archivpferde.",
    mares: "Stuten",
    maresDescription: "Alle weiblichen Zucht- und Archivpferde.",
    others: "Wallache / Sonstige",
    othersDescription: "Pferde, die nicht als Hengst oder Stute geführt werden.",
    breedingHorses: "Zuchtpferde",
    breedingHorsesDescription: "Pferde, die aktuell zur Zucht verfügbar sind.",
    archiveHorses: "Archivpferde",
    archiveHorsesDescription:
      "Pferde, die nicht zur Zucht verfügbar sind oder nur für die Abstammung gespeichert werden.",
    noHorsesInCategory: "In dieser Kategorie ist noch kein Pferd eingetragen.",
    noHorsesHere: "Hier ist noch kein Pferd eingetragen.",

    addHorse: "Pferd hinzufügen",
    editHorse: "Pferd bearbeiten",
    addHorseDescription:
      "Lege Pferde mit Eltern, Geschlecht und Zuchtverfügbarkeit an.",
    editHorseDescription:
      "Ändere die Daten und speichere sie direkt in deiner Pferdedatenbank.",
    cancel: "Abbrechen",
    name: "Name",
    namePlaceholder: "z. B. Moonshine Belle",
    sex: "Geschlecht",
    breed: "Rasse",
    breedPlaceholder: "z. B. Turkoman",
    color: "Farbe",
    colorPlaceholder: "z. B. Buckskin",
    genes: "Gene",
    genesPlaceholder: "z. B. BL-G-D",
    geneModifiersHelp: "Maximal zwei Modifier werden als Modifier 1 und Modifier 2 gespeichert.",
    savedGeneCode: "Gespeicherter Gen-Code",
    sire: "Vater",
    dam: "Mutter",
    unknown: "Unbekannt",
    unknownLower: "unbekannt",
    owner: "Besitzer:in",
    ownerPlaceholder: "z. B. Kira",
    ownershipStatus: "Besitzstatus",
    ownershipOwned: "In Besitz",
    ownershipNotOwned: "Nicht mehr in Besitz",
    notOwnedHorses: "Nicht mehr in Besitz",
    notOwnedHorsesDescription: "Pferde, die nicht mehr in deinem Besitz sind.",
    notes: "Notizen",
    notesPlaceholder: "z. B. RP-Linie, besondere Merkmale, Zuchtziel ...",
    availableForBreeding: "Zur Zucht verfügbar",
    availableBadge: "Zucht verfügbar",
    unavailableBadge: "nicht verfügbar",
    saveHorse: "Pferd speichern",
    saveChanges: "Änderungen speichern",
    edit: "Bearbeiten",
    delete: "Löschen",
    breedUnknown: "Rasse unbekannt",
    colorUnknown: "Farbe unbekannt",
    genesUnknown: "Gene unbekannt",
    ownerUnknown: "unbekannt",
    parentInfo: (sire, dam) => `Vater: ${sire} · Mutter: ${dam}`,
    deleteHorseConfirm: (name, childrenCount, pairingsCount) => {
      const lines = [`Möchtest du "${name}" wirklich löschen?`];
      if (childrenCount > 0) {
        lines.push(
          `Das Pferd ist bei ${childrenCount} Pferd(en) als Elternteil eingetragen. Diese Eltern-Verknüpfung wird entfernt.`
        );
      }
      if (pairingsCount > 0) {
        lines.push(`${pairingsCount} gespeicherte Pairing(s) mit diesem Pferd werden gelöscht.`);
      }
      return lines.join("\n\n");
    },

    pairingsTitle: "Gespeicherte Pairings",
    pairingsEmpty: "Noch keine Zuchtplanung gespeichert.",
    pairingsDescription:
      "Aus gespeicherten Pairings kannst du direkt ein Fohlen vorbereiten.",
    createFoal: "Fohlen vorbereiten",
    pairingSharedWarning:
      "⚠️ Dieses Pairing hat gemeinsame Vorfahren im gespeicherten Check.",
    plannedOn: "geplant am",
    foalFrom: (stallion, mare) => `Fohlen von ${stallion} × ${mare}`,
    autoFoalNote: (stallion, mare) =>
      `Automatisch aus Pairing erstellt: ${stallion} × ${mare}`,

    pedigreeViewerTitle: "Stammbaum anzeigen",
    pedigreeViewerDescription:
      "Wähle ein Pferd aus und öffne eine visuelle Stammbaum-Ansicht.",
    selectHorse: "Pferd auswählen",
    selectHorsePlaceholder: "Bitte Pferd wählen",
    showPedigree: "Stammbaum anzeigen",
    hidePedigree: "Stammbaum ausblenden",
    pedigreeHint:
      "Tipp: Du kannst im Stammbaum horizontal scrollen, wenn mehr Generationen angezeigt werden.",
    noPedigreeSelected: "Wähle ein Pferd aus, um den Stammbaum zu sehen.",
    noHorseSelectedYet: "Noch kein Pferd ausgewählt.",
    rootHorse: "Ausgewähltes Pferd",

    sexLabels: {
      stallion: "Hengst",
      mare: "Stute",
      gelding: "Wallach",
    },
    statusLabels: {
      planned: "geplant",
      covered: "gedeckt",
      pregnant: "trächtig",
      born: "Fohlen geboren",
      cancelled: "abgebrochen",
    },
  },
  en: {
    appLabel: "RedM Stable Tool",
    appTitle: "Breeding Planner",
    appSubtitle:
      "Manage horses, select breeding animals, compare pedigrees, and detect risky relationships.",
    switchLanguage: "Deutsch",
    resetDemo: "Reset demo",
    resetDemoConfirm:
      "Reset demo data? Your currently saved horses and pairings will be deleted.",

    backupTitle: "Save & Load Data",
    backupDescription:
      "Export horses and saved pairings as a CSV backup or upload a backup again.",
    exportCsv: "Export CSV",
    importCsv: "Import CSV",
    backupTip:
      "Tip: Export before making bigger changes. Importing replaces the current browser data.",
    emptyCsvError: "The CSV file does not contain importable data.",
    invalidCsvError: (columns) =>
      `The CSV file does not match the Breeding Planner. Missing columns: ${columns}`,
    importConfirm: (horseCount, pairingCount) =>
      `Import CSV?\n\nThis will replace your current data.\n\nImport found:\n- ${horseCount} horses\n- ${pairingCount} pairing(s)`,
    importSuccess: "Import successful. Your data has been replaced.",
    importReadError: "The file could not be read.",
    importGenericError: "The CSV file could not be imported.",

    plannerTitle: "Breeding Planner",
    plannerDescription:
      "Select available breeding horses and automatically check their pedigree.",
    selectStallion: "Select stallion",
    selectMare: "Select mare",
    selectStallionPlaceholder: "Please select a stallion",
    selectMarePlaceholder: "Please select a mare",
    stallionPedigree: "Stallion pedigree",
    marePedigree: "Mare pedigree",
    pairingNote: "Pairing note",
    pairingNotePlaceholder: "e.g. goal: color, line, RP story, temperament ...",
    savePairing: "Save pairing",

    relationshipNone: "No relationship found",
    relationshipNoneMessage:
      "No shared ancestors were found in the checked pedigree.",
    relationshipVeryClose: "Very close relationship",
    relationshipVeryCloseMessage:
      "Shared parents were found. This pairing is not recommended.",
    relationshipClose: "Close relationship",
    relationshipCloseMessage: "Shared ancestors are very close in the pedigree.",
    relationshipDistant: "Distant relationship",
    relationshipDistantMessage:
      "There are shared ancestors, but further back in the pedigree.",
    relationshipVeryDistant: "Very distant relationship",
    relationshipVeryDistantMessage:
      "There are shared ancestors in later generations.",
    sharedAncestorsOf: (stallion, mare) =>
      `Shared ancestors of ${stallion} and ${mare}:`,
    stallionGeneration: "stallion side",
    mareGeneration: "mare side",
    generation: "generation",
    warning: "Warning",
    understood: "Understood",

    filterBreed: "Filter breed",
    allBreeds: "All breeds",
    filterBaseColor: "Base Color",
    filterModifier1: "Modifier 1",
    filterModifier2: "Modifier 2",
    filterPattern: "Pattern",
    allOptions: "All",
    resetFilters: "Reset filters",
    resetSelection: "Reset selection",
    noMatchingHorse: "No matching horse found.",

    horseDatabase: "Horse Database",
    horseDatabaseDescription:
      "Open this section to manage stallions, mares, and other horses.",
    open: "open",
    close: "close",
    horsesCount: (count) => `${count} horses`,
    stallions: "Stallions",
    stallionsDescription: "All male breeding and archive horses.",
    mares: "Mares",
    maresDescription: "All female breeding and archive horses.",
    others: "Geldings / Other",
    othersDescription: "Horses not listed as stallions or mares.",
    breedingHorses: "Breeding horses",
    breedingHorsesDescription: "Horses currently available for breeding.",
    archiveHorses: "Archive horses",
    archiveHorsesDescription:
      "Horses that are not available for breeding or are saved only for pedigree records.",
    noHorsesInCategory: "No horse has been added to this category yet.",
    noHorsesHere: "No horse has been added here yet.",

    addHorse: "Add horse",
    editHorse: "Edit horse",
    addHorseDescription:
      "Add horses with parents, sex, and breeding availability.",
    editHorseDescription: "Change the data and save it directly to your horse database.",
    cancel: "Cancel",
    name: "Name",
    namePlaceholder: "e.g. Moonshine Belle",
    sex: "Sex",
    breed: "Breed",
    breedPlaceholder: "e.g. Turkoman",
    color: "Color",
    colorPlaceholder: "e.g. Buckskin",
    genes: "Genes",
    genesPlaceholder: "e.g. BL-G-D",
    geneModifiersHelp: "A maximum of two modifiers are saved as Modifier 1 and Modifier 2.",
    savedGeneCode: "Saved gene code",
    sire: "Sire",
    dam: "Dam",
    unknown: "Unknown",
    unknownLower: "unknown",
    owner: "Owner",
    ownerPlaceholder: "e.g. Kira",
    ownershipStatus: "Ownership status",
    ownershipOwned: "Owned",
    ownershipNotOwned: "No longer owned",
    notOwnedHorses: "No longer owned",
    notOwnedHorsesDescription: "Horses that are no longer in your ownership.",
    notes: "Notes",
    notesPlaceholder: "e.g. RP line, special traits, breeding goal ...",
    availableForBreeding: "Available for breeding",
    availableBadge: "Breeding available",
    unavailableBadge: "not available",
    saveHorse: "Save horse",
    saveChanges: "Save changes",
    edit: "Edit",
    delete: "Delete",
    breedUnknown: "Unknown breed",
    colorUnknown: "Unknown color",
    genesUnknown: "Unknown genes",
    ownerUnknown: "unknown",
    parentInfo: (sire, dam) => `Sire: ${sire} · Dam: ${dam}`,
    deleteHorseConfirm: (name, childrenCount, pairingsCount) => {
      const lines = [`Do you really want to delete "${name}"?`];
      if (childrenCount > 0) {
        lines.push(
          `This horse is listed as a parent for ${childrenCount} horse(s). That parent link will be removed.`
        );
      }
      if (pairingsCount > 0) {
        lines.push(`${pairingsCount} saved pairing(s) with this horse will be deleted.`);
      }
      return lines.join("\n\n");
    },

    pairingsTitle: "Saved Pairings",
    pairingsEmpty: "No breeding plan has been saved yet.",
    pairingsDescription:
      "You can prepare a foal directly from saved pairings.",
    createFoal: "Prepare foal",
    pairingSharedWarning:
      "⚠️ This pairing has shared ancestors in the saved check.",
    plannedOn: "planned on",
    foalFrom: (stallion, mare) => `Foal by ${stallion} × ${mare}`,
    autoFoalNote: (stallion, mare) =>
      `Automatically created from pairing: ${stallion} × ${mare}`,

    pedigreeViewerTitle: "Pedigree Viewer",
    pedigreeViewerDescription:
      "Select a horse and open a visual pedigree view.",
    selectHorse: "Select horse",
    selectHorsePlaceholder: "Please select a horse",
    showPedigree: "Show pedigree",
    hidePedigree: "Hide pedigree",
    pedigreeHint:
      "Tip: You can scroll horizontally inside the pedigree if more generations are shown.",
    noPedigreeSelected: "Select a horse to view its pedigree.",
    noHorseSelectedYet: "No horse selected yet.",
    rootHorse: "Selected horse",

    sexLabels: {
      stallion: "Stallion",
      mare: "Mare",
      gelding: "Gelding",
    },
    statusLabels: {
      planned: "planned",
      covered: "covered",
      pregnant: "pregnant",
      born: "foal born",
      cancelled: "cancelled",
    },
  },
};

const demoHorses = [
  {
    id: "h_001",
    name: "Silver King",
    sex: "stallion",
    breed: "Missouri Fox Trotter",
    color: "Silver Dapple Pinto",
    genes: "BL-G-D",
    geneBaseColor: "BL",
    geneModifier1: "G",
    geneModifier2: "",
    genePattern: "D",
    sireId: "h_005",
    damId: "h_006",
    availableForBreeding: true,
    ownershipStatus: "owned",
    owner: "TTR Ranch",
    notes: "Ruhige Showlinie",
  },
  {
    id: "h_002",
    name: "Moonshine Belle",
    sex: "mare",
    breed: "Missouri Fox Trotter",
    color: "Palomino",
    genes: "BL-G-CH-RN",
    geneBaseColor: "BL",
    geneModifier1: "G",
    geneModifier2: "CH",
    genePattern: "RN",
    sireId: "h_007",
    damId: "h_008",
    availableForBreeding: true,
    ownershipStatus: "owned",
    owner: "Gina",
    notes: "Gute Mutterlinie",
  },
  {
    id: "h_003",
    name: "Dusty Baron",
    sex: "stallion",
    breed: "Turkoman",
    color: "Dark Bay",
    genes: "R-FLX-CR-O",
    geneBaseColor: "R",
    geneModifier1: "FLX",
    geneModifier2: "CR",
    genePattern: "O",
    sireId: "h_009",
    damId: "h_010",
    availableForBreeding: true,
    ownershipStatus: "owned",
    owner: "Valentine Stable",
    notes: "Kräftige Linie",
  },
  {
    id: "h_004",
    name: "Rose Valley Queen",
    sex: "mare",
    breed: "Turkoman",
    color: "Chestnut",
    genes: "B-P-CH-SB",
    geneBaseColor: "B",
    geneModifier1: "P",
    geneModifier2: "CH",
    genePattern: "SB",
    sireId: "h_005",
    damId: "h_011",
    availableForBreeding: true,
    ownershipStatus: "owned",
    owner: "Emerald Ranch",
    notes: "Teilt Vater mit Silver King — Test für Warnung",
  },
  {
    id: "h_005",
    name: "Old Thunder",
    sex: "stallion",
    breed: "Missouri Fox Trotter",
    color: "Grey",
    genes: "BL",
    geneBaseColor: "BL",
    geneModifier1: "",
    geneModifier2: "",
    genePattern: "",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    ownershipStatus: "owned",
    owner: "Archiv",
    notes: "Foundation Sire",
  },
  {
    id: "h_006",
    name: "Belle Star",
    sex: "mare",
    breed: "Missouri Fox Trotter",
    color: "Black",
    genes: "BL-P-G",
    geneBaseColor: "BL",
    geneModifier1: "P",
    geneModifier2: "G",
    genePattern: "",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    ownershipStatus: "owned",
    owner: "Archiv",
    notes: "Foundation Mare",
  },
  {
    id: "h_007",
    name: "Red Baron",
    sex: "stallion",
    breed: "Missouri Fox Trotter",
    color: "Bay",
    genes: "B",
    geneBaseColor: "B",
    geneModifier1: "",
    geneModifier2: "",
    genePattern: "",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    ownershipStatus: "owned",
    owner: "Archiv",
    notes: "Foundation Sire",
  },
  {
    id: "h_008",
    name: "Lady May",
    sex: "mare",
    breed: "Missouri Fox Trotter",
    color: "Buckskin",
    genes: "R-CR-ZB",
    geneBaseColor: "R",
    geneModifier1: "CR",
    geneModifier2: "",
    genePattern: "ZB",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    ownershipStatus: "owned",
    owner: "Archiv",
    notes: "Foundation Mare",
  },
  {
    id: "h_009",
    name: "Black Jack",
    sex: "stallion",
    breed: "Turkoman",
    color: "Black",
    genes: "BL-CH-D",
    geneBaseColor: "BL",
    geneModifier1: "CH",
    geneModifier2: "",
    genePattern: "D",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    ownershipStatus: "owned",
    owner: "Archiv",
    notes: "Foundation Sire",
  },
  {
    id: "h_010",
    name: "Willow Creek",
    sex: "mare",
    breed: "Turkoman",
    color: "Grullo",
    genes: "R-G-TO",
    geneBaseColor: "R",
    geneModifier1: "G",
    geneModifier2: "",
    genePattern: "TO",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    ownershipStatus: "owned",
    owner: "Archiv",
    notes: "Foundation Mare",
  },
  {
    id: "h_011",
    name: "Daisy Mae",
    sex: "mare",
    breed: "Turkoman",
    color: "Sorrel",
    genes: "R-DW-G-RN",
    geneBaseColor: "R",
    geneModifier1: "DW",
    geneModifier2: "G",
    genePattern: "RN",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    ownershipStatus: "owned",
    owner: "Archiv",
    notes: "Foundation Mare",
  },
];

const GENE_BASE_COLOR_OPTIONS = [
  { value: "R", label: "Red/Chestnut (R)" },
  { value: "BL", label: "Black (BL)" },
  { value: "B", label: "Bay (B)" },
];

const GENE_MODIFIER_OPTIONS = ["FLX", "P", "CR", "CR2", "CH", "G", "DW", "M", "Z"];

const GENE_PATTERN_OPTIONS = [
  "ZB",
  "LP",
  "BK",
  "SF",
  "FSP",
  "SB",
  "TO",
  "O",
  "TOV",
  "SW",
  "RB",
  "BR",
  "D",
  "RN",
];

function splitGeneCode(genes = "") {
  const [baseColor = "", modifier1 = "", modifier2 = "", pattern = ""] = String(genes)
    .split("-")
    .map((part) => part.trim().toUpperCase());

  return {
    baseColor,
    modifier1,
    modifier2,
    pattern,
  };
}

function getHorseGeneParts(horse) {
  if (!horse) {
    return {
      baseColor: "",
      modifier1: "",
      modifier2: "",
      pattern: "",
    };
  }

  const fallback = splitGeneCode(horse.genes);

  return {
    baseColor: horse.geneBaseColor || fallback.baseColor || "",
    modifier1: horse.geneModifier1 || fallback.modifier1 || "",
    modifier2: horse.geneModifier2 || fallback.modifier2 || "",
    pattern: horse.genePattern || fallback.pattern || "",
  };
}

function buildGeneCode({ geneBaseColor, geneModifier1, geneModifier2, genePattern }) {
  return [geneBaseColor, geneModifier1, geneModifier2, genePattern]
    .map((part) => String(part || "").trim().toUpperCase())
    .filter(Boolean)
    .join("-");
}

const emptyHorseForm = {
  name: "",
  sex: "mare",
  breed: "",
  color: "",
  genes: "",
  geneBaseColor: "",
  geneModifier1: "",
  geneModifier2: "",
  genePattern: "",
  sireId: "",
  damId: "",
  availableForBreeding: true,
  ownershipStatus: "owned",
  notes: "",
};

const BACKUP_COLUMNS = [
  "recordType",
  "id",
  "name",
  "sex",
  "breed",
  "color",
  "genes",
  "geneBaseColor",
  "geneModifier1",
  "geneModifier2",
  "genePattern",
  "sireId",
  "damId",
  "availableForBreeding",
  "ownershipStatus",
  "owner",
  "notes",
  "stallionId",
  "mareId",
  "status",
  "plannedDate",
  "sharedAncestorIds",
];

function makeId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function findHorse(horses, id) {
  return horses.find((horse) => horse.id === id) || null;
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function escapeCsvValue(value) {
  const text = value === null || value === undefined ? "" : String(value);
  const escaped = text.replaceAll('"', '""');
  return `"${escaped}"`;
}

function makeBackupCsv(horses, pairings) {
  const horseRows = horses.map((horse) => ({
    recordType: "horse",
    id: horse.id,
    name: horse.name,
    sex: horse.sex,
    breed: horse.breed,
    color: horse.color,
    genes: horse.genes || "",
    geneBaseColor: horse.geneBaseColor || "",
    geneModifier1: horse.geneModifier1 || "",
    geneModifier2: horse.geneModifier2 || "",
    genePattern: horse.genePattern || "",
    sireId: horse.sireId || "",
    damId: horse.damId || "",
    availableForBreeding: horse.availableForBreeding ? "true" : "false",
    ownershipStatus: horse.ownershipStatus || "owned",
    owner: horse.owner,
    notes: horse.notes,
    stallionId: "",
    mareId: "",
    status: "",
    plannedDate: "",
    sharedAncestorIds: "",
  }));

  const pairingRows = pairings.map((pairing) => ({
    recordType: "pairing",
    id: pairing.id,
    name: "",
    sex: "",
    breed: "",
    color: "",
    genes: "",
    geneBaseColor: "",
    geneModifier1: "",
    geneModifier2: "",
    genePattern: "",
    sireId: "",
    damId: "",
    availableForBreeding: "",
    ownershipStatus: "",
    owner: "",
    notes: pairing.notes,
    stallionId: pairing.stallionId,
    mareId: pairing.mareId,
    status: pairing.status,
    plannedDate: pairing.plannedDate,
    sharedAncestorIds: (pairing.sharedAncestorIds || []).join("|"),
  }));

  const rows = [BACKUP_COLUMNS, ...horseRows, ...pairingRows];

  return rows
    .map((row) => {
      const values = Array.isArray(row) ? row : BACKUP_COLUMNS.map((column) => row[column]);
      return values.map(escapeCsvValue).join(",");
    })
    .join("\n");
}

function downloadTextFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        value += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows.filter((currentRow) => currentRow.some((cell) => cell.trim() !== ""));
}

function parseBackupCsv(text, t) {
  const rows = parseCsv(text);
  if (rows.length < 2) {
    throw new Error(t.emptyCsvError);
  }

  const header = rows[0].map((cell) => cell.trim());
  const requiredBackupColumns = BACKUP_COLUMNS.filter(
  (column) =>
    ![
      "genes",
      "ownershipStatus",
      "geneBaseColor",
      "geneModifier1",
      "geneModifier2",
      "genePattern",
    ].includes(column)
);
  const missingColumns = requiredBackupColumns.filter((column) => !header.includes(column));

  if (missingColumns.length > 0) {
    throw new Error(t.invalidCsvError(missingColumns.join(", ")));
  }

  const records = rows.slice(1).map((row) => {
    const record = {};
    header.forEach((column, index) => {
      record[column] = row[index] || "";
    });
    return record;
  });

  const importedHorses = records
    .filter((record) => record.recordType === "horse")
    .map((record) => ({
      id: record.id || makeId("h"),
      name: record.name || "Unnamed horse",
      sex: record.sex || "mare",
      breed: record.breed || "",
      color: record.color || "",
      genes: record.genes || "",
      geneBaseColor: record.geneBaseColor || splitGeneCode(record.genes).baseColor,
      geneModifier1: record.geneModifier1 || splitGeneCode(record.genes).modifier1,
      geneModifier2: record.geneModifier2 || splitGeneCode(record.genes).modifier2,
      genePattern: record.genePattern || splitGeneCode(record.genes).pattern,
      sireId: record.sireId || null,
      damId: record.damId || null,
      availableForBreeding: record.availableForBreeding === "true",
      ownershipStatus: record.ownershipStatus || "owned",
      owner: record.owner || "",
      notes: record.notes || "",
    }));

  const importedHorseIds = new Set(importedHorses.map((horse) => horse.id));

  const cleanedHorses = importedHorses.map((horse) => ({
    ...horse,
    sireId: importedHorseIds.has(horse.sireId) ? horse.sireId : null,
    damId: importedHorseIds.has(horse.damId) ? horse.damId : null,
  }));

  const importedPairings = records
    .filter((record) => record.recordType === "pairing")
    .map((record) => ({
      id: record.id || makeId("p"),
      stallionId: record.stallionId,
      mareId: record.mareId,
      status: record.status || "planned",
      plannedDate: record.plannedDate || new Date().toISOString().slice(0, 10),
      notes: record.notes || "",
      sharedAncestorIds: record.sharedAncestorIds
        ? record.sharedAncestorIds.split("|").filter(Boolean)
        : [],
    }))
    .filter((pairing) => importedHorseIds.has(pairing.stallionId) && importedHorseIds.has(pairing.mareId));

  return {
    horses: cleanedHorses,
    pairings: importedPairings,
  };
}

function getAncestors(horseId, horses, maxDepth = 5) {
  const ancestors = [];
  const visited = new Set();

  function walk(currentHorseId, generation, path) {
    if (!currentHorseId || generation > maxDepth) return;

    const horse = findHorse(horses, currentHorseId);
    if (!horse) return;

    const parents = [
      { id: horse.sireId, role: "sire" },
      { id: horse.damId, role: "dam" },
    ];

    parents.forEach((parent) => {
      if (!parent.id) return;

      const parentHorse = findHorse(horses, parent.id);
      if (!parentHorse) return;

      const visitKey = `${parent.id}-${generation}-${path.join(">")}`;
      if (visited.has(visitKey)) return;
      visited.add(visitKey);

      ancestors.push({
        id: parent.id,
        name: parentHorse.name,
        generation,
        role: parent.role,
        path: [...path, parent.role],
      });

      walk(parent.id, generation + 1, [...path, parent.role]);
    });
  }

  walk(horseId, 1, []);
  return ancestors;
}

function findSharedAncestors(stallionId, mareId, horses) {
  if (!stallionId || !mareId) return [];

  const stallion = findHorse(horses, stallionId);
  const mare = findHorse(horses, mareId);

  if (!stallion || !mare) return [];

  const stallionAncestors = getAncestors(stallionId, horses, 5);
  const mareAncestors = getAncestors(mareId, horses, 5);
  const sharedMap = new Map();

  function addSharedAncestor(id, name, stallionGeneration, mareGeneration, directRelationship = false) {
    const existing = sharedMap.get(id) || {
      id,
      name,
      stallionGenerations: [],
      mareGenerations: [],
      directRelationship: false,
    };

    existing.stallionGenerations.push(stallionGeneration);
    existing.mareGenerations.push(mareGeneration);
    existing.directRelationship = existing.directRelationship || directRelationship;

    sharedMap.set(id, existing);
  }

  // Sonderfall: ausgewählter Hengst ist Vorfahr der ausgewählten Stute
  // z. B. Vater × Tochter, Großvater × Enkelin
  mareAncestors
    .filter((ancestor) => ancestor.id === stallionId)
    .forEach((ancestor) => {
      addSharedAncestor(
        stallion.id,
        stallion.name,
        0,
        ancestor.generation,
        true
      );
    });

  // Sonderfall: ausgewählte Stute ist Vorfahrin des ausgewählten Hengstes
  // z. B. Sohn × Mutter, Enkel × Großmutter
  stallionAncestors
    .filter((ancestor) => ancestor.id === mareId)
    .forEach((ancestor) => {
      addSharedAncestor(
        mare.id,
        mare.name,
        ancestor.generation,
        0,
        true
      );
    });

  // Normalfall: beide haben gemeinsame Vorfahren
  stallionAncestors.forEach((stallionAncestor) => {
    const matches = mareAncestors.filter(
      (mareAncestor) => mareAncestor.id === stallionAncestor.id
    );

    matches.forEach((mareAncestor) => {
      addSharedAncestor(
        stallionAncestor.id,
        stallionAncestor.name,
        stallionAncestor.generation,
        mareAncestor.generation,
        false
      );
    });
  });

  return Array.from(sharedMap.values()).map((item) => ({
    ...item,
    closestStallionGeneration: Math.min(...item.stallionGenerations),
    closestMareGeneration: Math.min(...item.mareGenerations),
    closestOverall: Math.min(
      ...item.stallionGenerations,
      ...item.mareGenerations
    ),
  }));
}

function getRiskLevel(sharedAncestors, t) {
  if (sharedAncestors.length === 0) {
    return {
      label: t.relationshipNone,
      tone: "green",
      message: t.relationshipNoneMessage,
    };
  }

  const closest = Math.min(...sharedAncestors.map((item) => item.closestOverall));

  if (closest <= 1) {
    return {
      label: t.relationshipVeryClose,
      tone: "red",
      message: t.relationshipVeryCloseMessage,
    };
  }

  if (closest <= 2) {
    return {
      label: t.relationshipClose,
      tone: "orange",
      message: t.relationshipCloseMessage,
    };
  }

  if (closest <= 4) {
    return {
      label: t.relationshipDistant,
      tone: "yellow",
      message: t.relationshipDistantMessage,
    };
  }

  return {
    label: t.relationshipVeryDistant,
    tone: "yellow",
    message: t.relationshipVeryDistantMessage,
  };
}

function toneClasses(tone) {
  const map = {
    green: "border-green-300 bg-green-50 text-green-900",
    yellow: "border-yellow-300 bg-yellow-50 text-yellow-900",
    orange: "border-orange-300 bg-orange-50 text-orange-900",
    red: "border-red-300 bg-red-50 text-red-900",
    neutral: "border-stone-200 bg-white text-stone-800",
  };

  return map[tone] || map.neutral;
}

function HorseForm({ horses, editingHorse, prefillHorse, onSaveHorse, onCancelEdit, t }) {
  const [form, setForm] = useState(emptyHorseForm);

  useEffect(() => {
    const sourceHorse = editingHorse || prefillHorse;

    if (!sourceHorse) {
      setForm(emptyHorseForm);
      return;
    }

    setForm({
      name: sourceHorse.name || "",
      sex: sourceHorse.sex || "mare",
      breed: sourceHorse.breed || "",
      color: sourceHorse.color || "",
      genes: sourceHorse.genes || "",
      geneBaseColor: geneParts.baseColor,
      geneModifier1: geneParts.modifier1,
      geneModifier2: geneParts.modifier2,
      genePattern: geneParts.pattern,
      sireId: sourceHorse.sireId || "",
      damId: sourceHorse.damId || "",
      availableForBreeding: Boolean(sourceHorse.availableForBreeding),
      ownershipStatus: sourceHorse.ownershipStatus || "owned",
      owner: sourceHorse.owner || "",
      notes: sourceHorse.notes || "",
    });
  }, [editingHorse, prefillHorse]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function selectedModifiers() {
  return [form.geneModifier1, form.geneModifier2].filter(Boolean);
  }

  function toggleModifier(modifier) {
    const current = selectedModifiers();

    if (current.includes(modifier)) {
      const next = current.filter((item) => item !== modifier);
      setForm((previous) => ({
        ...previous,
        geneModifier1: next[0] || "",
        geneModifier2: next[1] || "",
      }));
      return;
    }

    const next = [...current, modifier].slice(0, 2);

    setForm((previous) => ({
      ...previous,
      geneModifier1: next[0] || "",
      geneModifier2: next[1] || "",
    }));
  }

  function togglePattern(pattern) {
    setForm((previous) => ({
      ...previous,
      genePattern: previous.genePattern === pattern ? "" : pattern,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.geneBaseColor.trim()) return;
    const genes = buildGeneCode(form);

    const savedHorse = {
      ...(editingHorse || {}),
      ...form,
      id: editingHorse?.id || makeId("h"),
      name: form.name.trim(),
      breed: form.breed.trim(),
      color: form.color.trim(),
      genes,
      geneBaseColor: form.geneBaseColor.trim().toUpperCase(),
      geneModifier1: form.geneModifier1.trim().toUpperCase(),
      geneModifier2: form.geneModifier2.trim().toUpperCase(),
      genePattern: form.genePattern.trim().toUpperCase(),
      owner: form.owner.trim(),
      notes: form.notes.trim(),
      sireId: form.sireId || null,
      damId: form.damId || null,
    };

    onSaveHorse(savedHorse);
    setForm(emptyHorseForm);
  }

  const possibleSires = horses.filter(
    (horse) => horse.sex === "stallion" && horse.id !== editingHorse?.id
  );
  const possibleDams = horses.filter(
    (horse) => horse.sex === "mare" && horse.id !== editingHorse?.id
  );

  return (
    <form onSubmit={handleSubmit} className="border border-black bg-transparent p-5 shadow-sm">
      <div className="-mx-5 -mt-5 mb-5 flex items-start justify-between gap-4 border-b border-[#363542] bg-[#363542] px-5 py-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {editingHorse ? t.editHorse : t.addHorse}
          </h2>
          <p className="text-sm text-white">
            {editingHorse ? t.editHorseDescription : t.addHorseDescription}
          </p>
        </div>

        {editingHorse && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl bg-[#4f4d63] px-3 py-2 text-xs font-semibold text-white hover:bg-[#6a6885]"
          >
            {t.cancel}
          </button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-stone-700">
          {t.name} *
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="rounded-xl border border-stone-300 px-3 py-2 font-normal outline-none focus:border-stone-900"
            placeholder={t.namePlaceholder}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-stone-700">
          {t.sex}
          <select
            value={form.sex}
            onChange={(event) => updateField("sex", event.target.value)}
            className="rounded-xl border border-stone-300 px-3 py-2 font-normal outline-none focus:border-stone-900"
          >
            <option value="stallion">{t.sexLabels.stallion}</option>
            <option value="mare">{t.sexLabels.mare}</option>
            <option value="gelding">{t.sexLabels.gelding}</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-stone-700">
          {t.breed}
          <input
            value={form.breed}
            onChange={(event) => updateField("breed", event.target.value)}
            className="rounded-xl border border-stone-300 px-3 py-2 font-normal outline-none focus:border-stone-900"
            placeholder={t.breedPlaceholder}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-stone-700">
          {t.color}
          <input
            value={form.color}
            onChange={(event) => updateField("color", event.target.value)}
            className="rounded-xl border border-stone-300 px-3 py-2 font-normal outline-none focus:border-stone-900"
            placeholder={t.colorPlaceholder}
          />
        </label>

        <div className="grid gap-3 md:col-span-2">

        <label className="grid gap-1 text-sm font-medium text-stone-700">
          Base Color *
          <select
            value={form.geneBaseColor}
            onChange={(event) => updateField("geneBaseColor", event.target.value)}
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 font-normal outline-none focus:border-stone-900"
            required
          >
            <option value="">Select base</option>
            {GENE_BASE_COLOR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-2">
          <p className="text-sm font-medium text-stone-700">Modifiers (optional)</p>

          <div className="flex flex-wrap gap-2">
            {GENE_MODIFIER_OPTIONS.map((modifier) => {
              const isSelected = selectedModifiers().includes(modifier);

              return (
                <button
                  key={modifier}
                  type="button"
                  onClick={() => toggleModifier(modifier)}
                  className={`rounded-lg border px-3 py-1 text-sm font-medium transition ${
                    isSelected
                      ? "border-[#4f4d63] bg-[#4f4d63] text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {modifier}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-stone-500">
            {t.geneModifiersHelp}
          </p>
        </div>

        <div className="grid gap-2">
          <p className="text-sm font-medium text-stone-700">Pattern (optional)</p>

          <div className="flex flex-wrap gap-2">
            {GENE_PATTERN_OPTIONS.map((pattern) => {
              const isSelected = form.genePattern === pattern;

              return (
                <button
                  key={pattern}
                  type="button"
                  onClick={() => togglePattern(pattern)}
                  className={`rounded-lg border px-3 py-1 text-sm font-medium transition ${
                    isSelected
                      ? "border-[#4f4d63] bg-[#4f4d63] text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
                  }`}
                >
                {pattern}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700">
          {t.savedGeneCode}:{" "}
          <strong>{buildGeneCode(form) || "—"}</strong>
        </div>
      </div>

        <label className="grid gap-1 text-sm font-medium text-stone-700">
          {t.owner}
          <input
            value={form.owner}
            onChange={(event) => updateField("owner", event.target.value)}
            className="rounded-xl border border-stone-300 px-3 py-2 font-normal outline-none focus:border-stone-900"
            placeholder={t.ownerPlaceholder}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-stone-700">
          {t.sire}
          <select
            value={form.sireId}
            onChange={(event) => updateField("sireId", event.target.value)}
            className="rounded-xl border border-stone-300 px-3 py-2 font-normal outline-none focus:border-stone-900"
          >
            <option value="">{t.unknown}</option>
            {possibleSires.map((horse) => (
              <option key={horse.id} value={horse.id}>{horse.name}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-stone-700">
          {t.dam}
          <select
            value={form.damId}
            onChange={(event) => updateField("damId", event.target.value)}
            className="rounded-xl border border-stone-300 px-3 py-2 font-normal outline-none focus:border-stone-900"
          >
            <option value="">{t.unknown}</option>
            {possibleDams.map((horse) => (
              <option key={horse.id} value={horse.id}>{horse.name}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700">
          <input
            type="checkbox"
            checked={form.availableForBreeding}
            onChange={(event) => updateField("availableForBreeding", event.target.checked)}
            className="h-4 w-4"
          />
          {t.availableForBreeding}
        </label>
      </div>

      <label className="grid gap-1 text-sm font-medium text-stone-700">
        {t.ownershipStatus}
        <select
          value={form.ownershipStatus}
          onChange={(event) => updateField("ownershipStatus", event.target.value)}
          className="rounded-xl border border-stone-300 px-3 py-2 font-normal outline-none focus:border-stone-900"
        >
          <option value="owned">{t.ownershipOwned}</option>
          <option value="notOwned">{t.ownershipNotOwned}</option>
        </select>
      </label>

      <label className="mt-3 grid gap-1 text-sm font-medium text-stone-700">
        {t.notes}
        <textarea
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          className="min-h-20 rounded-xl border border-stone-300 px-3 py-2 font-normal outline-none focus:border-stone-900"
          placeholder={t.notesPlaceholder}
        />
      </label>

      <button className="mt-4 rounded-xl bg-[#4f4d63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6a6885]">
        {editingHorse ? t.saveChanges : t.saveHorse}
      </button>
    </form>
  );
}

function HorseList({ horses, onToggleAvailability, onEditHorse, onDeleteHorse, t }) {
  const stallions = horses.filter((horse) => horse.sex === "stallion");
  const mares = horses.filter((horse) => horse.sex === "mare");
  const others = horses.filter((horse) => horse.sex !== "stallion" && horse.sex !== "mare");

  return (
    <section className="border border-black bg-transparent p-5 shadow-sm">
      <div className="-mx-5 -mt-5 mb-5 flex items-start justify-between gap-4 border-b border-[#363542] bg-[#363542] px-5 py-4 text-white">
          <div>
            <h2 className="text-xl font-semibold text-white">{t.horseDatabase}</h2>
            <p className="text-sm text-white">{t.horseDatabaseDescription}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white px-3 py-1 text-sm text-stone-700 shadow-sm">
              {t.horsesCount(horses.length)}
            </span>
          </div>
        </div>


        <div className="mt-4 grid items-start gap-4 md:grid-cols-2">
          <HorseGroup
            title={t.stallions}
            description={t.stallionsDescription}
            horses={stallions}
            allHorses={horses}
            onToggleAvailability={onToggleAvailability}
            onEditHorse={onEditHorse}
            onDeleteHorse={onDeleteHorse}          
            t={t}
          />

          <HorseGroup
            title={t.mares}
            description={t.maresDescription}
            horses={mares}
            allHorses={horses}
            onToggleAvailability={onToggleAvailability}
            onEditHorse={onEditHorse}
            onDeleteHorse={onDeleteHorse}            
            t={t}
          />

          {others.length > 0 && (
            <div className="md:col-span-2">
              <HorseGroup
                title={t.others}
                description={t.othersDescription}
                horses={others}
                allHorses={horses}
                onToggleAvailability={onToggleAvailability}
                onEditHorse={onEditHorse}
                onDeleteHorse={onDeleteHorse}
                t={t}
              />
            </div>
          )}
        </div>
    </section>
  );
}

function HorseGroup({
  title,
  description,
  horses,
  allHorses,
  onToggleAvailability,
  onEditHorse,
  onDeleteHorse,
  defaultOpen = false,
  t,
}) {
  const ownedHorses = horses.filter((horse) => (horse.ownershipStatus || "owned") === "owned");
  const notOwnedHorses = horses.filter((horse) => horse.ownershipStatus === "notOwned");

  const breedingHorses = ownedHorses.filter((horse) => horse.availableForBreeding);
  const archiveHorses = ownedHorses.filter((horse) => !horse.availableForBreeding);

  return (
    <div className="border border-black bg-transparent">
      <div className="flex items-center justify-between gap-3 border-b border-violet-200 bg-[#4f4d63] px-5 py-4 text-white">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-white">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700">{horses.length}</span>
        </div>
      </div>

      <div className="grid gap-3 border-t border-stone-100 p-4">
        {horses.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-500">
            {t.noHorsesInCategory}
          </p>
        ) : (
          <>
            <HorseSubGroup
              title={t.breedingHorses}
              description={t.breedingHorsesDescription}
              horses={breedingHorses}
              allHorses={allHorses}
              onToggleAvailability={onToggleAvailability}
              onEditHorse={onEditHorse}
              onDeleteHorse={onDeleteHorse}              
              t={t}
            />

            <HorseSubGroup
              title={t.archiveHorses}
              description={t.archiveHorsesDescription}
              horses={archiveHorses}
              allHorses={allHorses}
              onToggleAvailability={onToggleAvailability}
              onEditHorse={onEditHorse}
              onDeleteHorse={onDeleteHorse}
              t={t}
            />

            <HorseSubGroup
              title={t.notOwnedHorses}
              description={t.notOwnedHorsesDescription}
              horses={notOwnedHorses}
              allHorses={allHorses}
              onToggleAvailability={onToggleAvailability}
              onEditHorse={onEditHorse}
              onDeleteHorse={onDeleteHorse}
              t={t}
              />
          </>
        )}
      </div>
    </div>
  );
}

function HorseSubGroup({
  title,
  description,
  horses,
  allHorses,
  onToggleAvailability,
  onEditHorse,
  onDeleteHorse,
  defaultOpen = false,
  t,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="relative bg-transparent">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-black bg-transparent px-5 py-4 text-left text-stone-900 transition hover:bg-stone-50"
      >
        <div>
          <h4 className="font-semibold text-stone-800">{title}</h4>
          <p className="text-sm text-stone-500">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-sm text-stone-700 shadow-sm">{horses.length}</span>
          <span className="text-sm font-semibold text-stone-500">{isOpen ? "▲" : "▼"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-stone-300 bg-white shadow-lg">
          <div className="flex justify-center py-2 text-stone-500">⌃</div>

          <div className="max-h-80 overflow-y-auto px-3 pb-2 pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {horses.length === 0 ? (
              <p className="rounded-xl border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-500">
                {t.noHorsesHere}
              </p>
            ) : (
              <div className="grid gap-3">
                {horses.map((horse) => (
                  <HorseCard
                    key={horse.id}
                    horse={horse}
                    horses={allHorses}
                    onToggleAvailability={onToggleAvailability}
                    onEditHorse={onEditHorse}
                    onDeleteHorse={onDeleteHorse}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center py-2 text-stone-500">⌄</div>
        </div>
      )}
    </div>
  );
}

function HorseCard({ horse, horses, onToggleAvailability, onEditHorse, onDeleteHorse, t }) {
  const sire = findHorse(horses, horse.sireId);
  const dam = findHorse(horses, horse.damId);

  return (
    <article className="rounded-xl border border-black bg-transparent p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-stone-900">{horse.name}</h3>
          <p className="text-sm text-stone-500">
            {t.sexLabels[horse.sex]} · {horse.breed || t.breedUnknown} · {horse.color || t.colorUnknown} · {horse.genes || t.genesUnknown}
          </p>
          <p className="mt-1 text-xs text-stone-400">{t.owner}: {horse.owner || t.ownerUnknown}</p>
          <p className="mt-1 text-xs text-stone-400">
            {t.parentInfo(sire?.name || t.unknownLower, dam?.name || t.unknownLower)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onToggleAvailability(horse.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              horse.availableForBreeding
                ? "bg-green-100 text-green-800"
                : "bg-stone-100 text-stone-600"
            }`}
          >
            {horse.availableForBreeding ? t.availableBadge : t.unavailableBadge}
          </button>

          <button
            onClick={() => onEditHorse(horse)}
            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100"
          >
            {t.edit}
          </button>

          <button
            onClick={() => onDeleteHorse(horse)}
            className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-800 hover:bg-red-100"
          >
            {t.delete}
          </button>
        </div>
      </div>

      {horse.notes && <p className="mt-3 text-sm text-stone-600">{horse.notes}</p>}
    </article>
  );
}

function HorseSelect({ label, value, onChange, horses, placeholder, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const [breedFilter, setBreedFilter] = useState("");
  const [geneFilters, setGeneFilters] = useState(["", "", "", ""]);
  const dropdownRef = useRef(null);

  const selectedHorse = findHorse(horses, value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getGeneFilterParts(horse) {
    const parts = getHorseGeneParts(horse);

    return [
      parts.baseColor,
      parts.modifier1,
      parts.modifier2,
      parts.pattern,
    ];
  }

  const breedOptions = useMemo(() => {
    return Array.from(
      new Set(horses.map((horse) => horse.breed).filter(Boolean))
    ).sort();
  }, [horses]);

  const geneOptionsByPosition = useMemo(() => {
    return [0, 1, 2, 3].map((position) =>
      Array.from(
        new Set(
          horses
            .map((horse) => getGeneFilterParts(horse)[position])
            .filter(Boolean)
        )
      ).sort()
    );
  }, [horses]);

  const filteredHorses = useMemo(() => {
    return horses.filter((horse) => {
      const horseGenes = getGeneFilterParts(horse);

      const matchesBreed =
        !breedFilter || horse.breed === breedFilter;

      const matchesGenes = geneFilters.every((filterValue, index) => {
        if (!filterValue) return true;
        return horseGenes[index] === filterValue;
      });

      return matchesBreed && matchesGenes;
    });
  }, [horses, breedFilter, geneFilters]);

  function updateGeneFilter(index, value) {
    setGeneFilters((current) =>
      current.map((filter, currentIndex) =>
        currentIndex === index ? value : filter
      )
    );
  }

  function resetFilters() {
    setBreedFilter("");
    setGeneFilters(["", "", "", ""]);
  }

  function resetSelection() {
    onChange("");
    setIsOpen(false);
  }

  function handleSelect(horseId) {
    onChange(horseId);
    setIsOpen(false);
  }

  return (
    <div ref={dropdownRef} className="grid gap-1 text-sm font-medium text-stone-700">
      <label>{label}</label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between rounded-xl border border-stone-300 bg-white px-3 py-2 text-left font-normal outline-none transition hover:border-stone-500 focus:border-stone-900"
        >
          <span className={selectedHorse ? "text-stone-900" : "text-stone-400"}>
            {selectedHorse
              ? `${selectedHorse.name} · ${selectedHorse.breed || t.breedUnknown} · ${selectedHorse.genes || t.genesUnknown}`
              : placeholder}
          </span>
          <span className="text-stone-400">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-xl border border-stone-300 bg-white shadow-lg">
            <div className="grid gap-3 border-b border-stone-200 p-3">
              <label className="grid gap-1 text-xs font-semibold text-stone-600">
                {t.filterBreed}
                <select
                  value={breedFilter}
                  onChange={(event) => setBreedFilter(event.target.value)}
                  className="rounded-lg border border-stone-300 px-2 py-2 text-sm font-normal"
                >
                  <option value="">{t.allBreeds}</option>
                  {breedOptions.map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-2 md:grid-cols-4">
                {[
                  t.filterBaseColor,
                  t.filterModifier1,
                  t.filterModifier2,
                  t.filterPattern
                ].map((label, position) => (
                  <label key={label} className="grid gap-1 text-xs font-semibold text-stone-600">
                    {label}
                    <select
                      value={geneFilters[position]}
                      onChange={(event) => updateGeneFilter(position, event.target.value)}
                      className="rounded-lg border border-stone-300 px-2 py-2 text-sm font-normal"
                    >
                      <option value="">{t.allOptions}</option>
                      {geneOptionsByPosition[position].map((gene) => (
                        <option key={gene} value={gene}>
                          {gene}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-fit rounded-lg bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200"
                >
                  {t.resetFilters}
                </button>

                {value && (
                  <button
                    type="button"
                    onClick={resetSelection}
                    className="w-fit rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                  {t.resetSelection}
                  </button>
                )}
              </div>

              </div>

            <div className="max-h-80 overflow-y-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {filteredHorses.length === 0 ? (
                <p className="rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-500">
                  {t.noMatchingHorse}
                </p>
              ) : (
                <div className="grid gap-2">
                  {filteredHorses.map((horse) => (
                    <button
                      key={horse.id}
                      type="button"
                      onClick={() => handleSelect(horse.id)}
                      className={`rounded-lg px-3 py-2 text-left text-sm transition hover:bg-stone-100 ${
                        value === horse.id
                          ? "bg-stone-100 font-semibold text-stone-900"
                          : "text-stone-800"
                      }`}
                    >
                      <span className="block font-semibold">{horse.name}</span>
                      <span className="block text-xs text-stone-500">
                        {horse.breed || t.breedUnknown}
                        {horse.genes ? ` · ${horse.genes}` : ""}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PedigreeTree({ horseId, horses, t }) {
  const horse = findHorse(horses, horseId);

  if (!horse) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-500">
        {t.noHorseSelectedYet}
      </div>
    );
  }

  return <VisualPedigreeChart horse={horse} horses={horses} t={t} />;
}

function PedigreeNode({ horse, horses, depth, maxDepth, t }) {
  if (!horse) return null;

  const sire = findHorse(horses, horse.sireId);
  const dam = findHorse(horses, horse.damId);
  const canGoDeeper = depth < maxDepth;

  return (
    <div className={depth === 0 ? "" : "ml-4 border-l border-stone-300 pl-4"}>
      <div className="mb-2 rounded-lg bg-white px-3 py-2 shadow-sm">
        <p className="font-semibold text-stone-900">{horse.name}</p>
        <p className="text-xs text-stone-500">
          {t.sexLabels[horse.sex]} · {horse.breed || t.breedUnknown} · {horse.color || t.colorUnknown} · {horse.genes || t.genesUnknown}
        </p>
      </div>

      {canGoDeeper && (
        <div className="grid gap-2">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">{t.sire}</p>
            {sire ? (
              <PedigreeNode horse={sire} horses={horses} depth={depth + 1} maxDepth={maxDepth} t={t} />
            ) : (
              <UnknownParent t={t} />
            )}
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">{t.dam}</p>
            {dam ? (
              <PedigreeNode horse={dam} horses={horses} depth={depth + 1} maxDepth={maxDepth} t={t} />
            ) : (
              <UnknownParent t={t} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function UnknownParent({ t }) {
  return <div className="ml-4 rounded-lg border border-dashed border-stone-300 px-3 py-2 text-sm text-stone-400">{t.unknownLower}</div>;
}

function RelationshipWarning({ sharedAncestors, stallion, mare, t }) {
  const risk = getRiskLevel(sharedAncestors, t);

  return (
    <section className={`rounded-2xl border p-5 ${toneClasses(risk.tone)}`}>
      <h3 className="text-lg font-semibold">{risk.label}</h3>
      <p className="mt-1 text-sm">{risk.message}</p>

      {sharedAncestors.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">{t.sharedAncestorsOf(stallion.name, mare.name)}</p>
          <ul className="mt-2 grid gap-2 text-sm">
            {sharedAncestors.map((ancestor) => (
              <li key={ancestor.id} className="rounded-xl bg-white/70 px-3 py-2">
                <strong>{ancestor.name}</strong>
                <span className="block text-xs opacity-80">
                  {t.stallionGeneration}: {t.generation} {ancestor.closestStallionGeneration} · {t.mareGeneration}: {t.generation} {ancestor.closestMareGeneration}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function RelationshipModal({ isOpen, onClose, sharedAncestors, stallion, mare, t }) {
  if (!isOpen || !stallion || !mare || sharedAncestors.length === 0) return null;

  const risk = getRiskLevel(sharedAncestors, t);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className={`rounded-2xl border p-4 ${toneClasses(risk.tone)}`}>
          <p className="text-sm font-semibold uppercase tracking-wide">{t.warning}</p>
          <h2 className="mt-1 text-2xl font-bold">{risk.label}</h2>
          <p className="mt-2 text-sm">{risk.message}</p>
        </div>

        <div className="mt-4">
          <p className="font-semibold text-stone-900">
            {stallion.name} × {mare.name}
          </p>
          <ul className="mt-3 grid gap-2 text-sm text-stone-700">
            {sharedAncestors.map((ancestor) => (
              <li key={ancestor.id} className="rounded-xl bg-stone-100 px-3 py-2">
                <strong>{ancestor.name}</strong>
                <span className="block text-xs text-stone-500">
                  {t.stallionGeneration}: {t.generation} {ancestor.closestStallionGeneration} · {t.mareGeneration}: {t.generation} {ancestor.closestMareGeneration}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
        >
          {t.understood}
        </button>
      </div>
    </div>
  );
}

function BreedingPlanner({ horses, onSavePairing, t }) {
  const [stallionId, setStallionId] = useState("");
  const [mareId, setMareId] = useState("");
  const [notes, setNotes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [lastWarningKey, setLastWarningKey] = useState("");

  const availableStallions = useMemo(
    () =>
      horses.filter(
        (horse) =>
          horse.sex === "stallion" &&
          horse.availableForBreeding &&
          (horse.ownershipStatus || "owned") === "owned"
      ),
    [horses]
  );

  const availableMares = useMemo(
    () =>
      horses.filter(
        (horse) =>
          horse.sex === "mare" &&
          horse.availableForBreeding &&
          (horse.ownershipStatus || "owned") === "owned"
      ),
    [horses]
  );

  const stallion = findHorse(horses, stallionId);
  const mare = findHorse(horses, mareId);

  const sharedAncestors = useMemo(
    () => findSharedAncestors(stallionId, mareId, horses),
    [stallionId, mareId, horses]
  );

  useEffect(() => {
    const warningKey = `${stallionId}-${mareId}-${sharedAncestors.map((item) => item.id).join("-")}`;

    if (stallionId && mareId && sharedAncestors.length > 0 && warningKey !== lastWarningKey) {
      setShowModal(true);
      setLastWarningKey(warningKey);
    }
  }, [stallionId, mareId, sharedAncestors, lastWarningKey]);

  function handleSavePairing() {
    if (!stallion || !mare) return;

    onSavePairing({
      id: makeId("p"),
      stallionId: stallion.id,
      mareId: mare.id,
      status: "planned",
      plannedDate: new Date().toISOString().slice(0, 10),
      notes: notes.trim(),
      sharedAncestorIds: sharedAncestors.map((item) => item.id),
    });

    setNotes("");
  }

  return (
    <section className="border border-black bg-transparent p-5 shadow-sm">
      <div className="-mx-5 -mt-5 mb-5 border-b border-[#363542] bg-[#363542] px-5 py-4">
        <h2 className="text-xl font-semibold text-white">{t.plannerTitle}</h2>
        <p className="text-sm text-white">{t.plannerDescription}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <HorseSelect
          label={t.selectStallion}
          value={stallionId}
          onChange={setStallionId}
          horses={availableStallions}
          placeholder={t.selectStallionPlaceholder}
          t={t}
        />

        <HorseSelect
          label={t.selectMare}
          value={mareId}
          onChange={setMareId}
          horses={availableMares}
          placeholder={t.selectMarePlaceholder}
          t={t}
        />
      </div>

      {stallion && mare && (
        <div className="mt-5 grid gap-4">
          <RelationshipWarning sharedAncestors={sharedAncestors} stallion={stallion} mare={mare} t={t} />

          <label className="grid gap-1 text-sm font-medium text-stone-700">
            {t.pairingNote}
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-20 rounded-xl border border-stone-300 px-3 py-2 font-normal outline-none focus:border-stone-900"
              placeholder={t.pairingNotePlaceholder}
            />
          </label>

          <button
            onClick={handleSavePairing}
            className="w-fit rounded-xl bg-[#4f4d63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6a6885]"
          >
            {t.savePairing}
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold text-stone-900">{t.stallionPedigree}</h3>
          {stallion ? (
            <VisualPedigreeChart horse={stallion} horses={horses} t={t} />
          ) : (
            <div className="rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-500">
              {t.noHorseSelectedYet}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-stone-900">{t.marePedigree}</h3>
          {mare ? (
            <VisualPedigreeChart horse={mare} horses={horses} t={t} />
          ) : (
            <div className="rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-500">
              {t.noHorseSelectedYet}
            </div>
          )}
        </div>
      </div>

      <RelationshipModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        sharedAncestors={sharedAncestors}
        stallion={stallion}
        mare={mare}
        t={t}
      />
    </section>
  );
}

function PairingList({ pairings, horses, onCreateFoal, t }) {
  if (pairings.length === 0) {
    return (
      <section className="border border-black bg-transparent p-5 shadow-sm">
        <div className="-mx-5 -mt-5 mb-5 border-b border-[#363542] bg-[#363542] px-5 py-4">
          <h2 className="text-xl font-semibold text-white">{t.pairingsTitle}</h2>
          <p className="text-sm text-white">{t.pairingsEmpty}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-black bg-transparent p-5 shadow-sm">
      <div className="-mx-5 -mt-5 mb-5 border-b border-[#363542] bg-[#363542] px-5 py-4">
        <h2 className="text-xl font-semibold text-white">{t.pairingsTitle}</h2>
        <p className="text-sm text-white">{t.pairingsDescription}</p>
      </div>

      <div className="grid gap-3">
        {pairings.map((pairing) => {
          const stallion = findHorse(horses, pairing.stallionId);
          const mare = findHorse(horses, pairing.mareId);

          if (!stallion || !mare) return null;

          return (
            <article key={pairing.id} className="rounded-xl border border-black bg-transparent p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-stone-900">{stallion.name} × {mare.name}</h3>
                  <p className="text-sm text-stone-500">
                    {t.statusLabels[pairing.status] || pairing.status} · {t.plannedOn} {pairing.plannedDate}
                  </p>
                </div>

                <button
                  onClick={() => onCreateFoal(pairing)}
                  className="rounded-xl bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-200"
                >
                  {t.createFoal}
                </button>
              </div>

              {pairing.notes && <p className="mt-3 text-sm text-stone-600">{pairing.notes}</p>}

              {pairing.sharedAncestorIds.length > 0 && (
                <p className="mt-3 rounded-xl bg-yellow-50 px-3 py-2 text-sm text-yellow-900">
                  {t.pairingSharedWarning}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PedigreeViewer({ horses, t }) {
  const [selectedHorseId, setSelectedHorseId] = useState("");
  const [showPedigree, setShowPedigree] = useState(false);

  const sortedHorses = useMemo(
    () => [...horses].sort((first, second) => first.name.localeCompare(second.name)),
    [horses]
  );

  const selectedHorse = findHorse(horses, selectedHorseId);

  function handleSelect(horseId) {
    setSelectedHorseId(horseId);
    setShowPedigree(false);
  }

  return (
    <section className="border border-black bg-transparent p-5 shadow-sm">
      <div className="-mx-5 -mt-5 mb-5 border-b border-[#363542] bg-[#363542] px-5 py-4">
        <h2 className="text-xl font-semibold text-white">{t.pedigreeViewerTitle}</h2>
        <p className="text-sm text-white">{t.pedigreeViewerDescription}</p>
      </div>

      <div className="grid gap-3">
        <PedigreeHorseDropdown
          label={t.selectHorse}
          value={selectedHorseId}
          onChange={handleSelect}
          horses={sortedHorses}
          placeholder={t.selectHorsePlaceholder}
          t={t}
        />

        <button
          type="button"
          disabled={!selectedHorse}
          onClick={() => setShowPedigree((current) => !current)}
          className="rounded-xl bg-[#4f4d63] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6a6885] disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
        >
          {showPedigree ? t.hidePedigree : t.showPedigree}
        </button>
      </div>

      {!selectedHorse && (
        <p className="mt-4 rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-500">
          {t.noPedigreeSelected}
        </p>
      )}

      {selectedHorse && showPedigree && (
        <div className="mt-6">
          <VisualPedigreeChart horse={selectedHorse} horses={horses} t={t} />
          <p className="mt-3 text-xs text-stone-500">{t.pedigreeHint}</p>
        </div>
      )}
    </section>
  );
}

function PedigreeHorseDropdown({ label, value, onChange, horses, placeholder, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedHorse = findHorse(horses, value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(horseId) {
    onChange(horseId);
    setIsOpen(false);
  }

  return (
    <div ref={dropdownRef} className="grid gap-1 text-sm font-medium text-stone-700">
      <label>{label}</label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between rounded-xl border border-stone-300 bg-white px-3 py-2 text-left font-normal outline-none transition hover:border-stone-500 focus:border-stone-900"
        >
          <span className={selectedHorse ? "text-stone-900" : "text-stone-400"}>
            {selectedHorse
              ? `${selectedHorse.name} (${t.sexLabels[selectedHorse.sex] || selectedHorse.sex})`
              : placeholder}
          </span>
          <span className="text-stone-400">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-xl border border-stone-300 bg-white shadow-lg">
            <div className="flex justify-center py-2 text-stone-500">⌃</div>

            <div className="max-h-80 overflow-y-auto px-3 pb-2 pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {horses.length === 0 ? (
                <p className="rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-500">
                  {t.noHorsesHere}
                </p>
              ) : (
                <div className="grid gap-1">
                  {horses.map((horse) => (
                    <button
                      key={horse.id}
                      type="button"
                      onClick={() => handleSelect(horse.id)}
                      className={`rounded-lg px-3 py-2 text-left text-sm transition hover:bg-stone-100 ${
                        value === horse.id ? "bg-stone-100 font-semibold text-stone-900" : "text-stone-800"
                      }`}
                    >
                      <span className="block font-medium">{horse.name}</span>
                      <span className="block text-xs text-stone-500">
                        {t.sexLabels[horse.sex] || horse.sex}
                        {horse.breed ? ` · ${horse.breed}` : ""}
                        {horse.color ? ` · ${horse.color}` : ""}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center py-2 text-stone-500">⌄</div>
          </div>
        )}
      </div>
    </div>
  );
}

function buildPedigreeNodes(rootHorse, horses, maxDepth = 3) {
  const maxRows = 2 ** maxDepth * 2;
  const nodes = [];

  function addNode(horse, depth, pathIndex, relation) {
    const row = (pathIndex * 2 + 1) * 2 ** (maxDepth - depth);

    nodes.push({
      id: horse?.id || `unknown-${depth}-${pathIndex}`,
      horse,
      depth,
      row,
      relation,
    });

    if (!horse || depth >= maxDepth) return;

    addNode(findHorse(horses, horse.sireId), depth + 1, pathIndex * 2, "sire");
    addNode(findHorse(horses, horse.damId), depth + 1, pathIndex * 2 + 1, "dam");
  }

  addNode(rootHorse, 0, 0, "root");

  return { nodes, maxRows, maxDepth };
}

function VisualPedigreeChart({ horse, horses, t }) {
  const { nodes, maxRows, maxDepth } = buildPedigreeNodes(horse, horses, 3);

  return (
    <div className="border border-black bg-transparent p-4 shadow-sm">
      <div className="overflow-x-auto pb-3 [scrollbar-width:thin]">
        <div
          className="relative grid min-w-[980px] gap-x-16 gap-y-2 px-4 py-4"
          style={{
            gridTemplateColumns: `repeat(${maxDepth + 1}, 210px)`,
            gridTemplateRows: `repeat(${maxRows}, minmax(24px, auto))`,
          }}
        >
          {nodes.map((node) => (
            <PedigreeVisualCard key={node.id} node={node} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PedigreeVisualCard({ node, t }) {
  const { horse, depth, row, relation } = node;
  const relationLabel =
    relation === "root" ? t.rootHorse : relation === "sire" ? t.sire : t.dam;

  return (
    <div
      className="relative rounded-xl border border-stone-300 bg-white p-3 shadow-sm"
      style={{ gridColumn: depth + 1, gridRow: row }}
    >
      {depth > 0 && (
        <span className="absolute -left-16 top-1/2 hidden w-16 border-t border-stone-400 md:block" />
      )}

      {horse ? (
        <>
          <h4 className="font-semibold text-stone-900">{horse.name}</h4>
          <p className="mt-1 text-xs text-stone-500">{relationLabel}</p>
          <dl className="mt-2 grid gap-1 text-xs text-stone-700">
            <div>
              <dt className="inline font-semibold">{t.color}: </dt>
              <dd className="inline">{horse.color || t.colorUnknown}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">{t.breed}: </dt>
              <dd className="inline">{horse.breed || t.breedUnknown}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">{t.genes}: </dt>
              <dd className="inline">{horse.genes || t.genesUnknown}</dd>
            </div>
          </dl>
        </>
      ) : (
        <>
          <h4 className="font-semibold text-stone-400">{t.unknown}</h4>
          <p className="mt-1 text-xs text-stone-400">{relationLabel}</p>
        </>
      )}
    </div>
  );
}

function DataBackup({ horses, pairings, onImportBackup, t }) {
  const fileInputRef = useRef(null);

  function handleExport() {
    const csv = makeBackupCsv(horses, pairings);
    const today = new Date().toISOString().slice(0, 10);
    downloadTextFile(csv, `breeding-planner-backup-${today}.csv`, "text/csv;charset=utf-8");
  }

  function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const imported = parseBackupCsv(String(reader.result || ""), t);
        const confirmed = window.confirm(
          t.importConfirm(imported.horses.length, imported.pairings.length)
        );

        if (!confirmed) return;

        onImportBackup(imported.horses, imported.pairings);
        window.alert(t.importSuccess);
      } catch (error) {
        window.alert(error instanceof Error ? error.message : t.importGenericError);
      } finally {
        event.target.value = "";
      }
    };

    reader.onerror = () => {
      window.alert(t.importReadError);
      event.target.value = "";
    };

    reader.readAsText(file, "UTF-8");
  }

  return (
    <section className="border border-[#A8CDAA] bg-[#A8CDAA] p-5 shadow-sm">
      <div className="-mx-5 -mt-5 mb-4 flex flex-wrap items-start justify-between gap-4 border-b border-[#A8CDAA] bg-[#A8CDAA] px-5 py-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">{t.backupTitle}</h2>
          <p className="text-sm text-stone-500">{t.backupDescription}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="rounded-xl bg-[#4f4d63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6a6885]"
          >
            {t.exportCsv}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl bg-[#4f4d63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6a6885]"
          >
            {t.importCsv}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      <p className="mt-3 rounded-xl bg-[#cbffd2] px-3 py-2 text-sm text-stone-900">
        {t.backupTip}
      </p>
    </section>
  );
}

export default function App() {
  const [horses, setHorses] = useState(() => loadFromStorage(STORAGE_KEYS.horses, demoHorses));
  const [pairings, setPairings] = useState(() => loadFromStorage(STORAGE_KEYS.pairings, []));
  const [editingHorse, setEditingHorse] = useState(null);
  const [prefillHorse, setPrefillHorse] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEYS.language) || "de");

  const t = translations[language] || translations.de;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.horses, JSON.stringify(horses));
  }, [horses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.pairings, JSON.stringify(pairings));
  }, [pairings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.language, language);
  }, [language]);

  function saveHorse(horseToSave) {
    setHorses((current) => {
      const exists = current.some((horse) => horse.id === horseToSave.id);

      if (exists) {
        return current.map((horse) =>
          horse.id === horseToSave.id ? horseToSave : horse
        );
      }

      return [...current, horseToSave];
    });

    setEditingHorse(null);
    setPrefillHorse(null);
  }

  function toggleAvailability(horseId) {
    setHorses((current) =>
      current.map((horse) =>
        horse.id === horseId
          ? { ...horse, availableForBreeding: !horse.availableForBreeding }
          : horse
      )
    );
  }

  function startEditingHorse(horse) {
    setPrefillHorse(null);
    setEditingHorse(horse);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function deleteHorse(horseToDelete) {
    const childrenCount = horses.filter(
      (horse) => horse.sireId === horseToDelete.id || horse.damId === horseToDelete.id
    ).length;
    const pairingsCount = pairings.filter(
      (pairing) => pairing.stallionId === horseToDelete.id || pairing.mareId === horseToDelete.id
    ).length;

    const confirmed = window.confirm(
      t.deleteHorseConfirm(horseToDelete.name, childrenCount, pairingsCount)
    );
    if (!confirmed) return;

    setHorses((current) =>
      current
        .filter((horse) => horse.id !== horseToDelete.id)
        .map((horse) => ({
          ...horse,
          sireId: horse.sireId === horseToDelete.id ? null : horse.sireId,
          damId: horse.damId === horseToDelete.id ? null : horse.damId,
        }))
    );

    setPairings((current) =>
      current.filter(
        (pairing) => pairing.stallionId !== horseToDelete.id && pairing.mareId !== horseToDelete.id
      )
    );

    if (editingHorse?.id === horseToDelete.id) {
      setEditingHorse(null);
    }
  }

  function savePairing(pairing) {
    setPairings((current) => [pairing, ...current]);
  }

  function prepareFoalFromPairing(pairing) {
  const stallion = findHorse(horses, pairing.stallionId);
  const mare = findHorse(horses, pairing.mareId);

  if (!stallion || !mare) return;

  setEditingHorse(null);

  setPrefillHorse({
    ...emptyHorseForm,
    name: "",
    sex: "mare",
    breed: mare.breed || stallion.breed || "",
    color: "",
    genes: "",
    geneBaseColor: "",
    geneModifier1: "",
    geneModifier2: "",
    genePattern: "",
    sireId: stallion.id,
    damId: mare.id,
    availableForBreeding: false,
    ownershipStatus: "owned",
    owner: mare.owner || stallion.owner || "",
    notes: "",
  });

  window.setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, 0);
}

  function importBackup(importedHorses, importedPairings) {
    setHorses(importedHorses);
    setPairings(importedPairings);
    setEditingHorse(null);
    setPrefillHorse(null);
  }

  function resetDemoData() {
    const confirmed = window.confirm(t.resetDemoConfirm);
    if (!confirmed) return;

    setHorses(demoHorses);
    setPairings([]);
    setEditingHorse(null);
    setPrefillHorse(null);
    localStorage.removeItem(STORAGE_KEYS.horses);
    localStorage.removeItem(STORAGE_KEYS.pairings);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-stone-900">
      <div className="mx-auto grid max-w-7xl gap-6">
        <header className="border border-[#1e1d23] bg-[#1e1d23] p-6 text-white shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white">{t.appLabel}</p>
              <h1 className="mt-2 text-3xl font-bold md:text-5xl">{t.appTitle}</h1>
              <p className="mt-3 max-w-2xl text-white">{t.appSubtitle}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLanguage(language === "de" ? "en" : "de")}
                className="rounded-xl border border-[#1e1d23] bg-white/80 px-4 py-2 text-sm font-semibold text-stone-900 hover:bg-white"
              >
                {t.switchLanguage}
              </button>

              <button
                onClick={resetDemoData}
                className="rounded-xl border border-[#1e1d23] bg-white/80 px-4 py-2 text-sm font-semibold text-stone-900 hover:bg-white"
              >
                {t.resetDemo}
              </button>
            </div>
          </div>
        </header>

        <DataBackup horses={horses} pairings={pairings} onImportBackup={importBackup} t={t} />

        <BreedingPlanner horses={horses} onSavePairing={savePairing} t={t} />

        <HorseList
          horses={horses}
          onToggleAvailability={toggleAvailability}
          onEditHorse={startEditingHorse}
          onDeleteHorse={deleteHorse}
          t={t}
        />

        <PedigreeViewer horses={horses} t={t} />

        <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          <HorseForm
            horses={horses}
            editingHorse={editingHorse}
            prefillHorse={prefillHorse}
            onSaveHorse={saveHorse}
            onCancelEdit={() => {
              setEditingHorse(null);
              setPrefillHorse(null);
            }}
          t={t}
          />
          <PairingList pairings={pairings} horses={horses} onCreateFoal={prepareFoalFromPairing} t={t} />
        </div>
      </div>
    </main>
  );
}
