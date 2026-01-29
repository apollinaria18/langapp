import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const GRID_ROWS = 18;
const GRID_COLS = 35;

const PURPLE = "#6C63FF";

const WORDS = [
  { id: 1, label: 1, answer: "COMPULSORY", row: 0, col: 10, direction: "down", clue: "Something that must be done by rule or law" },
  { id: 3, label: 3, answer: "INTERROGATE", row: 1, col: 15, direction: "down", clue: "To question someone for a long time to get information" },
  { id: 4, label: 4, answer: "CHANCES", row: 1, col: 18, direction: "down", clue: "To do something risky or dangerous is to take..." },
  { id: 5, label: 5, answer: "PICK", row: 3, col: 21, direction: "down", clue: "When you repeatedly treat someone unfairly or unkindly you ... on them" },
  { id: 9, label: 9, answer: "FIBBER", row: 7, col: 12, direction: "down", clue: "A person who tells small lies" },
  { id: 10, label: 10, answer: "REPRIMAND", row: 7, col: 17, direction: "down", clue: "Strong official criticism of a person or their behaviour" },
  { id: 2, label: 2, answer: "SUPERVISION", row: 1, col: 1, direction: "across", clue: "The act of watching a person or activity to make sure everything is done correctly or safely" },
  { id: 6, label: 6, answer: "THIEF", row: 4, col: 12, direction: "across", clue: "A person that steals" },
  { id: 7, label: 7, answer: "CLOCK", row: 5, col: 18, direction: "across", clue: "At work or on the ..." },
  { id: 8, label: 8, answer: "OFF-HOURS", row: 7, col: 10, direction: "across", clue: "The time when someone is not at work" },
  { id: 11, label: 11, answer: "APPEAL", row: 9, col: 15, direction: "across", clue: "The quality that makes someone or something attractive and interesting" },
  { id: 12, label: 12, answer: "ACCOUNTABLE", row: 11, col: 2, direction: "across", clue: "To hold someone responsible for something and expect an explanation" },
];

const makeEmptyGrid = () =>
  Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => ({
      char: "",
      isLetter: false,
      startLabels: [],
      wordIds: []
    }))
  );

export default function Exercise1CrosswordScreen() {
  const navigation = useNavigation();
  const initialWordState = WORDS.reduce((acc, w) => {
    acc[w.id] = { correct: null, attempts: 0, lastAttemptCorrect: null };
    return acc;
  }, {});
  const [grid, setGrid] = useState(makeEmptyGrid());
  const [wordState, setWordState] = useState(initialWordState);
  const [activeWordInput, setActiveWordInput] = useState(null);
  const [allFilled, setAllFilled] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [checkSubmitted, setCheckSubmitted] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [penalty, setPenalty] = useState(0); // 🔹 новый стейт для накопленных штрафов

  useEffect(() => {
    const g = makeEmptyGrid();
    WORDS.forEach((w) => {
      const letters = w.answer.split("");
      for (let i = 0; i < letters.length; i++) {
        const r = w.direction === "across" ? w.row : w.row + i;
        const c = w.direction === "across" ? w.col + i : w.col;
        if (r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS) {
          g[r][c].isLetter = true;
          if (!g[r][c].wordIds.includes(w.id)) g[r][c].wordIds.push(w.id);
        }
      }
      if (w.row >= 0 && w.row < GRID_ROWS && w.col >= 0 && w.col < GRID_COLS) {
        g[w.row][w.col].startLabels.push(w.label);
      }
    });
    setGrid(g);
  }, []);

  const coordinatesForWord = (w) => {
    const coords = [];
    for (let i = 0; i < w.answer.length; i++) {
      const r = w.direction === "across" ? w.row : w.row + i;
      const c = w.direction === "across" ? w.col + i : w.col;
      coords.push({ r, c });
    }
    return coords;
  };

  const handleCellPress = (r, c) => {
    const startWord = WORDS.find((w) => w.row === r && w.col === c);
    if (!startWord) return;
    setActiveWordInput({ wordId: startWord.id, text: "" });
  };

  const submitFullWord = (wordId) => {
    const word = WORDS.find((w) => w.id === wordId);
    if (!word) return;
    const input = activeWordInput?.text?.trim().toUpperCase();
    if (!input) return;
    
    const isCorrect = input === word.answer.toUpperCase();
    const attempts = (wordState[wordId]?.attempts || 0) + 1;
    
    setWordState(prev => ({
      ...prev,
      [wordId]: { 
        ...prev[wordId],
        correct: isCorrect,
        lastAttemptCorrect: isCorrect,
        attempts: attempts
      }
    }));

    const coords = coordinatesForWord(word);
    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      coords.forEach(({ r, c }, i) => {
        if (r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS) {
          next[r][c].char = input[i] || "";
        }
      });
      return next;
    });
    setActiveWordInput(null);
  };

  useEffect(() => {
    const filled = WORDS.every((w) =>
      coordinatesForWord(w).every(({ r, c }) => grid[r]?.[c]?.char)
    );
    setAllFilled(filled);
  }, [grid]);

  // функция Левенштейна
  function levenshtein(a, b) {
    const m = [];
    for (let i = 0; i <= b.length; i++) m[i] = [i];
    for (let j = 0; j <= a.length; j++) m[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        m[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
          ? m[i - 1][j - 1]
          : Math.min(
              m[i - 1][j - 1] + 1,
              Math.min(m[i][j - 1] + 1, m[i - 1][j] + 1)
            );
      }
    }
    return m[b.length][a.length];
  }

  const handleCheckAll = () => {
    const newState = {};
    let allCorrect = true;
    let newPenalty = penalty; // 🔹 продолжаем считать штрафы

    WORDS.forEach((w) => {
      const user = coordinatesForWord(w)
        .map(({ r, c }) => grid[r]?.[c]?.char || "")
        .join("");

      const isCorrect = user === w.answer.toUpperCase();
      const prevAttempts = wordState[w.id]?.attempts || 0;

      if (!isCorrect) {
        allCorrect = false;
        const dist = levenshtein(user, w.answer.toUpperCase());

        if (dist > 0 && dist <= 2) {
          newPenalty += 2; // опечатка
        } else {
          newPenalty += 8; // другое слово
        }
      }

      newState[w.id] = { 
        correct: isCorrect,
        lastAttemptCorrect: isCorrect,
        attempts: prevAttempts + 1
      };
    });

    setWordState(newState);
    setPenalty(newPenalty);
    setCheckSubmitted(true);
    setAllCorrect(allCorrect);

    if (allCorrect) {
      const finalScore = Math.max(0, 100 - newPenalty);
      setScore(finalScore);
      setResultsVisible(true);
    }
  };

  const renderCell = (r, c) => {
    const cell = grid[r][c];
    if (!cell.isLetter) return <View key={`${r}-${c}`} style={[styles.cell, styles.emptyCell]} />;

    let bgColor = "#cdccedff";
    if (checkSubmitted) {
      const statuses = cell.wordIds.map((id) => wordState[id]?.correct ?? null);
      if (statuses.includes(true)) bgColor = "#78e268ff"; // зелёный
      else if (statuses.includes(false)) bgColor = "#e78080ff"; // красный
    }

    return (
      <TouchableOpacity
        key={`${r}-${c}`}
        style={[styles.cell, { backgroundColor: bgColor }]}
        onPress={() => handleCellPress(r, c)}
      >
        {cell.startLabels.length > 0 && (
          <Text style={styles.cellLabel}>{cell.startLabels[0]}</Text>
        )}
        <Text style={styles.cellChar}>{cell.char}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crossword</Text>
        <View style={styles.gridContainer}>
          {grid.map((row, r) => (
            <View key={`row-${r}`} style={styles.gridRow}>
              {row.map((_, c) => renderCell(r, c))}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: allFilled ? PURPLE : "#ccc" }]}
          disabled={!allFilled}
          onPress={handleCheckAll}
        >
          <Text style={styles.btnText}>Check</Text>
        </TouchableOpacity>

        <View style={styles.clues}>
          <Text style={styles.clueTitle}>ACROSS:</Text>
          {WORDS.filter(w => w.direction === "across").map(w => (
            <Text key={`a-${w.id}`} style={styles.clueText}>{w.label}. {w.clue}</Text>
          ))}
          <Text style={styles.clueTitle}>DOWN:</Text>
          {WORDS.filter(w => w.direction === "down").map(w => (
            <Text key={`d-${w.id}`} style={styles.clueText}>{w.label}. {w.clue}</Text>
          ))}
        </View>

        <Modal visible={!!activeWordInput} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.wordInputLabel}>
                Enter word for clue {WORDS.find(w => w.id === activeWordInput?.wordId)?.label}:
              </Text>
              <TextInput
                value={activeWordInput?.text || ""}
                onChangeText={(t) => setActiveWordInput((p) => ({ ...p, text: t }))}
                placeholder="Type whole word"
                autoCapitalize="characters"
                style={styles.wordInput}
              />
              <View style={styles.wordInputButtons}>
                <TouchableOpacity
                  style={[styles.btn, { paddingHorizontal: 14, backgroundColor: PURPLE }]}
                  onPress={() => submitFullWord(activeWordInput.wordId)}
                >
                  <Text style={styles.btnText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.clearBtn, { paddingHorizontal: 14 }]}
                  onPress={() => setActiveWordInput(null)}
                >
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {allCorrect && resultsVisible && (
        <View style={styles.resultsOverlay}>
          <View style={styles.resultsBox}>
            <Text style={styles.scoreText}>✅ Score: {score}%</Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() =>
                navigation.navigate("Exercise2Part2Screen", { 
                  part2score1: Number(score) 
                })
              }
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const CELL = 16;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 10, alignItems: "center", flexGrow: 1, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "bold", color: "#6C63FF", marginBottom: 16, marginTop: 20 },
  
  gridContainer: {
    alignItems: "flex-start",
    marginBottom: 16,
    backgroundColor: "#F9F8FF",
    padding: 25,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#ccc",
    width: '100%',
  },
  gridRow: { 
    flexDirection: "row",
    marginLeft: -40,
  },
  cell: {
    width: CELL,
    height: CELL,
    borderWidth: 1,
    borderColor: "#6C63FF",
    margin: 0.4,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: 6,
  },
  emptyCell: { borderWidth: 0, backgroundColor: "transparent" },
  cellChar: { 
    fontSize: 8, 
    fontWeight: "700", 
    color: "#6d087cff",
    textAlign: "center",
    zIndex: 1
  },
  cellLabel: { 
    position: "absolute", 
    top: 1, 
    left: 2, 
    fontSize: 7,
    fontWeight: "500", 
    color: "#3f3aa0ff",
    zIndex: 2
  },
  btn: { 
    paddingVertical: 12, 
    paddingHorizontal: 28, 
    borderRadius: 16, 
    marginVertical: 6, 
    backgroundColor: "#6C63FF", 
    elevation: 5 
  },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  clearBtn: { backgroundColor: "#E85B5B" },
  clues: { marginTop: 20, width: "100%" },
  clueTitle: { fontWeight: "700", marginTop: 12, marginBottom: 4, color: "#6C63FF", fontSize: 16 },
  clueText: { fontSize: 14, marginLeft: 6, marginVertical: 2, color: "#333" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  wordInputLabel: { marginBottom: 12, fontWeight: "700", color: "#6C63FF", textAlign: "center", fontSize: 16 },
  wordInput: { 
    borderWidth: 1, 
    borderColor: "#6C63FF", 
    borderRadius: 12, 
    padding: 10, 
    fontSize: 16, 
    marginBottom: 12, 
    width: "100%" 
  },
  wordInputButtons: { flexDirection: "row", gap: 10 },
  resultsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(187, 184, 246, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
  resultsBox: {
    backgroundColor: '#8B82FF',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  scoreText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#4A44C6',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 16,
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 