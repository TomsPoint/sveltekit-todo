<script context="module">
  import { get } from "$lib/api_old";

  export async function load() {
    let [programs, classrooms] = await Promise.all([await get("program"), await get("classroom")]);

    return {
      props: { programs, classrooms },
    };
  }
</script>

<script>
  // @ts-nocheck

  import { user } from "$lib/db";
  import { setContext } from "svelte";
  import { page } from "$app/stores";
  import { PROTECTED_ROUTES } from "$lib/constants";
  import { Modals, closeModal } from "svelte-modals";
  import { fade } from "svelte/transition";
  import "../app.css";
  import Login from "$lib/components/Login.svelte";
  import Navigation from "$lib/components/Navigation.svelte";

  export let programs;
  export let classrooms;
  setContext("programs", programs);
  setContext("classrooms", classrooms);
</script>

<Modals>
  <div slot="backdrop" class="backdrop" on:click={closeModal} transition:fade />
</Modals>
<header class="grid p-2 border-b">
  <Navigation />
</header>
<main>
  {#if PROTECTED_ROUTES.includes($page.url.pathname) && !$user}
    <Login />
  {:else}
    <slot />
  {/if}
</main>

<style lang="postcss">
  .backdrop {
    @apply z-50 fixed inset-0 bg-black bg-opacity-80;
  }
</style>
