<script>
  import { goto } from "$app/navigation";
  import { page, session } from "$app/stores";
  import { ROUTE_HOME, PROTECTED_ROUTES } from "$lib/constants";
  import { supabase } from "$lib/db";
  import { setAuthCookie, unsetAuthCookie } from "$lib/utils/session";
  import "../app.css";
  import Login from "$lib/components/Login.svelte";
  import Navigation from "$lib/components/Navigation.svelte";

  supabase.auth.onAuthStateChange(async (event, _session) => {
    if (event !== "SIGNED_OUT") {
      $session = { user: _session.user };
      await setAuthCookie(_session);
      goto(ROUTE_HOME);
    } else {
      $session = { user: {} };
      await unsetAuthCookie();
    }
  });
</script>

<header class="grid p-2 border-b">
  <Navigation />
</header>
<main>
  {#if PROTECTED_ROUTES.includes($page.path) && $session.user.aud !== "authenticated"}
    <Login />
  {:else}
    <slot />
  {/if}
</main>
<!-- <pre>{JSON.stringify($session.user, null, 1)}</pre> -->
