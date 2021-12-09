<script>
  import { goto } from "$app/navigation";
  import { page, session } from "$app/stores";
  import { ROUTE_HOME, ROUTES, PROTECTED_ROUTES } from "$lib/constants";
  import { supabase } from "$lib/db";

  const signOut = async () => {
    await supabase.auth.signOut();
    goto("/auth");
  };
</script>

<nav class="flex justify-evenly ">
  <ul class="flex gap-2 ">
    {#each ROUTES as { route, label }}
      {#if !PROTECTED_ROUTES.includes(route)}
        <li><a sveltekit:prefetch href={route} class:active={$page.path === route}>{label}</a></li>
      {:else if PROTECTED_ROUTES.includes(route) && $session?.user?.aud === "authenticated"}
        <li><a sveltekit:prefetch href={route} class:active={$page.path === route}>{label}</a></li>
      {/if}
    {/each}
  </ul>
  {#if $session?.user?.aud === "authenticated"}
    <span on:click={signOut}>Sign Out</span>
  {:else}
    <a sveltekit:prefetch href="/auth" class="inline-block" class:active={$page.path === "/auth"}> Sign In </a>
  {/if}
</nav>

<style>
  .active {
    color: var(--clr-primary, red);
  }
</style>
