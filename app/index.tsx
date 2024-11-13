import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Note {
  noteId: string;
  noteTitle: string;
  noteText: string;
}

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const navigation = useNavigation();

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Notes",
      headerRight: () => 
      selectionMode ? (
      <TouchableOpacity style={styles.newNote} onPress={() => deleteNote(selectedNotes)}>
        <Ionicons name="trash" size={30} color="red"/>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={styles.newNote} onPress={() => router.navigate('/new') }>
        <Ionicons name="add" size={30} color="blue"/>
      </TouchableOpacity>
    )
    });
  }, [navigation, selectionMode, selectedNotes]);

  useEffect(() => {
    const loadNotes = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const allNotes = await AsyncStorage.multiGet(keys);

      const notesList = allNotes.map(([noteId, noteJson]) => {
        if (noteJson) {
          const { noteTitle, noteText } = JSON.parse(noteJson);
          return { noteId, noteTitle, noteText };
        }
      }).filter(Boolean) as Note[];

      setNotes(notesList);
    };

    const unsubscribe = navigation.addListener('focus', loadNotes);
    return unsubscribe;
  }, [navigation]);

  const deleteNote = async (selectedNotes: string[]) => {
    try {
      // remove from AsyncStorage
      await AsyncStorage.multiRemove(selectedNotes);

      console.log("Selected Notes:", selectedNotes);

      // remove from state
      const updatedNotes = notes.filter((note) => !selectedNotes.includes(note.noteId));
      setNotes(updatedNotes)

      // reset selected notes
      setSelectedNotes([]);
      setSelectionMode(false);
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const toggleSelectedNote = (noteId: string) => {
    if (selectedNotes.includes(noteId)){
      const updatedNotes = selectedNotes.filter((id) => id != noteId);
      setSelectedNotes(updatedNotes);
      if (updatedNotes.length === 0){
        setSelectionMode(false); // exit selection mode if no notes remain selected
      }
    } else {
      const updatedNotes = [...selectedNotes, noteId];
      setSelectedNotes(updatedNotes);
      setSelectionMode(true);
    }

    console.log("Toggled Notes:", selectedNotes);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(note) => note.noteId}
        renderItem={({ item }) => (
          <View style={ selectedNotes.includes(item.noteId) && styles.selectedNote }>
            <TouchableOpacity 
              onLongPress={() => toggleSelectedNote(item.noteId)}
              onPress={() => {
                if (selectionMode){
                  toggleSelectedNote(item.noteId)
                } else {
                  router.navigate(`/${item.noteId}`)
                }
              }}
              style={[
                styles.noteContainer,
                selectedNotes.includes(item.noteId) && styles.selectedNote
              ]}
            >
              <View>
                <Text style={styles.noteTitle}>{item.noteTitle}</Text>
                <Text style={styles.noteText}>
                  {item.noteText.length > 100 ? `${item.noteText.substring(0, 100)}...` : item.noteText}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  newNote: {
    alignSelf: "center"
  },
  noteContainer: {
    marginHorizontal: 15,
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  selectedNote: {
    backgroundColor: "#e0f7fa"
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  noteText: {
    fontSize: 16,
    color: "#555",
  },
});