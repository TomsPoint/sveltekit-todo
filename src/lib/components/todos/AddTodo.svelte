<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let newTodo = "";

  const add = async () => {
    dispatch("add", newTodo);
    newTodo = "";
  };
</script>

<form on:submit|preventDefault={add} class="flex items-center rounded p-4">
  <label for="addTodo" class="mx-4 inline-block">Add a new Todo:</label>
  <input type="text" name="addTodo" placeholder="Add a new Todo..." bind:value={newTodo} class="flex-grow rounded-r-none focus:outline-none" />
  <button class="rounded-l-none">+</button>
</form>
