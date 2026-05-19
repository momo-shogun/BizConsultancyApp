import { useAnimatedScrollHandler } from 'react-native-reanimated';

import { reportBizAIScroll } from '../engine/bizAiScrollBridge';

/** Attach to ScrollView / FlatList `onScroll` on tab root screens. */
export function useBizAIScrollReporter(): ReturnType<typeof useAnimatedScrollHandler> {
  return useAnimatedScrollHandler({
    onScroll: (event) => {
      reportBizAIScroll(event.contentOffset.y);
    },
  });
}
