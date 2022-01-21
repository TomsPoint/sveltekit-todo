<script>
  // @ts-nocheck

  import { getContext } from "svelte";
  import { put } from "$lib/api";
  import SelectStartEnd from "$lib/components/date/SelectStartEnd.svelte";

  const { close } = getContext("simple-modal");

  export let slot;
  export let enrolment;
  export let start;
  let end = start;

  const _onCancel = () => close();

  const _onOkay = async () => {
    const updatedEnrolment = {
      id: enrolment.id,
      type: enrolment.type,
      modus: enrolment.modus,
      student_id: enrolment.student_id,
      curriculum_id: enrolment.curriculum_id,
      teacher_id: enrolment.teacher_id,
      slot_id: enrolment.slot_id,
      start,
      end,
    };
    await put("enrolments", updatedEnrolment);
    close();
    location.reload();
  };
</script>

<div class="grid gap-4 grid-cols-1">
  <h3>Update {enrolment.students.name}'s {slot.day} {slot.time} slot:</h3>
  <hr class="mt-1" />
  <SelectStartEnd bind:start bind:end />

  <div class="grid grid-cols-2 gap-4 p-2 mt-2 pt-4 border-t">
    <button on:click={_onCancel}> Cancel </button>
    <button on:click={_onOkay}> Update </button>
  </div>
</div>

<style lang="postcss">
  button {
    @apply hover:bg-gray-100;
  }
</style>
