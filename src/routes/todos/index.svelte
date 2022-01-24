<script lang="ts" context="module">
  import * as api from "$lib/api/todos";

  export async function load() {
    return { props: { todos: await api.todos.get() } };
  }
</script>

<script>
  import { user } from "$lib/db";
  import AddTodo from "$lib/components/todos/AddTodo.svelte";
  import Todo from "$lib/components/todos/Todo.svelte";

  export let todos = [];

  const getTodos = async () => (todos = await api.todos.get());

  const add = async (e) => {
    await api.todos.post({ task: e.detail, user_id: $user.id });
    getTodos();
  };
  const remove = async (e) => {
    await api.todos.delete(e.detail.id);
    getTodos();
  };

  const update = async (e) => {
    await api.todos.update(e.detail);
  };
</script>

<section>
  <h2>Todos</h2>
  <AddTodo on:add={add} />
  {#if todos.length > 0}
    <h2>Things you have to do:</h2>
  {:else}
    <h2>You have nothing to do!</h2>
  {/if}
  <ul>
    {#each todos as todo}
      <Todo {todo} on:update={update} on:remove={remove} />
    {/each}
  </ul>
</section>
