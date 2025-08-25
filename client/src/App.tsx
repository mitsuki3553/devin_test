import { useState, useEffect } from 'react'
import './App.css'

interface Todo {
  id: number;
  text: string;
  createdAt: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const validateInput = (text: string): string | null => {
    if (text.length > 100) {
      return '100文字以内で入力してください';
    }
    
    if (/\s{2,}/.test(text)) {
      return '空白は続けて入力できません';
    }
    
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    
    const validationError = validateInput(value);
    setError(validationError || '');
  };

  const handleAddTodo = async () => {
    const trimmedText = inputText.trim();
    
    if (!trimmedText) {
      return;
    }
    
    const validationError = validateInput(inputText);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: trimmedText }),
      });

      if (response.ok) {
        const newTodo = await response.json();
        setTodos([...todos, newTodo]);
        setInputText('');
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'エラーが発生しました');
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
      setError('サーバーエラーが発生しました');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Todoリスト
        </h1>
        
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="タスクを入力してください"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddTodo}
              disabled={!!error || !inputText.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              追加
            </button>
          </div>
          
          {error && (
            <p className="mt-2 text-red-600 font-bold text-sm">
              {error}
            </p>
          )}
        </div>

        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              タスクがありません
            </p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <p className="text-gray-800">{todo.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(todo.createdAt).toLocaleString('ja-JP')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App
