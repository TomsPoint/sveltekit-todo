<script context="module" lang="ts">
  import * as api from "$lib/api/students";

  export async function load() {
    return { props: { students: await api.students.get() } };
  }
</script>

<script lang="ts">
  import type { Program } from "$lib/basics/interface";

  import { page } from "$app/stores";
  import { getContext } from "svelte";
  import { isDateBetween } from "$lib/basics/utils";
  import Input from "$lib/ui/Input.svelte";
  import ProgramFilter from "$lib/components/filter/ProgramFilter.svelte";

  export let students = [];

  let filter = "";
  const PROGRAMS: Program[] = getContext("programs");
  let filteredPrograms = PROGRAMS;

  // prepare data: filter and enrich
  let data = students.map((person) => {
    return {
      ...person,
      name: person.first_name + " " + person.last_name,
      phone: person.phone.length === 0 ? [{ phone: "", primary: false, whatsapp: false }] : person.phone,
      email: person.email.length === 0 ? [{ email: "", primary: false }] : person.email,
      student: {
        ...person.student,
        student_weekly_enrolment: person.student.student_weekly_enrolment.filter((el) => isDateBetween(new Date(), el.start_date, el.end_date)),
        program_ids: person.student.student_weekly_enrolment.map((el) => el.program_id),
      },
    };
  });

  $: prefilteredStudents = data.filter((obj) => obj.student.program_ids.some((el) => filteredPrograms.map((el) => el.id).includes(el)));

  $: filteredStudents =
    filter.length === 0 ? prefilteredStudents : prefilteredStudents.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()));
</script>

<svelte:head>
  <title>Students</title>
</svelte:head>

<section>
  <h1>Students:</h1>
  <div class="grid gap-4 grid-cols-3 pb-8">
    <Input bind:value={filter} label="Filter" />
    <ProgramFilter bind:filteredPrograms />
    <span class=" place-self-center">
      <a class="button w-max " href="{$page.url.pathname}/add">Add Student</a>
    </span>
  </div>

  <ul class="data-table">
    <li class="table-header">
      <span class="left">Name</span>
      <span class="left">Email</span>
      <span class="left">Phone</span>
      <span class="left">Programs</span>
      <span>Birthday</span>
      <span>&nbsp;</span>
    </li>
    {#each filteredStudents as { id, first_name, last_name, phone, email, birthday, student }}
      <li>
        <span class="left">{first_name} {last_name}</span>
        <span class="left">{email.find((el) => el.primary === true)?.email || email[0]?.email || ""}</span>
        <span class="left">{phone.find((el) => el.primary === true)?.phone || phone[0]?.phone || ""}</span>
        <span class="left">{student.student_weekly_enrolment.map((el) => el.program.label.toUpperCase()).join(", ")}</span>
        <span>{!!birthday ? birthday : ""}</span>
        <span>
          <button class="edit"><a href="{$page.url.pathname}/edit-{id}">✐</a></button>
        </span>
      </li>
    {/each}
  </ul>
</section>

<style lang="postcss">
  li {
    @apply grid gap-4 p-1 grid-cols-[repeat(1,30ch)repeat(1,20ch)repeat(3,15ch)repeat(1,auto)];
  }
</style>
