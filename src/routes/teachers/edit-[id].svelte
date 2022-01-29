<script context="module">
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

  export let data;

  const refreshData = async () => location.reload();

  let tabs = { tabs: ["Personal Information", "Classrooms", "Today"], name: "edit-teachers" };
  let active = "Personal Information";
</script>

<svelte:head>
  <title>Edit Teacher</title>
</svelte:head>

<section>
  <h1 class="text-center">Update Teacher:</h1>
  <button on:click={refreshData}>Refresh</button>
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
