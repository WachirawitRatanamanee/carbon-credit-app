import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

const ExpandableListItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={toggleExpand}
        style={styles.itemTouchable}
      >
        <Text style={styles.itemTitle}>{item.title}</Text>
      </TouchableOpacity>
      {expanded ? (
        <View>
          {item.content.map((content, index) => (
            <View
              style={styles.expandContainer}
            >
              <Text style={styles.itemContent}>
                {item.content[index]}
              </Text>
              <Text style={styles.itemContent}>
                {item.price[index]}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const ExpandableList = ({ data }) => {
  const renderItem = ({ item }) => (
    <ExpandableListItem item={item} />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const Expand = ({ data = [] }) => {
  return (
    <View style={styles.container}>
      <ExpandableList data={data} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "green",
    textAlign: "center",
  },
  subheader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },
  itemTouchable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginLeft: 5,
  },
  itemContent: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  expandContainer: {
    marginHorizontal: "5%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default Expand;
