<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let newIdea = "";

  const add = async () => {
    dispatch("add", newIdea);
    newIdea = "";
  };
</script>

<form on:submit|preventDefault={add} class="flex items-center rounded p-4">
  <label for="addIdea" class="mx-4 inline-block">Add a new Idea:</label>
  <input type="text" name="addIdea" placeholder="Add a new Idea..." bind:value={newIdea} class="flex-grow rounded-r-none focus:outline-none" />
  <button class="rounded-l-none">+</button>
</form>
