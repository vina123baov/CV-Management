// src/App.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "./utils/supabase";

/**
 * Example Todo type — chỉnh lại nếu bảng todos của bạn có trường khác
 */
type Todo = {
  id: string | number;
  title?: string;
  done?: boolean;
  // thêm các trường khác nếu cần
};

export default function Page(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Không thể dùng `await` ở top-level trong callback non-async,
    // nên tạo hàm async bên trong rồi gọi nó.
    const getTodos = async () => {
      setLoading(true);
      setError(null);

      try {
        // Gọi Supabase: chú ý generic <Todo> để TypeScript biết kiểu trả về
        const { data, error } = await supabase.from<Todo>("todos").select("*");

        if (error) {
          // nếu supabase trả lỗi, show ra
          setError(error.message);
          setTodos([]);
        } else {
          // data có thể là Todo[] hoặc null
          // đảm bảo setTodos luôn nhận một mảng (không null)
          setTodos(data ?? []);
        }
      } catch (err: any) {
        setError(err?.message ?? String(err));
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };

    void getTodos();
  }, []);

  return (
    <div>
      <h2>Todos</h2>

      {loading && <p>Đang tải...</p>}
      {error && (
        <p style={{ color: "red" }}>
          Lỗi khi tải todos: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {todos.length === 0 ? (
            <p>Không có todo nào</p>
          ) : (
            <ul>
              {todos.map((todo) => (
                // key phải là một giá trị duy nhất — dùng todo.id
                <li key={String(todo.id)}>
                  {/* hiển thị title nếu có, fallback hiển thị id */}
                  {todo.title ?? `#${todo.id}`}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
