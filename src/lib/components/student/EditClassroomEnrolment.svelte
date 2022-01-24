<script>
  import { closeModal } from "svelte-modals";
  import InputDate from "$lib/ui/InputDate.svelte";
  import * as api from "$lib/api/student_classroom_enrolment";

  // provided by Modals
  export let isOpen;
  export let item;

  const _save = async () => {
    delete item.classroom;
    await api.enrolment.update(item);
    closeModal();
    location.reload();
  };

  const _cancel = () => closeModal();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>Edit Class Enrolment</h2>
      <InputDate bind:date={item.start_date} label="Start" />
      <InputDate bind:date={item.end_date} label="End" />

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}
