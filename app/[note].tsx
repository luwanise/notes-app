import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

type Note = {
    noteTitle: string,
    noteText: string
}

export default function Note() {

    const params = useLocalSearchParams();
    const noteId = params.note.toString();

    const [noteText, setNoteText] = useState("");
    const [noteTitle, setNoteTitle] = useState("");

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <TextInput
                    style={styles.headerInput}
                    value={noteTitle}
                    onChangeText={setNoteTitle}
                    placeholder="Title"
                    maxLength={35}
                    autoCapitalize="words"

                />
                <TouchableOpacity style={styles.save} onPress= {() => {
                    saveNote(noteTitle, noteText);
                    router.navigate('/');
                }} >
                    <Ionicons name="checkmark-done" size={30} color="blue"/>
                </TouchableOpacity>
            </View>

            <TextInput
                placeholder="Your notes here..."
                style={styles.body}
                value={noteText}
                onChangeText={(noteText) => {
                    setNoteText(noteText);
                }}
                multiline={true}
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
    headerInput: {
        fontSize: 20,
        flex: 1,
        textAlign: "center",
    },
    body: {
        flex: 1,
        fontSize: 18,
        padding: 12,
        backgroundColor: 'white',
        textAlignVertical: "top"
    }
})