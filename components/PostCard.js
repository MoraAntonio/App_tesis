import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
const HEIGHT = 225;
const WIDTH = Dimensions.get("window").width;
export default function PostCard({
  images,
  heading,
  subheading,
  stars,
  favorite,
  onPress,
  style,
  home,
  ...rest
}) {
  const flatListRef = (useRef < FlatList) | (null > null);
  const viewConfigRef = { viewAreaCoveragePercentThreshold: 95 };
  const [activeIndex, setActiveIndex] = useState(0);
  const onViewRef = useRef(({ changed }) => {
    if (changed[0].isViewable) {
      setActiveIndex(changed[0].index);
    }
  });
  const [favoriteItem, setFavoriteItem] = useState(favorite);

  const handleFavoriteItemClicked = () => {
    setFavoriteItem(!favoriteItem);
    console.log("make some backend request");
  };

  return (
    <View style={[styles.cardContainer, style]} {...rest}>
      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        ref={(ref) => (flatListRef.current = ref)}
        snapToAlignment="center"
        pagingEnabled
        viewabilityConfig={viewConfigRef}
        onViewableItemsChanged={onViewRef.current}
        renderItem={({ item }) => (
          <Pressable onPress={onPress} style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: item }} />
          </Pressable>
        )}
      />
      {images.length > 1 && (
        <View style={styles.dotContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                {
                  opacity: index === activeIndex ? 1 : 0.5,
                },
                styles.dot,
              ]}
            />
          ))}
        </View>
      )}

              {home && (
                <Pressable onPress={onPress} style={styles.textContainer}>
                <Text style={styles.heading}>{heading}</Text>
                <Text style={styles.subheading}>${subheading} por noche</Text>
                </Pressable>
              )}
     
    </View>
  );
}
const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 20,
    paddingHorizontal: 30,
    width: WIDTH,
    borderRadius: 10,
  },
  favoriteContainer: {
    position: "absolute",
    top: 10,
    right: 40,
    zIndex: 10,
    padding: 10,
  },
  imageContainer: { width: WIDTH - 60 },
  image: {
    width: "100%",
    height: HEIGHT,
    borderRadius: 10,
  },
  dotContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    top: HEIGHT - 20,
    alignSelf: "center",
  },
  dot: {
    width: 5,
    height: 5,
    margin: 3,
    borderRadius: 30,
    backgroundColor: "white",
  },
  textContainer: { marginTop: 10 },
  starContainer: { flexDirection: "row" },
  starText: { marginLeft: 5 },
  heading: { fontSize: 20 },
  subheading: { fontSize: 18, marginTop: 5 },
});