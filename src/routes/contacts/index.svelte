<script context="module">
  import { get } from "$lib/api_old";

  export async function load() {
    return {
      props: {
        persons: await get("person", "*,phone(*),email(*),address(*)"),
      },
    };
  }
</script>

<script>
  // @ts-nocheck
  import { page } from "$app/stores";

  export let persons = [];

  persons = persons.map((person) => {
    if (person.phone.length === 0) person.phone = [{ nr: "", primary: false, whatsapp: false }];
    if (person.email.length === 0) person.email = [{ nr: "", primary: false }];
    return person;
  });
</script>

<section>
  <h1>Contacts:</h1>

  <ul class="data-table">
    <li class="table-header">
      <span class="left">Name</span>
      <span class="left">Email</span>
      <span class="left">Phone</span>
      <span>Student</span>
      <span>Teacher</span>
      <span>Guardian</span>
      <span>Billing</span>
      <span>Lead</span>
      <span>&nbsp;</span>
    </li>
    {#each persons as { id, first_name, last_name, phone, email, birthday, student_id, teacher_id, billing_contact_id, contact_person_id, lead_id }}
      <li>
        <span class="left">{first_name} {last_name}</span>
        <span class="left">{email.find((el) => el.primary === true)?.email || email[0]?.email || ""}</span>
        <span class="left">{phone.find((el) => el.primary === true)?.phone || phone[0]?.phone || ""}</span>
        <span>{student_id === null ? "no" : "yes"}</span>
        <span>{teacher_id === null ? "no" : "yes"}</span>
        <span>{contact_person_id === null ? "no" : "yes"}</span>
        <span>{billing_contact_id === null ? "no" : "yes"}</span>
        <span>{lead_id === null ? "no" : "yes"}</span>
        <button class="edit"><a href="{$page.url.pathname}/edit-{id}">✐</a></button>
      </li>
    {/each}
    <li>
      <a class="button w-max justify-self-start" href="{$page.url.pathname}/add">Add Contact</a>
    </li>
  </ul>
</section>

<style lang="postcss">
  li {
    @apply grid gap-4 p-1 grid-cols-[repeat(1,20ch)repeat(1,25ch)repeat(1,15ch)repeat(5,6ch)repeat(1,auto)];
  }
</style>
