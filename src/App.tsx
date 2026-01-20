import { useReducer, useEffect, useState } from "react";
import useSWR from "swr";
import { useTranslation } from "react-i18next";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type Action =
  | { type: "LOAD"; payload: Todo[] }
  | { type: "ADD"; payload: string }
  | { type: "TOGGLE"; payload: number }
  | { type: "DELETE"; payload: number }
  | { type: "EDIT"; payload: { id: number; title: string } };

const reducer = (state: Todo[], action: Action): Todo[] => {
  switch (action.type) {
    case "LOAD":
      return action.payload;

    case "ADD":
      return [
        { id: Date.now(), title: action.payload, completed: false },
        ...state,
      ];

    case "TOGGLE":
      return state.map((t) =>
        t.id === action.payload
          ? { ...t, completed: !t.completed }
          : t
      );

    case "EDIT":
      return state.map((t) =>
        t.id === action.payload.id
          ? { ...t, title: action.payload.title }
          : t
      );

    case "DELETE":
      return state.filter((t) => t.id !== action.payload);

    default:
      return state;
  }
};

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json());

const App = () => {
  const { t, i18n } = useTranslation();

  const { data } = useSWR(
    "https://dummyjson.com/todos?limit=5",
    fetcher
  );

  const [todos, dispatch] = useReducer(reducer, []);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (data?.todos) {
      dispatch({
        type: "LOAD",
        payload: data.todos.map((d: any) => ({
          id: d.id,
          title: d.todo,
          completed: d.completed,
        })),
      });
    }
  }, [data]);

  const completed = todos.filter(t => t.completed).length;
  const uncompleted = todos.length - completed;
 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center px-4">
    
    <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">
          {t("title")}
        </h1>
        <select
          className="border rounded px-2 py-1 text-sm"
          onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
          <option value="en">EN</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          className="flex-1 border border-blue-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
          onClick={() => {
            if (!input.trim()) return;
            dispatch({ type: "ADD", payload: input });
            setInput("");
          }}
        >
          {t("add")}
        </button>
      </div>
      <ul className="space-y-3">
        {todos.length === 0 && (
          <p className="text-center text-gray-400 text-sm">
            {t("empty")}
          </p>
        )}

        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 bg-blue-100 rounded-lg px-3 py-2"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                dispatch({ type: "TOGGLE", payload: todo.id })
              }
              className="accent-blue-600"
            />
            {editId === todo.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 px-2 py-1 border rounded"
              />
            ) : (
              <span
                className={`flex-1 text-sm ${
                  todo.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {todo.title}
              </span>
            )}
            {editId === todo.id ? (
              <>
                <button
                  className="text-green-600 text-sm font-medium"
                  onClick={() => {
                    dispatch({
                      type: "EDIT",
                      payload: { id: todo.id, title: editText },
                    });
                    setEditId(null);
                  }}
                >
                  {t("save")}
                </button>
                <button
                  className="text-gray-500 text-sm"
                  onClick={() => setEditId(null)}
                >
                  {t("cancel")}
                </button>
              </>
            ) : (
              <>
                <button
                  className="text-blue-600 text-sm"
                  onClick={() => {
                    setEditId(todo.id);
                    setEditText(todo.title);
                  }}
                >
                  {t("edit")}
                </button>
                <button
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                  onClick={() =>
                    dispatch({ type: "DELETE", payload: todo.id })
                  }
                >
                  🗑
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

    
      <div className="mt-5 text-center text-sm text-gray-600">
        {t("completed")} : {completed} | {t("uncompleted")} : {uncompleted}
      </div>

    </div>
  </div>
);

};

export default App;
