import React from "react";
import { GestureResponderEvent, View } from "react-native";
import { Button, List, useTheme } from "react-native-paper";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";

interface TaskItemProps {
  title: string;
  description: string;
  taskId: number | string;
  onDelete: (e: GestureResponderEvent) => void;
}

const TaskItem: React.FC<TaskItemProps> = (props) => {
  const theme = useTheme();
  const { title, description, taskId, onDelete } = props;

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutUp}
      layout={Layout.springify()}
      style={{
        borderRadius: 10,
        backgroundColor: theme.colors.tertiaryContainer,
      }}
    >
      <List.Item
        title={title}
        description={description}
        descriptionNumberOfLines={3}
        key={taskId}
        descriptionStyle={{ fontSize: 8 }}
        right={() => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Button
              mode="elevated"
              icon="check"
              labelStyle={{
                fontSize: 10,
                color: theme.colors.onSecondary,
              }}
              style={{
                backgroundColor: theme.colors.secondary,
              }}
              onPress={onDelete}
            >
              Done
            </Button>
          </View>
        )}
      />
    </Animated.View>
  );
};

export default TaskItem;
