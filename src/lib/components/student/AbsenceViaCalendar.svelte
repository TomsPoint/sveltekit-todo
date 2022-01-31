<script lang="ts">
  import * as api from "$lib/api/absence";

  import { closeModal } from "svelte-modals";
  import { DATEFORMAT } from "$lib/basics/constants";
  import { isDateBetween } from "$lib/basics/utils";
  import InputDate from "$lib/ui/InputDate.svelte";
  import dayjs from "dayjs";
  import isBetween from "dayjs/plugin/isBetween";
  import type { Absence } from "$lib/basics/interface";
  import Select from "$lib/ui/Select.svelte";
  import { onMount } from "svelte";

  dayjs.extend(isBetween);

  export let isOpen;
  export let program;
  export let enrolment;
  export let time_slot;
  export let date;
  export let classroom_id;

  let classrooms;
  let student;
  onMount(async () => {
    student = await api.absence.getStudent(enrolment.student.id);
    student.programs = [...new Set(student.student_weekly_enrolment.map((el) => isDateBetween(date, el.start_date, el.end_date) && el.program_id))];

    classrooms = await api.absence.getClassrooms();
    // is classroom active on this date and fits the students programms
    classrooms = classrooms.filter((el) => isDateBetween(date, el.start_date, el.end_date) && student.programs.includes(el.program_id));
    // filter out all the enrolemets which are not active on this date
    classrooms.forEach((clr) => {
      return { ...clr, student_classroom_enrolment: clr.student_classroom_enrolment.filter((sce) => isDateBetween(date, sce.start_date, sce.end_date)) };
    });
    // filter out all the full classrooms
    classrooms = classrooms.filter((clr) => clr.capacity - clr.student_classroom_enrolment.length > 0);
    // add label for selection to each of the classrooms
    classrooms.forEach((clr) => {
      clr.label = `${clr.time_slot.time} - ${clr.teacher.person[0].first_name} - ${clr.mode} - (${clr.student_classroom_enrolment.length}/${clr.capacity})`;
    });
    // sort by time first then by sort_order
    classrooms.sort(
      (a, b) => +a.time_slot.time.slice(0, -8).replace(/\:/, "") - +b.time_slot.time.slice(0, -8).replace(/\:/, "") || +a.sort_order - +b.sort_order
    );
  });

  let data: Absence = {
    student_id: enrolment.student.person[0].id,
    missed_date: null,
    missed_classroom_id: classroom_id,
    makeup_date: null,
    makeup_classroom_id: null,
    status: "open",
  };

  let filteredClassrooms;

  $: if (isDateBetween(data.makeup_date, "1900-01-01", "2100-01-01")) {
    const weekday = dayjs(data.makeup_date).format("dddd");
    filteredClassrooms = classrooms.filter((el) => el.time_slot.weekday === weekday);
  }
  let selectedClassroom;

  const _save = async () => {
    await api.absence.update(data);
    closeModal();
  };

  const _cancel = () => closeModal();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2 class="mb-4">Student Absence</h2>
      <span>Student Name</span>
      <p>{enrolment.student.person[0].first_name} {enrolment.student.person[0].last_name}</p>
      <span>Missed Program</span>
      <p>{program.name}</p>
      <span>Missed Class</span>
      <p>{time_slot.weekday} {dayjs(date).format(DATEFORMAT)} {time_slot.time}</p>

      <InputDate
        bind:date={data.makeup_date}
        label={`Makeup Date ${isDateBetween(data.makeup_date, "1900-01-01", "2100-01-01") ? dayjs(data.makeup_date).format("(dddd)") : ""}`}
      />

      {#if isDateBetween(data.makeup_date, "1900-01-01", "2100-01-01")}
        <Select items={filteredClassrooms} bind:selectedItem={selectedClassroom} labelFieldName="label" label="Classroom" />
      {/if}

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  span {
    @apply text-sm;
  }
  p {
    @apply mb-2 border rounded px-1 py-2 cursor-not-allowed text-gray-400;
  }
</style>
