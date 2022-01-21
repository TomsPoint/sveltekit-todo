<script>
  // @ts-nocheck
  import { closeModal } from "svelte-modals";
  import { put } from "$lib/api";
  import Input from "../ui/Input.svelte";
  import InputDate from "../ui/InputDate.svelte";

  // provided by Modals
  export let isOpen;
  export let item;
  console.log("🚀  ~ file: EditClassEnrolment.svelte ~ line 12 ~ item", item);

  const _save = async () => {
    delete item.classroom;
    await put("student_classroom_enrolment", item);
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
