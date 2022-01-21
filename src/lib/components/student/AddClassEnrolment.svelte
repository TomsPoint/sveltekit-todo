<script>
  // @ts-nocheck
  import { getContext, onMount } from "svelte";
  import { closeModal } from "svelte-modals";
  import { get, post } from "$lib/api";
  import InputDate from "../ui/InputDate.svelte";
  import Select from "../ui/Select.svelte";

  // provided by Modals
  export let isOpen;
  export let student;

  let classrooms = [];
  onMount(async () => (classrooms = await get("classroom", "*,student_classroom_enrolment(*),time_slot(*),program(*),teacher(*,person(*))")));

  let selectedClassroom;
  let selectedProgram;
  const programs = getContext("programs");

  const programIds = [...new Set(student.student_weekly_enrolment.map((el) => el.program_id))].sort((a, b) => a - b);
  $: filteredPrograms = programs.filter((el) => programIds.includes(el.id));

  $: classrooms = classrooms.map((el) => {
    console.log("🚀  ~ file: AddClassEnrolment.svelte ~ line 25 ~ el", el);
    return {
      ...el,
      label: `${el.time_slot.label} - ${el.mode} - ${el.teacher.person[0].first_name} - (${el.student_classroom_enrolment.length}/${el.capacity})`,
    };
  });
  $: filteredClassrooms = classrooms.filter((el) => selectedProgram?.id === el.program_id && el.capacity - el.student_classroom_enrolment.length > 0);

  let item = {
    classroom_id: selectedClassroom?.id,
    student_id: student.id,
    start_date: new Date(),
    end_date: new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 365 * 2),
  };

  const clearClassrooms = () => (selectedClassroom = {});

  const _save = async () => {
    await post("student_classroom_enrolment", item);
    closeModal();
    location.reload();
  };

  const _cancel = () => closeModal();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>Add Program Enrolment</h2>

      <Select items={filteredPrograms} bind:selectedItem={selectedProgram} label="Program" labelFieldName="name" onChange={clearClassrooms} />
      <Select
        items={filteredClassrooms}
        bind:selectedItem={selectedClassroom}
        bind:value={item.classroom_id}
        label="Classroom"
        labelFieldName="label"
        valueFieldName="id"
      />

      <InputDate bind:date={item.start_date} label="Start" />
      <InputDate bind:date={item.end_date} label="End" />

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}
