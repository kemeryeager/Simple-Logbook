import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
  ScrollView,
  Dimensions,
  Keyboard,
} from 'react-native';
import { X } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ModalSheet({
  visible = false,
  onClose,
  title,
  subtitle,
  children,
}) {
  const [showModal, setShowModal] = useState(visible);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT * 0.4)).current;

  // Track keyboard appearance to lift the modal above it
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 24,
          stiffness: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (showModal) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT * 0.4,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
        setKeyboardHeight(0);
      });
    }
  }, [visible]);

  const requestClose = () => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT * 0.4,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowModal(false);
      setKeyboardHeight(0);
      if (onClose) onClose();
    });
  };

  if (!showModal) return null;

  const contentMaxHeight =
    keyboardHeight > 0
      ? Math.max(SCREEN_HEIGHT - keyboardHeight - 40, 240)
      : SCREEN_HEIGHT * 0.86;

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      onRequestClose={requestClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* Animated Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.4],
              }),
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={requestClose} />
        </Animated.View>

        {/* Bottom Sheet Container dynamically lifting with keyboard */}
        <View
          style={[
            styles.sheetContainer,
            {
              paddingBottom: keyboardHeight > 0 ? keyboardHeight : (Platform.OS === 'ios' ? 24 : 12),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.sheetContent,
              {
                maxHeight: contentMaxHeight,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Top Drag Indicator */}
            <View style={styles.handleContainer}>
              <View style={styles.dragHandle} />
            </View>

            {/* Sheet Header */}
            <View style={styles.header}>
              <View style={styles.headerTextCol}>
                {title ? <Text style={styles.title}>{title}</Text> : null}
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
              </View>

              <Pressable
                onPress={requestClose}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && { backgroundColor: '#E4E4E7' },
                ]}
              >
                <X size={16} color="#71717A" strokeWidth={2.4} />
              </Pressable>
            </View>

            {/* Scrollable Children */}
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: keyboardHeight > 0 ? 36 : 24 },
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              automaticallyAdjustKeyboardInsets={true}
            >
              {children}
            </ScrollView>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#09090B',
  },
  sheetContainer: {
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 24,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#D4D4D8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
  },
  headerTextCol: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#09090B',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
