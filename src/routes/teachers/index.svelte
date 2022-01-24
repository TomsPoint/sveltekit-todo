<script context="module">
  import { getFiltered } from "$lib/api_old";

  export async function load() {
    return {
      props: {
        persons: await getFiltered("person", "*,phone(*),email(*),address(*),teacher(*)", {
          column: "teacher_id",
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
  <h1>Teachers:</h1>
  <a class="button w-max" href="{$page.url.pathname}/add">Add Teacher</a>
  <ul class="data-table">
    <li class="table-header">
      <span class="left">Name</span>
      <span class="left">Email</span>
      <span class="left">Phone</span>
      <span>Birthday</span>
      <span>Programs</span>
      <span>&nbsp;</span>
    </li>
    {#each persons as { id, first_name, last_name, phone, email, birthday, teacher }}
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
