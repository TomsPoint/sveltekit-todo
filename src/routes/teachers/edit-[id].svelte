<script context="module" lang="ts">
  import * as api from "$lib/api/teachers";

  export async function load({ params }) {
    return { props: { data: await api.teachers.getById(params.id) } };
  }
</script>

<script lang="ts">
  import Tabs from "$lib/ui/Tabs.svelte";
  import PersonalInformation from "$lib/components/teacher/PersonalInformation.svelte";
  import Classrooms from "$lib/components/teacher/Classrooms.svelte";
  import Today from "$lib/components/teacher/Today.svelte";
  import ReloadButton from "$lib/components/basics/ReloadButton.svelte";

  export let data;

  let tabs = { tabs: ["Personal Information", "Classrooms", "Today"], name: "edit-teachers" };
  let active = "Personal Information";
</script>

<svelte:head>
  <title>Edit Teacher</title>
</svelte:head>

<section>
  <ReloadButton />
  <h1>Update Teacher:</h1>
  <Tabs {tabs} bind:active>
    <div class="grid gap-4 grid-cols-2">
      {#if active === "Personal Information"}
        <PersonalInformation {data} />
      {:else if active === "Classrooms"}
        <Classrooms {data} />
      {:else if active === "Today"}
        <Today data={data.teacher} />
      {/if}
    </div>
  </Tabs>
</section>
