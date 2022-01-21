<script context="module">
  import { getFiltered } from "$lib/api";

  export async function load() {
    return {
      props: {
        persons: await getFiltered("person", "*,phone(*),email(*),address(*),teacher(*)", {
          column: "student_id",
          filter: "gt",
          value: 0,
          sort: "first_name",
        }),
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
  <h1>Students:</h1>
  <a class="button w-max" href="{$page.url.pathname}/add">Add Student</a>
  <ul class="data-table">
    <li class="table-header">
      <span class="left">Name</span>
      <span class="left">Email</span>
      <span class="left">Phone</span>
      <span>Birthday</span>
      <span>&nbsp;</span>
    </li>
    {#each persons as { id, first_name, last_name, phone, email, birthday, student_id, teacher_id, billing_contact_id, contact_person_id, lead_id }}
      <li>
        <span class="left">{first_name} {last_name}</span>
        <span class="left">{email.find((el) => el.primary === true)?.email || email[0]?.email || ""}</span>
        <span class="left">{phone.find((el) => el.primary === true)?.phone || phone[0]?.phone || ""}</span>
        <span>{!!birthday ? birthday : ""}</span>
        <button class="edit"><a href="{$page.url.pathname}/edit-{id}">✐</a></button>
      </li>
    {/each}
  </ul>
</section>

<style lang="postcss">
  li {
    @apply grid gap-4 p-1 grid-cols-[repeat(1,30ch)repeat(1,20ch)repeat(2,15ch)repeat(1,auto)];
  }
</style>
