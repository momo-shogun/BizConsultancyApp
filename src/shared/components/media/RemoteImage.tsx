import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  StyleSheet,
  type ImageProps,
  type ImageStyle,
  type StyleProp,
} from 'react-native';

import { ImagePlaceholder, type ImagePlaceholderVariant } from './ImagePlaceholder';

export interface RemoteImageProps extends Omit<ImageProps, 'source'> {
  uri: string | null | undefined;
  placeholderVariant?: ImagePlaceholderVariant;
  placeholderName?: string;
  imageStyle?: StyleProp<ImageStyle>;
  placeholderStyle?: StyleProp<ImageStyle>;
}

/**
 * Renders a remote image or a neutral placeholder when URI is missing / load fails.
 */
export function RemoteImage({
  uri,
  placeholderVariant = 'card',
  placeholderName,
  style,
  imageStyle,
  placeholderStyle,
  resizeMode = 'cover',
  accessibilityLabel,
  ...imageProps
}: RemoteImageProps): React.ReactElement {
  const trimmedUri = useMemo(() => uri?.trim() ?? '', [uri]);
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    setFailed(false);
  }, [trimmedUri]);

  const showPlaceholder = trimmedUri.length === 0 || failed;

  if (showPlaceholder) {
    return (
      <ImagePlaceholder
        variant={placeholderVariant}
        name={placeholderName}
        style={[StyleSheet.absoluteFill, style, placeholderStyle]}
        accessibilityLabel={accessibilityLabel ?? 'Image unavailable'}
      />
    );
  }

  return (
    <Image
      {...imageProps}
      source={{ uri: trimmedUri }}
      style={[StyleSheet.absoluteFill, style, imageStyle]}
      resizeMode={resizeMode}
      accessibilityLabel={accessibilityLabel}
      accessibilityIgnoresInvertColors
      onError={() => setFailed(true)}
    />
  );
}
