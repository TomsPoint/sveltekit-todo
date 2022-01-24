<script context="module">
  import * as api from "$lib/api/students";

  export async function load() {
    return { props: { students: await api.students.get() } };
  }
</script>

<script>
  // @ts-nocheck
  import { page } from "$app/stores";
  import Input from "$lib/ui/Input.svelte";

  export let students = [];

  let filter = "";

  students = students.map((student) => {
    student.name = student.first_name + " " + student.last_name;
    if (student.phone.length === 0) student.phone = [{ nr: "", primary: false, whatsapp: false }];
    if (student.email.length === 0) student.email = [{ nr: "", primary: false }];
    return student;
  });
  $: filteredStudents = filter.length === 0 ? students : students.filter((student) => student.name.toLowerCase().includes(filter.toLowerCase()));
</script>

<section>
  <h1>Students:</h1>
  <Input bind:value={filter} label="Filter" />
  <a class="button w-max mb-8" href="{$page.url.pathname}/add">Add Student</a>
  <ul class="data-table">
    <li class="table-header">
      <span class="left">Name</span>
      <span class="left">Email</span>
      <span class="left">Phone</span>
      <span>Birthday</span>
      <span>&nbsp;</span>
    </li>
    {#each filteredStudents as { id, first_name, last_name, phone, email, birthday, student_id, teacher_id, billing_contact_id, contact_person_id, lead_id }}
      <li>
        <span class="left">{first_name} {last_name}</span>
        <span class="left">{email.find((el) => el.primary === true)?.email || email[0]?.email || ""}</span>
        <span class="left">{phone.find((el) => el.primary === true)?.phone || phone[0]?.phone || ""}</span>
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
    @apply grid gap-4 p-1 grid-cols-[repeat(1,30ch)repeat(1,20ch)repeat(2,15ch)repeat(1,auto)];
  }
</style>
