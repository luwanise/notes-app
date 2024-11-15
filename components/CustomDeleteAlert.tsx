import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

type CustomDeleteAlertProps = {
  visible: boolean;
  onDelete: (event: GestureResponderEvent) => void;
  onCancel: (event: GestureResponderEvent) => void;
};

const CustomDeleteAlert: React.FC<CustomDeleteAlertProps> = ({
  visible,
  onDelete,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>Delete this note?</Text>
          <Text style={styles.message}>
            This action will permanently remove the note and cannot be undone.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteText}>Delete Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cancelButton: {
    borderColor: '#808080',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelText: {
    fontSize: 16,
    color: '#555',
  },
  deleteButton: {
    backgroundColor: '#ff5555',
    borderWidth:1,
    borderColor: '#ff5555',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CustomDeleteAlert;