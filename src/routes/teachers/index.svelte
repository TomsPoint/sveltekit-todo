<script context="module">
  import * as api from "$lib/api/teachers";

  export async function load() {
    return {
      props: { teachers: await api.teachers.get() },
    };
  }
</script>

<script lang="ts">
  import type { Program } from "$lib/interface";

  import { page } from "$app/stores";
  import { getContext } from "svelte";
  import Input from "$lib/ui/Input.svelte";
  import ProgramFilter from "$lib/components/filter/ProgramFilter.svelte";

  export let teachers = [];

  let filter = "";
  const PROGRAMS: Program[] = getContext("programs");
  let filteredPrograms = PROGRAMS;

  let data = teachers.map((person) => {
    return {
      ...person,
      name: person.first_name + " " + person.last_name,
      phone: person.phone.length === 0 ? [{ phone: "", primary: false, whatsapp: false }] : person.phone,
      email: person.email.length === 0 ? [{ email: "", primary: false }] : person.email,
    };
  });

  $: prefilteredTeachers = data.filter((obj) => obj.teacher.programs.some((el) => filteredPrograms.map((el) => el.label).includes(el)));

  $: filteredTeachers =
    filter.length === 0 ? prefilteredTeachers : prefilteredTeachers.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()));
</script>

<section>
  <h1>Teachers:</h1>
  <div class="grid gap-4 grid-cols-3 pb-8">
    <Input bind:value={filter} label="Filter" />
    <ProgramFilter bind:filteredPrograms />
    <span class=" place-self-center">
      <a class="button w-max" href="{$page.url.pathname}/add">Add Teacher</a>
    </span>
  </div>
  <ul class="data-table">
    <li class="table-header">
      <span class="left">Name</span>
      <span class="left">Email</span>
      <span class="left">Phone</span>
      <span>Birthday</span>
      <span>Programs</span>
      <span>&nbsp;</span>
    </li>
    {#each filteredTeachers as { id, first_name, last_name, phone, email, birthday, teacher }}
      <li>
        <span class="left">{first_name} {last_name}</span>
        <span class="left">{email.find((el) => el.primary === true)?.email || email[0]?.email || ""}</span>
        <span class="left">{phone.find((el) => el.primary === true)?.phone || phone[0]?.phone || ""}</span>
        <span>{!!birthday ? birthday : ""}</span>
        <span>{teacher.programs.map((el) => el).join(", ")}</span>
        <button class="edit"><a href="{$page.url.pathname}/edit-{id}">✐</a> </button>
      </li>
    {/each}
  </ul>
</section>

<style lang="postcss">
  li {
    @apply grid-cols-[repeat(1,20ch)repeat(1,20ch)repeat(3,15ch)repeat(1,auto)];
  }
</style>
