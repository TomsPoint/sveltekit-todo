<script context="module" lang="ts">
  import * as api from "$lib/api/contacts";

  export async function load({ params }) {
    return { props: { data: await api.contacts.getById(params.id) } };
  }
</script>

<script lang="ts">
  import type { Program } from "$lib/interface";

  import { getContext } from "svelte";
  import { WEEKLY_STATUS } from "$lib/constants";
  import { addressObj, emailObj, phoneObj, studentObj, teacherObj } from "$lib/objects";

  import Input from "$lib/ui/Input.svelte";
  import Radio from "$lib/ui/Radio.svelte";
  import Select from "$lib/ui/Select.svelte";
  import Classrooms from "$lib/components/teacher/Classrooms.svelte";
  import Tabs from "$lib/ui/Tabs.svelte";
  import PersonalInformation from "$lib/components/contacts/PersonalInformation.svelte";
  import ReloadButton from "$lib/ui/ReloadButton.svelte";

  export let data;
  let { email = [emailObj], phone = [phoneObj], address = [addressObj], student = studentObj, teacher = teacherObj, ...person } = data;

  let person_id = person?.id || null;
  let student_id = person.student_id;
  let teacher_id = person.teacher_id;

  const PROGRAM: Program[] = getContext("programs");
  let selectedPrograms = PROGRAM.filter((el) => teacher?.programs.includes(el.label));

  const addToStudents = async () => {
    const res = await api.students.post(studentObj);
    student = res[0];
    student_id = res[0].id;
    person.student_id = student_id;
    await api.person.update(person);
  };

  const removeFromStudents = async () => {
    await api.person.update({ id: person_id, student_id: null });
    await api.students.delete(student_id);
    student = studentObj;
    student_id = null;
    person.student_id = null;
  };

  const addToTeachers = async () => {
    const res = await api.teachers.post(teacherObj);
    console.log("🚀  ~ file: edit-[id].svelte ~ line 57 ~ res", res);
    teacher = res[0];
    teacher_id = res[0].id;
    person.teacher_id = teacher_id;
    await api.person.update(person);
  };

  const removeFromTeachers = async () => {
    await api.person.update({ id: person_id, teacher_id: null });
    await api.teachers.delete(teacher_id);
    teacher = teacherObj;
    teacher_id = null;
    person.teacher_id = null;
  };

  let tabs = { tabs: ["Personal Information", "Student Information", "Teacher Information"], name: "edit-contact" };
  let active = "Personal Information";
</script>

<svelte:head>
  <title>Edit Contact</title>
</svelte:head>

<section>
  <ReloadButton />
  <h1>Update Contact:</h1>
  <Tabs {tabs} bind:active>
    <div class="grid gap-4 grid-cols-2">
      {#if active === "Personal Information"}
        <PersonalInformation {data} />
      {:else if active === "Teacher Information"}
        <h2 class="flex gap-2">
          {#if teacher_id === null}
            <button class="text-xs" on:click={addToTeachers}>Add Contact to Teachers</button>
          {:else}
            <button class="text-xs" on:click={removeFromTeachers}>Remove Contact from Teachers</button>
          {/if}
        </h2>
        {#if teacher_id !== null}
          <Select
            items={PROGRAM}
            bind:value={teacher.programs}
            bind:selectedItem={selectedPrograms}
            multiple
            labelFieldName="name"
            valueFieldName="label"
            tagFieldName="label"
            label="Possible programs"
          />
          <Classrooms {data} />
        {/if}
      {:else if active === "Student Information"}
        <h2 class="flex gap-2">
          {#if student_id === null}
            <button class="text-xs" on:click={addToStudents}>Add Contact to Students</button>
          {:else}
            <button class="text-xs" on:click={removeFromStudents}>Remove Contact from Students</button>
          {/if}
        </h2>
        {#if student_id !== null}
          <Input bind:value={student.short_name} label="Preferred Name" placeholder="Preferred Name" />
          <Input bind:value={student.certificate_name} label="Name for Certificates" placeholder="Name for Certificates" />

          <Input bind:value={student.school} label="School" placeholder="Name of School" />
          <Radio bind:value={student.weekly_status} items={WEEKLY_STATUS} label="Status" labelFieldName="weekly_status" />
          <Input bind:value={student.scratch_username} label="Scratch Username" placeholder=" Scratch Username" multiple />
          <Input bind:value={student.git_username} label="Git Username" placeholder=" Git Username" multiple />
          <Input bind:value={student.portfolio} label="Portfolio" placeholder=" Portfolio" multiple />
        {/if}
      {/if}
    </div>
  </Tabs>
</section>
