import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

type CustomLeaveNoteAlertProps = {
  visible: boolean;
  onLeave: (event: GestureResponderEvent) => void;
  onCancel: (event: GestureResponderEvent) => void;
};

const CustomDeleteAlert: React.FC<CustomLeaveNoteAlertProps> = ({
  visible,
  onLeave,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>Discard changes?</Text>
          <Text style={styles.message}>You have unsaved changes. Do you want to discard them and leave?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Stay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.discardButton} onPress={onLeave}>
              <Text style={styles.discardText}>"Discard & Leave"</Text>
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
    textAlign: 'center'
  },
  discardButton: {
    backgroundColor: '#ff5555',
    borderWidth:1,
    borderColor: '#ff5555',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  discardText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default CustomDeleteAlert;