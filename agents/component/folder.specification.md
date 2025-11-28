# Component Folder Specification

## Structure

When creating a component `X`, create the following folder structure:

```
components/
  X/
    index.ts          # Exports
    X.styles.ts       # Styles
    X.component.tsx   # Component logic & JSX
    X.types.ts        # Types (optional, if needed)
```

## File Templates

### 1. `index.ts` - Exports

```typescript
export { X } from "./X.component";
export type { XProps } from "./X.types"; // if types exist
```

### 2. `X.styles.ts` - Styles

```typescript
import { StyleSheet } from "react-native";
import { SoloLevelingPalette } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    // styles here
  },
});
```

### 3. `X.component.tsx` - Component

```typescript
import React from "react";
import { View } from "react-native";
import { styles } from "./X.styles";
import type { XProps } from "./X.types";

export function X({ ...props }: XProps) {
  return <View style={styles.container}>{/* component content */}</View>;
}
```

### 4. `X.types.ts` - Types (Optional)

```typescript
export interface XProps {
  // prop definitions
}
```

## Example: Creating `LevelBadge` Component

```
components/
  LevelBadge/
    index.ts
    LevelBadge.styles.ts
    LevelBadge.component.tsx
    LevelBadge.types.ts
```

## Rules

1. Folder name = Component name (PascalCase)
2. Always create `index.ts`, `styles.ts`, and `component.tsx`
3. Create `types.ts` only when external types are needed
4. Use named exports, not default exports
5. Import styles from local `./X.styles`
6. Import theme from `@/constants/theme`
