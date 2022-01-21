<script lang="ts" context="module">
  import { get, post, deleteId, put } from "$lib/api";

  export async function load() {
    return {
      props: { todos: await get("todo") },
    };
  }
</script>

<script>
  import { session } from "$app/stores";
  import AddTodo from "$lib/components/todos/AddTodo.svelte";
  import Todo from "$lib/components/todos/Todo.svelte";

  export let todos = [];

  const getTodos = async () => (todos = await get("todo"));

  const add = async (e) => {
    await post("todo", { task: e.detail, user_id: $session.user.id });
    getTodos();
  };
  const remove = async (e) => {
    await deleteId("todo", e.detail.id);
    getTodos();
  };

  const update = async (e) => {
    await put("todo", e.detail);
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
