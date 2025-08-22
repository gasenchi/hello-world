import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Dimensions, FlatList, TouchableOpacity, TouchableWithoutFeedback, Text, StyleSheet, ActivityIndicator, RefreshControl, Animated, Easing, Image, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as Haptics from 'expo-haptics';

 type FeedItem = {
  id: string;
  caption: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  hls: { masterUrl: string; posterUrl: string };
};

export default function ForYou() {
  const [data, setData] = useState<FeedItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const playerRefs = useRef<Record<string, Video | null>>({});
  const likeAnim = useRef(new Animated.Value(0)).current;
  const lastTapRef = useRef<number>(0);
  const [optimisticLikes, setOptimisticLikes] = useState<Record<string, number>>({});

  const fetchFeed = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/feed?mode=for-you');
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError('Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFeed();
    setRefreshing(false);
  }, [fetchFeed]);

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
    const next = data[activeIndex + 1];
    const prev = data[activeIndex - 1];
    [next, prev].forEach((itm) => {
      if (!itm) return;
      fetch(itm.hls.masterUrl).catch(() => {});
      if (itm.hls.posterUrl) Image.prefetch(itm.hls.posterUrl).catch(() => {});
    });
  }, [activeIndex, data]);

  const triggerLikeAnimation = async () => {
    likeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(likeAnim, { toValue: 1, duration: 180, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(likeAnim, { toValue: 0, delay: 180, duration: 300, easing: Easing.in(Easing.ease), useNativeDriver: true }),
    ]).start();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const likeCountFor = useCallback((item: FeedItem) => {
    return optimisticLikes[item.id] ?? item.likeCount ?? 0;
  }, [optimisticLikes]);

  const onDoubleTap = useCallback((item: FeedItem) => {
    triggerLikeAnimation();
    setOptimisticLikes((prev) => ({ ...prev, [item.id]: (prev[item.id] ?? item.likeCount ?? 0) + 1 }));
  }, []);

  const onLongPress = useCallback((itemId: string) => {
    const ref = playerRefs.current[itemId];
    ref?.pauseAsync?.();
  }, []);

  const onPressOut = useCallback((itemId: string) => {
    const ref = playerRefs.current[itemId];
    ref?.playAsync?.();
  }, []);

  const renderSkeleton = () => (
    <View style={styles.page}>
      <View style={styles.skeleton} />
      <View style={[styles.skeleton, { width: '60%', height: 20, position: 'absolute', left: 16, bottom: 90 }]} />
      <View style={[styles.skeleton, { width: 120, height: 36, position: 'absolute', left: 16, bottom: 130, borderRadius: 18 }]} />
      <View style={{ position: 'absolute', right: 16, bottom: 120, alignItems: 'center', gap: 16 }}>
        {[0,1,2].map((k) => <View key={k} style={[styles.skeleton, { width: 40, height: 40, borderRadius: 20 }]} />)}
      </View>
    </View>
  );

  const renderItem = ({ item, index }: { item: FeedItem; index: number }) => (
    <Pressable onPress={() => onDoubleTap(item)} onLongPress={() => onLongPress(item.id)} onPressOut={() => onPressOut(item.id)} accessibilityRole="imagebutton" accessibilityLabel="Video. Double-tap to like.">
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
          onLoadStart={() => setBuffering(true)}
          onReadyForDisplay={() => setBuffering(false)}
          onError={() => setBuffering(false)}
          accessibilityIgnoresInvertColors
          importantForAccessibility="no-hide-descendants"
        />
        {buffering && (
          <View style={styles.bufferBadge}><ActivityIndicator size="small" color="#000" /><Text style={styles.bufferText}>Buffering…</Text></View>
        )}
        <Animated.View pointerEvents="none" style={[styles.heartContainer, { opacity: likeAnim, transform: [{ scale: likeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
          <Text style={styles.heart}>❤</Text>
        </Animated.View>
        <View style={styles.caption}><Text accessibilityLabel={`Caption: ${item.caption}`} allowFontScaling style={styles.captionText}>{item.caption}</Text></View>
        <View style={styles.soundPillContainer}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Use this sound" hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={styles.soundPill} onPress={() => {}}>
            <Text style={styles.soundPillText}>Use this sound</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rail} accessible accessibilityLabel="Actions">
          <RailButton label={`${likeCountFor(item)}`} icon="❤" onPress={() => onDoubleTap(item)} />
          <RailButton label={`${item.commentCount ?? 0}`} icon="💬" onPress={() => {}} />
          <RailButton label={`${item.shareCount ?? 0}`} icon="↗" onPress={() => {}} />
        </View>
      </View>
    </Pressable>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Retry" onPress={fetchFeed} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
      refreshControl={<RefreshControl tintColor="#fff" refreshing={refreshing} onRefresh={onRefresh} />}
      accessibilityLabel="For You feed"
    />
  );
}

function RailButton({ label, icon, onPress }: { label: string; icon: string; onPress: () => void }) {
  return (
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} onPress={onPress} style={styles.railBtn}>
      <Text style={styles.railIcon}>{icon}</Text>
      <Text style={styles.railLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  page: { height: Dimensions.get('window').height, backgroundColor: 'black' },
  video: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  caption: { position: 'absolute', bottom: 80, left: 16, right: 120 },
  captionText: { color: 'white', fontSize: 16 },
  rail: { position: 'absolute', right: 16, bottom: 120, alignItems: 'center', gap: 16 },
  railBtn: { alignItems: 'center' },
  railIcon: { color: 'white', fontSize: 24 },
  railLabel: { color: 'white', fontSize: 12 },
  heartContainer: { position: 'absolute', left: 0, right: 0, top: '40%', alignItems: 'center' },
  heart: { color: 'white', fontSize: 96, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
  centered: { flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#ff7676', marginBottom: 12 },
  retryBtn: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  retryText: { color: '#000' },
  soundPillContainer: { position: 'absolute', left: 16, bottom: 120 },
  soundPill: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  soundPillText: { color: 'white' },
  skeleton: { backgroundColor: '#222', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  bufferBadge: { position: 'absolute', top: 18, right: 18, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 8, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  bufferText: { color: '#000', fontSize: 12 },
});