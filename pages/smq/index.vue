<script setup>
// Redirection vers le tableau de bord par défaut
definePageMeta({ middleware: 'auth' })
await navigateTo('/smq/dashboard', { replace: true })
</script>
