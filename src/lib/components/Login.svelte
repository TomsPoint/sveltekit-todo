<script lang="ts">
  import { supabase } from "$lib/db";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { ROUTE_HOME } from "$lib/constants";

  let loading = false;
  let action = "signIn";
  let email, password;
  email = "thomas@lcclcoding.com";
  password = "lccl-admin";

  async function signInOrSignUp() {
    loading = true;
    const { error, session } = await supabase.auth[action]({
      email,
      password,
    });
    if (error) {
      console.error(error.message);
    } else {
      if (session) {
        if ($page.url.pathname === "/auth") {
          goto(ROUTE_HOME);
        } else {
          goto($page.url.pathname);
        }
        location.reload();
      } else {
        alert("Registered. Please confirm your email");
      }
    }
    loading = false;
  }
</script>

<svelte:head>
  <title>{action === "signIn" ? "Sign In" : "Sign Up"}</title>
</svelte:head>

<form on:submit|preventDefault={signInOrSignUp} class="grid gap-2 mx-auto my-10 max-w-lg border rounded p-4">
  <h2>{action === "signIn" ? "Sign In" : "Sign Up"}</h2>
  <label for="email">Email</label>
  <input name="email" type="email" bind:value={email} placeholder="Email" />
  <label for="password">Password</label>
  <input name="password" type="password" bind:value={password} placeholder="Password" />

  <button>
    {loading ? "Loading ..." : action === "signIn" ? "Sign In" : "Sign Up"}
  </button>
  <p>
    {action === "singIn" ? "Not a member yet?" : "Already a member?"}
    <span on:click|preventDefault={() => (action === "signIn" ? (action = "signUp") : (action = "signIn"))} class="cursor-pointer">
      {action === "singIn" ? "Sign In" : "Sign Up"}
    </span>
  </p>
</form>
