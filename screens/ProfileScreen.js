import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { signOut, deleteUser } from "firebase/auth";
import { TextInput, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext"; // ✅ импорт контекста темы

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [newName, setNewName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const { theme, toggleTheme } = useContext(ThemeContext); // ✅ доступ к теме
  const isDark = theme === "dark";

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserData(snap.data());
          setNewName(snap.data().username || "");
        }
      } catch (e) {
        console.log("🔥 Error loading user:", e);
      }
    };
    fetchUser();
  }, [user]);

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { username: newName });
      setUserData({ ...userData, username: newName });
      setEditModal(false);
      Alert.alert("✅ Success", "Nickname updated!");
    } catch (e) {
      Alert.alert("Error", "Failed to update nickname.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("Login");
  };

  const handleDeleteAccount = async () => {
    Alert.alert("Delete Account", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "users", user.uid));
            await deleteUser(user);
            navigation.replace("Register");
          } catch (e) {
            Alert.alert("Error", "Failed to delete account.");
          }
        },
      },
    ]);
  };

  if (!userData) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? "#1E1E2E" : "#F5F5F5" }]}>
        <Text style={{ color: isDark ? "white" : "black" }}>Loading profile...</Text>
      </View>
    );
  }

  const date = userData.createdAt?.toDate
    ? userData.createdAt.toDate().toLocaleDateString()
    : "Unknown";

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#1E1E2E" : "#F5F5F5" }]}>
      {/* ⚙️ Шестерёнка */}
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="settings-outline" size={28} color={isDark ? "white" : "black"} />
      </TouchableOpacity>

      {/* Аватар */}
      <View style={styles.avatarSection}>
        <Ionicons name="person-circle-outline" size={140} color={isDark ? "#4A90E2" : "#6C63FF"} />
      </View>

      {/* Инфо */}
      <Text style={[styles.username, { color: isDark ? "white" : "black" }]}>
        {userData.username || user.email.split("@")[0]}
      </Text>
      <Text style={[styles.text, { color: isDark ? "#ccc" : "#333" }]}>
        Registered: {date}
      </Text>

      {/* Кнопка смены ника */}
      <TouchableOpacity
        style={[styles.changeBtn, { backgroundColor: isDark ? "#6C63FF" : "#4A90E2" }]}
        onPress={() => setEditModal(true)}
      >
        <Ionicons name="pencil-outline" size={18} color="white" />
        <Text style={styles.changeBtnText}> Change nickname</Text>
      </TouchableOpacity>

      {/* Модалка для смены ника */}
      <Modal visible={editModal} animationType="fade" transparent onRequestClose={() => setEditModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.editModalBox}>
            <Text style={styles.modalTitle}>Edit your nickname</Text>
            <TextInput
              label="New nickname"
              value={newName}
              onChangeText={setNewName}
              style={styles.input}
            />
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Button
                mode="contained"
                style={[styles.modalBtn, { backgroundColor: "#6C63FF" }]}
                onPress={handleUpdateName}
              >
                Save
              </Button>
              <Button
                mode="outlined"
                style={[styles.modalBtn, { marginLeft: 10 }]}
                onPress={() => setEditModal(false)}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модалка с настройками */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? "#2C2C3A" : "white" }]}>
            <Button
              mode="contained"
              style={styles.actionButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("ReviewScreen");
              }}
            >
              Leave feedback
            </Button>

            <Button
              mode="contained"
              style={styles.actionButton}
              onPress={handleLogout}
            >
              Logout
            </Button>

            <Button
              mode="contained"
              style={[styles.actionButton, { backgroundColor: "rgba(255,0,0,0.6)" }]}
              onPress={handleDeleteAccount}
            >
              Delete account
            </Button>

            {/* Переключатель темы */}
            <Button
              mode="contained"
              style={[styles.actionButton, { backgroundColor: isDark ? "#444" : "#ddd" }]}
              onPress={toggleTheme}
            >
              Switch to {isDark ? "Light" : "Dark"} theme
            </Button>

            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 15 }}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  settingsIcon: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  avatarSection: {
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 5,
  },
  changeBtn: {
    flexDirection: "row",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  changeBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  editModalBox: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
  },
  modalBtn: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    height: "55%",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "center",
  },
  actionButton: {
    marginVertical: 10,
    backgroundColor: "rgba(108,99,255,0.7)",
    paddingVertical: 8,
  },
});
