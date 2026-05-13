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
    genesPlaceholder: "z. B. BL_G_D",
    sire: "Vater",
    dam: "Mutter",
    unknown: "Unbekannt",
    unknownLower: "unbekannt",
    owner: "Besitzer:in",
    ownerPlaceholder: "z. B. Gina",
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
    genesPlaceholder: "e.g. BL_G_D",
    sire: "Sire",
    dam: "Dam",
    unknown: "Unknown",
    unknownLower: "unknown",
    owner: "Owner",
    ownerPlaceholder: "e.g. Gina",
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
    genes: "BL_G_D",
    sireId: "h_005",
    damId: "h_006",
    availableForBreeding: true,
    owner: "TTR Ranch",
    notes: "Ruhige Showlinie",
  },
  {
    id: "h_002",
    name: "Moonshine Belle",
    sex: "mare",
    breed: "Missouri Fox Trotter",
    color: "Palomino",
    genes: "CH_E_A",
    sireId: "h_007",
    damId: "h_008",
    availableForBreeding: true,
    owner: "Gina",
    notes: "Gute Mutterlinie",
  },
  {
    id: "h_003",
    name: "Dusty Baron",
    sex: "stallion",
    breed: "Turkoman",
    color: "Dark Bay",
    genes: "DB_A_N",
    sireId: "h_009",
    damId: "h_010",
    availableForBreeding: true,
    owner: "Valentine Stable",
    notes: "Kräftige Linie",
  },
  {
    id: "h_004",
    name: "Rose Valley Queen",
    sex: "mare",
    breed: "Turkoman",
    color: "Chestnut",
    genes: "CH_R_Q",
    sireId: "h_005",
    damId: "h_011",
    availableForBreeding: true,
    owner: "Emerald Ranch",
    notes: "Teilt Vater mit Silver King — Test für Warnung",
  },
  {
    id: "h_005",
    name: "Old Thunder",
    sex: "stallion",
    breed: "Missouri Fox Trotter",
    color: "Grey",
    genes: "GR_O_T",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    owner: "Archiv",
    notes: "Foundation Sire",
  },
  {
    id: "h_006",
    name: "Belle Star",
    sex: "mare",
    breed: "Missouri Fox Trotter",
    color: "Black",
    genes: "BL_B_S",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    owner: "Archiv",
    notes: "Foundation Mare",
  },
  {
    id: "h_007",
    name: "Red Baron",
    sex: "stallion",
    breed: "Missouri Fox Trotter",
    color: "Bay",
    genes: "BY_R_B",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    owner: "Archiv",
    notes: "Foundation Sire",
  },
  {
    id: "h_008",
    name: "Lady May",
    sex: "mare",
    breed: "Missouri Fox Trotter",
    color: "Buckskin",
    genes: "BK_L_M",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    owner: "Archiv",
    notes: "Foundation Mare",
  },
  {
    id: "h_009",
    name: "Black Jack",
    sex: "stallion",
    breed: "Turkoman",
    color: "Black",
    genes: "BL_B_J",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    owner: "Archiv",
    notes: "Foundation Sire",
  },
  {
    id: "h_010",
    name: "Willow Creek",
    sex: "mare",
    breed: "Turkoman",
    color: "Grullo",
    genes: "GR_W_C",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    owner: "Archiv",
    notes: "Foundation Mare",
  },
  {
    id: "h_011",
    name: "Daisy Mae",
    sex: "mare",
    breed: "Turkoman",
    color: "Sorrel",
    genes: "SR_D_M",
    sireId: null,
    damId: null,
    availableForBreeding: false,
    owner: "Archiv",
    notes: "Foundation Mare",
  },
];

const emptyHorseForm = {
  name: "",
  sex: "mare",
  breed: "",
  color: "",
  genes: "",
  sireId: "",
  damId: "",
  availableForBreeding: true,
  owner: "",
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
  "sireId",
  "damId",
  "availableForBreeding",
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
    sireId: horse.sireId || "",
    damId: horse.damId || "",
    availableForBreeding: horse.availableForBreeding ? "true" : "false",
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
    sireId: "",
    damId: "",
    availableForBreeding: "",
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
  const requiredBackupColumns = BACKUP_COLUMNS.filter((column) => column !== "genes");
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
      sireId: record.sireId || null,
      damId: record.damId || null,
      availableForBreeding: record.availableForBreeding === "true",
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
  if (!stallionId || !mareId || stallionId === mareId) return [];

  const stallionAncestors = getAncestors(stallionId, horses, 5);
  const mareAncestors = getAncestors(mareId, horses, 5);
  const sharedMap = new Map();

  stallionAncestors.forEach((stallionAncestor) => {
    const matches = mareAncestors.filter(
      (mareAncestor) => mareAncestor.id === stallionAncestor.id
    );

    matches.forEach((mareAncestor) => {
      const existing = sharedMap.get(stallionAncestor.id) || {
        id: stallionAncestor.id,
        name: stallionAncestor.name,
        stallionGenerations: [],
        mareGenerations: [],
      };

      existing.stallionGenerations.push(stallionAncestor.generation);
      existing.mareGenerations.push(mareAncestor.generation);
      sharedMap.set(stallionAncestor.id, existing);
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

function HorseForm({ horses, editingHorse, onSaveHorse, onCancelEdit, t }) {
  const [form, setForm] = useState(emptyHorseForm);

  useEffect(() => {
    if (!editingHorse) {
      setForm(emptyHorseForm);
      return;
    }

    setForm({
      name: editingHorse.name || "",
      sex: editingHorse.sex || "mare",
      breed: editingHorse.breed || "",
      color: editingHorse.color || "",
      genes: editingHorse.genes || "",
      sireId: editingHorse.sireId || "",
      damId: editingHorse.damId || "",
      availableForBreeding: Boolean(editingHorse.availableForBreeding),
      owner: editingHorse.owner || "",
      notes: editingHorse.notes || "",
    });
  }, [editingHorse]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;

    const savedHorse = {
      ...(editingHorse || {}),
      ...form,
      id: editingHorse?.id || makeId("h"),
      name: form.name.trim(),
      breed: form.breed.trim(),
      color: form.color.trim(),
      genes: form.genes.trim(),
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
    <form onSubmit={handleSubmit} className="rounded-2xl border border-black bg-transparent p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">
            {editingHorse ? t.editHorse : t.addHorse}
          </h2>
          <p className="text-sm text-stone-500">
            {editingHorse ? t.editHorseDescription : t.addHorseDescription}
          </p>
        </div>

        {editingHorse && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200"
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

        <label className="grid gap-1 text-sm font-medium text-stone-700">
          {t.genes}
          <input
            value={form.genes}
            onChange={(event) => updateField("genes", event.target.value)}
            className="rounded-xl border border-stone-300 px-3 py-2 font-normal outline-none focus:border-stone-900"
            placeholder={t.genesPlaceholder}
          />
        </label>

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

      <label className="mt-3 grid gap-1 text-sm font-medium text-stone-700">
        {t.notes}
        <textarea
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          className="min-h-20 rounded-xl border border-stone-300 px-3 py-2 font-normal outline-none focus:border-stone-900"
          placeholder={t.notesPlaceholder}
        />
      </label>

      <button className="mt-4 rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700">
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
    <section className="rounded-2xl border border-black bg-transparent p-5 shadow-sm">
      <details open className="group">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-xl bg-stone-50 px-4 py-3 transition hover:bg-stone-100">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">{t.horseDatabase}</h2>
            <p className="text-sm text-stone-500">{t.horseDatabaseDescription}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white px-3 py-1 text-sm text-stone-700 shadow-sm">
              {t.horsesCount(horses.length)}
            </span>
            <span className="text-sm font-semibold text-stone-500 group-open:hidden">{t.open}</span>
            <span className="hidden text-sm font-semibold text-stone-500 group-open:inline">{t.close}</span>
          </div>
        </summary>

        <div className="mt-4 grid gap-3">
          <HorseGroup
            title={t.stallions}
            description={t.stallionsDescription}
            horses={stallions}
            allHorses={horses}
            onToggleAvailability={onToggleAvailability}
            onEditHorse={onEditHorse}
            onDeleteHorse={onDeleteHorse}
            defaultOpen
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
            defaultOpen
            t={t}
          />

          {others.length > 0 && (
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
          )}
        </div>
      </details>
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
  const breedingHorses = horses.filter((horse) => horse.availableForBreeding);
  const archiveHorses = horses.filter((horse) => !horse.availableForBreeding);

  return (
    <details open={defaultOpen} className="group rounded-2xl border border-black bg-transparent">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 transition hover:bg-stone-50">
        <div>
          <h3 className="font-semibold text-stone-900">{title}</h3>
          <p className="text-sm text-stone-500">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700">{horses.length}</span>
          <span className="text-sm font-semibold text-stone-400 group-open:hidden">▼</span>
          <span className="hidden text-sm font-semibold text-stone-400 group-open:inline">▲</span>
        </div>
      </summary>

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
              defaultOpen
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
          </>
        )}
      </div>
    </details>
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
  return (
    <details open={defaultOpen} className="group/sub rounded-xl border border-black bg-transparent">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 transition hover:bg-stone-50">
        <div>
          <h4 className="font-semibold text-stone-800">{title}</h4>
          <p className="text-sm text-stone-500">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-sm text-stone-700 shadow-sm">{horses.length}</span>
          <span className="text-sm font-semibold text-stone-400 group-open/sub:hidden">▼</span>
          <span className="hidden text-sm font-semibold text-stone-400 group-open/sub:inline">▲</span>
        </div>
      </summary>

      <div className="border-t border-stone-200 p-4">
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
    </details>
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
  return (
    <label className="grid gap-1 text-sm font-medium text-stone-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-stone-300 bg-white px-3 py-2 font-normal outline-none focus:border-stone-900"
      >
        <option value="">{placeholder}</option>
        {horses.map((horse) => (
          <option key={horse.id} value={horse.id}>
            {horse.name} · {horse.breed || t.breedUnknown}
          </option>
        ))}
      </select>
    </label>
  );
}

function PedigreeTree({ horseId, horses, maxDepth = 4, t }) {
  const horse = findHorse(horses, horseId);

  if (!horse) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 p-4 text-sm text-stone-500">
        {t.plannerTitle === "Breeding Planner" && t.switchLanguage === "English"
          ? "Noch kein Pferd ausgewählt."
          : "No horse selected yet."}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <PedigreeNode horse={horse} horses={horses} depth={0} maxDepth={maxDepth} t={t} />
    </div>
  );
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
    () => horses.filter((horse) => horse.sex === "stallion" && horse.availableForBreeding),
    [horses]
  );

  const availableMares = useMemo(
    () => horses.filter((horse) => horse.sex === "mare" && horse.availableForBreeding),
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
    <section className="rounded-2xl border border-black bg-transparent p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-stone-900">{t.plannerTitle}</h2>
        <p className="text-sm text-stone-500">{t.plannerDescription}</p>
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
            className="w-fit rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
          >
            {t.savePairing}
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold text-stone-900">{t.stallionPedigree}</h3>
          <PedigreeTree horseId={stallionId} horses={horses} t={t} />
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-stone-900">{t.marePedigree}</h3>
          <PedigreeTree horseId={mareId} horses={horses} t={t} />
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
      <section className="rounded-2xl border border-black bg-transparent p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-stone-900">{t.pairingsTitle}</h2>
        <p className="mt-2 text-sm text-stone-500">{t.pairingsEmpty}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-black bg-transparent p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-stone-900">{t.pairingsTitle}</h2>
        <p className="text-sm text-stone-500">{t.pairingsDescription}</p>
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
    <section className="rounded-2xl border border-yellow-300 bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">{t.backupTitle}</h2>
          <p className="text-sm text-stone-500">{t.backupDescription}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
          >
            {t.exportCsv}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-200"
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

      <p className="mt-3 rounded-xl bg-yellow-50 px-3 py-2 text-sm text-yellow-900">
        {t.backupTip}
      </p>
    </section>
  );
}

export default function App() {
  const [horses, setHorses] = useState(() => loadFromStorage(STORAGE_KEYS.horses, demoHorses));
  const [pairings, setPairings] = useState(() => loadFromStorage(STORAGE_KEYS.pairings, []));
  const [editingHorse, setEditingHorse] = useState(null);
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

  function createFoalFromPairing(pairing) {
    const stallion = findHorse(horses, pairing.stallionId);
    const mare = findHorse(horses, pairing.mareId);

    if (!stallion || !mare) return;

    const foal = {
      id: makeId("h"),
      name: t.foalFrom(stallion.name, mare.name),
      sex: "mare",
      breed: mare.breed || stallion.breed || "",
      color: "",
      genes: "",
      sireId: stallion.id,
      damId: mare.id,
      availableForBreeding: false,
      owner: mare.owner || stallion.owner || "",
      notes: t.autoFoalNote(stallion.name, mare.name),
    };

    setHorses((current) => [foal, ...current]);
  }

  function importBackup(importedHorses, importedPairings) {
    setHorses(importedHorses);
    setPairings(importedPairings);
    setEditingHorse(null);
  }

  function resetDemoData() {
    const confirmed = window.confirm(t.resetDemoConfirm);
    if (!confirmed) return;

    setHorses(demoHorses);
    setPairings([]);
    setEditingHorse(null);
    localStorage.removeItem(STORAGE_KEYS.horses);
    localStorage.removeItem(STORAGE_KEYS.pairings);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-stone-900">
      <div className="mx-auto grid max-w-7xl gap-6">
        <header className="rounded-3xl border border-amber-700 bg-gradient-to-r from-[#6f3f22] via-[#9b6a3d] to-[#d8b27c] p-6 text-white shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-amber-100">{t.appLabel}</p>
              <h1 className="mt-2 text-3xl font-bold md:text-5xl">{t.appTitle}</h1>
              <p className="mt-3 max-w-2xl text-amber-50">{t.appSubtitle}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLanguage(language === "de" ? "en" : "de")}
                className="rounded-xl border border-amber-200 bg-white/80 px-4 py-2 text-sm font-semibold text-stone-900 hover:bg-white"
              >
                {t.switchLanguage}
              </button>

              <button
                onClick={resetDemoData}
                className="rounded-xl border border-amber-200 bg-white/80 px-4 py-2 text-sm font-semibold text-stone-900 hover:bg-white"
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

        <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          <HorseForm
            horses={horses}
            editingHorse={editingHorse}
            onSaveHorse={saveHorse}
            onCancelEdit={() => setEditingHorse(null)}
            t={t}
          />
          <PairingList pairings={pairings} horses={horses} onCreateFoal={createFoalFromPairing} t={t} />
        </div>
      </div>
    </main>
  );
}
