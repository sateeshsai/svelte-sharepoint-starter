<script>
  let count = $state(0);

  function increment() {
    count += 1;
  }

  function decrement() {
    count -= 1;
  }
</script>

<div class="flex items-center gap-2">
  <button onclick={decrement} class="px-3 py-1 bg-red-500 text-white rounded">-</button>
  <span class="text-lg font-semibold">{count}</span>
  <button onclick={increment} class="px-3 py-1 bg-green-500 text-white rounded">+</button>
</div>
