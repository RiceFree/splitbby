import { Platform, StyleSheet } from 'react-native';

export const Colors = {
  primary: '#5ec436ff',
  background: '#ffffff',
  text: '#11181C',
  muted: '#687076',
  error: '#ff4444',
  border: '#dddddd',
};

export const Fonts = {
  titleSize: 32,
  subtitleSize: 18,
  bodySize: 16,
};

const baseInput = {
  borderWidth: 1,
  borderColor: Colors.border,
  borderRadius: 8,
  padding: 12,
  fontSize: Fonts.bodySize,
  backgroundColor: Colors.background,
};

export const global = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },

  // Headings / Text
  title: {
    fontSize: Fonts.titleSize,
    fontWeight: '700',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: Fonts.subtitleSize,
    fontWeight: '600',
    color: Colors.text,
  },
  body: {
    fontSize: Fonts.bodySize,
    color: Colors.text,
  },
  muted: {
    fontSize: Fonts.bodySize,
    color: Colors.muted,
  },

  // Form
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: Colors.text,
  },
  input: {
    ...baseInput,
    marginBottom: 8,
  },
  inputError: {
    ...baseInput,
    borderColor: Colors.error,
  },

  // Buttons
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: Fonts.bodySize,
  },

  // Links & messages
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  message: {
    marginTop: 12,
    color: Colors.primary,
    textAlign: 'center',
  },
  error: {
    color: Colors.error,
    fontSize: 13,
    marginTop: 6,
  },

  // Small helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    height: 12,
  },
  // Platform specific tweaks
  iosInputFix: Platform.OS === 'ios' ? { paddingVertical: 14 } : {},
});

export default global;
