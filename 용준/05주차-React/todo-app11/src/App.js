import { useReducer, useState, useRef, useCallback } from 'react';
import TodoTemplate from './components/TodoTemplate';
import TodoInsert from './components/TodoInsert';
import TodoList from './components/TodoList';

function createBulkTodos() {
  const array = [];
  for (let i = 1; i <= 2500; i++) {
    array.push({
      id: i,
      text: `할 일 ${i}`,
      category: '[개인]',
      checked: false,
    });
  }
  return array;
}

function todoReducer(todos, action) {
  switch (action.type) {
    case 'INSERT': // 새로 추가
      return todos.concat(action.todo);
    case 'REMOVE': // 제거
      return todos.filter((todo) => todo.id !== action.id);
    case 'TOGGLE': // 토글
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, checked: !todo.checked } : todo,
      );
    default:
      return todos;
  }
}

const App = () => {
  // const [todos, setTodos] = useState(createBulkTodos);
  const [todos, dispatch] = useReducer(todoReducer, undefined, createBulkTodos);

  const [categories] = useState([
    { key: 'private', title: '[개인]' },
    { key: 'work', title: '[업무]' },
    { key: 'family', title: '[가족]' },
  ]);

  // 고유값으로 사용될 id
  // ref를 사용하여 변수 담기
  const nextTodoId = useRef(2501);

  const onInsert = useCallback((text, category) => {
    const todo = {
      id: nextTodoId.current,
      text,
      category,
      checked: false,
    };
    // setTodos((todos) => todos.concat(todo));
    dispatch({ type: 'INSERT', todo });
    nextTodoId.current += 1; // nextId 1씩 더하기
  });

  const onRemove = useCallback((id) => {
    // setTodos((todos) => todos.filter((todo) => todo.id !== id));
    dispatch({ type: 'REMOVE', id });
  }, []);

  const onToggle = useCallback((id) => {
    // setTodos((todos) =>
    //   todos.map((todo) =>
    //     todo.id === id ? { ...todo, checked: !todo.checked } : todo,
    //   ),
    // );
    dispatch({ type: 'TOGGLE', id });
  }, []);

  return (
    <TodoTemplate>
      <TodoInsert categories={categories} onInsert={onInsert} />
      <TodoList todos={todos} onRemove={onRemove} onToggle={onToggle} />
    </TodoTemplate>
  );
};

export default App;
