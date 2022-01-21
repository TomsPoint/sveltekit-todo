<script context="module">
  import { post, put, getFiltered, del, deleteFiltered } from "$lib/api";

  export async function load({ params }) {
    let data = await getFiltered(
      "person",
      "*,phone(*),email(*),student(*,student_weekly_enrolment(*),student_classroom_enrolment(*,classroom(*,time_slot(*),teacher(person(first_name)))),student_camp_enrolment(*,camp(*)))",
      {
        column: "id",
        value: params.id,
      }
    );
    return { props: { data: data[0] } };
  }
</script>

<script>
  // @ts-nocheck
  import { page } from "$app/stores";
  import { getContext } from "svelte";
  import { DATEFORMAT, GENDER, WEEKLY_STATUS } from "$lib/constants";
  import { back } from "$lib/utils";
  import { emailObj, phoneObj, studentObj } from "$lib/objects";
  import { openModal } from "svelte-modals";
  import Input from "$lib/components/ui/Input.svelte";
  import Radio from "$lib/components/ui/Radio.svelte";
  import InputPhones from "$lib/components/ui/InputPhones.svelte";
  import InputEmails from "$lib/components/ui/InputEmails.svelte";
  import dayjs from "dayjs";
  import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
  import AddClassEnrolment from "$lib/components/student/AddClassEnrolment.svelte";
  import AddCampEnrolment from "$lib/components/student/AddCampEnrolment.svelte";
  import AddProgramEnrolment from "$lib/components/student/AddWeeklyEnrolment.svelte";
  import EditClassEnrolment from "$lib/components/student/EditClassEnrolment.svelte";
  import EditCampEnrolment from "$lib/components/student/EditCampEnrolment.svelte";
  import EditProgramEnrolment from "$lib/components/student/EditWeeklyEnrolment.svelte";

  const programs = getContext("programs");
  dayjs.extend(isSameOrBefore);

  export let data;
  let { email = [emailObj], phone = [phoneObj], student = studentObj, ...person } = data;

  const person_id = person?.id || null;
  const student_id = student?.id || null;

  const save = async () => {
    const promises = [];
    // enrich data with person_id
    phone = phone.map((el) => ({ ...el, person_id }));
    email = email.map((el) => ({ ...el, person_id }));
    // what to delete
    const phoneToDelete = data.phone.filter((o) => !phone.find((o2) => o.id === o2.id)).map((el) => el.id);
    const emailToDelete = data.email.filter((o) => !email.find((o2) => o.id === o2.id)).map((el) => el.id);
    if (phoneToDelete.length > 0) promises.push(await deleteFiltered("phone", { column: "id", value: phoneToDelete }));
    if (emailToDelete.length > 0) promises.push(await deleteFiltered("email", { column: "id", value: emailToDelete }));
    // what to add
    const phoneToAdd = phone.filter((el) => !el.hasOwnProperty("id"));
    const emailToAdd = email.filter((el) => !el.hasOwnProperty("id"));
    // const addressToAdd = address.filter((el) => !el.hasOwnProperty("id"));
    if (phoneToAdd.length > 0) promises.push(await post("phone", phoneToAdd));
    if (emailToAdd.length > 0) promises.push(await post("email", emailToAdd));
    // what to update
    const phoneToUpdate = phone.filter((el) => el.hasOwnProperty("id"));
    const emailToUpdate = email.filter((el) => el.hasOwnProperty("id"));
    if (phoneToUpdate.length > 0) promises.push(await put("phone", phoneToUpdate));
    if (emailToUpdate.length > 0) promises.push(await put("email", emailToUpdate));

    promises.push(await put("person", person));
    promises.push(
      await put("student", {
        id: student.id,
        short_name: student.short_name,
        certificate_name: student.certificate_name,
        school: student.school,
        weekly_status: student.weekly_status,
        portfolio: student.portfolio,
        git_username: student.git_username,
        scratch_username: student.scratch_username,
      })
    );

    Promise.all(promises);
    back($page.url.pathname);
  };

  const remove = async () => {
    await Promise.all([
      await del("phone", { person_id }),
      await del("email", { person_id }),
      await del("address", { person_id }),
      await deleteFiltered("student", { column: "id", filter: "eq", value: student_id }),
    ]);
    await deleteFiltered("person", { column: "id", filter: "eq", value: person_id });
    back($page.url.pathname);
  };
  const removeTeacher = async () => {
    await put("person", { id, student_id: null });
    await deleteFiltered("student", { column: "id", filter: "eq", value: student_id });
    back($page.url.pathname);
  };

  function openAddCampEnrolment() {
    openModal(AddCampEnrolment, { student_id: student.id });
  }
  function openEditCampEnrolment(item) {
    openModal(EditCampEnrolment, { item });
  }

  function openAddClassEnrolment() {
    openModal(AddClassEnrolment, { student });
  }
  function openEditClassEnrolment(item) {
    openModal(EditClassEnrolment, { item });
  }
  function openAddWeeklyEnrolment() {
    openModal(AddProgramEnrolment, { student_id: student.id });
  }
  function openEditWeeklyEnrolment(item) {
    openModal(EditProgramEnrolment, { item });
  }

  async function deleteWeeklyEnrolment(id) {
    await deleteFiltered("student_weekly_enrolment", { column: "id", filter: "eq", value: id });
    location.reload();
  }
  async function deleteClassEnrolment(id) {
    await deleteFiltered("student_classroom_enrolment", { column: "id", filter: "eq", value: id });
    location.reload();
  }
  async function deleteCampEnrolment(id) {
    await deleteFiltered("student_camp_enrolment", { column: "id", filter: "eq", value: id });
    location.reload();
  }
  async function deleteMakeup(id) {
    await deleteFiltered("absence", { column: "id", filter: "eq", value: id });
    location.reload();
  }
</script>

<svelte:head>
  <title>Edit Student</title>
</svelte:head>

<section>
  {#if person === null}
    <p>There is no Student with this ID. <button class="rounded-l-none" type="reset" on:click={() => back($page.url.pathname)}>Back</button></p>
  {:else}
    <div class="grid gap-4 grid-cols-2">
      <h1 class="text-center">Update Student:</h1>
      <h2>Personal Information:</h2>
      <Input bind:value={person.first_name} label="First Name" placeholder="First Name" />
      <Input bind:value={person.last_name} label="Last Name" placeholder="Last Name" />
      <Input bind:value={student.short_name} label="Short Name" placeholder="Short Name" />
      <Input bind:value={student.certificate_name} label="Name for Certificates" placeholder="Name for Certificates" />
      <Input bind:value={person.birthday} label="Birthday" placeholder="Birthday" type="date" />
      <Radio bind:value={person.gender} items={GENDER} label="Gender" labelFieldName="name" valueFieldName="value" />
      <InputEmails bind:value={email} label="Email" />
      <InputPhones bind:value={phone} label="Phone" />
      <h2>Student Information:</h2>
      <Input bind:value={student.school} label="School" placeholder="Name of School" />
      <Radio bind:value={student.weekly_status} items={WEEKLY_STATUS} label="Status" labelFieldName="weekly_status" />
      <Input bind:value={student.scratch_username} label="Scratch Username" placeholder=" Scratch Username" multiple />
      <Input bind:value={student.git_username} label="Git Username" placeholder=" Git Username" multiple />
      <Input bind:value={student.portfolio} label="Portfolio" placeholder=" Portfolio" multiple />
      <h2>Enrolments:</h2>

      <h3>Programs:</h3>
      <ul id="enrolment" class="data-table">
        <li class="table-header">
          <span class=" !text-left">Program</span>
          <span>Frequency</span>
          <span>Start</span>
          <span>End</span>
        </li>
        {#each student.student_weekly_enrolment.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()) as item}
          <li>
            <span class=" !text-left">{programs.find((el) => el.id === item.program_id).name}</span>
            <span class="">{item.frequency}</span>
            <span>{dayjs(item.start_date).format(DATEFORMAT)}</span>
            <span>{dayjs(item.end_date).format(DATEFORMAT)}</span>
            <span class="btn-group">
              <button class="delete" on:click={() => deleteWeeklyEnrolment(item.id)}>✕</button>
              <button class="edit" on:click={() => openEditWeeklyEnrolment(item.id)}>✐</button>
            </span>
          </li>
        {/each}
        <li class="mt-2"><button class="add" on:click={openAddWeeklyEnrolment}>Add Enrolment</button></li>
      </ul>

      <h3>Classrooms:</h3>
      <ul id="classrooms" class="data-table">
        <li class="table-header">
          <span class=" !text-left">Weekday</span>
          <span>Time</span>
          <span>Program</span>
          <span>Mode</span>
          <span>Teacher</span>
          <span>Start</span>
          <span>End</span>
        </li>
        {#each student.student_classroom_enrolment.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()) as item}
          <li>
            <span class=" !text-left">{item.classroom.time_slot.weekday}</span>
            <span>{item.classroom.time_slot.time}</span>
            <span class="uppercase">{programs.find((el) => el.id === item.classroom.program_id).label}</span>
            <span>{item.classroom.mode}</span>
            <span>{item.classroom.teacher.person[0].first_name}</span>
            <span>{dayjs(item.start_date).format(DATEFORMAT)}</span>
            <span>{dayjs(item.end_date).format(DATEFORMAT)}</span>
            <span class="btn-group">
              <button class="delete" on:click={() => deleteClassEnrolment(item.id)}>✕</button>
              <button class="edit" on:click={() => openEditClassEnrolment(item)}>✐</button>
            </span>
          </li>
        {/each}
        <li class="mt-2"><button class="add" on:click={openAddClassEnrolment}>Add Class</button></li>
      </ul>

      <h3>Camp:</h3>
      <ul id="camp" class="data-table">
        <li class="table-header">
          <span class="left">Program</span>
          <span>Mode</span>
          <span>Start</span>
          <span>End</span>
        </li>
        {#each student.student_camp_enrolment.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()) as item}
          <li>
            <span class="left">{programs.find((el) => el.id === item.camp.program_id).name}</span>
            <span>{item.camp.mode}</span>
            <span>{dayjs(item.camp.start_date).format(DATEFORMAT)}</span>
            <span>{dayjs(item.camp.end_date).format(DATEFORMAT)}</span>
            <span class="btn-group">
              <button class="delete" on:click={() => deleteCampEnrolment(item.id)}>✕</button>
              <button class="edit" on:click={() => openEditCampEnrolment(item)}>✐</button>
            </span>
          </li>
        {/each}

        <li class="mt-2"><button class="add" on:click={openAddCampEnrolment}>Add Camp</button></li>
      </ul>

      <h3>Makeups:</h3>
      <ul id="makeup" class="data-table">
        <li class="table-header">
          <span class=" !text-left">Program</span>
          <span>Mode</span>
          <span>Slot Missed</span>
          <span>Slot Makeup</span>
          <span>Status</span>
        </li>
        {#each student.student_camp_enrolment.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()) as item}
          <li>
            <span class="left">{programs.find((el) => el.id === item.camp.program_id).name}</span>
            <span>{item.camp.mode}</span>
            <span>{dayjs(item.camp.start_date).format(DATEFORMAT)}</span>
            <span>{dayjs(item.camp.end_date).format(DATEFORMAT)}</span>
            <span>open</span>
            <span class="btn-group">
              <button class="delete" on:click={() => deleteMakeup(item.id)}>✕</button>
              <button class="edit" on:click={() => openEditCampEnrolment(item)}>✐</button>
            </span>
          </li>
        {/each}
        <li class="mt-2"><button class="add" on:click={openAddCampEnrolment}>Add Makeup</button></li>
      </ul>

      <hr class="col-span-full" />
      <button class="rounded-l-none" on:click={removeTeacher}>Remove from Students</button>
      <button class="rounded-l-none" on:click={() => back($page.url.pathname)}>Cancel</button>
      <button class="rounded-l-none" on:click={remove}>Delete Contact</button>
      <button class="rounded-l-none" on:click={save}>Save Changes</button>
    </div>
  {/if}
</section>

<style lang="postcss">
  #enrolment > li {
    @apply grid-cols-[repeat(1,20ch)repeat(3,10ch)repeat(1,auto)];
  }
  #classrooms > li {
    @apply grid-cols-[repeat(7,10ch)repeat(1,auto)];
  }
  #camp > li {
    @apply grid-cols-[repeat(1,20ch)repeat(3,10ch)repeat(1,auto)];
  }
  #makeup > li {
    @apply grid-cols-[repeat(1,20ch)repeat(4,10ch)repeat(1,auto)];
  }
</style>
