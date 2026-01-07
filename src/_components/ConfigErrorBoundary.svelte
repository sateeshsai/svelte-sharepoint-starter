<script lang="ts">
  import { initializeDataProviders } from "$lib/data/data-providers/provider-factory";

  let configError: string | null = null;
  let isInitialized = false;

  // Initialize providers and catch config errors
  // Async to support dynamic import of mock data in development
  (async () => {
    try {
      await initializeDataProviders();
      isInitialized = true;
    } catch (error) {
      if (error instanceof Error) {
        configError = error.message;
      } else {
        configError = "Unknown configuration error occurred";
      }
      console.error("Config initialization failed:", error);
    }
  })();
</script>

{#if configError}
  <div class="config-error-container">
    <div class="error-content">
      <h1>⚠️ Configuration Error</h1>
      <p class="error-message">The SharePoint configuration is invalid. Please check your settings:</p>
      <pre class="error-details">{configError}</pre>
      <div class="error-help">
        <h3>What to check:</h3>
        <ul>
          <li>Verify <code>src/lib/env/sharepoint-config.ts</code> exists and has correct syntax</li>
          <li>Ensure all required fields are present (paths.site_collection, etc.)</li>
          <li>Check that URLs are valid (must start with https://)</li>
          <li>Verify list and folder names are not empty strings</li>
          <li>Check email addresses are valid format</li>
        </ul>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">Open the browser console (F12) for full error details.</p>
      </div>
    </div>
  </div>
{:else if isInitialized}
  <slot />
{:else}
  <div class="loading">Initializing...</div>
{/if}

<style>
  :global(body.config-error) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background: #f5f5f5;
  }

  .config-error-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
  }

  .error-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    padding: 40px;
    max-width: 600px;
    width: 100%;
  }

  h1 {
    margin: 0 0 16px 0;
    color: #d32f2f;
    font-size: 28px;
  }

  .error-message {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 16px;
    line-height: 1.5;
  }

  .error-details {
    background: #f5f5f5;
    border-left: 4px solid #d32f2f;
    padding: 16px;
    border-radius: 4px;
    font-family: "Courier New", monospace;
    font-size: 13px;
    overflow-x: auto;
    color: #333;
    margin: 16px 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .error-help {
    background: #fafafa;
    padding: 16px;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }

  .error-help h3 {
    margin: 0 0 12px 0;
    color: #333;
    font-size: 14px;
    font-weight: 600;
  }

  .error-help ul {
    margin: 0;
    padding-left: 20px;
  }

  .error-help li {
    margin: 8px 0;
    color: #666;
    font-size: 14px;
    line-height: 1.4;
  }

  .error-help code {
    background: #fff3e0;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: "Courier New", monospace;
    font-size: 12px;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: 18px;
    color: #666;
  }
</style>
