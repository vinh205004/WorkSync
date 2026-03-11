import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = true,
  disabled = false,
  style,
  ...props
}) => {
  const variantStyles = {
    primary: { backgroundColor: '#4CAF50' },
    secondary: { backgroundColor: '#2196F3' },
    danger: { backgroundColor: '#f44336' },
  };

  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 12 },
    medium: { paddingVertical: 12, paddingHorizontal: 16 },
    large: { paddingVertical: 16, paddingHorizontal: 20 },
  };

  const buttonStyle = [
    styles.button,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && { flex: 1 },
    (loading || disabled) && styles.disabled,
    style,
  ];

  const textSizes = {
    small: 12,
    medium: 14,
    large: 16,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={[styles.text, { fontSize: textSizes[size] }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});
