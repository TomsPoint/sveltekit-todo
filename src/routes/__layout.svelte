<script context="module" lang="ts">
  import * as api from "$lib/api/layout";

  export async function load() {
    let [programs, classrooms] = await Promise.all([await api.programs.get(), await api.classrooms.get()]);
    return { props: { programs, classrooms } };
  }
</script>

<script lang="ts">
  import { user } from "$lib/basics/db";
  import { setContext } from "svelte";
  import { page } from "$app/stores";
  import { PROTECTED_ROUTES, WEEKDAYS } from "$lib/basics/constants";
  import { Modals, closeModal } from "svelte-modals";
  import { fade } from "svelte/transition";
  import "../app.css";
  import Login from "$lib/components/basics/Login.svelte";
  import Navigation from "$lib/components/basics/Navigation.svelte";

  export let programs;
  export let classrooms;
  setContext("programs", programs);
  setContext("classrooms", classrooms);
  setContext("weekdays", WEEKDAYS);
</script>

<Modals>
  <div slot="backdrop" class="backdrop" on:click={closeModal} transition:fade />
</Modals>
<header class="flex p-2 border-b place-items-center justify-between">
  <Navigation />
</header>
<main>
  {#if PROTECTED_ROUTES.includes($page.url.pathname) && !$user}
    <Login />
  {:else}
    <slot />
  {/if}
</main>
<footer class="p-1">© LCCL Coding Academy</footer>

<style lang="postcss">
  .backdrop {
    @apply z-50 fixed inset-0 bg-black bg-opacity-80;
  }
</style>
