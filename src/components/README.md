# Components Directory

This directory is for reusable UI components.

## Creating Components

Create components here that are used across multiple screens:

### Example: Button Component

```typescript
// src/components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary'
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' && styles.secondaryButton
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default Button;
```

### Example: Card Component

```typescript
// src/components/Card.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return <View style={styles.card}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
});

export default Card;
```

## Best Practices

1. **Keep components small and focused** - Each component should do one thing well
2. **Use TypeScript** - Define prop interfaces for type safety
3. **Make components reusable** - Use props for customization
4. **Use the theme** - Import colors, spacing, and fonts from `constants/theme.ts`
5. **Export from index** - Create an `index.ts` file to export all components

### Example index.ts

```typescript
// src/components/index.ts
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';
```

Then import anywhere:
```typescript
import { Button, Card, Input } from '../components';
```
