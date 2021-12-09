<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let todo;

  const update = async () => {
    dispatch("update", todo);
  };
</script>

<li class="flex gap-2 items-center mb-2 px-4">
  <input type="checkbox" bind:checked={todo.is_complete} on:change={update} />
  <input type="text" bind:value={todo.task} on:change={update} class="border-0 flex-grow focus:border outline-none" />
  <button on:click={() => dispatch("remove", todo.id)}>X</button>
</li>
