<script context="module">
  import * as api from "$lib/api/students";

  export async function load({ params }) {
    return { props: { data: await api.students.getById(params.id) } };
  }
</script>

<script lang="ts">
  import Tabs from "$lib/ui/Tabs.svelte";
  import PersonalInformation from "$lib/components/student/PersonalInformation.svelte";
  import ProgramEnrolment from "$lib/components/student/ProgramEnrolment.svelte";
  import ClassroomEnrolment from "$lib/components/student/ClassroomEnrolment.svelte";
  import CampEnrolment from "$lib/components/student/CampEnrolment.svelte";

  export let data;

  const refreshData = async () => location.reload();

  $: student = data.student;

  let tabs = { tabs: ["Personal Information", "Enrolments"], name: "edit-students" };
  let active = "Personal Information";

  $: console.log("🚀  ~ file: edit-[id].svelte ~ line 24 ~ active", active);
</script>

<svelte:head>
  <title>Edit Student</title>
</svelte:head>

<section>
  <h1 class="text-center">Update Student:</h1>
  <button on:click={refreshData}>Refresh</button>
  <Tabs {tabs} bind:active>
    <div class="grid gap-4 grid-cols-2">
      {#if active === "Personal Information"}
        <PersonalInformation {data} />
      {:else if active === "Enrolments"}
        <ProgramEnrolment {student} />
        <ClassroomEnrolment {student} />
        <CampEnrolment {student} />
      {/if}
    </div>
  </Tabs>
</section>
