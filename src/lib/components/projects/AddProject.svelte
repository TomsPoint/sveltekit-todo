<script lang="ts">
  import * as api from "$lib/api/projects";

  import { closeModal } from "svelte-modals";
  import Input from "$lib/ui/Input.svelte";
  import Radio from "$lib/ui/Radio.svelte";

  // provided by Modals
  export let isOpen;
  export let program;

  let data = {
    program_id: program.id,
    name: "",
    level: 0,
    status: "active",
    learning_points: [{}],
    progress: [{}],
  };

  const _save = async () => {
    await api.projects.post(data);
    closeModal();
    location.reload();
  };

  const _cancel = () => closeModal();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>HEADLINE</h2>
      <Input bind:value={data.name} label="Project name" placeholder="Project name" />
      <Input bind:value={data.level} type="range" label="Level: {program.level[data.level]}" min="0" max={program.level.length - 1} hideRangeValue />
      <Radio bind:value={data.status} items={["in development", "active", "paused", "retired"]} label="Project status:" />

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}
