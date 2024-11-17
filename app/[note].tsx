import React, { useEffect, useState } from "react";
import { Alert, Keyboard, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ToastAndroid } from "react-native";
import CustomLeaveNoteAlert from "@/components/CustomLeaveNoteAlert";

type Note = {
    noteTitle: string,
    noteText: string
}

export default function Note() {

    const params = useLocalSearchParams();
    const noteId = params.note.toString();

    const [noteText, setNoteText] = useState("");
    const [noteTitle, setNoteTitle] = useState("");

    const [editMode, setEditMode] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [onLeave, setOnLeave] = useState<() => void>(() => () => {});

    const [isWarning, setIsWarning] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        if (editMode){
            const unsubscribe = navigation.addListener("beforeRemove", (e) => {
                e.preventDefault()

                setAlertVisible(true);
                setOnLeave(() => () => navigation.dispatch(e.data.action));
            })

            return unsubscribe
        }
    }, [navigation, editMode])

    const saveNote = async (noteTitle: string, noteText: string) => {
        try {
            let newNote: Note = {
                noteTitle: noteTitle,
                noteText: noteText
            };

            if (noteId === "new") {
                const newId = `note-${Date.now()}`;
                await AsyncStorage.setItem(newId, JSON.stringify(newNote));
            } else {
                await AsyncStorage.setItem(noteId, JSON.stringify(newNote));
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getNote = async () => {
        try {
            const note = await AsyncStorage.getItem(noteId);
            return note != null ? JSON.parse(note) : null;
        } catch (error){
            console.error("Error", error);
        }
    }

    useEffect(() => {   
        // get current note
        if (noteId !== "new"){
            getNote().then((note) => {
                if (note) {
                    setNoteTitle(note.noteTitle);
                    setNoteText(note.noteText);
                } else {
                    console.error("Failed to get note!")
                }
            })
        }
    }, [noteId]);

    const sendToast = (message: string) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT)
        } else {
            Alert.alert(message);
        }
    }

    const initiateSave = () => {
        if (noteTitle !== ''){
            setEditMode(false);
            saveNote(noteTitle, noteText);
            sendToast("Your note was saved! 🎉"); // send a Toast message that the note has been saved
            Keyboard.dismiss(); // hide the keyboard
        } else {
            setIsWarning(true);
            Keyboard.dismiss();
            sendToast("Note Title is required!");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <TextInput
                    style={[styles.headerInput, isWarning && styles.warningInput]}
                    value={noteTitle}
                    onChangeText={(noteTitle) => {
                        setEditMode(true);
                        setNoteTitle(noteTitle);
                        setIsWarning(false);
                    }}
                    placeholder="Title"
                    maxLength={35}
                    autoCapitalize="words"

                />
                <TouchableOpacity 
                style={[styles.save, !editMode && styles.saveDisabled]} 
                onPress= {() => {
                    initiateSave()
                }}
                disabled= {!editMode} // disable button if not in edit mode
                >  
                    <Ionicons name="checkmark-done" size={30} color="blue"/>
                </TouchableOpacity>
            </View>

            <TextInput
                placeholder="Your notes here..."
                style={styles.body}
                value={noteText}
                onChangeText={(noteText) => {
                    setEditMode(true)
                    setNoteText(noteText);
                }}
                multiline={true}
            />

            <CustomLeaveNoteAlert
              visible={alertVisible}
              onLeave={() => {
                setAlertVisible(false)
                onLeave();
              }}
              onCancel={() => setAlertVisible(false)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        paddingTop: 40,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    back: {
        alignSelf: "center",
        paddingHorizontal: 5,
    },
    save: {
        alignSelf: "center",
        paddingHorizontal: 5,
    },
    saveDisabled: {
        opacity: 0.3,
    },
    headerInput: {
        flex: 1,
        fontSize: 20,
        textAlign: "center",
        borderBottomWidth: 1,
        borderColor: "transparent",
    },
    warningInput: {
        borderColor: "red",
        borderBottomWidth: 1,
    },
    body: {
        flex: 1,
        fontSize: 18,
        padding: 12,
        backgroundColor: 'white',
        textAlignVertical: "top"
    }
})