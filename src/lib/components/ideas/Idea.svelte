<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let idea;

  const update = async () => {
    dispatch("update", idea);
  };
</script>

<li class="flex gap-2 items-center mb-2 px-4">
  <input type="checkbox" bind:checked={idea.is_complete} on:change={update} />
  <input type="text" bind:value={idea.task} on:change={update} class="border-0 flex-grow focus:border outline-none" />
  <button on:click={() => dispatch("remove", idea)}>X</button>
</li>
