<template>
  <div>
    <h1>Test Page</h1>
    <router-link to="/">Home</router-link>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>