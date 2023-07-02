import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import useSWR from "swr";
import axiosService, { fetcher } from "../lib/utils/axios";
import { StyleSheet, View, ScrollView } from "react-native";
import {
  Appbar,
  Button,
  FAB,
  List,
  Modal,
  Portal,
  TextInput,
  useTheme,
} from "react-native-paper";
import store from "../lib/store";
import TaskItem from "../lib/components/TaskItem";
import { useAuth } from "../lib/context/auth";

interface ITask {
  id?: number | string;
  title: string;
  description: string;
  completed?: boolean;
  user?: string;
}

export default function Home() {
  const theme = useTheme();
  const { signOut } = useAuth() as any;
  const auth = store.getState().auth;
  const { data, error, isLoading, mutate } = useSWR<ITask[]>("/todo", fetcher);
  const [visible, setVisible] = React.useState(false);
  const [taskItems, setTaskItems] = useState<ITask[]>([]);

  const [taskTitle, setTaskTitle] = useState<string>();
  const [taskDescription, setTaskDescription] = useState<string>();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    setTaskItems(data || []);
    console.log("data ", data);
    console.log("error ", error);
    console.log("isLoading ", isLoading);
  }, [data, error, isLoading]);

  const handlerCreateTask = () => {
    console.log("user ", auth);
    if (taskTitle && taskDescription) {
      const newTask = {
        title: taskTitle,
        description: taskDescription,
        completed: false,
        user: auth.account?.user.email,
      };

      axiosService
        .post("todo/", newTask)
        .then((res) => {
          console.log(res);
          mutate([...taskItems, newTask]);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setTaskTitle("");
          setTaskDescription("");
          hideModal();
        });
    }
  };

  const completeTask = (id: number | string | undefined) => {
    axiosService.delete(`todo/${id}/`).then((res) => {
      // let itemsCopy = [...taskItems];

      // itemsCopy = itemsCopy.filter((item) => item.id !== id);
      
      mutate();
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header>
        <Appbar.Content title="ToDo Today" />
        <Appbar.Action icon='account-arrow-right-outline' onPress={() => signOut()} />
      </Appbar.Header>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            ...styles.container,
            backgroundColor: theme.colors.backdrop,
          }}
        >
          <List.Section
            title="Today's tasks"
            titleStyle={{ color: theme.colors.onBackground }}
            style={{
              columnGap: 10,
              rowGap: 10,
            }}
          >
            {taskItems.map((item, index) => (
              <TaskItem
                taskId={index}
                key={index}
                title={item.title}
                description={item.description}
                onDelete={() => completeTask(item.id)}
              />
            ))}
          </List.Section>
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            ...styles.modalContainer,
            backgroundColor: theme.colors.primaryContainer,
          }}
        >
          <TextInput
            mode="outlined"
            style={styles.textInput}
            label="Task Title"
            value={taskTitle}
            onChangeText={(text) => setTaskTitle(text)}
          />
          <TextInput
            mode="outlined"
            style={styles.multilineTextInput}
            multiline={true}
            numberOfLines={4}
            label="Description"
            value={taskDescription}
            onChangeText={(text) => setTaskDescription(text)}
          />

          <Button mode="contained" onPress={handlerCreateTask}>
            Create Task
          </Button>
        </Modal>
      </Portal>
      <FAB
        icon="plus"
        label="New Task"
        style={styles.fab}
        onPress={showModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  modalContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
    alignContent: "center",
    padding: 20,
    borderRadius: 20,
  },
  textInput: {
    width: "100%",
    height: 40,
    marginTop: 8,
    marginBottom: 8,
  },
  multilineTextInput: {
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
