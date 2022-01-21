<script context="module">
  import { post, put, getFiltered, del, deleteFiltered } from "$lib/api";

  export async function load({ params }) {
    let data = await getFiltered("person", "*,phone(*),email(*),address(*),student(*),teacher(*,classroom(*,time_slot(*)))", {
      column: "id",
      value: params.id,
    });
    return { props: { data: data[0] } };
  }
</script>

<script>
  // @ts-nocheck
  import { getContext } from "svelte";
  import { page } from "$app/stores";
  import { DATEFORMAT, GENDER, WEEKLY_STATUS } from "$lib/constants";
  import { addressObj, emailObj, phoneObj, studentObj, teacherObj } from "$lib/objects";
  import { back } from "$lib/utils";
  import { isEqual } from "lodash";
  import { openModal } from "svelte-modals";
  import Input from "$lib/components/ui/Input.svelte";
  import Radio from "$lib/components/ui/Radio.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import InputPhones from "$lib/components/ui/InputPhones.svelte";
  import InputEmails from "$lib/components/ui/InputEmails.svelte";
  import InputAddress from "$lib/components/ui/InputAddress.svelte";
  import dayjs from "dayjs";
  import AddClass from "$lib/components/class/AddClass.svelte";
  import EditClass from "$lib/components/class/EditClass.svelte";

  export let data;
  let { email = [emailObj], phone = [phoneObj], address = [addressObj], student = studentObj, teacher = teacherObj, ...person } = data;
  console.log("🚀  ~ file: edit-[id].svelte ~ line 31 ~ student", student);
  console.log("🚀  ~ file: edit-[id].svelte ~ line 31 ~ teacher", teacher);

  let person_id = person?.id || null;
  let student_id = student?.id || null;
  let teacher_id = teacher?.id || null;

  const PROGRAM = getContext("programs");
  let selectedPrograms = PROGRAM.filter((el) => teacher?.programs.includes(el.label));

  const save = async () => {
    const promises = [];
    // enrich data with person_id
    phone = phone.map((el) => ({ ...el, person_id }));
    email = email.map((el) => ({ ...el, person_id }));
    address = address.map((el) => ({ ...el, person_id }));
    // what to delete
    const phoneToDelete = data.phone.filter((o) => !phone.find((o2) => o.id === o2.id)).map((el) => el.id);
    const emailToDelete = data.email.filter((o) => !email.find((o2) => o.id === o2.id)).map((el) => el.id);
    const addressToDelete = data.address.filter((o) => !address.find((o2) => o.id === o2.id)).map((el) => el.id);
    if (phoneToDelete.length > 0) promises.push(await deleteFiltered("phone", { column: "id", value: phoneToDelete }));
    if (emailToDelete.length > 0) promises.push(await deleteFiltered("email", { column: "id", value: emailToDelete }));
    if (addressToDelete.length > 0) promises.push(await deleteFiltered("address", { column: "id", value: addressToDelete }));
    // what to add
    const phoneToAdd = phone.filter((el) => !el.hasOwnProperty("id"));
    const emailToAdd = email.filter((el) => !el.hasOwnProperty("id"));
    const addressToAdd = address.filter((el) => !el.hasOwnProperty("id"));
    if (phoneToAdd.length > 0) promises.push(await post("phone", phoneToAdd));
    if (emailToAdd.length > 0) promises.push(await post("email", emailToAdd));
    if (addressToAdd.length > 0) promises.push(await post("address", addressToAdd));
    // what to update
    const phoneToUpdate = phone.filter((el) => el.hasOwnProperty("id"));
    const emailToUpdate = email.filter((el) => el.hasOwnProperty("id"));
    const addressToUpdate = address.filter((el) => el.hasOwnProperty("id"));
    if (phoneToUpdate.length > 0) promises.push(await put("phone", phoneToUpdate));
    if (emailToUpdate.length > 0) promises.push(await put("email", emailToUpdate));
    if (addressToUpdate.length > 0) promises.push(await put("address", addressToUpdate));

    if (!isEqual(student, studentObj)) promises.push(await put("student", student));
    if (!isEqual(teacher, teacherObj)) promises.push(await put("teacher", teacher));
    promises.push(await put("person", person));

    Promise.all(promises);
    back($page.url.pathname);
  };

  const addToStudents = async () => {
    const res = await post("student", studentObj);
    student = res[0];
    student_id = res[0].id;
    person.student_id = student_id;
    await put("person", person);
  };

  const removeFromStudents = async () => {
    await put("person", { id: person_id, student_id: null });
    await del("student", { id: student_id });
    student = studentObj;
    student_id = null;
    person.student_id = null;
  };

  const addToTeachers = async () => {
    const res = await post("teacher", teacherObj);
    teacher = res[0];
    teacher_id = res[0].id;
    person.teacher_id = teacher_id;
    await put("person", person);
  };

  const removeFromTeachers = async () => {
    await put("person", { id: person_id, teacher_id: null });
    await del("teacher", { id: teacher_id });
    teacher = teacherObj;
    teacher_id = null;
    person.teacher_id = null;
  };

  const remove = async () => {
    await Promise.all([await del("phone", { person_id }), await del("email", { person_id }), await del("address", { person_id })]);
    await deleteFiltered("person", { column: "id", filter: "eq", value: person_id });
    back($page.url.pathname);
  };

  function openAddClass() {
    openModal(AddClass, { programs: selectedPrograms, teacher });
  }
  function openEditClass(item) {
    openModal(EditClass, { programs: selectedPrograms, item });
  }
</script>

<section>
  {#if person === null}
    <p>There is no Contact with this ID. <button class="rounded-l-none" type="reset" on:click={() => back($page.url.pathname)}>Back</button></p>
  {:else}
    <div class="grid gap-4 grid-cols-2">
      <h1 class="text-center">Update Contact:</h1>
      <h2>Personal Information:</h2>
      <Input bind:value={person.first_name} label="First Name" placeholder="First Name" />
      <Input bind:value={person.last_name} label="Last Name" placeholder="Last Name" />
      <Input bind:value={person.birthday} label="Birthday" placeholder="Birthday" type="date" />
      <Radio bind:value={person.gender} items={GENDER} label="Gender" labelFieldName="name" valueFieldName="value" />
      <InputEmails bind:value={email} label="Email" />
      <InputPhones bind:value={phone} label="Phone" />
      <InputAddress bind:value={address} label="Address" />

      <h2 class="flex gap-2">
        Teacher Information:
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
        <h2>Classrooms:</h2>
        <ul id="teacher-classrooms" class="data-table">
          <li class="table-header">
            <span class=" !text-left">Weekday</span>
            <span>Time</span>
            <span>Program</span>
            <span>Mode</span>
            <span>Capacity</span>
            <span>Start</span>
            <span>End</span>
            <span>&nbsp;</span>
          </li>
          {#each teacher.classroom.sort((a, b) => a.time_slot_id - b.time_slot_id) as item}
            <li>
              <span class="!text-left">{item.time_slot.weekday}</span>
              <span>{item.time_slot.time}</span>
              <span class="uppercase">{PROGRAM.find((el) => el.id === item.program_id).label}</span>
              <span>{item.mode}</span>
              <span>{item.capacity}</span>
              <span>{dayjs(item.start_date).format(DATEFORMAT)}</span>
              <span>{dayjs(item.end_date).format(DATEFORMAT)}</span>
              <button class="edit" on:click={() => openEditClass(item)}>✐</button>
            </li>
          {/each}
          <li class="mt-2"><button on:click={openAddClass}>Add Class</button></li>
        </ul>
      {/if}

      <h2 class="flex gap-2">
        Student Information: {#if student_id === null}
          <button class="text-xs" on:click={addToStudents}>Add Contact to Students</button>
        {:else}
          <button class="text-xs" on:click={removeFromStudents}>Remove Contact from Students</button>
        {/if}
      </h2>
      {#if student_id !== null}
        <Input bind:value={student.school} label="School" placeholder="Name of School" />
        <Radio bind:value={student.weekly_status} items={WEEKLY_STATUS} label="Status" labelFieldName="weekly_status" />
        <Input bind:value={student.scratch_username} label="Scratch Username" placeholder=" Scratch Username" multiple />
        <Input bind:value={student.git_username} label="Git Username" placeholder=" Git Username" multiple />
        <Input bind:value={student.portfolio} label="Portfolio" placeholder=" Portfolio" multiple />
      {/if}

      <hr class="col-span-full" />
      <button class="rounded-l-none" on:click={save}>Save Changes</button>
      <button class="rounded-l-none" on:click={remove}>Delete Contact</button>
      <button class="rounded-l-none" on:click={() => back($page.url.pathname)}>Cancel</button>
    </div>
  {/if}
</section>

<style lang="postcss">
  #teacher-classrooms li {
    @apply grid-cols-[repeat(7,10ch)repeat(1,auto)];
  }
</style>
