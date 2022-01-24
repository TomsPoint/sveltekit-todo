<script>
  import { put } from "$lib/api_old";

  // @ts-nocheck
  import { closeModal } from "svelte-modals";
  import InputDate from "$lib/ui/InputDate.svelte";

  // provided by Modals
  export let isOpen;
  export let item;

  const _save = async () => {
    await put("student_weekly_enrolment", item);
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
