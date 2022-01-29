<script lang="ts">
  import { closeModal } from "svelte-modals";
  import * as api from "$lib/api/student_weekly_enrolment";
  import InputDate from "$lib/ui/InputDate.svelte";

  // provided by Modals
  export let isOpen;
  export let item;

  const _save = async () => {
    await api.enrolment.update(item);
    closeModal();
    location.reload();
  };

  const _cancel = () => closeModal();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>Edit Program Enrolment</h2>
      <InputDate bind:date={item.start_date} label="Start" />
      <InputDate bind:date={item.end_date} label="End" />

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}
