import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../../css/scroll-bar.css';
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import api from '../../api/Api';
import TaskModal from './TaskModal';

let timer;
const timeout = 500;

function Kanban(props) {
  const boardId = props.boardId;
  const [data, setData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(undefined);

  async function onDragEnd({ source, destination }) {
    if (!destination) return;

    const sourceColIndex = data.findIndex(
      (el) => el._id === source.droppableId
    );
    const destinationColIndex = data.findIndex(
      (el) => el._id === destination.droppableId
    );

    const sourceCol = data[sourceColIndex];
    const destinationCol = data[destinationColIndex];

    const sourceSectionId = sourceCol._id;
    const destinationSectionId = destinationCol._id;

    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[destinationColIndex].tasks = destinationTasks;
    }

    try {
      await api.updatePositionTask(boardId, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId,
      });

      setData(data);
    } catch {
      alert(
        'Произошла ошибка при запросе к серверу при перемещении задач из секции в другую секцию!'
      );
    }
  }

  async function createSection() {
    try {
      const section = await api.createSection(boardId);
      setData([...data, section]);
    } catch {
      alert(
        'Произошла ошибка при запросе к серверу при создании секции доски!'
      );
    }
  }

  async function createTask(sectionId) {
    try {
      const task = await api.createTask(boardId, { sectionId });
      const newData = [...data];
      const index = newData.findIndex((el) => el._id === sectionId);
      newData[index].tasks.unshift(task);
      setData(newData);
    } catch {
      alert(
        'Произошла ошибка при запросе к серверу при создании задачи секции доски!'
      );
    }
  }

  async function changeTitle(e, sectionId) {
    clearTimeout(timer);
    const newTitle = e.target.value;

    const newSectionList = [...data];
    const index = newSectionList.findIndex((b) => b._id === sectionId);
    newSectionList[index].title = newTitle;

    setData(newSectionList);

    timer = setTimeout(async () => {
      try {
        await api.updateSection(boardId, sectionId, { title: newTitle });
      } catch {
        alert(
          'Произошла ошибка при запросе к серверу при обновлении заголовка секции доски!'
        );
      }
    }, timeout);
  }

  async function deleteSection(sectionId) {
    try {
      await api.deleteSection(boardId, sectionId);
      const newSectionList = data.filter(
        (section) => section._id !== sectionId
      );
      setData(newSectionList);
    } catch {
      alert(
        'Произошла ошибка при запросе к серверу при удалении секции доски!'
      );
    }
  }

  async function onUpdateTask(task) {
    if (task) {
      const newData = [...data];
      const sectionIndex = newData.findIndex(
        (el) => el._id === task.section._id
      );
      const taskIndex = newData[sectionIndex].tasks.findIndex(
        (t) => t._id === task._id
      );

      newData[sectionIndex].tasks[taskIndex] = task;
      setData(newData);
    }
  }

  async function onDeleteTask(task) {
    const newData = [...data];
    const sectionIndex = newData.findIndex((el) => el._id === task.section._id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (t) => t._id === task._id
    );

    newData[sectionIndex].tasks.splice(taskIndex, 1);
    setData(newData);
  }

  useEffect(() => {
    setData(props.sections);
  }, [props.sections]);
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button onClick={createSection}>Добавить секцию</Button>
        <Typography variant="body2" fontWeight="700">
          {`Секций: ${data.length}шт.`}
        </Typography>
      </Box>
      <Divider sx={{ margin: '10px 0' }} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            width: 'calc(100vw - 400px)',
            overflowX: 'auto',
          }}
        >
          {data.map((section) => (
            <div key={section._id} style={{ width: '300px' }}>
              <Droppable key={section._id} droppableId={section._id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      width: '300px',
                      padding: '10px',
                      marginRight: '10px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <TextField
                        onChange={(e) => changeTitle(e, section._id)}
                        value={section.title}
                        placeholder="Без названия"
                        variant="outlined"
                        sx={{
                          flexGrow: 1,
                          '& .MuiOutlinedInput-input': { padding: 0 },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'unset',
                          },
                          '& .MuiOutlinedInput-root': { fontSize: '1rem' },
                        }}
                      />
                      <IconButton
                        variant="outlined"
                        size="small"
                        sx={{
                          color: 'grey',
                          '&:hover': { color: 'green' },
                        }}
                        onClick={() => createTask(section._id)}
                      >
                        <AddOutlinedIcon />
                      </IconButton>
                      <IconButton
                        variant="outlined"
                        size="small"
                        sx={{
                          color: 'grey',
                          '&:hover': { color: 'red' },
                        }}
                        onClick={() => deleteSection(section._id)}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </Box>
                    {section.tasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            onClick={() => setSelectedTask(task)}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              padding: '10px',
                              marginBottom: '10px',
                              cursor: snapshot.isDraggable
                                ? 'grab'
                                : 'pointer!important',
                            }}
                          >
                            <Typography>
                              {task.title === '' ? 'Без названия' : task.title}
                            </Typography>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </div>
          ))}
        </Box>
      </DragDropContext>
      <TaskModal
        task={selectedTask}
        boardId={boardId}
        onClose={() => setSelectedTask(undefined)}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
      />
    </>
  );
}

export default Kanban;
