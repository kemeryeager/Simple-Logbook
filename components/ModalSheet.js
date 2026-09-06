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
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ModalSheet({
  visible = false,
  onClose,
  title,
  subtitle,
  children,
  theme,
}) {
  const insets = useSafeAreaInsets();
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
      slideAnim.setValue(SCREEN_HEIGHT * 0.4);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 24,
          stiffness: 220,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (showModal) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 160,
          useNativeDriver: false,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT * 0.4,
          duration: 180,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setShowModal(false);
        setKeyboardHeight(0);
        slideAnim.setValue(SCREEN_HEIGHT * 0.4);
      });
    }
  }, [visible]);

  const requestClose = () => {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT * 0.4,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setShowModal(false);
      setKeyboardHeight(0);
      slideAnim.setValue(SCREEN_HEIGHT * 0.4);
      if (onClose) onClose();
    });
  };

  // Robust PanResponder to handle drag-down-to-dismiss gesture on Android and iOS
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 3;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 3;
      },
      onPanResponderGrant: () => {
        slideAnim.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        } else {
          // slight elastic resistance when dragging up
          slideAnim.setValue(gestureState.dy * 0.12);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 65 || gestureState.vy > 0.32) {
          requestClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            damping: 24,
            stiffness: 240,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 24,
          stiffness: 240,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

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

        {/* Bottom Sheet Container dynamically lifting with keyboard & respecting bottom navigation bar */}
        <View
          style={[
            styles.sheetContainer,
            {
              paddingBottom:
                keyboardHeight > 0
                  ? keyboardHeight + 8
                  : Math.max(insets.bottom + 8, Platform.OS === 'ios' ? 24 : 16),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.sheetContent,
              theme && {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              {
                maxHeight: contentMaxHeight,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Top Draggable Header Area (Covers handle and title area) */}
            <View
              style={[
                styles.headerWrapper,
                theme && { borderBottomColor: theme.borderMuted },
              ]}
            >
              {/* Entire header surface is draggable */}
              <View
                {...panResponder.panHandlers}
                style={styles.draggableHeaderArea}
                collapsable={false}
              >
                {/* Drag Handle Bar */}
                <View style={styles.handleContainer}>
                  <View
                    style={[
                      styles.dragHandle,
                      theme && { backgroundColor: theme.border },
                    ]}
                  />
                </View>

                {/* Title & Subtitle */}
                <View style={styles.headerContentRow}>
                  <View style={styles.headerTextCol}>
                    {title ? (
                      <Text
                        style={[
                          styles.title,
                          theme && { color: theme.textPrimary },
                        ]}
                        numberOfLines={1}
                      >
                        {title}
                      </Text>
                    ) : null}
                    {subtitle ? (
                      <Text
                        style={[
                          styles.subtitle,
                          theme && { color: theme.textMuted },
                        ]}
                        numberOfLines={1}
                      >
                        {subtitle}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              {/* Close Button - Positioned absolutely at top right, outside panResponder */}
              <Pressable
                onPress={requestClose}
                hitSlop={12}
                style={({ pressed }) => [
                  styles.closeButton,
                  theme && { backgroundColor: theme.btnSecondaryBg },
                  pressed && {
                    backgroundColor: theme ? theme.border : '#E4E4E7',
                  },
                ]}
              >
                <X
                  size={16}
                  color={theme ? theme.textMuted : '#71717A'}
                  strokeWidth={2.4}
                />
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
  headerWrapper: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
  },
  draggableHeaderArea: {
    width: '100%',
    paddingBottom: 12,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#D4D4D8',
  },
  headerContentRow: {
    paddingLeft: 20,
    paddingRight: 60, // leaves room for the close button
  },
  headerTextCol: {
    justifyContent: 'center',
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
    position: 'absolute',
    right: 16,
    bottom: 12,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
