import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions, FlatList, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatusSuccess } from 'expo-av';
import * as Haptics from 'expo-haptics';

type FeedItem = {
  id: string;
  caption: string;
  hls: { masterUrl: string; posterUrl: string };
};

export default function App() {
  const [data, setData] = useState<FeedItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const playerRefs = useRef<Record<string, Video | null>>({});

  useEffect(() => {
    fetch('http://localhost:3000/feed?mode=for-you').then((r) => r.json()).then(setData).catch(() => setData([]));
  }, []);

  useEffect(() => {
    Object.values(playerRefs.current).forEach((p, i) => {
      // no-op
    });
  }, [data]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const idx = viewableItems[0].index || 0;
      setActiveIndex(idx);
    }
  }).current;

  useEffect(() => {
    data.forEach((item, idx) => {
      const ref = playerRefs.current[item.id];
      if (!ref) return;
      if (idx === activeIndex) {
        ref.playAsync?.();
      } else {
        ref.pauseAsync?.();
      }
    });
  }, [activeIndex, data]);

  const onDoubleTap = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const renderItem = ({ item, index }: { item: FeedItem; index: number }) => (
    <TouchableWithoutFeedback onPress={onDoubleTap}>
      <View style={styles.page}>
        <Video
          ref={(ref) => (playerRefs.current[item.id] = ref)}
          source={{ uri: item.hls.masterUrl }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay={index === activeIndex}
          posterSource={{ uri: item.hls.posterUrl }}
          usePoster
        />
        <View style={styles.caption}><Text style={styles.captionText}>{item.caption}</Text></View>
        <View style={styles.rail}><Text style={styles.railText}>❤ ↗ 💬</Text></View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i.id}
      pagingEnabled
      decelerationRate="fast"
      renderItem={renderItem}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
      getItemLayout={(_, index) => ({ length: Dimensions.get('window').height, offset: Dimensions.get('window').height * index, index })}
    />
  );
}

const styles = StyleSheet.create({
  page: { height: Dimensions.get('window').height, backgroundColor: 'black' },
  video: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  caption: { position: 'absolute', bottom: 80, left: 16 },
  captionText: { color: 'white', fontSize: 16 },
  rail: { position: 'absolute', right: 16, bottom: 120 },
  railText: { color: 'white', fontSize: 24 },
});

